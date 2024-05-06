import reservationPage from "@/app/reservation/page";
import styles from "./styles.module.scss";
import { IoMdCheckmark } from "react-icons/io";

interface Props {
  page: "reservationPage" | "formPage" | "confirmationPage" | "alertPage";
}

export const Header = ({ page }: Props) => {
  return (
    <>
      <div className={styles.headerDesktop}>
        <div className={styles.centerBox}>
          <div className={styles.ball}>
            <IoMdCheckmark />
          </div>
          <div className={styles.line}></div>
          <div className={styles.ball}>
            {page == "reservationPage" ? "2" : ""}
            {page == "formPage" ||
            page == "confirmationPage" ||
            page == "alertPage" ? (
              <IoMdCheckmark />
            ) : (
              ""
            )}
          </div>
          <div className={styles.line}></div>
          <div
            className={
              page == "reservationPage" ? styles.disableBall : styles.ball
            }
          >
            {page == "reservationPage" || page == "formPage" ? (
              "3"
            ) : (
              <IoMdCheckmark />
            )}
          </div>
          <div className={styles.line}></div>

          <div
            className={page == "alertPage" ? styles.ball : styles.disableBall}
          >
            4
          </div>
        </div>
      </div>
      <div className={styles.headerMobile}>
        <div className={styles.midContainer}>
          <p
            style={page === "formPage" ? { marginLeft: 22 } : {}}
            className={styles.textHeaderMobile}
          >
            {page == "reservationPage" && "Selecione um horário:"}
            {page == "formPage" && "Preencha os dados:"}
            {page == "alertPage" && "Fale no whatsapp"}
          </p>
        </div>
      </div>
    </>
  );
};
