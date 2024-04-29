import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { UserRepository } from "../repositories/UserRepository";
import { removeNonNumerics } from "../utils/remove-non-numerics";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async findById(id: string) {
    const getUser = await this.userRepository.findById(id);
    if (!getUser) {
      throw new NotFoundError("User Not Found");
    }

    const { password, ...user } = getUser;

    user.phoneNumber = removeNonNumerics(user.phoneNumber);
    user.cpf = removeNonNumerics(user.cpf);

    return user;
  }

  public async create(
    cpf: string,
    name: string,
    password: string,
    phoneNumber: string
  ) {
    const userExists = await this.userRepository.findByCpf(cpf);
    if (userExists) {
      throw new BadRequestError("User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.create(
      cpf,
      name,
      hashPassword,
      phoneNumber
    );

    const { password: _, ...user } = newUser;

    user.phoneNumber = removeNonNumerics(user.phoneNumber);
    user.cpf = removeNonNumerics(user.cpf);

    return user;
  }


}
