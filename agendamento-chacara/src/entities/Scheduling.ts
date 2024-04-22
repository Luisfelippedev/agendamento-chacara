import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DayOfSchedule } from "./DayOfSchedule";

@Entity("scheduling")
export class Scheduling {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  clientName: string;

  @Column({ type: "text" })
  schedulingTime: string;

  @Column({ type: "text" })
  status: string;

  @OneToMany(() => DayOfSchedule, (dayOfSchedule) => dayOfSchedule.scheduling)
  @JoinColumn({ name: "day-of-schedule_id" }) // Chave estrangeira
  dayOfSchedule: DayOfSchedule;
}
