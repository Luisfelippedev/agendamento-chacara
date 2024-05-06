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

const isNumbers = (str: any) => /^[0-9]*$/.test(str);
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
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    if (params.date === "undefined") {
      router.push("/reservation");
    } else {
      setCurrentDate(params.date);
    }
    verifyDateStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.date]);

  const onCpfInputChange = (e: any) => {
    const { value } = e.target;
    if (isNumbers(value)) {
      setIsValidInputValue((prevState) => ({
        ...prevState, // Mantém os valores anteriores dos outros campos
        cpfIsValid: true, // Altera apenas o campo firstNameIsValid para true
      }));
      setCpfValue(value);
    }
  };

  const onPhoneNumberInputChange = (e: any) => {
    const { value } = e.target;
    if (isNumbers(value)) {
      setIsValidInputValue((prevState) => ({
        ...prevState, // Mantém os valores anteriores dos outros campos
        phoneNumberIsValid: true, // Altera apenas o campo firstNameIsValid para true
      }));
      setPhoneNumberValue(value);
    }
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
    // Reset state
    setIsValidInputValue({
      firstNameIsValid: true,
      lastNameIsValid: true,
      cpfIsValid: true,
      phoneNumberIsValid: true,
    });
    setFormSubmitted(true);
    setIsExistsScheduling(false);

    if (cpfValue.length == 0 || cpfValue.length < 11 || cpfValue.length > 14) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        cpfIsValid: false,
      }));
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
    }

    if (
      lastNameValue.length == 0 ||
      firstNameValue.length < 2 ||
      lastNameValue.length > 40
    ) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        lastNameIsValid: false,
      }));
    }

    if (phoneNumberValue.length == 0 || phoneNumberValue.length > 20) {
      setIsValidInputValue((prevState) => ({
        ...prevState,
        phoneNumberIsValid: false,
      }));
    }
    if (formSubmitted) {
      if (
        isValidInputValue.firstNameIsValid &&
        isValidInputValue.lastNameIsValid &&
        isValidInputValue.cpfIsValid &&
        isValidInputValue.phoneNumberIsValid
      ) {
        const schedulingService = new SchedulingService();
        const newScheduling: Scheduling = {
          clientName: firstNameValue,
          cpf: cpfValue,
          date: params.date,
          phoneNumber: phoneNumberValue,
          status: false,
        };
        try {
          await schedulingService.createScheduling(newScheduling);
        } catch (error) {
          setIsExistsScheduling(true);
        }
      }
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
          {isValidInputValue.firstNameIsValid == false && (
            <p className={styles.invalidValueLabel}>Nome inválido</p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Sobrenome:"
            value={lastNameValue}
            onChange={onLastNameInputChange}
            type="text"
            required
          />
          {isValidInputValue.lastNameIsValid == false && (
            <p className={styles.invalidValueLabel}>Sobrenome inválido</p>
          )}
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          {currentDate != null ? (
            <DatePicker
              disabled
              label="Data"
              // defaultValue={stringToDateObj()}
              defaultValue={stringToDateObj(currentDate)}
            />
          ) : (
            ""
          )}
        </LocalizationProvider>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Cpf:"
            value={cpfValue}
            onChange={onCpfInputChange}
            required
          ></TextField>
          {isValidInputValue.cpfIsValid == false && (
            <p className={styles.invalidValueLabel}>Cpf inválido</p>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            label="Telefone:"
            value={phoneNumberValue}
            onChange={onPhoneNumberInputChange}
            required
          />
          {isValidInputValue.phoneNumberIsValid == false && (
            <p className={styles.invalidValueLabel}>Telefone inválido</p>
          )}
        </div>

        <Button
          onClick={handleClickButtonSubmit}
          className={styles.button}
          variant="contained"
          disabled={isComponentLoaded}
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
