import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Arrow function
  public getById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await this.userService.findById(id);
    res.status(200).json(user);
  };

  public createUser = async (req: Request, res: Response) => {
    const {cpf, name, password, phoneNumber} = req.body

    const user = await this.userService.create(cpf, name, password, phoneNumber)

    res.status(201).json(user)
  }

}
