import styles from "./page.module.scss";
import { HomePage } from "../pages/Home";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomePage />
    </main>
  );
}
