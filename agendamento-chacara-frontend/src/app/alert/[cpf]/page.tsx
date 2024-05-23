"use client";
import { Header } from "@/components/Header/Header";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import Lottie from "lottie-react";
import talkAnimation from "../../../../public/talk-animation.json";
import whatsappAnimation from "../../../../public/whatsapp-animation.json";
import whatsappTwoAnimation from "../../../../public/whatsapptwo-animation.json";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";
import loadingAnimation from "../../../../public/loading-animation.json";
import { isBefore, parse, startOfDay } from "date-fns";

const AlertPage = () => {
  const params = useParams<{ cpf: string }>();
  const router = useRouter();
  const schedulingService = new SchedulingService();
  const [isLogged, setIsLogged] = useState(false);

  const schedulingExists = async () => {
    const filteredCpf = params.cpf.replace(/\D/g, "");
    try {
      const schedulingByCpf: any = await schedulingService.getByCpf(
        filteredCpf
      );
      setIsLogged(true);
      const { clientName, cpf, date, phoneNumber } = schedulingByCpf[0];
      window.open(
        `https://api.whatsapp.com/send?phone=5583993190450&text=*Ch%C3%A1cara%20do%20Dand%C3%A3o*%0A*Data:*%20${date.replace(
          /-/g,
          "/"
        )}%0A*Nome:*%20${clientName}%0A*Cpf:*%20${cpf}%0A*Telefone:*%20${phoneNumber}`
      );
    } catch (error) {
      router.push("/reservation");
    }
  };

  useEffect(() => {
    schedulingExists();
    // deleteOldScheduling();
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
            target="_blank"
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
