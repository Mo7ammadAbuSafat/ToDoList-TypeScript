import Task from "../interfaces/task";
import { TASKS_CONTAINER_ID } from "./constant-service";
import addEventListenerForTask from "./event-listener-for-tasks";
import { GetState } from "./hooks-service";

// Define a class responsible for rendering tasks in the UI
class RenderService {
  getAllTasks: GetState<Task[]>;
  getFilteredTasks: GetState<Task[]>;

  constructor(
    getAllTasks: GetState<Task[]>,
    getFilteredTasks: GetState<Task[]>
  ) {
    this.getAllTasks = getAllTasks;
    this.getFilteredTasks = getFilteredTasks;
  }

  // Method to render a single task as an HTML element
  renderSingleTask = (task: Task): HTMLElement => {
    const taskContainerElement = document.createElement("tr");
    taskContainerElement.draggable = true;
    taskContainerElement.setAttribute("data-task-id", task.id);
    taskContainerElement.setAttribute(
      "data-task-element-type",
      "task-container"
    );
    taskContainerElement.classList.add("transition-all");
    taskContainerElement.classList.add("ease-in-out");
    taskContainerElement.classList.add("duration-500");
    if (task.completed) {
      taskContainerElement.classList.add("bg-emerald-300");
    }
    // Set the inner HTML of the task container element with task details
    taskContainerElement.innerHTML = `
    <td class="px-6 py-4">
      <input  data-task-id=${task.id}
              type="checkbox"
              class="complete-status mr-2" ${task.completed ? "checked" : ""}
      >
    </td>
    <td class="px-6 py-4 ">
      <span data-task-id=${task.id} data-title-container
            class="break-words ${task.completed ? "line-through" : ""}">
        ${task.title}
      </span>
    </td>
    <td class="px-6 py-4">
      <button data-task-id=${task.id} data-action-type="edit-task"
              class="font-bold py-2 px-4 rounded bg-sky-400 text-white">
        Edit
      </button>
      <button data-task-id=${task.id} data-action-type="delete-task"
              class="font-bold py-2 px-4 rounded bg-red-500 text-white">
        Delete
      </button>
    </td>`;

    // Add event listeners for task
    addEventListenerForTask(taskContainerElement, this.getAllTasks, task.id);

    return taskContainerElement;
  };

  // Method to render all tasks
  renderTasks = (): void => {
    let tasksContainerElement = document.getElementById(
      TASKS_CONTAINER_ID
    ) as HTMLElement | null;
    if (!tasksContainerElement) {
      return;
    }
    tasksContainerElement.innerHTML = "";
    for (const task of this.getFilteredTasks()) {
      const tableRow = this.renderSingleTask(task);
      tasksContainerElement.appendChild(tableRow);
    }
  };
}

export default RenderService;
