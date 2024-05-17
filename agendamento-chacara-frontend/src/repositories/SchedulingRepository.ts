import { firestore } from "@/database/firestore";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Scheduling } from "../app/models/Scheduling";

export class SchedulingRepository {
  constructor() {}

  public async create(scheduling: Scheduling) {
    const {
      clientName,
      cpf,
      date,
      phoneNumber,
      status,
      avaliableDays,
      forgeinKey,
    } = scheduling;
    const id = uuidv4();
    await setDoc(doc(firestore, "Scheduling", id), {
      id,
      clientName,
      cpf,
      date,
      phoneNumber,
      status,
      avaliableDays,
      forgeinKey
    });
  }

  public async findAll() {
    const collectionRef = collection(firestore, "Scheduling");

    const querySnapshot = await getDocs(collectionRef);
    const allScheduling = [];

    for (const document of querySnapshot.docs) {
      const scheduling = document.data();
      allScheduling.push(scheduling);
    }

    return allScheduling;
  }

  public async findByDate(date: string): Promise<Scheduling[]> {
    const newQuery = query(
      collection(firestore, "Scheduling"),
      where("date", "==", date)
    );
    const querySnapshot = await getDocs(newQuery);
    const schedulings: Scheduling[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedulings.push({
        id: doc.id,
        cpf: data.cpf,
        clientName: data.clientName,
        date: data.date,
        phoneNumber: data.phoneNumber,
        status: data.status,
        avaliableDays: data.avaliableDays,
        forgeinKey: data.forgeinKey
      });
    });

    return schedulings;
  }

  public async findByCpf(cpf: string): Promise<Scheduling[]> {
    const newQuery = query(
      collection(firestore, "Scheduling"),
      where("cpf", "==", cpf)
    );
    const querySnapshot = await getDocs(newQuery);
    const schedulings: Scheduling[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedulings.push({
        id: doc.id,
        cpf: data.cpf,
        clientName: data.clientName,
        date: data.date,
        phoneNumber: data.phoneNumber,
        status: data.status,
        avaliableDays: data.avaliableDays,
        forgeinKey: data.forgeinKey
      });
    });

    return schedulings;
  }

  public async findById(id: string): Promise<Scheduling[]> {
    const newQuery = query(
      collection(firestore, "Scheduling"),
      where("id", "==", id)
    );
    const querySnapshot = await getDocs(newQuery);
    const schedulings: Scheduling[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      schedulings.push({
        id: doc.id,
        cpf: data.cpf,
        clientName: data.clientName,
        date: data.date,
        phoneNumber: data.phoneNumber,
        status: data.status,
        avaliableDays: data.avaliableDays,
        forgeinKey: data.forgeinKey
      });
    });

    return schedulings;
  }

  public async deleteById(id: string) {
    const userDocRef = doc(firestore, "Scheduling", id);
    await deleteDoc(userDocRef);
  }

  public async updateDateById(id: string, newDate: string) {
    const schedulingDocRef = doc(firestore, "Scheduling", id);
    await setDoc(schedulingDocRef, { date: newDate }, { merge: true });
  }

  public async toggleStatusById(id: string) {
    const schedulingDocRef = doc(firestore, "Scheduling", id);
    const newQuery = query(
      collection(firestore, "Scheduling"),
      where("id", "==", id)
    );
    const querySnapshot = await getDocs(newQuery);
    let status;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status == false) {
        status = true;
      } else {
        status = false;
      }
    });

    await setDoc(schedulingDocRef, { status: status }, { merge: true });
  }

  public async updateAvaliableDaysById(id: string, numberOfBusyDays: number) {
    const schedulingDocRef = doc(firestore, "Scheduling", id);
    await setDoc(schedulingDocRef, { avaliableDays: numberOfBusyDays }, { merge: true });
  }

}
