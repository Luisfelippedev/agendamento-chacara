"use client";
import { HomePage } from "@/components/Home/Home";
import styles from "./page.module.scss";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <main className={styles.main}>
        <HomePage />
      </main>
    </ThemeProvider>
  );
}
