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

    res.status(200).json(user);
  };
  // login controller method
  public getProfile (req: Request, res: Response){
    res.json(req.user);
  };
} 
