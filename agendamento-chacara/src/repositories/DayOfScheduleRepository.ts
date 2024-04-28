import { AppDataSource } from "../data-source";
import { CountryHouse } from "../entities/CountryHouse";
import { DayOfSchedule } from "../entities/DayOfSchedule";

const repository = AppDataSource.getRepository(DayOfSchedule);

import { Status } from "../entities/DayOfSchedule";

export class DayOfScheduleRepository {
  private dayOfScheduleRepository = repository;
  constructor() {}

  public async create(
    startTime: string,
    endTime: string,
    countryHouse: CountryHouse,
    date: string
  ) {
    const newDaySchedule = this.dayOfScheduleRepository.create({
      startTime,
      endTime,
      date,
      status: Status.Free,
      countryHouse,
    });

    await this.dayOfScheduleRepository.save(newDaySchedule);

    return newDaySchedule;
  }

  public async findById(id: string) {
    const dayOfSchedule = await this.dayOfScheduleRepository.findOneBy({
      id: id,
    });
    return dayOfSchedule;
  }

  public async findByDate(date: string) {
    const dayOfSchedule = await this.dayOfScheduleRepository.findOneBy({
      date: date,
    });
    return dayOfSchedule;
  }

  public async updateStatus(id: string, status: Status) {
    await this.dayOfScheduleRepository.update({ id }, { status: status });
  }

  public async findAll() {
    const daysOfSchedule = await this.dayOfScheduleRepository.find();
    return daysOfSchedule
  }


  public async findForeignKey(id: string) {
    const scheduling = await this.dayOfScheduleRepository.findOneOrFail({
      where: { id: id },
      relations: ["scheduling"],
    });
    return scheduling;
  }
}
