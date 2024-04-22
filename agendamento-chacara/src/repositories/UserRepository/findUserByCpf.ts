import { User } from "../../entities/User";
import { userRepository } from "./user.repository";
import HttpStatusCode from "../../utils/enum/httpStatusCode";

export class findUserByCpf {
  private repository = userRepository;
  constructor(private cpf: string) {}

  async handle(): Promise<any> {
    const user = await this.repository.findOneBy({
      cpf: this.cpf,
    });

    if (!user) {
      const error = new Error("User not found in database");
      (error as any).status = HttpStatusCode.NOT_FOUND;
      throw error
    }

    return user;
  }
}
