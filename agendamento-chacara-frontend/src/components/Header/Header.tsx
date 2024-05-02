import reservationPage from "@/app/reservation/page";
import styles from "./styles.module.scss";
import { IoMdCheckmark } from "react-icons/io";

interface Props {
  page: "reservationPage" | "formPage" | "confirmationPage";
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
            {page == "formPage" || page == "confirmationPage" ? (
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
          <div className={styles.disableBall}>4</div>
        </div>
      </div>
      <div className={styles.headerMobile}>
        <div className={styles.midContainer}>
          <p className={styles.textHeaderMobile}>Selecione um horário</p>
        </div>
      </div>
    </>
  );
};
