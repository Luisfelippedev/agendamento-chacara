import { AppDataSource } from "../data-source";
import { Address, CountryHouse } from "../entities/CountryHouse";
import { User } from "../entities/User";

const countryHouseRepository = AppDataSource.getRepository(CountryHouse);
const userRepository = AppDataSource.getRepository(User);

export class CountryHouseRepository {
  private countryHouseRepository = countryHouseRepository;
  private userRepository = userRepository;

  constructor() {}

  async createCountryHouse(
    name: string,
    status: string,
    address: Address,
    owner: User
  ) {
    const newCountryHouse = this.countryHouseRepository.create({
      name,
      status,
      address,
      owner,
    });
    await this.countryHouseRepository.save(newCountryHouse);

    owner.countryHouse = newCountryHouse;
    await this.userRepository.save(owner);

    return newCountryHouse;
  }
}
