import { Request, Response } from "express";
import { findUserByCpf } from "../../repositories/UserRepository/findUserByCpf";

export class getUserController {
  async getByCpf(req: Request, res: Response) {
    try {
      const { cpf } = req.body;
      const user = await new findUserByCpf(cpf).handle();

      // console.log(user);
      res.status(200).json(user);
    } catch (err: any) {
      res.status(err.status).json({ error: err.message });
    }
  }
}
