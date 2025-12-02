export interface TaskItem {
  id: string;
  content: string;
  done: boolean;
}

export type TaskEventType = 'del' | 'edit' | 'done'