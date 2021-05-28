import { User } from './user.interface';

export interface Course {
  id: number;
  code: string;
  name: string;
  startDate: Date;
  endDate: Date;
  user: User | null;
  state: boolean | string;
}
