"use client";
import { NavBar } from "@/components/NavBar/NavBar";
import styles from "./styles.module.scss";
import { Button } from "@mui/material";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaBusinessTime } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { useState } from "react";
import { motion } from "framer-motion";
import { Map } from "@/components/Map/Map";
import { IoCloseCircle } from "react-icons/io5";
import { User } from "@/app/models/User";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const HomePage = () => {
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  // const handleClickButton = async () => {
  //   const userService = new UserService();
  //   userService.login("123456789", "123abc");
  // };

  return (
    <div className={styles.background}>
      <NavBar />
      <div className={styles.midContainer}>
        <p className={styles.titleText}>Chácara do Dandão</p>
        <p className={styles.subTitleText}>Reserva de ambiente privado</p>
        <Link href={"/reservation"}>
          <Button className={styles.button} variant="contained" href="#">
            RESERVAR
          </Button>
        </Link>
      </div>

      <div className={styles.footerContainer}>
        <div className={styles.infoBox}>
          <p className={styles.textFooter}>
            <FaBusinessTime className={styles.iconFooter} color="white" />
            Segunda - Domingo (6:00 até 22:00)
          </p>
          <p className={styles.textFooter}>
            <IoLogoWhatsapp className={styles.iconFooter} color="#25d366" />
            (83) 99400-8849
          </p>
        </div>
        <div className={styles.mapBox}>
          <FaMapLocationDot
            onClick={handleOpenModal}
            className={styles.iconMap}
            color="#FF5722"
          />
        </div>
      </div>

      {showModal && (
        <div className={styles.modalBackground} onClick={handleCloseModal}>
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
            <IoCloseCircle
              className={styles.closeIcon}
              onClick={handleCloseModal}
              size={30}
              color="red"
            />
            <Map />
          </motion.div>
        </div>
      )}
    </div>
  );
};
