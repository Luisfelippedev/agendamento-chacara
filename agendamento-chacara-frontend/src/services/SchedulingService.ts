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
        if (item.date === date) {
          if (item.status === true) {
            throw new Error("Date occupied");
          }
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

    if (!objScheduling.clientName || !objScheduling.cpf || !objScheduling.date || !objScheduling.phoneNumber) {
      throw new Error("Empty input value")
    }


    const newScheduling = await this.schedulingRepository.create(objScheduling);

    return newScheduling;
  }

  public async getByDate(date: string) {
    const scheduling = await this.schedulingRepository.findByDate(date);

    if (scheduling == null) {
      throw new Error("Scheduling not found");
    }
    return scheduling;
  }

  public async getAll() {
    const allScheduling = await this.schedulingRepository.findAll();

    if (allScheduling.length <= 0) {
      throw new Error("Schedulings not found");
    }

    return allScheduling;
  }
}
