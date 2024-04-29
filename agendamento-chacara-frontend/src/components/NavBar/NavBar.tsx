import Image from "next/image";
import styles from "./styles.module.scss";
import logo from "../../../public/tridev-logo.png";

export const NavBar = () => {
  return (
    <div className={styles.container}>
      <Image className={styles.logoImage} src={logo} alt="tridev-logo" />
      <p className={styles.logoText}>Tridev Soluções</p>
    </div>
  );
};
