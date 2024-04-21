import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserAdmin } from "./UserAdmin";
import { DayOfSchedule } from "./DayOfSchedule";

export interface Address {
  city: string;
  street: string;
  number: string;
}

@Entity("country-house")
export class CountryHouse {
  @PrimaryGeneratedColumn() // Chave Primária
  id: number;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  status: string;

  @Column({ type: "jsonb" }) // JSONB para armazenar o endereço como um objeto JSON no banco de dados
  address: Address;

  @OneToOne(() => UserAdmin, (userAdmin) => userAdmin.countryHouse)
  @JoinColumn({ name: "user-admin_id" }) // Chave Estrangeira
  owner: UserAdmin;

  @OneToMany(()=>DayOfSchedule, dayOfSchedule => dayOfSchedule.countryHouse)
  @JoinColumn({ name: "day-of-schedule_id" }) // Chave estrangeira
  daysSchedule: DayOfSchedule[]
}
