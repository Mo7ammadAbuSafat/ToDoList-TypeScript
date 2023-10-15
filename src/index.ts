import Task from "./interfaces/task";
import {
  CLEAR_COMPETED_TASK_BUTTON_ID,
  COMPLETED_TASK,
  FILTER_SELECT_ID,
  TASKS_CONTAINER_ID,
  TASK_NAME_INPUT_ID,
} from "./services/constant-service";
import DragAndDropService from "./services/drag-and-drop-service";
import Filter from "./services/filter-service";
import { useState } from "./services/hooks-service";
import { loadTasks, saveTasks } from "./services/local-storageservice";
import RenderService from "./services/render-service";
import "./styles/index.css";
import { v4 as uuidv4 } from "uuid";

// Get references to various HTML elements and initialize data
const input = document.getElementById(
  TASK_NAME_INPUT_ID
) as HTMLInputElement | null;
const form = document.getElementsByTagName("form")[0];

const tasksContainerElement = document.getElementById(
  TASKS_CONTAINER_ID
) as HTMLTableElement | null;

const filterSelect = document.getElementById(
  FILTER_SELECT_ID
) as HTMLInputElement;

const clearCompletedButton = document.getElementById(
  CLEAR_COMPETED_TASK_BUTTON_ID
);

let allTasks: Task[] = loadTasks();
const [getAllTasksState, setAllTasksState] = useState<Task[]>(allTasks);
const [getFilteredTasksState, setFilteredTasksState] =
  useState<Task[]>(allTasks);

const filterService = new Filter(setFilteredTasksState, getAllTasksState);
const renderService = new RenderService(
  getAllTasksState,
  getFilteredTasksState
);

const dragAndDropService = new DragAndDropService(
  getAllTasksState,
  filterService,
  renderService
);

// Event listener for form submission (adding a new task)
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input === null) {
    return;
  }
  if (input.value == "" || input.value == null) {
    return;
  } else {
    addTask(input.value);
    input.value = "";
  }
});

// Function to add a new task
const addTask = (name: string) => {
  const newTask: Task = {
    id: uuidv4(),
    title: name,
    completed: false,
    createdAt: new Date(),
  };
  getAllTasksState().push(newTask);
  saveTasks(getAllTasksState());
  // If the filter is set to show completed tasks, don't render the new task
  if (filterSelect.value !== COMPLETED_TASK) {
    const newTableRow = renderService.renderSingleTask(newTask);
    tasksContainerElement.appendChild(newTableRow);
  }
};

// Event listener for clearing completed tasks
clearCompletedButton?.addEventListener("click", () => {
  setAllTasksState(getAllTasksState().filter((task) => !task.completed));
  saveTasks(getAllTasksState());
  filterService.applyFilter();
  renderService.renderTasks();
});

// Event listener for changing the task filter
filterSelect?.addEventListener("change", () => {
  filterService.applyFilter();
  renderService.renderTasks();
});

// Initial rendering of tasks
renderService.renderTasks();
