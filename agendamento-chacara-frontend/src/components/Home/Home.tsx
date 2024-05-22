"use client";
import { NavBar } from "@/components/NavBar/NavBar";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaBusinessTime } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Map = dynamic<{ inline?: boolean }>(() =>
  import("../Map/Map").then((mod) => mod.Map)
);

export const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  try {
  } catch (error) {}

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClickContinueButton = async () => {
    router.push("/reservation");
  };

  return (
    <div className={styles.background}>
      <NavBar type="tridev"/>
      <div className={styles.midContainer}>
        <p className={styles.titleText}>Chácara do Dandão</p>
        <p className={styles.subTitleText}>Reserva de ambiente privado</p>
        <Button
          onClick={handleClickContinueButton}
          className={styles.button}
          variant="contained"
          href="#"
        >
          RESERVAR
        </Button>
      </div>

      <div className={styles.footerContainer}>
        <div className={styles.infoBox}>
          <p className={styles.textFooter}>
            <FaBusinessTime className={styles.iconFooter} color="white" />
            Segunda - Domingo
          </p>
          <p className={styles.textFooter}>
            <IoLogoWhatsapp className={styles.iconFooter} color="#25d366" />
            (83) 99192-1727
          </p>
        </div>
        <div className={styles.mapBox}>
          <FaMapLocationDot
            onClick={handleOpenModal}
            className={styles.iconMap}
            color="#FF5722"
          />
          <p className={styles.textLocalInfo}>Saída para Boa Vista</p>
          <p className={styles.textLocalInfo}>Sítio Saco, PB-366</p>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalBackground} onClick={handleCloseModal}>
          <IoCloseOutline
            className={styles.closeIcon}
            onClick={handleCloseModal}
            size={60}
          />
          <motion.div
            initial={{
              scale: 0,
              position: "absolute",
              right: 0,
              bottom: 0,
              transformOrigin: "bottom right",
            }} // Inicia menor e da direita para baixo
            animate={{
              scale: 1,
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }} // Anima para o tamanho original e ao centro
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            {isMounted && <Map />}
          </motion.div>
        </div>
      )}
    </div>
  );
};
