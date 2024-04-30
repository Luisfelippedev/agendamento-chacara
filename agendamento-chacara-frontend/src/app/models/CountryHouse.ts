export interface Address {
  city: string;
  street: string;
  number: string;
}

export interface CountryHouse {
  name: string;
  address: Address;
  user_id: string;
  daySchedule_id?: Array<string>
}
