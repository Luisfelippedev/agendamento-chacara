import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CountryHouseController } from "../controllers/CountryHouseController";
import { LoginController } from "../controllers/LoginController";

const userRoutes = Router();

userRoutes.get("/", (req, res) => {
  res.json({ message: "test" });
});

userRoutes.post('/login', new LoginController().login)

userRoutes.get("/getUserById/:id", new UserController().getById);

userRoutes.post("/create/user", new UserController().createUser);

userRoutes.post(
  "/create/countryHouse/:userId",
  new CountryHouseController().createCountryHouse
);

export default userRoutes;
