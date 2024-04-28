import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { DayOfSchedule } from "./DayOfSchedule";

export interface Address {
  city: string;
  street: string;
  number: string;
}

@Entity("country-house")
export class CountryHouse {
  @PrimaryGeneratedColumn('uuid') // Chave Primária
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  status: string;

  @Column({ type: "jsonb" }) // JSONB para armazenar o endereço como um objeto JSON no banco de dados
  address: Address;

  @OneToOne(() => User, (user) => user.countryHouse)
  @JoinColumn({ name: "user-admin_id" }) // Chave Estrangeira
  owner: User;

  @OneToMany(() => DayOfSchedule, (dayOfSchedule) => dayOfSchedule.countryHouse, {nullable: true})
  @JoinColumn({ name: "day-of-schedule_id" }) // Chave estrangeira
  daysSchedule: DayOfSchedule[];
}
