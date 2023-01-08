export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
  assignee?: Assignee;
  attachments: Attachment[];
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

interface Assignee {
  image?: string;
  name: string;
}

export interface Attachment {
  url: string;
  name: string;
  size: number;
  type: 'image' | 'file';
}
