import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
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
  phoneNumber: string;

  @ManyToMany(() => DayOfSchedule, (dayOfSchedule) => dayOfSchedule.scheduling)
  dayOfSchedule: DayOfSchedule[];
}
