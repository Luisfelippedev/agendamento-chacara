"use client";
import { Header } from "@/components/Header/Header";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import Lottie from "lottie-react";
import talkAnimation from "../../../../public/talk-animation.json";
import whatsappAnimation from "../../../../public/whatsapp-animation.json";
import whatsappTwoAnimation from "../../../../public/whatsapptwo-animation.json";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { SchedulingService } from "@/services/SchedulingService";
import { isBefore, parse, startOfDay } from "date-fns";

const AlertPage = () => {
  const params = useParams<{ cpf: string }>();
  const router = useRouter();
  const schedulingService = new SchedulingService();

  const schedulingExists = async () => {
    const filteredCpf = params.cpf.replace(/\D/g, "");
    try {
      await schedulingService.getByCpf(filteredCpf);
      window.open(
        "https://wa.me/5583993190450?text=Ol%C3%A1,%20solicitei%20uma%20reserva%20para%20o%20dia%20xx/xx/xxxx",
        "_blank"
      );
    } catch (error) {
      router.push("/reservation");
    }
  };

  // function isPastDate(dataString: string) {
  //   const partes = dataString.split("-");
  //   const dia = parseInt(partes[0], 10);
  //   const mes = parseInt(partes[1], 10) - 1; // O mês em JavaScript começa em 0 (janeiro = 0)
  //   const ano = parseInt(partes[2], 10);
  //   const dataFornecida = new Date(ano, mes, dia);
  //   const dataAtual = new Date();

  //   return dataFornecida < dataAtual;
  // }

  // function isPastDate(dataString: string) {
  //   const dataFornecida = parse(dataString, 'dd-MM-yyyy', new Date());
  //   const dataAtual = startOfDay(new Date()); // Inicia a hora do dia atual em 00:00:00
    
  //   return isBefore(dataFornecida, dataAtual);
  // }

    // const deleteOldScheduling = async () => {
    //   const allScheduling = await schedulingService.getAll();
    //   allScheduling.forEach((scheduling) => {
    //     const isPast = isPastDate(scheduling.date);
    //     if(isPast){
    //       schedulingService.deleteById(scheduling.id)
    //     }
    //   });
    // };

  useEffect(() => {
    schedulingExists();
    // deleteOldScheduling();
  });

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
