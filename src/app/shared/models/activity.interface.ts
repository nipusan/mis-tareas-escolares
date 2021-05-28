
import { Course } from "./course.interface";

export interface Activity {
  id: number;
  name: string;
  content: string;
  startDate: Date;
  endDate: Date;
  course: Course | null;
}
