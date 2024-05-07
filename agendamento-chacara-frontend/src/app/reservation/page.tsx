"use client";
import styles from "./styles.module.scss";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Locale, format, addYears, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { Header } from "@/components/Header/Header";
import { Button } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "dayjs/locale/pt-br"; // Importe o locale desejado, neste caso, português do Brasil
import localizedFormat from "dayjs/plugin/localizedFormat"; //
import { SchedulingService } from "@/services/SchedulingService";

const ReservationPage = () => {
  dayjs.extend(localizedFormat); // Adicione o plugin de localização ao dayjs
  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      weekStartsOn: 1,
    },
  };

  const router = useRouter();
  const date = new Date();
  const nextYear = addYears(date, 1);

  const dateToString = (date: any) => {
    const formattedDate = format(date, "eeee, MMMM dd, yyyy", { locale: ptBR });
    return formattedDate;
  };

  function dayjsDateToSimpleDate(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
  }

  const [dateActualValue, setDateActualValue]: any = useState();
  const [schedulingStatus, setSchedulingStatus]: any = useState("loading");
  const [dateFromBd, setDateFromBd]: any = useState();
  const [occupiedDays, setOccupiedDays]: any = useState();

  const bdDateToDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    const formattedDate = parse(
      `${year}-${month}-${day}`,
      "yyyy-MM-dd",
      new Date()
    );
    return formattedDate;
  };

  const searchOcuppiedDays = async () => {
    const schedulingService = new SchedulingService();
    try {
      const occupiedDaysArr: any = [];
      const allSchedulings = await schedulingService.getAll();

      allSchedulings.forEach((scheduling) => {
        if (scheduling.status == true) {
          const dateFormated = bdDateToDate(scheduling.date);
          occupiedDaysArr.push(dateFormated);
        }
      });
      setOccupiedDays(occupiedDaysArr);
      return;
    } catch (error) {
      setOccupiedDays([]);
      return;
    }
  };
  useEffect(() => {
    searchOcuppiedDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickDayButton = async (dateValue: any) => {
    setSchedulingStatus(false);
    const stringDateFormated = dateToString(dateValue);
    setDateActualValue(stringDateFormated);
    const simpleDateFormated = dayjsDateToSimpleDate(dateValue);
    setDateFromBd(simpleDateFormated);
    const schedulingService = new SchedulingService();
    try {
      const schedulingExists = await schedulingService.getByDate(
        simpleDateFormated
      );
      schedulingExists.forEach((scheduling) => {
        if (scheduling.status == true) {
          setSchedulingStatus(true);
        }
      });
    } catch (error) {
      return;
    }
  };

  const handleClickBackButton = () => {
    router.push("/");
  };

  const handleClickConfirmButton = async () => {
    if (dateFromBd) {
      router.push(`/form/${dateFromBd}`);
    }
  };

  const customCalendarDay = (props: any): any => {
    const { day, ...others } = props;
    let reservedDay = false;
    occupiedDays.forEach((element: string) => {
      if (element == day.toString()) {
        reservedDay = true;
      }
    });

    return (
      <PickersDay
        {...others}
        style={{
          color: reservedDay ? "red" : "none",
          fontWeight: reservedDay ? "bold" : "normal",
        }}
        day={day}
        sx={{
          ...(reservedDay
            ? {
                "&.Mui-selected": {
                  backgroundColor: "rgb(253, 64, 64) !important",
                  color: "white !important",
                },
              }
            : {}),
        }}
      />
    );
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
            {occupiedDays ? (
              <DateCalendar
                value={dateActualValue}
                onChange={(newValue) => {
                  handleClickDayButton(newValue);
                }}
                minDate={date}
                maxDate={nextYear}
                autoFocus={true}
                slots={{
                  day: customCalendarDay,
                }}
              />
            ) : (
              <DateCalendar disabled />
            )}
          </LocalizationProvider>
        </div>
        <div className={styles.confirmationContainer}>
          <p className={styles.textDate}>
            {dateActualValue && dateActualValue}
          </p>
          {schedulingStatus === true ? (
            <div
              style={{
                color: "rgb(253, 64, 64)",
                borderColor: "rgb(253, 64, 64)",
              }}
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
