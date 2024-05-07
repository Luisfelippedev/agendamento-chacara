import { HomePage } from "@/components/Home/Home";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <HomePage />
    </main>
  );
}
