"use client";
import { Header } from "@/components/Header/Header";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import Lottie from "lottie-react";
import talkAnimation from "../../../../public/talk-animation.json";
import whatsappAnimation from "../../../../public/whatsapp-animation.json";
import whatsappTwoAnimation from "../../../../public/whatsapptwo-animation.json";
import fireWorksAnimation from "../../../../public/fireworks.json";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";

const AlertPage = () => {
  const params = useParams<{ cpf: string }>();
  const router = useRouter();

  const schedulingExists = async () => {
    const schedulingService = new SchedulingService();
    const filteredCpf = params.cpf.replace(/\D/g, "");
    console.log(filteredCpf);
    try {
      await schedulingService.getByCpf(filteredCpf);
      const newTab = window.open(
        "https://wa.me/5583993190450?text=Ol%C3%A1,%20solicitei%20uma%20reserva%20para%20o%20dia%20xx/xx/xxxx",
        "_blank"
      );
      if (newTab) {
        newTab.focus(); // Focar na nova aba se ela foi aberta com sucesso
      }
    } catch (error) {
      router.push("/reservation");
    }
  };

  useEffect(() => {
    schedulingExists();

  });

  return (
    <div className={styles.background}>
      <Lottie
        animationData={fireWorksAnimation}
        loop={false}
        className={styles.lottieBg}
      />
      <Header page="alertPage" />
      <div className={styles.container}>
        <div className={styles.firstBox}>
          <p className={styles.title}>Quase lá...</p>
          <Lottie
            className={styles.talkAnimation}
            animationData={talkAnimation}
            loop={true}
          />
        </div>
        <div className={styles.lastBox}>
          <div className={styles.subTitle}>
            Você foi redirecionado para o
            <div className={styles.subTitleTwo}>
              whatsapp...
              <Lottie
                className={styles.whatsappAnimation}
                animationData={whatsappAnimation}
                loop={true}
              />
            </div>
          </div>
          <p className={styles.description}>
            Confirme sua reserva no whatsapp, é necessário para conversamos
            sobre contrato e informações adicionais.
          </p>
          <p className={styles.lastText}>
            Caso não tenha sido redirecionado para o whatsapp, utilize o botão
            abaixo!
          </p>
          <Button
            href="https://wa.me/5583993190450?text=Ol%C3%A1,%20solicitei%20uma%20reserva%20para%20o%20dia%20xx/xx/xxxx."
            className={styles.button}
            variant="outlined"
          >
            <Lottie
              style={{ height: 30 }}
              animationData={whatsappTwoAnimation}
              loop={true}
            />
            Whatsapp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertPage;
