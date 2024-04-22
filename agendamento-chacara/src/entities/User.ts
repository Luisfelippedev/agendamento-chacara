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
  @PrimaryGeneratedColumn() // Chave Primária
  id: number;

  @Column({ type: "text" })
  cpf: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  phoneNumber: string;

  @OneToOne(() => CountryHouse, (countryHouse) => countryHouse.owner)
  @JoinColumn({ name: "country-house_id" }) // Chave estrangeira
  countryHouse: CountryHouse;
}
