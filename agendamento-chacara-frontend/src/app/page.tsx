import { HomePage } from "@/pages/Home/Home";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <HomePage />
      </main>
    </>
  );
}
