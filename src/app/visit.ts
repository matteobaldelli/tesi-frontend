import { Exam } from './exam';

export class Visit {
  id: number;
  name: string;
  userUsername?: string;
  userGender?: string;
  dateCreated?: Date;
  dateModified?: Date;
  exams?: Exam[];
}
