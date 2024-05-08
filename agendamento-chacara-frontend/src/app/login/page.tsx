"use client";
import { Button, TextField } from "@mui/material";
import styles from "./styles.module.scss";
import { useState } from "react";
import { PatternFormat } from "react-number-format";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [cpfValue, setCpfValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isInvalidLogin, setIsInvalidLogin] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleClickButtonSubmit = async () => {
    let isLogin = false;
    const userService = new UserService();
    const filteredCpf = cpfValue.replace(/\D/g, "");
    try {
      await userService.login(filteredCpf, passwordValue);
      isLogin = true;
      //   setIsLoginLoading(true);
      if (isLogin) {
        router.push("/dashboard");
      }
    } catch (error) {
      setCpfValue("");
      setPasswordValue("");
      setIsInvalidLogin(true);
    }
  };

  return (
    <div className={styles.background}>
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
          type="text"
          required
        />
        <Button
          onClick={handleClickButtonSubmit}
          className={styles.submitButton}
          variant="contained"
          disabled={isLoginLoading}
        >
          FAZER LOGIN
        </Button>
        {isInvalidLogin && (
          <p className={styles.invalidLoginText}>Credenciais inválidas</p>
        )}
      </div>
    </div>
  );
};

export default Login;
