import { Address } from "../entities/CountryHouse";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { CountryHouseRepository } from "../repositories/CountryHouseRepository";
import { UserRepository } from "../repositories/UserRepository";

export class CountryHouseService {
  private countryHouseRepository: CountryHouseRepository;
  private userRepository: UserRepository;

  constructor() {
    this.countryHouseRepository = new CountryHouseRepository();
    this.userRepository = new UserRepository();
  }

  public async create(
    name: string,
    address: Address,
    userId: string
  ) {
    const user = await this.userRepository.findById(userId); // Está travando caso usuário nao exista
    const foreignKeyUser = await this.userRepository.findForeignKey(userId);

    if (!user) {
      throw new NotFoundError("User Not Found"); // Error middleware usage example
    }
    if (foreignKeyUser.countryHouse !== null) {
      throw new BadRequestError("The user already has a country house"); // Error middleware usage example
    }

    const newCountryHouse =
      await this.countryHouseRepository.createCountryHouse(
        name,
        address,
        user
      );
    const { password, ...ownerWithoutPassword } = newCountryHouse.owner;

    return {
      ...newCountryHouse,
      owner: ownerWithoutPassword,
    };
  }

  
}
