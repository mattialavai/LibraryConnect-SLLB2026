export type Role = "ADMIN" | "MANAGEMENT" | "STAFF" | "PATRON";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
