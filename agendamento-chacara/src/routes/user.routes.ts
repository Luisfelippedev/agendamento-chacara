import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CountryHouseController } from "../controllers/CountryHouseController";

const userRoutes = Router();

userRoutes.get("/", (req, res) => {
  res.json({ message: "test" });
});

userRoutes.get("/getUserById/:id", new UserController().getById);

userRoutes.post("/create/user", new UserController().createUser);

userRoutes.post(
  "/create/countryHouse/:userId",
  new CountryHouseController().createCountryHouse
);

export default userRoutes;
