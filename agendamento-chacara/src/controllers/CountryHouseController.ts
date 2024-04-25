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
    const { name, status, city, street, number } = req.body;

    const userId = req.params.userId;

    const address: Address = { city, street, number };

    const newCountryHouse = await this.countryHouseService.createCountryHouse(
      name,
      status,
      address,
      userId
    );

    res.status(201).json(newCountryHouse);
  };
}
