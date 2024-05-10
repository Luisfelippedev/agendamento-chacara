import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";

export interface SchedulingCardProps {
  date: any;
  fullName: any;
  phoneNumber: any;
  status: any;
}

export const SchedulingCard = ({
  date,
  fullName,
  phoneNumber,
  status,
}: SchedulingCardProps) => {
  const [dateObj, setDateObj] = useState(dateToObj(date));
  const [phoneNumberFormated, setPhoneNumberFormated] = useState(
    formatPhoneNumber(phoneNumber)
  );
  const [dateString, setDateString] = useState(dateToString(date));

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
 
  useEffect(() => {
    console.log(dateObj);
  }, []);

  return (
    <>
      {dateObj && phoneNumberFormated && dateString ? (
        <div className={styles.container}>
          <div className={styles.firstBox}>
            <p className={styles.dayText}>{dateObj.day}</p>
            <p className={styles.monthText}>{dateObj.month}</p>
          </div>
          <div className={styles.lastBox}>
            <p className={styles.fullNameText}>{fullName}</p>
            <p className={styles.phoneNumberText}>{phoneNumberFormated}</p>
            <p className={styles.fullDateText}>{dateString}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
