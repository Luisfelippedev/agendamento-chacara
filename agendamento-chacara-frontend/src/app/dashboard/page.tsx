"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/UserService";

const Dashboard = () => {
  const router = useRouter();
  const userService = new UserService();

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
    <div>
      <p>dashboard</p>
    </div>
  );
};

export default Dashboard;
