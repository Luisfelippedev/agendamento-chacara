import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
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
  @JoinTable({
    name: "day-of-schedule_scheduling",
    joinColumn: { name: "dayOfSchedule_id", referencedColumnName: "id" }, // Aqui
    inverseJoinColumn: { name: "scheduling_id", referencedColumnName: "id" },
  })
  dayOfSchedule: DayOfSchedule[];
}
