import { type Unit } from './unit';

export interface UserUnit {
  unit: Unit;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  units?: UserUnit[];
}

export interface CreateUserPayload {
  userId: string;
  name: string;
  mobile: string;
  password?: string;
  active: boolean;
}