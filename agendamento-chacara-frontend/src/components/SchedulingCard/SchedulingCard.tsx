import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { IoIosCloseCircle } from "react-icons/io";
import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PatternFormat, NumericFormat } from "react-number-format";
import "dayjs/locale/pt-br";
import { ptBR } from "date-fns/locale";
import { Locale, addYears, format, parse } from "date-fns";
import { FaDownload } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";
import ContractGenerator, { IContractTemplateProps } from "../Pdf/Pdf";
import { VscDiffAdded } from "react-icons/vsc";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { SchedulingService } from "@/services/SchedulingService";
import changeDateIcon from "../../../public/change-date-icon.png";
import Image from "next/image";

// import ReactPDF from "@react-pdf/renderer";
// import dynamic from "next/dynamic";

export interface SchedulingCardProps {
  date: any;
  fullName: any;
  phoneNumber: any;
  status: any;
  cpf: any;
  id: any;
  occupiedDays: any;
  avaliableDaysProp: any;
}

export const SchedulingCard = ({
  date,
  fullName,
  phoneNumber,
  status,
  cpf,
  id,
  occupiedDays,
  avaliableDaysProp,
}: SchedulingCardProps) => {
  const customPtBrLocale: Locale = {
    ...ptBR,
    options: {
      ...ptBR.options,
      weekStartsOn: 1,
    },
  };

  const schedulingService = new SchedulingService();

  const [dateObj, setDateObj] = useState(dateToObj(date));
  const [phoneNumberFormated, setPhoneNumberFormated]: any = useState(
    formatPhoneNumber(phoneNumber)
  );
  const [entryTime, setEntryTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [dateString, setDateString] = useState(dateToString(date));
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fullNameClient, setFullNameClient]: any = useState("");
  const [cpfClient, setCpfClient]: any = useState("");
  const [numberOfBusyDays, setNumberOfBusyDays]: any = useState(
    // avaliableDaysProp > 1 ? avaliableDaysProp : ""
    status == "occupied" ? avaliableDaysProp : ""
  );
  const [initialValue, setInitialValue]: any = useState(NaN);
  const [additionalServices, setAdditionalServices]: any = useState([]);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceValue, setNewServiceValue]: any = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateIsOccupied, setDateIsOccupied]: any = useState();
  const [availableDays, setAvailableDays]: any = useState();
  const [isTemporaryValues, setIsTemporaryValues]: any = useState(false);

  const [currentChangeDateValue, setCurrentChangeDateValue]: any =
    useState(null);

  const handleOpenModal = () => {
    // setFullNameClient(fullName);
    // setCpfClient(cpf);
    // setPhoneNumberFormated(formatPhoneNumber(phoneNumber));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    searchTemporaryValuesInLocalStorage();
    setShowModal(false);
  };

  const dateNow = new Date();

  const nextYear = addYears(dateNow, 1);

  // const handleOpenSubModal = () => {
  //   setShowSubModal(true);
  // };

  const handleCloseSubModal = () => {
    setShowSubModal(false);
  };

  const toggleStatusCurrentScheduling = async () => {
    try {
      await schedulingService.toggleStatusById(id);
      if (avaliableDaysProp > 1) {
        await schedulingService.updateAvaliableDaysById(id, 1);
      } else {
        await schedulingService.updateAvaliableDaysById(id, numberOfBusyDays);
      }
      setTemporaryValuesInLocalStorage();
      window.location.reload();
    } catch (error) {
      return;
    }

    // handleCloseSubModal();
  };

  const dateToLongString = (date: any) => {
    const formattedDate = format(date, "eeee, MMMM dd, yyyy", { locale: ptBR });
    return formattedDate;
  };

  const searchTemporaryValuesInLocalStorage = () => {
    const temporaryData = localStorage.getItem("temporaryData" + id);
    if (temporaryData) {
      const temporaryDataObject = JSON.parse(temporaryData);
      console.log("aqui" + temporaryDataObject.initialValue);
      setNumberOfBusyDays(temporaryDataObject.numberOfBusyDays);
      setEntryTime(temporaryDataObject.entryTime);
      setDepartureTime(temporaryDataObject.departureTime);
      setInitialValue(temporaryDataObject.initialValue);
      setAdditionalServices(temporaryDataObject.additionalServices);
      setFullNameClient(temporaryDataObject.fullNameClient);
      setCpfClient(temporaryDataObject.cpfClient);
    } else {
      setFullNameClient(fullName);
      setCpfClient(cpf);
      setIsTemporaryValues(true);
    }
    console.log("TESTEE");
  };

  useEffect(() => {
    setIsMounted(true);
    currentDateIsOccupied();
    searchAvailableDays();
    //
    searchTemporaryValuesInLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeEntryTimeValue = (value: any) => {
    // Remove os dois pontos ":" da string
    // const newValue = value.replace(/:/g, "");

    // Verifica se o valor inserido é menor ou igual a 1200 (12:00)
    // if (parseInt(newValue, 10) <= 2400) {
    setEntryTime(String(value).trim());
    // } else {
    //   // Se for maior que 12:00, define o valor como 1200 (12:00)
    //   setEntryTime("0000");
    // }
  };

  const onChangeDepartureTimeValue = (value: any) => {
    // Remove os dois pontos ":" da string
    // const newValue = value.replace(/:/g, "");

    // Verifica se o valor inserido é menor ou igual a 1200 (12:00)
    // if (parseInt(newValue, 10) <= 1200) {
    setDepartureTime(String(value).trim());
    // } else {
    //   // Se for maior que 12:00, define o valor como 1200 (12:00)
    //   setDepartureTime("1200");
    // }
  };

  function dateToObj(value: any) {
    const monthsPtBr = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const dateObj = new Date(value);
    let day = String(dateObj.getDate());
    const monthIndex = dateObj.getMonth();
    const month = monthsPtBr[monthIndex];
    const year = dateObj.getFullYear();
    const formattedDate = dateObj.toString();

    if (avaliableDaysProp > 1) {
      let untilTheDate = dateToString(date);
      for (let i = 1; i < avaliableDaysProp; i++) {
        untilTheDate = adicionarUmDia(untilTheDate);
      }
      day = day + "-" + untilTheDate.substring(0, 2);
    }

    return {
      day,
      month,
      year,
      formattedDate,
    };
  }

  function formatPhoneNumber(phone: any): string {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(0?(\d{2})(\d{5})(\d{4}))$/);
    if (match) {
      return `(${match[2]}) ${match[3]}-${match[4]}`;
    }
    return "";
  }

  function dateToString(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
  }

  const getDateToContractPdf = (): IContractTemplateProps => {
    const dateProps: IContractTemplateProps = {
      cpf: cpfClient,
      fullName: fullName,
      entryTime: entryTime,
      departureTime: departureTime,
      numberOfBusyDays: numberOfBusyDays,
      phoneNumber: phoneNumberFormated,
    };
    return dateProps;
  };

  const onChangeInitialValue = (value: any) => {
    // Remove o símbolo 'R$', vírgulas e pontos
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Converte para número flutuante
    const floatValue = parseFloat(cleanValue);

    setInitialValue(floatValue);
  };

  const onChangeAdditionalValue = (value: any) => {
    // Remove o símbolo 'R$', vírgulas e pontos
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Converte para número flutuante
    const floatValue = parseFloat(cleanValue);
    setNewServiceValue(floatValue);
  };

  const handleAddedAdditionalServiceButton = () => {
    const additionalServiceArr = additionalServices;

    additionalServiceArr.push({
      serviceName: newServiceName,
      value: newServiceValue,
    });
    setAdditionalServices(additionalServiceArr);

    setNewServiceName("");
    setNewServiceValue("");
    setShowNewServiceModal(false);
  };

  const handleChangeServiceValue = (index: any, newValue: any) => {
    // Cria uma cópia do array additionalServices para não modificar o estado diretamente
    const updatedServices = [...additionalServices];

    // Remove o símbolo 'R$', vírgulas e pontos
    const cleanValue = newValue.replace(/[^\d.]/g, "");

    // Converte para número flutuante
    const floatValue = parseFloat(cleanValue);
    // Modifica o objeto específico dentro do array com o novo name
    updatedServices[index] = { ...updatedServices[index], value: floatValue };

    // Define o novo array como o estado additionalServices
    setAdditionalServices(updatedServices);
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

  function dayjsDateToSimpleDate(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
  }
  const handleChangeDayOfChangeDate = (value: any) => {
    const formattedDate = dayjsDateToSimpleDate(value);
    setCurrentChangeDateValue(formattedDate);
  };

  const customCalendarDay = (props: any): any => {
    const { day, ...others } = props;
    let reservedDay: any;

    occupiedDays.forEach((element: any) => {
      const dateFormated = bdDateToDate(element.date);
      if (dateFormated == day.toString()) {
        reservedDay = { date: dateFormated, status: element.status };
      }
    });

    const currentDate = new Date();
    const isDisabled = currentDate.getDate() > day.getDate(); // Verificar se o dia é anterior ao dia atual

    return (
      <PickersDay
        {...others}
        disabled={
          (reservedDay && reservedDay.status === "occupied") || isDisabled
        } // Desabilitar se a data estiver ocupada ou for anterior ao dia atual
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

  const handleChangeDateButton = async () => {
    try {
      await schedulingService.updateDateById(id, currentChangeDateValue);
      window.location.reload();
    } catch (error) {
      return;
    }
  };

  function verificarFormatoString(string: any) {
    // Expressão regular para verificar o formato xx-xx-xxxx
    const regex = /^[A-Za-z0-9]{2}-[A-Za-z0-9]{2}-[A-Za-z0-9]{4}$/;

    // Testar se a string corresponde à expressão regular
    return regex.test(string);
  }

  const currentDateIsOccupied = () => {
    const currentDateBdString = dayjsDateToSimpleDate(date);
    let status = false;
    const currentDateOccupied = occupiedDays.filter(
      (item: any) => item.date === currentDateBdString
    );
    currentDateOccupied.forEach((item: any) => {
      if (item.status == "occupied") {
        status = true;
      }
    });
    setDateIsOccupied(status);
  };

  const onChangeCpfInput = (value: any) => {
    let newValue = parseInt(value.replace(/[.-]/g, ""));
    setCpfClient(String(newValue));
  };

  const onChangePhoneNumberInput = (value: any) => {
    let newValue = parseInt(value.replace(/[+()-\s]/g, ""));
    setPhoneNumberFormated(String(newValue));
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

  const searchAvailableDays = () => {
    let currentDateDbFormat = adicionarUmDia(dayjsDateToSimpleDate(date));
    // let currentDateDbFormat = adicionarUmDia("10-05-2024");
    let availableDaysValue = 0;
    let breakLoop = false;

    while (breakLoop == false) {
      let newArr = occupiedDays.filter((item: any) => {
        return item.date === currentDateDbFormat;
      });
      if (newArr.length > 0) {
        newArr.forEach((item: any) => {
          if (item.status == "occupied") {
            breakLoop = true;
          }
        });
        availableDaysValue++;
        currentDateDbFormat = adicionarUmDia(currentDateDbFormat);
      } else {
        if (availableDaysValue > 15) {
          breakLoop = true;
        }
        availableDaysValue++;
        currentDateDbFormat = adicionarUmDia(currentDateDbFormat);
      }
    }
    setAvailableDays(availableDaysValue);
  };

  function addOneDay(dateString: any) {
    // Cria um objeto Date a partir da string fornecida
    const date = new Date(dateString);

    // Adiciona um dia (86400000 milissegundos) à data
    date.setTime(date.getTime() + 86400000);

    // Converte a data de volta para o formato string original
    return date.toString();
  }

  const getUntilDate = () => {
    if (avaliableDaysProp > 1) {
      let untilTheDate = date;
      for (let i = 1; i < avaliableDaysProp; i++) {
        untilTheDate = addOneDay(untilTheDate);
      }
      return untilTheDate;
    }
  };

  const setTemporaryValuesInLocalStorage = () => {
    const temporaryData = {
      fullNameClient: fullNameClient,
      phoneNumberFormated: phoneNumberFormated,
      cpfClient: cpfClient,
      numberOfBusyDays: numberOfBusyDays,
      entryTime: entryTime,
      departureTime: departureTime,
      initialValue: initialValue,
      additionalServices: additionalServices,
    };
    const temporaryDataString = JSON.stringify(temporaryData);
    localStorage.setItem("temporaryData" + id, temporaryDataString);
  };

  const resetStatesValues = () => {
    setFullNameClient(fullName);
    setCpfClient(cpf);
    setInitialValue(NaN);
    setEntryTime("");
    setDepartureTime("");
    setAdditionalServices([]);
    setNumberOfBusyDays(status == "occupied" ? avaliableDaysProp : "");
  };

  return (
    isMounted && (
      <>
        {dateObj && phoneNumberFormated && dateString ? (
          <div className={styles.container} onClick={handleOpenModal}>
            <div
              style={{
                backgroundColor:
                  status === "occupied" ? "green" : "rgb(255, 128, 0)",
              }}
              className={styles.firstBox}
            >
              <p className={styles.dayText}>{dateObj.day}</p>
              <p className={styles.monthText}>{dateObj.month}</p>
            </div>
            <div className={styles.lastBox}>
              <p className={styles.fullNameText}>{fullName}</p>
              <p className={styles.phoneNumberText}>{phoneNumberFormated}</p>
              <p className={styles.fullDateText}>{dateString}</p>
            </div>
          </div>
        ) : null}
        {showModal && (
          <div className={styles.modalBackground}>
            <div
              className={styles.modalBox}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.closeModalBox}>
                <div className={styles.titleBox}>
                  <p>{dateToLongString(date)}</p>
                  {status == "occupied" && (
                    <p style={{ color: "green", marginTop: "5px" }}>
                      [ RESERVADO ]
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "15px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <IoIosCloseCircle
                      className={styles.closeIcon}
                      onClick={handleCloseModal}
                      size={30}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: status == "occupied" ? "90px" : "55px",
                  paddingTop: status == "occupied" ? "10px" : "10px",
                }}
                className={styles.modalContentBox}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="Nome completo:"
                    value={fullNameClient}
                    onChange={(e) => setFullNameClient(e.target.value)}
                    type="text"
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <PatternFormat
                    required
                    format="+55 (##) #####-####"
                    label={"Telefone:"}
                    mask="_"
                    onChange={(e) => onChangePhoneNumberInput(e.target.value)}
                    value={phoneNumber}
                    customInput={TextField}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <PatternFormat
                    required
                    format={"###.###.###-##"}
                    mask="_"
                    label={"Cpf:"}
                    onChange={(e) => onChangeCpfInput(e.target.value)}
                    value={cpfClient}
                    customInput={TextField}
                    className={styles["input-phone"]}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={styles.dateField}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={customPtBrLocale}
                    >
                      {avaliableDaysProp > 1 ? (
                        <div className={styles.datePickersFormBox}>
                          <DatePicker
                            disabled
                            value={date}
                            label="Data de Entrada:"
                          />
                          <DatePicker
                            disabled
                            // value={new Date("Wed May 22 2024 00:00:00 GMT-0300 (Horário Padrão de Brasília)")}
                            value={new Date(getUntilDate())}
                            label="Data de Saída:"
                          />
                        </div>
                      ) : (
                        <DatePicker disabled value={date} label="Data:" />
                      )}
                    </LocalizationProvider>
                    {status === "waiting" && (
                      <Image
                        onClick={() => {
                          setCurrentChangeDateValue(null);
                          setShowDateModal(true);
                        }}
                        style={{
                          height: "45px",
                          width: "45px",
                          cursor: "pointer",
                          transition: "transform 0.2s ease-in-out", // Adicionando transição suave
                        }}
                        src={changeDateIcon}
                        alt="change-date-icon"
                        onMouseEnter={(e: any) => {
                          e.target.style.transform = "scale(1.1)"; // Escala aumentada no hover
                        }}
                        onMouseLeave={(e: any) => {
                          e.target.style.transform = "scale(1)"; // Escala normal ao sair do hover
                        }}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <InputLabel id="demo-simple-select-label">
                    Dias ocupados:
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={numberOfBusyDays}
                    onChange={(e) => setNumberOfBusyDays(e.target.value)}
                    disabled={
                      availableDays == undefined || status == "occupied"
                    }
                  >
                    {avaliableDaysProp > 1 || status == "occupied" ? (
                      <MenuItem value={avaliableDaysProp}>
                        {avaliableDaysProp}
                      </MenuItem>
                    ) : (
                      Array.from(
                        { length: availableDays },
                        (_, index) => index + 1
                      ).map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "15px" }}
                >
                  <PatternFormat
                    required
                    format={"##:##"}
                    label={"Início:"}
                    sx={{ width: "100px" }}
                    customInput={TextField}
                    placeholder="00:00"
                    onChange={(e) => onChangeEntryTimeValue(e.target.value)}
                    value={entryTime}
                  />
                  <PatternFormat
                    required
                    format={"##:##"}
                    label={"Saída:"}
                    sx={{ width: "100px" }}
                    customInput={TextField}
                    placeholder="00:00"
                    onChange={(e) => onChangeDepartureTimeValue(e.target.value)}
                    value={departureTime}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <InputLabel id="demo-simple-select-label">
                    Valor mínimo: *
                  </InputLabel>

                  <NumericFormat
                    required
                    customInput={TextField}
                    thousandSeparator={true}
                    prefix={"R$"}
                    decimalScale={2}
                    placeholder="R$"
                    onChange={(e) => onChangeInitialValue(e.target.value)}
                    value={initialValue}
                    fixedDecimalScale
                    sx={{ width: "200px" }}
                  />
                </div>
                {additionalServices.length > 0 &&
                  // Se sim, mapeia o array para renderizar um componente para cada item
                  additionalServices.map((service: any, index: any) => (
                    <div key={index}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <InputLabel
                          sx={{ color: "#161616", fontWeight: 600 }}
                          id={`demo-simple-select-label-${index}`}
                        >
                          #{1 + index} Serviço: {service.serviceName}
                        </InputLabel>

                        <InputLabel
                          id={`demo-simple-select-label-value-${index}`}
                        >
                          Valor: *
                        </InputLabel>
                        <NumericFormat
                          required
                          customInput={TextField}
                          thousandSeparator={true}
                          prefix={"R$"}
                          decimalScale={2}
                          placeholder="R$"
                          onChange={(e) =>
                            handleChangeServiceValue(index, e.target.value)
                          }
                          value={service.value}
                          fixedDecimalScale
                          sx={{ width: "200px" }}
                        />
                      </div>
                    </div>
                  ))}

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    onClick={() => setShowNewServiceModal(true)}
                    className={styles.additionalValueButton}
                  >
                    <p className={styles.addServiceText}> novo serviço</p>

                    <VscDiffAdded
                      className={styles.addedServiceIcon}
                      size={30}
                    />
                  </div>
                </div>
                <div className={styles.buttonsSubmitBox}>
                  <div className={styles.downloadButtonsBox}>
                    <Button
                      disabled={
                        fullNameClient.length < 5 ||
                        phoneNumberFormated.length < 13 ||
                        cpfClient.length < 11 ||
                        entryTime == "" ||
                        departureTime == "" ||
                        numberOfBusyDays == "" ||
                        // parseInt(entryTime, 10) < 1000 ||
                        // parseInt(departureTime, 10) < 1000 ||
                        isNaN(initialValue) ||
                        initialValue == undefined ||
                        // (additionalServices.length > 0 &&
                        //   additionalServices.every(
                        //     (service: any) =>
                        //       isNaN(service.value) ||
                        //       service.value == undefined ||
                        //       service.value == ""
                        //   ))
                        (additionalServices.length > 0 &&
                          additionalServices.some(
                            (service: any) =>
                              isNaN(service.value) ||
                              service.value === undefined ||
                              service.value === ""
                          ))
                      }
                    >
                      <ContractGenerator
                        data={getDateToContractPdf()}
                        childComponent={
                          <Button
                            onClick={setTemporaryValuesInLocalStorage}
                            variant="contained"
                            className={styles.downloadButton}
                            style={{
                              backgroundColor:
                                fullNameClient.length < 5 ||
                                phoneNumberFormated.length < 13 ||
                                cpfClient.length < 11 ||
                                entryTime == "" ||
                                departureTime == "" ||
                                entryTime.length < 4 ||
                                departureTime.length < 4 ||
                                numberOfBusyDays == "" ||
                                isNaN(initialValue) ||
                                initialValue == undefined ||
                                (additionalServices.length > 0 &&
                                  additionalServices.some(
                                    (service: any) =>
                                      isNaN(service.value) ||
                                      service.value === undefined ||
                                      service.value === ""
                                  ))
                                  ? "#ad7f7f"
                                  : "#d32f2f",
                            }}
                          >
                            <p className={styles.textDownloadButton}>PDF</p>
                            <FaDownload
                              className={styles.downloadIcon}
                              size={30}
                            />
                          </Button>
                        }
                      />
                    </Button>

                    {/* <Button variant="contained" className={styles.sendButton}>
                      <p className={styles.textSendButton}>ENVIAR</p>
                      <IoMdSend className={styles.sendIcon} size={30} />
                    </Button> */}
                  </div>
                  <div className={styles.reserveButtonBox}>
                    {status == "occupied" ? (
                      <Button
                        className={styles.cancelReservedButton}
                        variant="contained"
                        onClick={() => setShowSubModal(true)}
                      >
                        CANCELAR RESERVA
                      </Button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => setShowSubModal(true)}
                          className={styles.reserveButton}
                          disabled={
                            dateIsOccupied == true || numberOfBusyDays == ""
                          }
                          style={{
                            backgroundColor:
                              dateIsOccupied == true || numberOfBusyDays == ""
                                ? "#8aa28a"
                                : "green",
                            width: "150px",
                          }}
                        >
                          RESERVAR
                          <IoCheckmarkDone
                            style={{ marginLeft: "2px" }}
                            className={styles.sendIcon}
                            size={30}
                          />
                        </Button>
                        {dateIsOccupied == true && (
                          <p style={{ color: "red", marginTop: "10px" }}>
                            Já existe uma reserva para esse dia!
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="outlined"
                      className={styles.buttonViewAlll}
                      onClick={resetStatesValues}
                      disabled={status == "occupied"}
                      style={{
                        display: status == "occupied" ? "none" : "flex",
                      }}
                    >
                      REDEFINIR
                    </Button>
                  </div>
                </div>
              </div>
              {showSubModal && (
                <div
                  onClick={() => setShowSubModal(false)}
                  className={styles.subModalBackground}
                >
                  <div className={styles.subModalContent}>
                    <div className={styles.textBox}>
                      <p className={styles.textConfirmSubModal}>
                        {status == "occupied"
                          ? "Deseja cancelar essa reserva?"
                          : "Deseja reservar esse pedido?"}
                      </p>
                    </div>
                    <div className={styles.buttonsBox}>
                      <Button
                        variant="contained"
                        className={styles.cancelButtonSubModal}
                        onClick={handleCloseSubModal}
                      >
                        CANCELAR
                      </Button>
                      <Button
                        variant="contained"
                        className={styles.confirmButtonSubModal}
                        onClick={toggleStatusCurrentScheduling}
                        style={{
                          backgroundColor: status == "occupied" ? "red" : "",
                        }}
                      >
                        CONFIRMAR
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {showNewServiceModal && (
                <div className={styles.newServiceBackgroundModal}>
                  <div className={styles.newServiceContentModal}>
                    <p className={styles.titleNewServiceModal}>Novo serviço:</p>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <TextField
                        label="Nome:"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        type="text"
                        required
                        inputProps={{
                          maxLength: 60,
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <NumericFormat
                        required
                        customInput={TextField}
                        thousandSeparator={true}
                        prefix={"R$"}
                        decimalScale={2}
                        placeholder="R$"
                        onChange={(e) =>
                          onChangeAdditionalValue(e.target.value)
                        }
                        value={newServiceValue}
                        fixedDecimalScale
                      />
                    </div>
                    <div className={styles.buttonsBox}>
                      <Button
                        variant="outlined"
                        className={styles.cancelButtonServiceModal}
                        onClick={() => {
                          setNewServiceName("");
                          setNewServiceValue("");
                          setShowNewServiceModal(false);
                        }}
                      >
                        CANCELAR
                      </Button>
                      <Button
                        variant="contained"
                        className={styles.confirmButtonServiceModal}
                        onClick={() => {
                          handleAddedAdditionalServiceButton();
                        }}
                        style={{
                          backgroundColor:
                            newServiceName == "" || newServiceValue == ""
                              ? "#8aa28a"
                              : "green",
                        }}
                        disabled={newServiceName == "" || newServiceValue == ""}
                      >
                        ADICIONAR
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {showDateModal && (
                <div className={styles.dateModalBackground}>
                  <div className={styles.dateModalContent}>
                    <p className={styles.titleDateModal}>Alterar data:</p>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={customPtBrLocale}
                    >
                      <DatePicker
                        // disabled
                        minDate={new Date()}
                        maxDate={nextYear}
                        slots={{
                          day: customCalendarDay,
                        }}
                        disableOpenPicker={false}
                        onChange={(e) => {
                          handleChangeDayOfChangeDate(e);
                        }}
                      />
                    </LocalizationProvider>
                    <div className={styles.buttonsBox}>
                      <Button
                        variant="outlined"
                        className={styles.cancelButtonDateModal}
                        onClick={() => {
                          setShowDateModal(false);
                        }}
                      >
                        CANCELAR
                      </Button>

                      <Button
                        disabled={
                          !verificarFormatoString(currentChangeDateValue)
                            ? true
                            : false
                        }
                        sx={{
                          backgroundColor: currentChangeDateValue
                            ? "#007FFF"
                            : "#90b4fc !important",
                        }}
                        variant="contained"
                        className={styles.confirmButtonDateModal}
                        onClick={() => {
                          handleChangeDateButton();
                        }}
                      >
                        ALTERAR
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  );
};
