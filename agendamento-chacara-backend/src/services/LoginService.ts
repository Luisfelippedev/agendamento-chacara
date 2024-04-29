import { UnauthorizedError } from "../helpers/api-errors";
import { UserRepository } from "../repositories/UserRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

type IPayLoad = {
  id: string;
};

export class LoginService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(cpf: string, password: string) {
    const userExists = await this.userRepository.findByCpf(cpf);

    if (!userExists) {
      throw new UnauthorizedError("Unauthenticated user");
    }

    const verifyPassword = await bcrypt.compare(password, userExists.password);

    if (!verifyPassword) {
      throw new UnauthorizedError("Unauthenticated user");
    }

    const token = jwt.sign({ id: userExists.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "8h",
    });

    const { password: _, ...user } = userExists;

    return { user, token: token };
  }

  public getProfile = async (authorization: string | undefined) => {
    if (!authorization) {
      throw new UnauthorizedError("Unauthenticated user");
    }

    const token = authorization.split(" ")[1];

    try {
      const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as IPayLoad;

      if (!id) {
          throw new UnauthorizedError("Unauthenticated user");
      }

      const userExists = await this.userRepository.findById(id);

      if (!userExists) {
          throw new UnauthorizedError("Unauthenticated user");
      }

      const { password, ...user } = userExists;

      return user;
  } catch (error) {
      throw new UnauthorizedError("Invalid token");
  }
  };
}
