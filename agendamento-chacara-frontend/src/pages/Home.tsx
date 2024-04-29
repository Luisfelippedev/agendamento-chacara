import { NavBar } from "@/components/NavBar/NavBar";
import styles from "./styles.module.scss";

export const HomePage = () => {
  return (
    <div className={styles.background}>
      <NavBar />
    </div>
  );
};
