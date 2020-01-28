import { Issue } from './issue.model';

export class Category {
  _id?: string;
  name?: string;
  color?: string;
  issues?: Issue[];
}
