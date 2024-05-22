import styles from "./styles.module.scss";
import Image from "next/image";
import tridevLogo from "../../../public/tridev-logo.png";
import chacaraLogo from "../../../public/chacara.png";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IProps {
  type: "tridev" | "chacara";
}

export const NavBar = ({ type }: IProps) => {
  const router = useRouter();

  const handleClickLoginButton = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {type == "tridev" ? (
        <div className={styles.logoBox}>
          <Image
            className={styles.tridevLogoIcon}
            src={tridevLogo}
            alt="tridev-logo"
          />
          <p className={styles.logoText}>Tridev Soluções</p>
        </div>
      ) : (
        <Link href={"/"}>
          <div className={styles.logoBox}>
            <Image
              className={styles.chacaraLogoIcon}
              src={chacaraLogo}
              alt="chacara-logo"
            />
            <p className={styles.logoText}>Chácara do Dandão</p>
          </div>
        </Link>
      )}

      <div className={styles.lastBox}>
        {type == "tridev" ? (
          <Button
            onClick={handleClickLoginButton}
            className={styles.loginButton}
            variant="outlined"
          >
            Login
          </Button>
        ) : null}
      </div>
    </div>
  );
};
