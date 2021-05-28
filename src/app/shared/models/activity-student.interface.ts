'strict'

import { Activity } from "./activity.interface";
import { Student } from "./student.interface";

export interface ActivityStudent {
  id: number;
  activity: Activity | null;
  student: Student | null;
  observation: string;
  state: boolean;
}
