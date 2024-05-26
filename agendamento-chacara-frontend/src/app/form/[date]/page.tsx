"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";
import styles from "./styles.module.scss";
import { Button, TextField, Stack } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Header } from "@/components/Header/Header";
import { IoIosArrowBack } from "react-icons/io";
import { Scheduling } from "@/app/models/Scheduling";
import { PatternFormat } from "react-number-format";
import { isBefore, parse, startOfDay } from "date-fns";
import validator from "validator";

const isLetters = (str: any) => /^[A-Za-z\s]*$/.test(str);

interface IValidInput {
  firstNameIsValid: boolean;
  lastNameIsValid: boolean;
  cpfIsValid: boolean;
  phoneNumberIsValid: boolean;
}

const Form = () => {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [cpfValue, setCpfValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");
  const [isComponentLoaded, setIsComponentLoaded] = useState(true);
  const [isValidCpf, setIsValidCpf] = useState(true);

  useEffect(() => {
    setIsComponentLoaded(false);
  }, []);

  const [isExistsScheduling, setIsExistsScheduling] = useState<boolean>(false);

  const stringToDateObj = (date: string) => {
    const dataFormatoOriginal = date;
    const dataFormatoInverso = dayjs(dataFormatoOriginal, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    return dayjs(dataFormatoInverso);
  };

  const verifyDateStatus = async () => {
    const schedulingService = new SchedulingService();
    try {
      const schedulingExists = await schedulingService.getByDate(params.date);
      schedulingExists.forEach((scheduling) => {
        if (scheduling.status === true) {
          router.push("/reservation");
        }
        return;
      });
    } catch (error) {
      return;
    }
  };

  const handleClickBackButton = () => {
    router.push("/reservation");
  };

  function isPastDate(dataString: string) {
    const dataFornecida = parse(dataString, "dd-MM-yyyy", new Date());
    const dataAtual = startOfDay(new Date()); // Inicia a hora do dia atual em 00:00:00

    return isBefore(dataFornecida, dataAtual);
  }

  useEffect(() => {
    if (!params.date || !/^\d{2}-\d{2}-\d{4}$/.test(params.date)) {
      router.push("/reservation");
    } else if (isPastDate(params.date)) {
      router.push("/reservation");
    } else {
      setCurrentDate(params.date);
    }
    verifyDateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.date]);

  const onCpfInputChange = (value: any) => {
    setCpfValue(value);
  };

  const onPhoneNumberInputChange = (value: any) => {
    setPhoneNumberValue(value);
  };

  const onFirstNameInputChange = (e: any) => {
    const { value } = e.target;
    if (isLetters(value)) {
      setFirstNameValue(value);
    }
  };

  const onLastNameInputChange = (e: any) => {
    const { value } = e.target;
    if (isLetters(value)) {
      setLastNameValue(value);
    }
  };

  function isValidCPF(value: any) {
    // Remove caracteres não numéricos
    let cpfFormated = value.replace(/[^\d]/g, "");

    // Verifica se o CPF tem 11 dígitos
    if (!validator.isLength(cpfFormated, { min: 11, max: 11 })) {
      return false;
    }

    if (!validator.isNumeric(cpfFormated)) {
      return false;
    }

    // Elimina CPFs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cpfFormated)) {
      return false;
    }

    // Valida os dígitos verificadores
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpfFormated.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfFormated.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpfFormated.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfFormated.substring(10, 11))) {
      return false;
    }

    return true;
  }

  const handleClickButtonSubmit = async () => {
    // setIsComponentLoaded(true);
    setIsExistsScheduling(false);
    setIsValidCpf(true)

    let isValid = isValidCPF(cpfValue);
    console.log(isValid);

    if (isValid) {
      createScheduling();
    } else {
      setIsValidCpf(false);
    }
  };

  const createScheduling = async () => {
    setIsComponentLoaded(true);
    const schedulingService = new SchedulingService();
    const filteredNumber = phoneNumberValue
      .replace(/\D/g, "")
      .replace(/^55/, "")
      .trim();
    const filteredCpf = cpfValue.replace(/\D/g, "");
    const newScheduling: Scheduling = {
      clientName: `${firstNameValue} ${lastNameValue}`,
      cpf: filteredCpf,
      date: params.date,
      phoneNumber: filteredNumber,
      status: false,
      avaliableDays: 1,
      forgeinKey: "",
    };
    try {
      await schedulingService.createScheduling(newScheduling);
      router.push(`/alert/${cpfValue}`);
    } catch (error) {
      setIsComponentLoaded(false);
      setIsExistsScheduling(true);
    }
  };

  return (
    <div className={styles.background}>
      <Header page="formPage" />

      <div className={styles.formContainer}>
        <p style={{ textAlign: "center" }} className={styles.titleForm}>
          Dados pessoais
        </p>
        <div className={styles.backButton}>
          <p onClick={handleClickBackButton} className={styles.textBackButton}>
            <IoIosArrowBack size={15} />
            Voltar
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Nome:"
            value={firstNameValue}
            onChange={onFirstNameInputChange}
            type="text"
            required
            inputProps={{
              maxLength: 50,
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Sobrenome:"
            value={lastNameValue}
            onChange={onLastNameInputChange}
            type="text"
            required
            inputProps={{
              maxLength: 50,
            }}
          />
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          {currentDate != null ? (
            <DatePicker
              disabled
              label="Data"
              defaultValue={stringToDateObj(currentDate)}
            />
          ) : (
            ""
          )}
        </LocalizationProvider>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PatternFormat
            format={"###.###.###-##"}
            mask="_"
            label={"Cpf:"}
            onChange={(e) => onCpfInputChange(e.target.value)}
            value={cpfValue}
            customInput={TextField}
            className={styles["input-phone"]}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <PatternFormat
            format="+55 (##) #####-####"
            label={"Whatsapp:"}
            mask="_"
            onChange={(e) => onPhoneNumberInputChange(e.target.value)}
            value={phoneNumberValue}
            customInput={TextField}
          />
        </div>

        <Button
          onClick={handleClickButtonSubmit}
          className={styles.submitButton}
          variant="contained"
          disabled={
            isComponentLoaded ||
            firstNameValue.length == 0 ||
            lastNameValue.length == 0 ||
            cpfValue.replace(/\D/g, "").length < 11 ||
            phoneNumberValue.replace(/\D/g, "").replace(/^55/, "").trim()
              .length < 11
          }
        >
          FINALIZAR
        </Button>

        {isExistsScheduling == true && (
          <p
            style={{ textAlign: "center" }}
            className={styles.invalidValueLabel}
          >
            Desculpe, já existe um agendamento para esta data com esse Cpf
          </p>
        )}

        {!isValidCpf && (
          <p
            style={{ textAlign: "center" }}
            className={styles.invalidValueLabel}
          >
            Cpf inválido
          </p>
        )}
      </div>
    </div>
  );
};

export default Form;
