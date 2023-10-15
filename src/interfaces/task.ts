// Interface representing a Task
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default Task;
