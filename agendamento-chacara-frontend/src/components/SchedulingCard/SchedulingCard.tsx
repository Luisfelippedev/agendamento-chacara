import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import { IoIosCloseCircle } from "react-icons/io";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PatternFormat } from "react-number-format";
import "dayjs/locale/pt-br";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { FaDownload } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

export interface SchedulingCardProps {
  date: any;
  fullName: any;
  phoneNumber: any;
  status: any;
  cpf: any;
  id: any;
}

export const SchedulingCard = ({
  date,
  fullName,
  phoneNumber,
  status,
  cpf,
  id,
}: SchedulingCardProps) => {
  const [dateObj, setDateObj] = useState(dateToObj(date));
  const [phoneNumberFormated, setPhoneNumberFormated] = useState(
    formatPhoneNumber(phoneNumber)
  );
  const [dateClient, setDateClient] = useState(date);
  const [entryTime, setEntryTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [dateString, setDateString] = useState(dateToString(date));
  const [showModal, setShowModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fullNameClient, setFullNameClient] = useState(fullName);
  const [cpfClient, setCpfClient] = useState(cpf);
  const [numberOfBusyDays, setNumberOfBusyDays]: any = useState(1);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenSubModal = () => {
    setShowSubModal(true);
  };

  const handleCloseSubModal = () => {
    setShowSubModal(false);
  };

  const handleClickConfirmScheduling = () => {
    handleCloseSubModal();
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

  function formatPhoneNumber(phone: any) {
    const cleaned = ("" + phone).replace(/\D/g, "");
    const match = cleaned.match(/^(0?(\d{2})(\d{5})(\d{4}))$/);
    if (match) {
      return `(${match[2]}) ${match[3]}-${match[4]}`;
    }
    return null;
  }

  function dateToString(date: any) {
    const data = dayjs(date).locale("pt-br"); // Parse da string de data e configuração do local
    const formattedDate = data.format("DD-MM-YYYY"); // Formato desejado
    return formattedDate;
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
                    label="Nome:"
                    value={fullNameClient}
                    onChange={(e) => setFullNameClient(e.target.value)}
                    type="text"
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <PatternFormat
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
                  <p className={styles.dateText}>
                    Data: {dateClientToString(date)}
                  </p>
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
                <div className={styles.buttonsSubmitBox}>
                  <div className={styles.downloadButtonsBox}>
                    <button className={styles.downloadButton}>
                      <p className={styles.textDownloadButton}>PDF</p>
                      <FaDownload className={styles.downloadIcon} size={30} />
                    </button>
                    <button className={styles.sendButton}>
                      <p className={styles.textSendButton}>ENVIAR</p>
                      <IoMdSend className={styles.sendIcon} size={30} />
                    </button>
                  </div>
                  <div className={styles.reserveButtonBox}>
                    <button
                      onClick={() => setShowSubModal(true)}
                      className={styles.reserveButton}
                    >
                      RESERVAR
                      <IoCheckmarkDone
                        style={{ marginLeft: "2px" }}
                        className={styles.sendIcon}
                        size={30}
                      />
                    </button>
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
                        DESEJA RESERVAR ESSE PEDIDO?
                      </p>
                      <p className={styles.subTextConfirmSubModal}>
                        Todos os demais pedidos para o mesmo dia serão
                        excluídos.
                      </p>
                    </div>
                    <div className={styles.buttonsBox}>
                      <button
                        className={styles.cancelButtonSubModal}
                        onClick={handleCloseSubModal}
                      >
                        CANCELAR
                      </button>
                      <button
                        className={styles.confirmButtonSubModal}
                        onClick={handleClickConfirmScheduling}
                      >
                        CONFIRMAR
                      </button>
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
