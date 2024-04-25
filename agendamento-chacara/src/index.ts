import "express-async-errors";
import epxress from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error";

AppDataSource.initialize()
  .then(() => {
    const app = epxress();

    app.use(epxress.json());

    app.use(userRoutes);

    // Middleware error
    app.use(errorMiddleware);
    return app.listen(process.env.APP_PORT, () => {
      console.log(`App running in port ${process.env.APP_PORT}...`);
    });
  })
  .catch((err) => {
    console.log(`Fixed error when connecting to the bank: ${err}`);
  });
