"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";
import styles from "./styles.module.scss";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Header } from "@/components/Header/Header";
import { IoIosArrowBack } from "react-icons/io";

const Form = () => {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const [value, setValue] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

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
  }, [params.date]); // Executa o efeito quando params.date mudar

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
        <TextField id="outlined-basic" label="Nome:" variant="outlined" />
        <TextField id="outlined-basic" label="Sobrenome:" variant="outlined" />
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
        <TextField
          id="outlined-basic"
          label="Cpf:"
          variant="outlined"
          type="tel"
          className={styles["mui-number-field"]}
        />
        <TextField id="outlined-basic" label="Telefone:" variant="outlined" />
        <Button className={styles.button} variant="contained">
          FINALIZAR
        </Button>
      </div>
    </div>
  );
};

export default Form;
