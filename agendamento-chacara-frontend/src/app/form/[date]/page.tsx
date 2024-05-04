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

const Form = () => {
  const params = useParams<{ date: string }>();
  const router = useRouter();
  const [value, setValue]: any = useState();

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

  useEffect(() => {
    if (params.date === "undefined") {
      router.push("/reservation");
    }
    verifyDateStatus();
    // stringToDateObj();
  }),
    [];

  return (
    <div className={styles.background}>
      <div className={styles.formContainer}>
        <span className={styles.titleForm}>Finalizar reserva:</span>
        <TextField id="outlined-basic" label="Nome:" variant="outlined" />
        <TextField id="outlined-basic" label="Sobrenome:" variant="outlined" />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <DatePicker
            disabled
            label="Data"
            // defaultValue={stringToDateObj()}
            defaultValue={stringToDateObj(params.date)}
          />
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
          ENVIAR
        </Button>
      </div>
      {/* <p>{params.date}</p>; */}
    </div>
  );
};

export default Form;
