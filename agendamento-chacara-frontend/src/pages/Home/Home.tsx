"use client";
import { NavBar } from "@/components/NavBar/NavBar";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { UserService } from "@/services/UserService";
import { User } from "@/app/models/User";

export const HomePage = () => {
  const handleButton = async () => {
    const userService = new UserService();
    const newUser: User = {
      fullName: "luis felippe",
      password: "123abc",
      cpf: "12345678",
      phoneNumber: "123456789",
    };
    try {
      const user = await userService.login(newUser.cpf, '');
      console.log(user);
    } catch (error) {
      console.log("error");
    }
    // const user = await userService.getUserById("02f465d7-5b56-414d-a7c4-1557345eb7f3");
  };

  return (
    <div className={styles.background}>
      <NavBar />
      <div className={styles.midContainer}>
        <p className={styles.titleText}>Chácara do Dandão</p>
        <p className={styles.subTitleText}>Reserva de ambiente privado</p>
        <Button
          onClick={handleButton}
          className={styles.button}
          variant="contained"
          href="#"
        >
          RESERVAR
        </Button>
      </div>
      <div className={styles.lastContainer}>
        <div className={styles.selectBox}>
          <div className={styles.itemSelect}>
            <p className={styles.itemSelectText}>Localização</p>
          </div>
          <div className={styles.itemSelect}>
            <p className={styles.itemSelectText}>Horários</p>
          </div>
          <div className={styles.itemSelect}>
            <p className={styles.itemSelectText}>Contato</p>
          </div>
        </div>
        <div className={styles.infoBox}></div>
      </div>
    </div>
  );
};
