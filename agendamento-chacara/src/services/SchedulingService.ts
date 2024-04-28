import { DayOfSchedule } from "../entities/DayOfSchedule";
import { NotFoundError } from "../helpers/api-errors";
import { DayOfScheduleRepository } from "../repositories/DayOfScheduleRepository";
import { SchedulingRepository } from "../repositories/SchedulingRepository";

export class SchedulingService {
  private schedulingRepository: SchedulingRepository;
  private dayOfSchedule: DayOfScheduleRepository;

  constructor() {
    this.schedulingRepository = new SchedulingRepository();
    this.dayOfSchedule = new DayOfScheduleRepository();
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
    const scheduling = await this.schedulingRepository.create(
      clientName,
      phoneNumber,
      dayOfSchedule
    );

    return scheduling;
  }

  public async delete(id: string) {

    const scheduling = await this.schedulingRepository.findById(id)
    if(!scheduling){
        throw new NotFoundError('scheduling not found')
    }
    await this.schedulingRepository.delete(id);



  }
}
