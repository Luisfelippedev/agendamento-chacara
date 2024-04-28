import { Router } from "express";
import { CountryHouseController } from "../controllers/CountryHouseController";
import { DayOfScheduleController } from "../controllers/DayOfScheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SchedulingController } from "../controllers/SchedulingController";

const generalRoutes = Router();

// CountryHouse Routes
generalRoutes.post(
    "/create/countryHouse/:userId",
    authMiddleware,
    new CountryHouseController().createCountryHouse
  );

// DayOfSchedule Routes
generalRoutes.post("/create/dayOfSchedule/:countryHouseId", authMiddleware ,new DayOfScheduleController().create);

generalRoutes.patch("/update/status/free/:id", authMiddleware, new DayOfScheduleController().setFreeStatus)

generalRoutes.patch("/update/status/occupied/:id", authMiddleware, new DayOfScheduleController().setOccupiedStatus)

generalRoutes.get("/get/all/dayOfSchedule", new DayOfScheduleController().getAll)

generalRoutes.post("/create/scheduling/:dayOfScheduleId", new SchedulingController().create)

generalRoutes.delete("/delete/scheduling/:schedulingId",new SchedulingController().delete)

generalRoutes.get("/get/all/scheduling", new SchedulingController().getAll)

export default generalRoutes