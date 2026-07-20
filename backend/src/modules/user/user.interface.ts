import { Role } from '@prisma/client';

export interface IUser {
  id:           string;
  email:        string;
  role:         Role;
  isActive:     boolean;
  isVerified:   boolean;
  createdAt:    Date;
  updatedAt:    Date;
}

export interface IManagerProfile {
  id:         string;
  userId:     string;
  firstName:  string;
  lastName:   string;
  avatar:     string | null;
  phone:      string | null;
  department: string | null;
  bio:        string | null;
}

export interface IUserWithProfile extends IUser {
  managerProfile: IManagerProfile | null;
}

export interface PaginationQuery {
  page?:   number;
  limit?:  number;
  search?: string;
}
