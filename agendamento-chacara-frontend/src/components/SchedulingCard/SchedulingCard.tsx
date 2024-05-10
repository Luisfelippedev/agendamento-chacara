import styles from "./styles.module.scss";

export const SchedulingCard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.firstBox}>
        <p className={styles.dayText}>10</p>
        <p className={styles.monthText}>Janeiro</p>
      </div>
      <div className={styles.lastBox}>
        <p className={styles.fullNameText}>Luis Felippe Marques de Oliveira</p>
        <p className={styles.phoneNumberText}>(83) 99400-8849</p>
        <p className={styles.fullDateText}>05/05/2024</p>
      </div>
    </div>
  );
};
