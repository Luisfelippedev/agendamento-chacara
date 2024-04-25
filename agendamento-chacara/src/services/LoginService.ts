import { UnauthorizedError } from "../helpers/api-errors";
import { UserRepository } from "../repositories/UserRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export class LoginService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(cpf: string, password: string) {
    const userExists = await this.userRepository.findUserByCpf(cpf);
    console.log(userExists);

    if (!userExists) {
      throw new UnauthorizedError("Unauthenticated user");
    }

    const verifyPassword = await bcrypt.compare(password, userExists.password);

    if (!verifyPassword) {
      throw new UnauthorizedError("Unauthenticated user");
    }

    const token = jwt.sign({ id: userExists.id }, process.env.JWT_PASS ?? "");

    const { password: _, ...user } = userExists;

    return { user, token: token };
  }
}
