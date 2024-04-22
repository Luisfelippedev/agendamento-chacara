import epxress from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";

AppDataSource.initialize()
  .then(() => {
    const app = epxress();

    app.use(epxress.json());

    app.use(userRoutes);

    return app.listen(process.env.APP_PORT, () => {
      console.log(`Express rodando na porta ${process.env.APP_PORT}...`);
    });
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao se conectar com o banco: " + err);
  });
