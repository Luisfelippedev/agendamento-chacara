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
  const [currentDateCalendar, setCurrentDateCalendar]: any = useState();
  const [waitSendDate, setWaitSendDate] = useState(false)

  const bdDateToDate = (dateString: string) => {
    const [day, month, year] = dateString.split("-");
    const formattedDate = parse(
      `${year}-${month}-${day}`,
      "yyyy-MM-dd",
      new Date()
    );
    return formattedDate;
  };

  function adicionarUmDia(dataString: any) {
    // Dividir a string da data em dia, mês e ano
    const [dia, mes, ano] = dataString.split("-").map(Number);

    // Criar um objeto de data usando o construtor Date
    const data = new Date(ano, mes - 1, dia);

    // Adicionar um dia à data
    data.setDate(data.getDate() + 1);

    // Obter o novo dia, mês e ano da data
    const novoDia = data.getDate();
    const novoMes = data.getMonth() + 1;
    const novoAno = data.getFullYear();

    // Formatar a nova data para o formato dd/mm/yyyy
    const novaDataFormatada = `${novoDia.toString().padStart(2, "0")}-${novoMes
      .toString()
      .padStart(2, "0")}-${novoAno}`;

    return novaDataFormatada;
  }

  const searchOcuppiedDays = async () => {
    const schedulingService = new SchedulingService();
    try {
      const occupiedDaysArr: any = [];
      const allSchedulings = await schedulingService.getAll();

      allSchedulings.forEach((scheduling) => {
        if (scheduling.status == true) {
          if (scheduling.avaliableDays > 1) {
            let dateNewScheduling = scheduling.date;
            for (let i = 1; i < scheduling.avaliableDays; i++) {
              dateNewScheduling = adicionarUmDia(dateNewScheduling);

              occupiedDaysArr.push(bdDateToDate(dateNewScheduling));
              // }
            }
          }
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
    setCurrentDateCalendar(dateValue);
    setSchedulingStatus(false);
    const stringDateFormated = dateToString(dateValue);
    setDateActualValue(stringDateFormated);
    const simpleDateFormated = dayjsDateToSimpleDate(dateValue);
    setDateFromBd(simpleDateFormated);

    let newArr = occupiedDays.filter((item: any) => {
      return String(item) == String(dateValue);
    });

    if (newArr.length > 0) {
      setSchedulingStatus(true);
    } else {
      return;
    }
  };

  const handleClickBackButton = () => {
    router.push("/");
  };

  const handleClickConfirmButton = async () => {
    if (dateFromBd) {
      setWaitSendDate(true)
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
                value={currentDateCalendar}
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
                schedulingStatus === "loading" || schedulingStatus === true || waitSendDate
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
