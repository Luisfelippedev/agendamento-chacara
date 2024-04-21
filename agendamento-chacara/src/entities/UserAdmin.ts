import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CountryHouse } from "./CountryHouse";

@Entity("user-admin")
export class UserAdmin {
  @PrimaryGeneratedColumn() // Chave Primária
  id: number;

  @Column()
  cpf: number;

  @Column({ type: "text" })
  name: string;

  @Column()
  phoneNumber: number;

  @OneToOne(() => CountryHouse, (countryHouse) => countryHouse.owner)
  @JoinColumn({ name: "country-house_id" }) // Chave estrangeira
  countryHouse: CountryHouse;
}
