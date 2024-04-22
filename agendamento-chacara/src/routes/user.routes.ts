import { Router } from "express";
import { getUserController } from "../controllers/userControllers/getUserController";

const userRoutes = Router();

userRoutes.post("/getUserByCpf", new getUserController().getByCpf);

export default userRoutes;
