import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/tridev-logo.png";

export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logoBox}>
        <Image className={styles.logoImage} src={logo} alt="tridev-logo" />
        <p className={styles.logoText}>Tridev Soluções</p>
      </div>
    </div>
  );
};
