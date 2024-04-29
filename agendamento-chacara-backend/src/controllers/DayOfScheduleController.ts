import { Request, Response } from "express";
import { DayOfScheduleService } from "../services/DayOfScheduleService";

export class DayOfScheduleController {
  private dayOfScheduleService: DayOfScheduleService;

  constructor() {
    this.dayOfScheduleService = new DayOfScheduleService();
  }

  public create = async (req: Request, res: Response) => {
    const { startTime, endTime, date } = req.body;
    const countryHouseId = req.params.countryHouseId;

    const dayOfSchedule = await this.dayOfScheduleService.create(
      startTime,
      endTime,
      countryHouseId,
      date
    );

    res.status(201).json(dayOfSchedule);
  };

  public setFreeStatus = async (req: Request, res: Response)=>{
    const id = req.params.id
    const updatedDayOfSchedule = await this.dayOfScheduleService.setFreeStatus(id)
    res.status(200).json({updatedDayOfSchedule})
  }


  public setOccupiedStatus = async (req: Request, res: Response)=>{
    const id = req.params.id
    const updatedDayOfSchedule = await this.dayOfScheduleService.setOccupiedStatus(id)
    res.status(200).json({updatedDayOfSchedule})
  }

  public getAll = async (req: Request, res: Response) => {
    const daysOfSchedule = await this.dayOfScheduleService.findAll()
    res.status(200).json(daysOfSchedule)
  }

}
