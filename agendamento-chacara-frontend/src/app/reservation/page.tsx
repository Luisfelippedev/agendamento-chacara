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
import Link from "next/link";
import { SchedulingService } from "@/services/SchedulingService";
import { Scheduling } from "../models/Scheduling";

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

  function dayjsDateToSimpleDate(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const dataFormatada = data.format("DD-MM-YYYY"); // Formato desejado
    return dataFormatada;
  }

  const [dateActualValue, setDateActualValue]: any = useState();
  const [schedulingStatus, setSchedulingStatus]: any = useState("loading");
  const [dateFromBd, setDateFromBd]: any = useState();

  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      // Sunday = 0, Monday = 1.
      weekStartsOn: 1,
    },
  };

  const handleClickDayButton = async (dateValue: any) => {
    setSchedulingStatus(false);
    const stringDateFormated = dayjsDateToString(dateValue);
    setDateActualValue(stringDateFormated);
    const simpleDateFormated = dayjsDateToSimpleDate(dateValue);
    setDateFromBd(simpleDateFormated);
    const schedulingService = new SchedulingService();
    try {
      const schedulingExists = await schedulingService.getByDate(
        simpleDateFormated
      );
      schedulingExists.forEach((scheduling) => {
        if (scheduling.status == undefined || scheduling.status == false) {
          console.log("chegou");
          setSchedulingStatus(false);
          return;
        }
        setSchedulingStatus(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickBackButton = () => {
    router.push("/");
  };

  const handleClickConfirmButton = async () => {
    if (dateFromBd) {
      router.push(`/form/${dateFromBd}`);
    }

    // const schedulingService = new SchedulingService();
    // const objScheduling: Scheduling = {
    //   clientName: "asdads",
    //   cpf: "12345678907889",
    //   date: "03-05-2023",
    //   phoneNumber: "1234567887699",
    //   status: false,
    // };
    // await schedulingService.createScheduling(objScheduling);
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
          {schedulingStatus === true ? (
            <div
              style={{ color: "red", borderColor: "red" }}
              className={styles.statusLabel}
            >
              Reservado
            </div>
          ) : schedulingStatus === "loading" ? (
            ""
          ) : (
            <div className={styles.statusLabel}>Livre</div>
          )}
          <div className={styles.buttonContainer}>
            <Button
              disabled={
                schedulingStatus === "loading" || schedulingStatus === true
              }
              onClick={handleClickConfirmButton}
              className={styles.button}
              variant="contained"
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
