import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const repository = AppDataSource.getRepository(User);

export class UserRepository {
  private userRepository = repository;
  constructor() {}

  public async findByCpf(cpf: string) {
    const user = await this.userRepository.findOneBy({
      cpf: cpf,
    });
    return user;
  }

  public async findById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  public async findForeignKey(userId: string) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ["countryHouse"],
    });
    return user;
  }

  public async create(
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
