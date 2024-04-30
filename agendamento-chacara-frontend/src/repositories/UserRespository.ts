import { firestore } from "@/database/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

export class UserRepository {
  constructor() {}

  public async findById(id: string) {
    let user;
    const newQuery = query(collection(firestore, "User"), where("id", "==", id));
    const querySnapshot = await getDocs(newQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { password, ...rest } = data;
      user = rest;
    });
    return user;
  }

  public async findByCpf(cpf: string) {
    let user;
    const newQuery = query(collection(firestore, "User"), where("cpf", "==", cpf));
    const querySnapshot = await getDocs(newQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { password, ...rest } = data;
      user = rest;
    });
    return user;
  }
}
