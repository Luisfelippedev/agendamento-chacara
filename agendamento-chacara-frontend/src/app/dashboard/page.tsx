"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/tridev-logo-black.png";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MdOutlineSupportAgent } from "react-icons/md";
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/loading-animation.json";
import { IoLogOut } from "react-icons/io5";
import { ptBR } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import dayjs from "dayjs";
import {
  Locale,
  format,
  addYears,
  parse,
  startOfDay,
  isBefore,
} from "date-fns";
import "dayjs/locale/pt-br"; // Importe o locale desejado, neste caso, português do Brasil
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { SchedulingCard } from "@/components/SchedulingCard/SchedulingCard";
import { SchedulingService } from "@/services/SchedulingService";
import { Scheduling } from "../models/Scheduling";
import { randomUUID } from "crypto";

const DashboardPage = () => {
  const router = useRouter();
  const date = new Date();
  const nextYear = addYears(date, 1);
  const [isLogged, setIsLogged] = useState(false);
  const [dateActualString, setDateActualString]: any = useState();
  const [currentDateCalendar, setCurrentDateCalendar]: any = useState();
  const [schedulingStatus, setSchedulingStatus]: any = useState("loading");
  // const [dateFromBd, setDateFromBd]: any = useState();
  const [numberOfSchedulings, setNumberOfSchedulings]: any = useState(null);
  const [currentPage, setCurrentPage]: any = useState("schedule");
  const [occupiedDays, setOccupiedDays]: any = useState([]);
  const [occupiedDaysCurrentList, setOccupiedDaysCurrentList]: any = useState(
    []
  );
  const [isAllScheduling, setIsAllScheduling]: any = useState(false);

  const userService = new UserService();
  const schedulingService = new SchedulingService();

  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      weekStartsOn: 1,
    },
  };

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
      let occupiedDaysArr: Array<any> = [];
      const allSchedulings = await schedulingService.getAll();

      for (const scheduling of allSchedulings) {
        if (scheduling.status == true) {
          if (scheduling.avaliableDays > 1) {
            let dateNewScheduling = scheduling.date;
            for (let i = 1; i < scheduling.avaliableDays; i++) {
              dateNewScheduling = adicionarUmDia(dateNewScheduling);

              occupiedDaysArr.push({
                date: dateNewScheduling,
                status: "occupied",
                fullName: scheduling.clientName,
                cpf: scheduling.cpf,
                id: randomUUID,
                phoneNumber: scheduling.phoneNumber,
                avaliableDays: 1,
                forgeinKey: scheduling.id,
              });
              // }
            }
          }
          // const dateFormated = bdDateToDate(scheduling.date);
          occupiedDaysArr.push({
            date: scheduling.date,
            status: "occupied",
            fullName: scheduling.clientName,
            cpf: scheduling.cpf,
            id: scheduling.id,
            phoneNumber: scheduling.phoneNumber,
            avaliableDays: scheduling.avaliableDays,
            forgeinKey: scheduling.forgeinKey,
          });
        } else {
          // const dateFormated = bdDateToDate(scheduling.date);
          occupiedDaysArr.push({
            date: scheduling.date,
            status: "waiting",
            fullName: scheduling.clientName,
            cpf: scheduling.cpf,
            id: scheduling.id,
            phoneNumber: scheduling.phoneNumber,
            avaliableDays: scheduling.avaliableDays,
            forgeinKey: scheduling.forgeinKey,
          });
        }
      }

      occupiedDaysArr.sort((a, b) => {
        const dateA = new Date(a.date.split("-").reverse().join("-")).getTime();
        const dateB = new Date(b.date.split("-").reverse().join("-")).getTime();

        // Se as datas forem iguais, coloque os objetos com status "occupied" por último
        if (dateA === dateB) {
          if (a.status === "occupied") return 1;
          if (b.status === "occupied") return -1;
        }

        return dateA - dateB;
      });

      setOccupiedDays(occupiedDaysArr);
      return;
    } catch (error) {
      setOccupiedDays([]);
      return;
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeModal = () => {
    setAnchorEl(null);
  };

  const userIsLogged = async () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        await userService.getProfile(token);
        setIsLogged(true); // Define como logado após a verificação
      } catch (error) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  const dateToString = (datee: any) => {
    const formattedDate = format(datee, "eeee, MMMM dd, yyyy", {
      locale: ptBR,
    });
    return formattedDate;
  };

  function dayjsDateToSimpleDate(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
  }

  const handleClickDayButton = async (dateValue: any) => {
    setCurrentDateCalendar(dateValue);
    setNumberOfSchedulings(null);
    setSchedulingStatus("loading");
    const stringDateFormated = dateToString(dateValue);
    setDateActualString(stringDateFormated);

    const simpleDateFormated = dayjsDateToSimpleDate(dateValue);
    // setDateFromBd(simpleDateFormated);
    // const schedulingService = new SchedulingService();

    let newArr = occupiedDays.filter((item: any) => {
      return item.date === simpleDateFormated;
    });

    if (newArr.length > 0) {
      setNumberOfSchedulings(newArr.length);
      let hasOccupied = false; // Estado intermediário para controlar se scheduling.status já foi true
      occupiedDays.forEach((scheduling: any) => {
        if (scheduling.status === "occupied" && !hasOccupied) {
          setSchedulingStatus("occupied");
          hasOccupied = true; // Marca que scheduling.status já foi true
        }
      });
      if (!hasOccupied) {
        setSchedulingStatus("waiting");
      }
    } else {
      setSchedulingStatus("free");
    }

    // try {
    //   const schedulingExists = await schedulingService.getByDate(
    //     simpleDateFormated
    //   );
    //   setNumberOfSchedulings(schedulingExists.length);
    //   let hasOccupied = false; // Estado intermediário para controlar se scheduling.status já foi true
    //   occupiedDays.forEach((scheduling: any) => {
    //     if (scheduling.status === "occupied" && !hasOccupied) {
    //       setSchedulingStatus("occupied");
    //       hasOccupied = true; // Marca que scheduling.status já foi true
    //     }
    //   });
    //   if (!hasOccupied) {
    //     setSchedulingStatus("waiting");
    //   }
    // } catch (error) {
    //   setSchedulingStatus("free");
    // }
  };

  const handleClickScheduleButton = () => {
    setCurrentPage("schedule");
    // searchOcuppiedDays();
  };

  const handleClickOderButton = () => {
    setIsAllScheduling(true);
    setCurrentPage("order");
  };

  const onClickButtonToView = () => {
    setIsAllScheduling(false);
    changeSchedulingsByDate();
    setCurrentPage("order");
  };

  const changeSchedulingsByDate = async () => {
    const dataObj = new Date(currentDateCalendar);
    const dia = String(dataObj.getDate()).padStart(2, "0");
    const mes = String(dataObj.getMonth() + 1).padStart(2, "0"); // Adiciona +1 porque os meses começam em 0
    const ano = dataObj.getFullYear();
    const dateFromDb = `${dia}-${mes}-${ano}`;

    let occupiedDaysArr: Array<any> = [];

    occupiedDays.forEach((item: any) => {
      if (item.date == dateFromDb) {
        if (item.status == "occupied") {
          occupiedDaysArr.push(item);
          setOccupiedDaysCurrentList(occupiedDaysArr);
          return;
        }
        if (item.status == "waiting") {
          occupiedDaysArr.push(item);
          setOccupiedDaysCurrentList(occupiedDaysArr);
        }
      }
    });
  };

  const onClickViewAllButton = () => {
    setIsAllScheduling(true);
  };

  const dateStringToWithBar = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  function isPastDate(dataString: string) {
    const dataFornecida = parse(dataString, "dd-MM-yyyy", new Date());
    const dataAtual = startOfDay(new Date()); // Inicia a hora do dia atual em 00:00:00

    return isBefore(dataFornecida, dataAtual);
  }

  const deleteOldScheduling = async () => {
    const allScheduling = await schedulingService.getAll();
    allScheduling.forEach((scheduling) => {
      const isPast = isPastDate(scheduling.date);
      if (isPast) {
        schedulingService.deleteById(scheduling.id);
      }
    });
    searchOcuppiedDays();
  };

  // const deleteOldTemporaryValuesInLocalStorage = () => {
  //   occupiedDays.forEach((item: any) => {
  //     if (item.id) console.log("aquiii teste" + item.id);
  //   });
  // };

  useEffect(() => {
    deleteOldScheduling();
    // deleteOldTemporaryValuesInLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    userIsLogged();
  });

  const customCalendarDay = (props: any): any => {
    const { day, ...others } = props;
    let reservedDay: any;

    occupiedDays.forEach((element: any) => {
      const dateFormated = bdDateToDate(element.date);
      if (dateFormated == day.toString()) {
        reservedDay = { date: dateFormated, status: element.status };
      }
    });

    return (
      <PickersDay
        {...others}
        style={{
          color:
            reservedDay && reservedDay.status === "occupied"
              ? "green"
              : reservedDay && reservedDay.status === "waiting"
              ? "rgb(255, 128, 0)"
              : "none",
          fontWeight: reservedDay ? "bold" : "normal",
        }}
        day={day}
        sx={{
          ...(reservedDay && reservedDay.status === "occupied"
            ? {
                "&.Mui-selected": {
                  backgroundColor: "green !important",
                  color: "white !important",
                },
              }
            : reservedDay && reservedDay.status === "waiting"
            ? {
                "&.Mui-selected": {
                  backgroundColor: "rgb(255, 128, 0) !important",
                  color: "white !important",
                },
              }
            : {}),
        }}
      />
    );
  };

  if (!isLogged) {
    return (
      <div className={styles.backgroundLoading}>
        <Lottie
          className={styles.loadingAnimation}
          animationData={loadingAnimation}
          loop={true}
        />
      </div>
    ); // Não renderiza nada enquanto a verificação não estiver concluída
  }
  return (
    <div className={styles.background}>
      <div className={styles.header}>
        <Image className={styles.logoImage} src={logo} alt="tridev-logo" />

        <div className={styles.lastBox}>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClickMenu}
              size="small"
              sx={{ ml: 3 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar className={styles.userAvatar}>L</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeModal}
            onClick={closeModal}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <p style={{ textAlign: "center", padding: "6% 0 8% 0" }}>
              Luis Felippe
            </p>
            <Divider />
            <MenuItem onClick={closeModal}>
              <ListItemIcon>
                <MdOutlineSupportAgent className={styles.userIcon} size={30} />
              </ListItemIcon>
              Suporte
            </MenuItem>
            <MenuItem onClick={closeModal}>
              <ListItemIcon>
                <IoLogOut className={styles.userIcon} size={30} />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className={styles.centerContainer}>
        <div className={styles.buttonsContainer}>
          <button
            onClick={handleClickScheduleButton}
            className={
              currentPage == "schedule"
                ? styles.scheduleButtonActive
                : styles.scheduleButtonInative
            }
          >
            Agenda
          </button>
          <button
            onClick={handleClickOderButton}
            className={
              currentPage == "order"
                ? styles.orderButtonActive
                : styles.orderButtonInative
            }
          >
            Pedidos
          </button>
        </div>

        {currentPage == "schedule" && (
          <>
            <div className={styles.dateCalendarContainer}>
              <div className={styles.calendarHeader}>Selecione um dia</div>

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
            <div className={styles.lastContainer}>
              <p className={styles.textDate}>
                {dateActualString && dateActualString}
              </p>
              {schedulingStatus == "waiting" && (
                <p className={styles.orderText}>
                  Quantidade de pedidos: {numberOfSchedulings}
                </p>
              )}
              {schedulingStatus == "occupied" && (
                <p className={styles.orderText}>
                  Quantidade de pedidos: {numberOfSchedulings}
                </p>
              )}
              {schedulingStatus == "free" && (
                <p className={styles.orderText}>Quantidade de pedidos: 0</p>
              )}
              {schedulingStatus == "free" && (
                <span className={styles.statusLabel}>Livre</span>
              )}
              {schedulingStatus == "occupied" && (
                <span
                  style={{ color: "green", borderColor: "green" }}
                  className={styles.statusLabel}
                >
                  Reservado
                </span>
              )}
              {schedulingStatus == "waiting" && (
                <span
                  style={{
                    color: "rgb(255, 128, 0)",
                    borderColor: "rgb(255, 128, 0)",
                  }}
                  className={styles.statusLabel}
                >
                  Esperando
                </span>
              )}
              <div className={styles.submitButtonContainer}>
                <Button
                  disabled={
                    schedulingStatus === "loading" ||
                    schedulingStatus === "free"
                  }
                  variant="contained"
                  onClick={onClickButtonToView}
                >
                  VISUALIZAR
                </Button>
              </div>
            </div>
          </>
        )}

        {currentPage == "order" && (
          <>
            <div className={styles.schedulingListContainer}>
              {dateActualString && !isAllScheduling && (
                <div className={styles.titleBox}>
                  <span className={styles.titleText}>
                    <p className={styles.dateTitleText}>
                      ({dateStringToWithBar(currentDateCalendar)})
                    </p>
                  </span>
                </div>
              )}
              <div className={styles.clearFilterBox}>
                {!isAllScheduling && (
                  <Button
                    onClick={onClickViewAllButton}
                    className={styles.buttonViewAll}
                    variant="outlined"
                  >
                    VER TODOS
                  </Button>
                )}
              </div>
              {/* {occupiedDays.length > 0 &&
                isAllScheduling &&
                occupiedDays.map((scheduling: any, index: any) => (
                  <SchedulingCard
                    key={index} // Certifique-se de usar uma chave única para cada item renderizado em um loop
                    date={bdDateToDate(scheduling.date)} // Passe as propriedades necessárias para o componente SchedulingCard
                    status={scheduling.status}
                    fullName={scheduling.fullName}
                    phoneNumber={scheduling.phoneNumber}
                    id={scheduling.id}
                    cpf={scheduling.cpf}
                    occupiedDays={occupiedDays}
                    avaliableDaysProp={scheduling.avaliableDays}
                  />
                ))} */}
              {occupiedDays.length > 0 &&
                isAllScheduling &&
                occupiedDays
                  .filter((scheduling: any) => scheduling.forgeinKey === "") // Filtra os objetos com forgeinKey vazia
                  .map((scheduling: any, index: any) => (
                    <SchedulingCard
                      key={index}
                      date={bdDateToDate(scheduling.date)}
                      status={scheduling.status}
                      fullName={scheduling.fullName}
                      phoneNumber={scheduling.phoneNumber}
                      id={scheduling.id}
                      cpf={scheduling.cpf}
                      occupiedDays={occupiedDays}
                      avaliableDaysProp={scheduling.avaliableDays}
                    />
                  ))}
              {occupiedDaysCurrentList.length > 0 && !isAllScheduling && (
                <>
                  {/* Renderize primeiro os dias com status "occupied" */}
                  {/* {occupiedDaysCurrentList
                    .filter(
                      (scheduling: any) => scheduling.status === "occupied"
                    )
                    .map((scheduling: any, index: any) => (
                      <SchedulingCard
                        key={index}
                        date={bdDateToDate(scheduling.date)}
                        status={scheduling.status}
                        fullName={scheduling.fullName}
                        phoneNumber={scheduling.phoneNumber}
                        id={scheduling.id}
                        cpf={scheduling.cpf}
                        occupiedDays={occupiedDays}
                        avaliableDaysProp={scheduling.avaliableDays}
                      />
                    ))} */}
                  {occupiedDaysCurrentList
                    .filter(
                      (scheduling: any) => scheduling.status === "occupied"
                    )
                    .map((scheduling: any, index: any) => {
                      let scheduledItem =
                        scheduling.forgeinKey !== ""
                          ? occupiedDays.find(
                              (item: any) => item.id === scheduling.forgeinKey
                            )
                          : null;
                      let schedulingToRender = scheduledItem
                        ? scheduledItem
                        : scheduling;

                      return (
                        <SchedulingCard
                          key={index}
                          date={bdDateToDate(schedulingToRender.date)}
                          status={schedulingToRender.status}
                          fullName={schedulingToRender.fullName}
                          phoneNumber={schedulingToRender.phoneNumber}
                          id={schedulingToRender.id}
                          cpf={schedulingToRender.cpf}
                          occupiedDays={occupiedDays}
                          avaliableDaysProp={schedulingToRender.avaliableDays}
                        />
                      );
                    })}

                  {/* Renderize os dias com status "waiting" depois */}
                  {occupiedDaysCurrentList
                    .filter(
                      (scheduling: any) => scheduling.status === "waiting"
                    )
                    .map((scheduling: any, index: any) => (
                      <SchedulingCard
                        key={index}
                        date={bdDateToDate(scheduling.date)}
                        status={scheduling.status}
                        fullName={scheduling.fullName}
                        phoneNumber={scheduling.phoneNumber}
                        id={scheduling.id}
                        cpf={scheduling.cpf}
                        occupiedDays={occupiedDays}
                        avaliableDaysProp={scheduling.avaliableDays}
                      />
                    ))}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
