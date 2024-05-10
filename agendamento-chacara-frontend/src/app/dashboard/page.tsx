"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/tridev-logo-black.png";
import { HiMiniUserCircle } from "react-icons/hi2";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { ptBR } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import dayjs from "dayjs";
import { Locale, format, addYears, parse } from "date-fns";
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
import { DateCalendar, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { SchedulingCard } from "@/components/SchedulingCard/SchedulingCard";
import { SchedulingService } from "@/services/SchedulingService";

const DashboardPage = () => {
  const router = useRouter();
  const date = new Date();
  const nextYear = addYears(date, 1);
  const [isLogged, setIsLogged] = useState(false);
  const [dateActualString, setDateActualString]: any = useState();
  const [schedulingStatus, setSchedulingStatus]: any = useState("loading");
  const [dateFromBd, setDateFromBd]: any = useState();
  const [numberOfSchedulings, setNumberOfSchedulings]: any = useState(null);
  const [currentPage, setCurrentPage]: any = useState("schedule");

  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      weekStartsOn: 1,
    },
  };

  const userService = new UserService();

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
    setNumberOfSchedulings(null);

    setSchedulingStatus("loading");
    const stringDateFormated = dateToString(dateValue);
    setDateActualString(stringDateFormated);
    const simpleDateFormated = dayjsDateToSimpleDate(dateValue);
    setDateFromBd(simpleDateFormated);
    const schedulingService = new SchedulingService();
    try {
      const schedulingExists = await schedulingService.getByDate(
        simpleDateFormated
      );
      setNumberOfSchedulings(schedulingExists.length);
      let hasOccupied = false; // Estado intermediário para controlar se scheduling.status já foi true
      schedulingExists.forEach((scheduling) => {
        if (scheduling.status === true && !hasOccupied) {
          setSchedulingStatus("occupied");
          hasOccupied = true; // Marca que scheduling.status já foi true
        }
      });
      if (!hasOccupied) {
        setSchedulingStatus("waiting");
      }
    } catch (error) {
      setSchedulingStatus("free");
    }
  };

  const handleClickScheduleButton = () => {
    setCurrentPage("schedule");
  };

  const handleClickOderButton = () => {
    setCurrentPage("order");
  };


  useEffect(() => {
    userIsLogged();
  });

  if (!isLogged) {
    return null; // Não renderiza nada enquanto a verificação não estiver concluída
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
              <div className={styles.calendarHeader}>Agenda</div>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={customPtBrLocale}
              >
                <DateCalendar
                  value={dateActualString}
                  onChange={(newValue) => {
                    handleClickDayButton(newValue);
                  }}
                  minDate={date}
                  maxDate={nextYear}
                  autoFocus={true}
                />
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
              {schedulingStatus == "free" && (
                <p className={styles.orderText}>Quantidade de pedidos: 0</p>
              )}
              {schedulingStatus == "free" && (
                <span className={styles.statusLabel}>Livre</span>
              )}
              {schedulingStatus == "occupied" && (
                <span
                  style={{ color: "red", borderColor: "red" }}
                  className={styles.statusLabel}
                >
                  Reservado
                </span>
              )}
              {schedulingStatus == "waiting" && (
                <span
                  style={{ color: "orange", borderColor: "orange" }}
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
                >
                  VISUALIZAR
                </Button>
              </div>
            </div>
          </>
        )}

        {currentPage == "order" && (
          <>
            <p className={styles.titleText}>Pedidos</p>
            <div className={styles.schedulingListContainer}>
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
              <SchedulingCard />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
