import { AppDataSource } from "../data-source";
import { DayOfSchedule } from "../entities/DayOfSchedule";
import { Scheduling } from "../entities/Scheduling";
import { NotFoundError } from "../helpers/api-errors";

export class SchedulingRepository {
  schedulingRepository = AppDataSource.getRepository(Scheduling);
  constructor() {}

  public async create(
    clientName: string,
    phoneNumber: string,
    dayOfSchedule: DayOfSchedule
  ) {
    const scheduling = this.schedulingRepository.create({
      clientName,
      phoneNumber,
      dayOfSchedule: [dayOfSchedule],
    });
    await this.schedulingRepository.save(scheduling);
    return scheduling;
  }

  public async findAll() {
    const daysOfSchedule = await this.schedulingRepository.find();
    return daysOfSchedule;
  }
  public async findByPhoneNumber(phoneNumber: string) {
    const daysOfSchedule = await this.schedulingRepository.findOneBy({
      phoneNumber,
    });
    return daysOfSchedule;
  }

  public async findById(id: string) {
    const daysOfSchedule = await this.schedulingRepository.findOneBy({
      id: id,
    });
    return daysOfSchedule;
  }

  public async delete(id: string) {
    const scheduling = await this.schedulingRepository.findOneBy({ id: id });

    if (!scheduling) {
      throw new NotFoundError("Scheduling not found");
    }

    scheduling.dayOfSchedule = [];

    await this.schedulingRepository.save(scheduling);

    await this.schedulingRepository.delete(scheduling); // error
  }
}
