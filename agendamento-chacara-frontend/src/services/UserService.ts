import { User } from "@/app/models/User";
import CryptoJS from "crypto-js";
import { UserRepository } from "@/repositories/UserRespository";
import axios from "axios";
import { setCookie } from "cookies-next";


export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createUser(user: User) {
    const { cpf, fullName, password, phoneNumber } = user;
    const userExists = await this.userRepository.getAllUsers();
    console.log(userExists);

    if (userExists.length > 0) {
      throw new Error("User already exists");
    }

    const hashPassword = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY as string
    ).toString();

    const newUser = {
      cpf,
      fullName,
      password: hashPassword,
      phoneNumber,
    };

    this.userRepository.createUser(newUser);
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

    const verifyPassword = CryptoJS.AES.decrypt(
      userExists.password,
      process.env.SECRET_KEY as string
    ).toString(CryptoJS.enc.Utf8);

    if (password != verifyPassword) {
      throw new Error("Unauthenticated user");
    }

    const token = (await axios.post("/api/auth", { id: userExists.id })).data
      .token;
    const expirationTime = new Date();
    expirationTime.setTime(expirationTime.getTime() + 24 * 60 * 60 * 1000);
    // Seto o token para o cookie, e quando eu precisar do id do user que está logado, posso pegar no payload do token por exemplo
    setCookie("token", token, {
      expires: expirationTime,
      secure: true,
      sameSite: "lax",
    });
  }

  public async getProfile(token: string) {
    try {
      const response = await fetch("http://localhost:3000/api/getprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      const userExists = await response.json();
      return userExists;
    } catch (error) {
      throw new Error("User unauthenticated");
    }
  }

}
