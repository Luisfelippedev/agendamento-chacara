"use client";
import { Button, TextField } from "@mui/material";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { PatternFormat } from "react-number-format";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loadingAnimation from "../../../public/loading-animation.json";
import { NavBar } from "@/components/NavBar/NavBar";

const Login = () => {
  const router = useRouter();
  const [cpfValue, setCpfValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isInvalidLogin, setIsInvalidLogin] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const userService = new UserService();

  const handleClickButtonSubmit = async () => {
    let isLogin = false;

    const filteredCpf = cpfValue.replace(/\D/g, "");
    try {
      await userService.login(filteredCpf, passwordValue);
      isLogin = true;
      if (isLogin) {
        router.push("/dashboard");
      }
    } catch (error) {
      setCpfValue("");
      setPasswordValue("");
      setIsInvalidLogin(true);
    }
  };

  const userIsLogged = async () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        await userService.getProfile(token);
        router.push("/dashboard");
      } catch (error) {
        setIsLogged(true);
      }
    } else {
      setIsLogged(true);
    }
  };

  useEffect(() => {
    userIsLogged();
  });

  if (!isLogged) {
    return (
      <div className={styles.backgroundLoading}>
        <Lottie
          className={styles.loadingAnimation}
          animationData={loadingAnimation}
          loop={true}
        />
      </div>
    ); // Não renderiza nada enquanto a verificação não estiver concluída
  }
  return (
    <div className={styles.background}>
      <NavBar />
      <div className={styles.centerBox}>
        <div className={styles.formContainer}>
          <p className={styles.titleForm}>Faça login:</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <PatternFormat
              format={"###.###.###-##"}
              mask="_"
              label={"Cpf:"}
              onChange={(e) => setCpfValue(e.target.value)}
              value={cpfValue}
              customInput={TextField}
              className={styles["input-phone"]}
            />
          </div>
          <TextField
            label="Senha:"
            value={passwordValue}
            onChange={(e) => {
              setPasswordValue(e.target.value);
            }}
            type="password"
            required
          />
          <Button
            onClick={handleClickButtonSubmit}
            className={styles.submitButton}
            variant="contained"
          >
            FAZER LOGIN
          </Button>
          {isInvalidLogin && (
            <p className={styles.invalidLoginText}>Credenciais inválidas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
