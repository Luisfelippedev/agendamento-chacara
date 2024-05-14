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
import { GiPadlock } from "react-icons/gi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { SchedulingService } from "@/services/SchedulingService";
import { RiExchangeBoxFill } from "react-icons/ri";
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
}

export const SchedulingCard = ({
  date,
  fullName,
  phoneNumber,
  status,
  cpf,
  id,
  occupiedDays,
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
  const [phoneNumberFormated, setPhoneNumberFormated] = useState(
    formatPhoneNumber(phoneNumber)
  );
  const [dateClient, setDateClient] = useState(date);
  const [entryTime, setEntryTime] = useState("00:00");
  const [departureTime, setDepartureTime] = useState("00:00");
  const [dateString, setDateString] = useState(dateToString(date));
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fullNameClient, setFullNameClient] = useState(fullName);
  const [cpfClient, setCpfClient] = useState(cpf);
  const [numberOfBusyDays, setNumberOfBusyDays]: any = useState(1);
  const [initialValue, setInitialValue]: any = useState("");
  const [additionalServices, setAdditionalServices]: any = useState([]);
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceValue, setNewServiceValue]: any = useState("");
  const [showDateModal, setShowDateModal] = useState(false);

  const [currentChangeDateValue, setCurrentChangeDateValue]: any =
    useState(null);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
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
      console.log("confirm");
      window.location.reload();
    } catch (error) {
      return;
    }

    // handleCloseSubModal();
  };

  function dateClientToString(dateValue: any) {
    // Converte a string de data para um objeto Date
    const dateObj = new Date(dateValue);

    // Extrai o dia, mês e ano do objeto Date
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Mês é base 0 (janeiro = 0)
    const year = dateObj.getFullYear();

    // Retorna a data formatada como "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }

  const dateToLongString = (date: any) => {
    const formattedDate = format(date, "eeee, MMMM dd, yyyy", { locale: ptBR });
    return formattedDate;
  };

  useEffect(() => {
    console.log(numberOfBusyDays);
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeEntryTimeValue = (value: any) => {
    // Remove os dois pontos ":" da string
    const newValue = value.replace(/:/g, "");

    // Verifica se o valor inserido é menor ou igual a 1200 (12:00)
    if (parseInt(newValue, 10) <= 1200) {
      setEntryTime(newValue);
    } else {
      // Se for maior que 12:00, define o valor como 1200 (12:00)
      setEntryTime("1200");
    }
  };

  const onChangeDepartureTimeValue = (value: any) => {
    // Remove os dois pontos ":" da string
    const newValue = value.replace(/:/g, "");

    // Verifica se o valor inserido é menor ou igual a 1200 (12:00)
    if (parseInt(newValue, 10) <= 1200) {
      setDepartureTime(newValue);
    } else {
      // Se for maior que 12:00, define o valor como 1200 (12:00)
      setDepartureTime("1200");
    }
  };

  function dateToObj(date: any) {
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

    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const monthIndex = dateObj.getMonth();
    const month = monthsPtBr[monthIndex];
    const year = dateObj.getFullYear();

    const formattedDate = dateObj.toString();

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
    console.log(additionalServices);
    setAdditionalServices(additionalServiceArr);

    setNewServiceName("");
    setNewServiceValue("");
    setShowNewServiceModal(false);
  };

  // const handleChangeServiceName = (index: any, newName: any) => {
  //   // Cria uma cópia do array additionalServices para não modificar o estado diretamente
  //   const updatedServices = [...additionalServices];

  //   // Modifica o objeto específico dentro do array com o novo name
  //   updatedServices[index] = {
  //     ...updatedServices[index],
  //     serviceName: newName,
  //   };

  //   // Define o novo array como o estado additionalServices
  //   setAdditionalServices(updatedServices);
  // };

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

  useEffect(() => {
    console.log(additionalServices);
  }, [additionalServices]);

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
    console.log(formattedDate);
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
                </div>
                <IoIosCloseCircle
                  className={styles.closeIcon}
                  onClick={handleCloseModal}
                  size={30}
                />
              </div>
              <div className={styles.modalContentBox}>
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
                    onChange={(e) => setPhoneNumberFormated(e.target.value)}
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
                    onChange={(e) => setCpfClient(e.target.value)}
                    value={cpfClient}
                    customInput={TextField}
                    className={styles["input-phone"]}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className={styles.dateField}>
                    {/* Data: {dateClientToString(date)} */}
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={customPtBrLocale}
                    >
                      {/* <DatePicker
                        // disabled
                        value={date}
                        label="Basic date picker"
                        slots={{
                          day: customCalendarDay,
                        }}
                      /> */}
                      <DatePicker disabled value={date} label="Data:" />
                    </LocalizationProvider>
                    {/* <RiExchangeBoxFill
                      onClick={() => {
                        setCurrentChangeDateValue(null);
                        setShowDateModal(true);
                      }}
                      color="blue"
                      size={50}
                    /> */}
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
                      onMouseEnter={(e:any) => {
                        e.target.style.transform = "scale(1.1)"; // Escala aumentada no hover
                      }}
                      onMouseLeave={(e:any) => {
                        e.target.style.transform = "scale(1)"; // Escala normal ao sair do hover
                      }}
                    />
                  </div>
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
                  />
                  <PatternFormat
                    required
                    format={"##:##"}
                    label={"Saída:"}
                    sx={{ width: "100px" }}
                    customInput={TextField}
                    placeholder="00:00"
                    onChange={(e) => onChangeDepartureTimeValue(e.target.value)}
                  />
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
                  >
                    {Array.from({ length: 30 }, (_, index) => index + 1).map(
                      (value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      )
                    )}
                    {/* <MenuItem value={1}>1</MenuItem> */}
                  </Select>
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
                        {/* <TextField
                            value={service.serviceName}
                            onChange={(e) =>
                              handleChangeServiceName(index, e.target.value)
                            }
                            type="text"
                            required
                            sx={{ width: "200px" }}
                          /> */}

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
                    <ContractGenerator
                      data={getDateToContractPdf()}
                      childComponent={
                        <Button
                          variant="contained"
                          // onClick={handleClickDownloadPdfButton}
                          className={styles.downloadButton}
                        >
                          <p className={styles.textDownloadButton}>PDF</p>
                          <FaDownload
                            className={styles.downloadIcon}
                            size={30}
                          />
                        </Button>
                      }
                    />
                    <Button variant="contained" className={styles.sendButton}>
                      <p className={styles.textSendButton}>ENVIAR</p>
                      <IoMdSend className={styles.sendIcon} size={30} />
                    </Button>
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
                      <Button
                        variant="contained"
                        onClick={() => setShowSubModal(true)}
                        className={styles.reserveButton}
                      >
                        RESERVAR
                        <IoCheckmarkDone
                          style={{ marginLeft: "2px" }}
                          className={styles.sendIcon}
                          size={30}
                        />
                      </Button>
                    )}
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
                          maxLength: 30,
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
