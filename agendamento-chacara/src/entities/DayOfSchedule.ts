import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryHouse } from "./CountryHouse";
import { Scheduling } from "./Scheduling";

@Entity("day-of-schedule")
export class DayOfSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "text" })
  entryTime: string;

  @Column({ type: "text" })
  departureTime: string;

  @Column()
  monthDay: number;

  @Column({ type: "text" })
  status: string;

  @ManyToOne(() => CountryHouse, (countryHouse) => countryHouse.daysSchedule)
  @JoinColumn({ name: "country-house_id" }) // Chave estrangeira
  countryHouse: CountryHouse;

  @ManyToOne(() => Scheduling, (scheduling) => scheduling.dayOfSchedule, {
    nullable: true,
  })
  @JoinColumn({ name: "scheduling_id" }) // Chave estrangeira
  scheduling: Scheduling;
}
