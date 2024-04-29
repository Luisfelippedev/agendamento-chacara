import { BadRequestError, NotFoundError } from "../helpers/api-errors";
import { CountryHouseRepository } from "../repositories/CountryHouseRepository";
import { DayOfScheduleRepository } from "../repositories/DayOfScheduleRepository";
import { Status } from "../entities/DayOfSchedule";
import { dateExist } from "../utils/valid-date-exists";

export class DayOfScheduleService {
  private dayOfScheduleRepository: DayOfScheduleRepository;
  private countryHouseRepository: CountryHouseRepository;

  constructor() {
    this.dayOfScheduleRepository = new DayOfScheduleRepository();
    this.countryHouseRepository = new CountryHouseRepository();
  }

  public async create(
    startTime: string,
    endTime: string,
    countryHouseId: string,
    date: string
  ) {
    const countryHouseExists = await this.countryHouseRepository.findById(
      countryHouseId
    );

    if (!countryHouseExists) {
      throw new NotFoundError("country house not found");
    }

    const dayOfScheduleExists = await this.dayOfScheduleRepository.findByDate(
      date
    );

    if (dayOfScheduleExists) {
      throw new BadRequestError("Day of schedule already exists");
    }

    if (!dateExist(date)) {
      throw new BadRequestError("Date does not exist");
    }

    const newDayOfSchedule = await this.dayOfScheduleRepository.create(
      startTime,
      endTime,
      countryHouseExists,
      date
    );

    return newDayOfSchedule;
  }

  public async findById(id: string) {
    const dayOfSchedule = await this.dayOfScheduleRepository.findById(id);

    if (!dayOfSchedule) {
      throw new NotFoundError("day of schedule not found");
    }
    return dayOfSchedule;
  }

  public async setOccupiedStatus(id: string) {
    const dayOfSchedule = await this.dayOfScheduleRepository.findById(id);

    if (!dayOfSchedule) {
      throw new NotFoundError("Day of schedule not found");
    }

    await this.dayOfScheduleRepository.updateStatus(id, Status.Occupied);
    return { id: id, status: Status.Occupied };
  }

  public async setFreeStatus(id: string) {
    const dayOfSchedule = await this.dayOfScheduleRepository.findById(id);

    if (!dayOfSchedule) {
      throw new NotFoundError("Day of schedule not found");
    }

    await this.dayOfScheduleRepository.updateStatus(id, Status.Free);
    return { id: id, status: Status.Free };
  }

  public async findAll(){
    const daysOfSchedule = await this.dayOfScheduleRepository.findAll()

    if(daysOfSchedule.length<=0){
      throw new NotFoundError('no data found')
    }

    return daysOfSchedule
  }

}
