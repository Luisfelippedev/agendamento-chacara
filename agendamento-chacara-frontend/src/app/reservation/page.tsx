"use client";
import styles from "./styles.module.scss";
import {
  DateCalendar,
  DateField,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Locale } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { IoMdClose } from "react-icons/io";
import { Header } from "@/components/Header/Header";
import { Button } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const ReservationPage = () => {
  const router = useRouter();
  const date = dayjs();
  const nextYear = date.add(1, "year");

  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      // Sunday = 0, Monday = 1.
      weekStartsOn: 1,
    },
  };

  const handleClickBackButton = () => {
    router.push("/");
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
            <DateCalendar minDate={date} maxDate={nextYear} autoFocus={true} />
          </LocalizationProvider>
        </div>
        <div className={styles.confirmationContainer}>
          <p className={styles.textDate}>Quinta Feira, mai 02, 2024</p>
          <div className={styles.statusLabel}>Livre</div>
          <div className={styles.buttonContainer}>
            <Button className={styles.button} variant="contained" href="#">
              CONTINUAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
