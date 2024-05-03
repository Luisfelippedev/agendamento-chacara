import { Scheduling } from "@/app/models/Scheduling";
import { SchedulingRepository } from "@/repositories/SchedulingRepository";

export class SchedulingService {
  private schedulingRepository: SchedulingRepository;

  constructor() {
    this.schedulingRepository = new SchedulingRepository();
  }

  public async createScheduling(scheduling: Scheduling) {
    const { clientName, cpf, date, phoneNumber } = scheduling;
    const allScheduling = await this.schedulingRepository.findAll();

    if (allScheduling) {
      allScheduling.forEach((item) => {
        if (item.cpf == cpf) {
          throw new Error("Cpf already exists");
        }
        if (item.phoneNumber == phoneNumber) {
          throw new Error("Phone number already exists");
        }
        if (item.status == true) {
          throw new Error("Date occupied");
        }
      });
    }
    const objScheduling: Scheduling = {
      clientName: clientName,
      cpf: cpf,
      date: date,
      phoneNumber: phoneNumber,
      status: false,
    };

    const newScheduling = await this.schedulingRepository.create(objScheduling);

    return newScheduling;
  }

  public async getByDate(date: string) {
    const scheduling = await this.schedulingRepository.findByDate(date);

    if (scheduling == null) {
      throw new Error("Scheduling not found");
    }
    console.log(scheduling);
    return scheduling;
  }
}
