import { ConflictEror, NotFoundError } from "../helpers/api-errors";
import { DayOfScheduleRepository } from "../repositories/DayOfScheduleRepository";
import { SchedulingRepository } from "../repositories/SchedulingRepository";

export class SchedulingService {
  private schedulingRepository: SchedulingRepository;
  private dayOfSchedule: DayOfScheduleRepository;

  constructor() {
    this.schedulingRepository = new SchedulingRepository();
    this.dayOfSchedule = new DayOfScheduleRepository();
  }

  public async findAll() {
    const allScheduling = await this.schedulingRepository.findAll();
    return allScheduling;
  }

  public async create(
    clientName: string,
    phoneNumber: string,
    dayOfScheduleId: string
  ) {
    const dayOfSchedule = await this.dayOfSchedule.findById(dayOfScheduleId);
    if (!dayOfSchedule) {
      throw new NotFoundError("Day of schedule not found");
    }

    const foreignKey = await this.dayOfSchedule.findForeignKey(dayOfScheduleId);

    foreignKey.scheduling.forEach((item) => {
      if (item.phoneNumber == phoneNumber) {
        throw new ConflictEror(
          "There is already an appointment with the same phone number for the day"
        );
      }
    });

    const scheduling = await this.schedulingRepository.create(
      clientName,
      phoneNumber,
      dayOfSchedule
    );

    return scheduling;
  }

  public async delete(id: string) {
    const scheduling = await this.schedulingRepository.findById(id);
    console.log(scheduling);
    if (!scheduling) {
      throw new NotFoundError("scheduling not found");
    }
    await this.schedulingRepository.delete(scheduling);
  }
}
