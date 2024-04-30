import { firestore } from "@/database/firestore";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { uuid } from "uuidv4";
import { User } from "@/app/models/User";
import CryptoJS from "crypto-js";
import { UserRepository } from "@/repositories/UserRespository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(user: User) {
    const id = uuid();
    const { cpf, fullName, password, phoneNumber } = user;

    const userExists = await this.userRepository.findByCpf(cpf);

    if (userExists) {
      throw new Error("User already exists");
    }
    const hashPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY as string
    ).toString();

    await setDoc(doc(firestore, "User", id), {
      id,
      fullName,
      cpf,
      password: hashPassword,
      phoneNumber,
    });
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    console.log(user);
  }

  public async login(cpf: string, password: string) {
    const userExists = await this.userRepository.findByCpf(cpf);

    if (!userExists) {
      throw new Error("User not found");
    }
    const { id } = userExists;
    return userExists
  }
}
