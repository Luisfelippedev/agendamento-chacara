import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DayOfSchedule } from "./DayOfSchedule";
import { UUID } from "crypto";

@Entity("scheduling")
export class Scheduling {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "text" })
  clientName: string;

  @Column({ type: "text" })
  schedulingTime: string;

  @Column({ type: "text" })
  status: string;

  @OneToMany(() => DayOfSchedule, (dayOfSchedule) => dayOfSchedule.scheduling)
  @JoinColumn({ name: "day-of-schedule_id" }) // Foreign Key
  dayOfSchedule: DayOfSchedule;
}
