"use client";
import styles from "./styles.module.scss";
import {
  DateCalendar,
  DateField,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Locale, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { IoMdClose } from "react-icons/io";
import { Header } from "@/components/Header/Header";
import { Button } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br"; // Importe o locale desejado, neste caso, português do Brasil
import localizedFormat from "dayjs/plugin/localizedFormat"; //

const ReservationPage = () => {
  dayjs.extend(localizedFormat); // Adicione o plugin de localização ao dayjs

  const router = useRouter();
  const date = dayjs();
  const nextYear = date.add(1, "year");

  const dayjsDateToString = (date: any) => {
    const dataFormatada = dayjs(date, "dddd, MMM DD, YYYY")
      .locale("pt-br")
      .format("dddd, MMMM DD, YYYY");
    return dataFormatada;
  };

  const initialDate = dayjsDateToString(date);

  const [dateActualValue, setDateActualValue]: any = useState();
  const [dateFromBd, setDateFromBd]: any = useState();

  useEffect(() => {
    console.log(dateFromBd);
  }, [dateFromBd]);

  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      // Sunday = 0, Monday = 1.
      weekStartsOn: 1,
    },
  };

  const handleClickDayButton = (dateValue: any) => {
    const dateFormated = dayjsDateToString(dateValue);
    setDateActualValue(dateFormated);
    setDateFromBd(dateValue);
  };

  const handleClickBackButton = () => {
    router.push("/");
  };

  const handleClickConfirmButton = () => {
    // salvar data no contexto
    // redirecionar o usuário para a outra aba
    // na outra aba confiro se há um valor no context, caso não tenha, o useEffect de la irá retornar o usuário para essa página novamente
  };

  return (
    <div className={styles.background}>
      <Header page="reservationPage" />
      <div className={styles.titleText}>Selecione um horário</div>
      <div className={styles.container}>
        <div className={styles.backButton}>
          <p onClick={handleClickBackButton} className={styles.textBackButton}>
            <IoIosArrowBack size={15} />
            Voltar
          </p>
        </div>
        <div className={styles.dateCalendarContainer}>
          <div className={styles.calendarHeader}>Agenda</div>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={customPtBrLocale}
          >
            <DateCalendar
              value={dateActualValue}
              onChange={(newValue) => {
                handleClickDayButton(newValue);
              }}
              minDate={date}
              maxDate={nextYear}
              autoFocus={true}
            />
          </LocalizationProvider>
        </div>
        <div className={styles.confirmationContainer}>
          <p className={styles.textDate}>
            {dateActualValue && dateActualValue}
          </p>
          <div className={styles.statusLabel}>Livre</div>
          <div className={styles.buttonContainer}>
            <Button
              onClick={handleClickConfirmButton}
              className={styles.button}
              variant="contained"
              href="#"
            >
              CONTINUAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
