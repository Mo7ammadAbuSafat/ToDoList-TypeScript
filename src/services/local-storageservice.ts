import Task from "../interfaces/task";
import { LOCAL_STORAGE_TASKS_KEY } from "./constant-service";

// Function to save tasks to local storage
export const saveTasks = (allTasks: Task[]) => {
  localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(allTasks));
};

// Function to load tasks from local storage
export const loadTasks = (): Task[] => {
  const taskJSON = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
  if (taskJSON == null) {
    return [];
  }
  return JSON.parse(taskJSON);
};
