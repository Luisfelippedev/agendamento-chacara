import { Router } from "express";
import { GetUserController } from "../controllers/userControllers/GetUserController";

const userRoutes = Router();

userRoutes.get("/", (req, res) => {
  res.json({ message: "teste" });
});

userRoutes.get("/getUserByCpf/:cpf", new GetUserController().getByCpf)

export default userRoutes;
