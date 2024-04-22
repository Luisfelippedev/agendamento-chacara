import { Request, Response } from "express";
import { GetUserService } from "../../services/userServices/GetUserService";

export class GetUserController {
  private getUserService: GetUserService;

  constructor() {
    this.getUserService = new GetUserService();
    
  }

  public getByCpf = async(req: Request, res: Response) => {
    const cpf  = req.params.cpf;
    console.log(cpf);
    const user = await this.getUserService.findUserByCpf(cpf);
    console.log(user);
    res.status(200).json(user);
  };

  
}
