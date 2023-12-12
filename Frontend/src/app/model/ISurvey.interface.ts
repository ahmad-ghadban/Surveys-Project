import { IQuestion } from './IQuestion.interface';

export interface ISurvey {
  id: number;
  name: string;
  description: string;
  questions: Array<IQuestion>;
  deadline: number;
  published: boolean;
  isPublic: boolean;
}
