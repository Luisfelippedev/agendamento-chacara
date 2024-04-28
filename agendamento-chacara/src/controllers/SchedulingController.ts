import { Request, Response } from "express";
import { SchedulingService } from "../services/SchedulingService";

export class SchedulingController {
  private schedulingService: SchedulingService;

  constructor() {
    this.schedulingService = new SchedulingService();
  }

  public create = async (req: Request, res: Response) => {
    const { clientName, phoneNumber } = req.body;
    const dayOfScheduleId = req.params.dayOfScheduleId;

    const scheduling = await this.schedulingService.create(
      clientName,
      phoneNumber,
      dayOfScheduleId
    );

    res.status(201).json(scheduling);
  };

  public delete = async (req: Request, res: Response) => {
    const schedulingId = req.params.schedulingId;

    await this.schedulingService.delete(schedulingId);

    res.status(200).json({ message: "scheduling deleted sucessfully!" });
  };

  public getAll = async (req: Request, res: Response) => {
    const allScheduling = await this.schedulingService.findAll();

    res.status(200).json(allScheduling);
  };
}
