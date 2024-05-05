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

const isNumbers = (str: any) => /^[0-9]*$/.test(str);
const isLetters = (str: any) => /^[A-Za-z\s]*$/.test(str);

const Form = () => {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [cpfValue, setCpfValue] = useState("");
  const [phoneNumberValue, setPhoneNumberValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");

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
      setCpfValue(value);
    }
  };

  const onPhoneNumberInputChange = (e: any) => {
    const { value } = e.target;
    if (isNumbers(value)) {
      setPhoneNumberValue(value);
    }
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
        <TextField
          label="Nome:"
          value={firstNameValue}
          onChange={onFirstNameInputChange}
          type="text"
          required
        />
        <TextField
          label="Sobrenome:"
          value={lastNameValue}
          onChange={onLastNameInputChange}
          type="text"
          required
        />
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

        <TextField label="Cpf:" value={cpfValue} onChange={onCpfInputChange} required/>

        <TextField
          label="Telefone:"
          value={phoneNumberValue}
          onChange={onPhoneNumberInputChange}
          required
        />
        <Button className={styles.button} variant="contained">
          FINALIZAR
        </Button>
      </div>
    </div>
  );
};

export default Form;
