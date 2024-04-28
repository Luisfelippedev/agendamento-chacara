import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryHouse } from "./CountryHouse";
import { Scheduling } from "./Scheduling";

export enum Status {
  Free = 'free',
  Occupied = 'ocupado', // ou 'ocupado', conforme sua convenção de escrita
}

@Entity("day-of-schedule")
export class DayOfSchedule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  startTime: string;

  @Column({ type: "text" })
  endTime: string;

  @Column({ type: "text" })
  date: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.Free, // Definir o valor padrão como 'free'
  })
  status: Status;

  @ManyToOne(() => CountryHouse, (countryHouse) => countryHouse.daysSchedule)
  @JoinColumn({ name: "country-house_id" }) // Chave estrangeira
  countryHouse: CountryHouse;

  @ManyToMany(() => Scheduling, (scheduling) => scheduling.dayOfSchedule, {
    nullable: true,
  })
  @JoinTable({
    name: "day-of-schedule_scheduling",
    joinColumn: { name: "scheduling_id", referencedColumnName: "id" }, // Aqui
    inverseJoinColumn: { name: "dayOfSchedule_id", referencedColumnName: "id" },
  })
  scheduling: Scheduling[];
}
