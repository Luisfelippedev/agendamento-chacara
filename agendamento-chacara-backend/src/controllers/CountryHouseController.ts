import { Request, Response } from "express";
import { CountryHouseService } from "../services/CountryHouseService";
import { Address } from "../entities/CountryHouse";

export class CountryHouseController {
  private countryHouseService: CountryHouseService;

  constructor() {
    this.countryHouseService = new CountryHouseService();
  }

  public getCountryHouseById() {}

  public createCountryHouse = async (req: Request, res: Response) => {
    const { name, city, street, number } = req.body;

    const userId = req.params.userId;

    const address: Address = { city, street, number };

    const newCountryHouse = await this.countryHouseService.create(
      name,
      address,
      userId
    );

    res.status(201).json(newCountryHouse);
  };
}
