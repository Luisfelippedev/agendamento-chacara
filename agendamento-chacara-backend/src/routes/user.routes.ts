import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { LoginController } from "../controllers/LoginController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.get("/", (req, res) => {
  res.json({ message: "test" });
});

userRoutes.post("/login", new LoginController().login);

userRoutes.get("/getProfile", authMiddleware, new LoginController().getProfile);

userRoutes.get("/getUserById/:id", new UserController().getById);

userRoutes.post("/create/user", new UserController().createUser);


export default userRoutes;
