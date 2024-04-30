export enum Status {
  Free = "free",
  Occupied = "ocupado", // ou 'ocupado', conforme sua convenção de escrita
}

export interface DayOfSchedule {
  startTime: string;
  endTime: string;
  date: string;
  status: Status;
  countryHouse_id: string;
  scheduling_id?: Array<string>;
}
