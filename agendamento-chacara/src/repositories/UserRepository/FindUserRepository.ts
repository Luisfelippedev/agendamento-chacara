import { userRepository } from "./user.repository";

export class FindUserRepository {
  private repository = userRepository;
  constructor(){}

  async findUserByCpf(cpf: string): Promise<any> {
    const user = await this.repository.findOneBy({
      cpf: cpf,
    });
    return user;
  }
}
