import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export class UserRepository {
  private userRepository = userRepository;
  constructor() {}

  async findUserByCpf(cpf: string) {
    const user = await this.userRepository.findOneBy({
      cpf: cpf,
    });
    return user;
  }

  async findUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async findUserForeignKey(userId: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ["countryHouse"],
    });
    return user;
  }

  async createUser(
    cpf: string,
    name: string,
    password: string,
    phoneNumber: string
  ) {
    const newUser = this.userRepository.create({
      cpf,
      name,
      password,
      phoneNumber,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }
}
