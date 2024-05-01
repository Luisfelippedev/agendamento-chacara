import { firestore } from "@/database/firestore";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"
import { User } from "../app/models/User";

export class UserRepository {
  constructor() {}

  public async findById(id: string) {
    let user;
    const newQuery = query(
      collection(firestore, "User"),
      where("id", "==", id)
    );
    const querySnapshot = await getDocs(newQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { password, ...rest } = data;
      user = rest;
    });
    return user;
  }
  public async findByCpf(cpf: string): Promise<User | null> {
    let user: User | null = null;
    const newQuery = query(
      collection(firestore, "User"),
      where("cpf", "==", cpf)
    );
    const querySnapshot = await getDocs(newQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      user = {
        id: data.id,
        cpf: data.cpf,
        fullName: data.fullName,
        password: data.password,
        phoneNumber: data.phoneNumber,
      };
    });
    return user;
  }

  public async createUser(user: User) {
    const { cpf, fullName, password, phoneNumber } = user;
    const id = uuidv4();
    await setDoc(doc(firestore, "User", id), {
      id,
      fullName,
      cpf,
      password,
      phoneNumber,
    });
  }
  public async getAllUsers() {
    const collectionRef = collection(firestore, "User");

    const querySnapshot = await getDocs(collectionRef);
    const users = [];

    for (const document of querySnapshot.docs) {
      const user = document.data();
      users.push(user);
    }

    return users;
  }
}
