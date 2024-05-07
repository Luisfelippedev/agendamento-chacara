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

  useEffect(() => {
    setIsComponentLoaded(false);
  }, []);

  const [isValidInputValue, setIsValidInputValue] = useState<IValidInput>({
    firstNameIsValid: true,
    lastNameIsValid: true,
    cpfIsValid: true,
    phoneNumberIsValid: true,
  });
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
    const schedulingExists = await schedulingService.getByDate(params.date);
    schedulingExists.forEach((scheduling) => {
      if (scheduling.status === true) {
        router.push("/reservation");
      }
      return;
    });
  };

  const handleClickBackButton = () => {
    router.push("/reservation");
  };

  useEffect(() => {
    if (!params.date || !/^\d{2}-\d{2}-\d{4}$/.test(params.date)) {
      router.push("/reservation");
    } else {
      setCurrentDate(params.date);
    }
    verifyDateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.date]);

  const onCpfInputChange = (value: any) => {
    setIsValidInputValue((prevState) => ({
      ...prevState, // Mantém os valores anteriores dos outros campos
      cpfIsValid: true, // Altera apenas o campo firstNameIsValid para true
    }));
    setCpfValue(value);
    console.log(cpfValue);
  };

  const onPhoneNumberInputChange = (value: any) => {
    setIsValidInputValue((prevState) => ({
      ...prevState, // Mantém os valores anteriores dos outros campos
      phoneNumberIsValid: true, // Altera apenas o campo firstNameIsValid para true
    }));
    setPhoneNumberValue(value);
    console.log(phoneNumberValue);
  };

  const onFirstNameInputChange = (e: any) => {
    const { value } = e.target;
    if (isLetters(value)) {
      setIsValidInputValue((prevState) => ({
        ...prevState, // Mantém os valores anteriores dos outros campos
        firstNameIsValid: true, // Altera apenas o campo firstNameIsValid para true
      }));
      setFirstNameValue(value);
    }
  };

  const onLastNameInputChange = (e: any) => {
    const { value } = e.target;
    if (isLetters(value)) {
      setIsValidInputValue((prevState) => ({
        ...prevState, // Mantém os valores anteriores dos outros campos
        lastNameIsValid: true, // Altera apenas o campo firstNameIsValid para true
      }));
      setLastNameValue(value);
    }
  };

  const handleClickButtonSubmit = async () => {
    setIsExistsScheduling(false);
    let isValid = true;

    const filteredCpf = cpfValue.replace(/\D/g, "");
    console.log(filteredCpf);

    if (filteredCpf.length == 0 || cpfValue.length < 10) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        cpfIsValid: false,
      }));
      isValid = false;
    }

    if (
      firstNameValue.length == 0 ||
      firstNameValue.length < 2 ||
      firstNameValue.length > 40
    ) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        firstNameIsValid: false,
      }));
      isValid = false;
    }

    if (
      lastNameValue.length == 0 ||
      lastNameValue.length < 2 ||
      lastNameValue.length > 40
    ) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        lastNameIsValid: false,
      }));
      isValid = false;
    }

    const filteredNumber = phoneNumberValue
      .replace(/\D/g, "")
      .replace(/^55/, "")
      .trim();

    if (filteredNumber.length < 11) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        phoneNumberIsValid: false,
      }));
      isValid = false;
    }

    if (isValid) {
      createScheduling();
    }
  };

  const createScheduling = async () => {
    const schedulingService = new SchedulingService();
    const filteredNumber = phoneNumberValue
      .replace(/\D/g, "")
      .replace(/^55/, "")
      .trim();
      const filteredCpf = cpfValue.replace(/\D/g, "");
    const newScheduling: Scheduling = {
      clientName: firstNameValue,
      cpf: filteredCpf,
      date: params.date,
      phoneNumber: filteredNumber,
      status: false,
    };
    try {
      await schedulingService.createScheduling(newScheduling);
      console.log("chegou");
      router.push(`/alert/${cpfValue}`);
    } catch (error) {
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
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Sobrenome:"
            value={lastNameValue}
            onChange={onLastNameInputChange}
            type="text"
            required
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
            label={"Telefone:"}
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
      </div>
    </div>
  );
};

export default Form;
