"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";
import styles from "./styles.module.scss";
import Image from "next/image";
import logo from "../../../public/tridev-logo-black.png";
import { HiMiniUserCircle } from "react-icons/hi2";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";

const DashboardPage = () => {
  const router = useRouter();
  const userService = new UserService();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeModal = () => {
    setAnchorEl(null);
  };

  const userIsLogged = async () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      try {
        await userService.getProfile(token);
      } catch (error) {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    userIsLogged();
  });

  return (
    <div className={styles.background}>
      <div className={styles.header}>
        <Image className={styles.logoImage} src={logo} alt="tridev-logo" />

        <div className={styles.lastBox}>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 3 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar className={styles.userAvatar}>L</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={closeModal}
            onClick={closeModal}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <p style={{ textAlign: "center", padding: "6% 0 8% 0" }}>
              Luis Felippe
            </p>
            <Divider />
            <MenuItem onClick={closeModal}>
              <ListItemIcon>
                <MdOutlineSupportAgent className={styles.userIcon} size={30} />
              </ListItemIcon>
              Suporte
            </MenuItem>
            <MenuItem onClick={closeModal}>
              <ListItemIcon>
                <IoLogOut className={styles.userIcon} size={30} />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
