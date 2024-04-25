import { Request, Response } from "express";
import { LoginService } from "../services/LoginService";

export class LoginController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  public login = async (req: Request, res: Response) => {
    const { cpf, password } = req.body;

    const user = await this.loginService.login(cpf, password);
    console.log(user);

    res.status(200).json(user);
  };
}
