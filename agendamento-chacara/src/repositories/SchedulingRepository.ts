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
    const allScheduling = await this.schedulingRepository.find({
      relations: ['dayOfSchedule'],
    });
    return allScheduling;
  }
  public async findByPhoneNumber(phoneNumber: string) {
    const scheduling = await this.schedulingRepository.findOneBy({
      phoneNumber,
    });
    return scheduling;
  }

  public async findById(id: string) {
    const scheduling = await this.schedulingRepository.findOneBy({
      id: id,
    });
    return scheduling;
  }

  public async delete(scheduling: Scheduling) {
    await this.schedulingRepository.delete(scheduling); 
  }
}
