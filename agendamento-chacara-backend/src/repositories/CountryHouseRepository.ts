import { AppDataSource } from "../data-source";
import { Address, CountryHouse } from "../entities/CountryHouse";
import { User } from "../entities/User";

const countryHouseRepository = AppDataSource.getRepository(CountryHouse);
const userRepository = AppDataSource.getRepository(User);


export class CountryHouseRepository {
  private countryHouseRepository = countryHouseRepository;
  private userRepository = userRepository;

  constructor() {}

  public async createCountryHouse(
    name: string,
    address: Address,
    owner: User
  ) {
    const newCountryHouse = this.countryHouseRepository.create({
      name,
      address,
      owner,
    });
    await this.countryHouseRepository.save(newCountryHouse);

    owner.countryHouse = newCountryHouse;
    await this.userRepository.save(owner);

    return newCountryHouse;
  }

  public async findById(id: string) {
    const countryHouse = await this.countryHouseRepository.findOneBy({
      id: id,
    });
    return countryHouse;
  }


}
