export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number | null;
  assignee: string | null;
  attachments: Attachment[];
  user: string;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export interface Attachment {
  url: string;
  name: string;
  size: number;
  type: 'image' | 'file';
}
