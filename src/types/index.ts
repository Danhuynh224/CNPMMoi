import { Request, Response } from 'express';

// User interface
export interface IUser {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  roleId?: string;
}

// Request body interface for user operations
export interface IUserRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  roleId?: string;
}

// Controller function types
export type ControllerFunction = (req: Request, res: Response) => Promise<void> | void;

// Database configuration interface
export interface IDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
}

// Service interface
export interface ICRUDService {
  getAllUsers(): Promise<IUser[]>;
  createNewUser(userData: IUserRequestBody): Promise<string>;
  getUserInfoById(userId: string): Promise<IUser | null>;
  updateUser(userData: IUserRequestBody & { id: string }): Promise<IUser[]>;
  deleteUser(userId: string): Promise<void>;
}
