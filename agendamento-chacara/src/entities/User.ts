import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryHouse } from "./CountryHouse";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn('uuid') // Chave Primária
  id: string;

  @Column({ type: "text", unique: true })
  cpf: string;

  @Column({ type: "text"})
  password: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  phoneNumber: string;

  @OneToOne(() => CountryHouse, (countryHouse) => countryHouse.owner, {nullable: true})
  @JoinColumn({ name: "country-house_id" }) // Chave estrangeira
  countryHouse: CountryHouse;
}
