import Task from "../interfaces/task";
import { EDIT_TASK_NAME_MESSAGE } from "./constant-service";
import { GetState } from "./hooks-service";
import { saveTasks } from "./local-storageservice";

// Define a function to add event listeners for task actions
const addEventListenerForTask = (
  taskContainerElement: HTMLElement,
  getAllTasks: GetState<Task[]>,
  taskId: string
) => {
  // Find the index of the task
  const taskIndex = getAllTasks().findIndex((t) => t.id === taskId);

  // Get the element that triggers the "Edit" action for the task
  const editTaskTriggerElement = taskContainerElement.querySelectorAll(
    "[data-action-type='edit-task']"
  )[0] as HTMLElement;

  // Get the element that displays the task title
  const taskTitleElement = taskContainerElement.querySelectorAll(
    "[data-title-container]"
  )[0] as HTMLElement;

  // Add a click event listener to the Edit element
  editTaskTriggerElement?.addEventListener("click", () => {
    let newTaskTitle = prompt(EDIT_TASK_NAME_MESSAGE);
    if (newTaskTitle !== null) {
      // Update the task title in the list
      getAllTasks()[taskIndex].title = newTaskTitle;
      saveTasks(getAllTasks());
      // Update the task title displayed
      taskTitleElement.innerHTML = newTaskTitle;
    }
  });

  // Get the checkbox input element for task status
  const checkbox = taskContainerElement.querySelector(
    "input[type='checkbox']"
  ) as HTMLInputElement | null;

  // Add a change event listener to the checkbox
  checkbox?.addEventListener("change", () => {
    // Update the completion status of the task in the list
    getAllTasks()[taskIndex].completed = checkbox.checked;
    saveTasks(getAllTasks());
    // Apply styles based on the completion status
    if (checkbox.checked) {
      taskContainerElement.classList.add("bg-emerald-300");
      taskTitleElement.classList.add("line-through");
    } else {
      taskContainerElement.classList.remove("bg-emerald-300");
      taskTitleElement.classList.remove("line-through");
    }
  });

  // Get the element that triggers the delete action for the task
  const deleteTaskTriggerElement = taskContainerElement.querySelectorAll(
    "[data-action-type='delete-task']"
  )[0] as HTMLElement;

  deleteTaskTriggerElement?.addEventListener("click", () => {
    // Add a tailwind class to animate the task container removal
    taskContainerElement.classList.add("translate-x-[100vw]");

    // Remove the task from the list
    getAllTasks().splice(taskIndex, 1);
    saveTasks(getAllTasks());
    // Schedule the removal of the task container from the DOM after a delay to achieve animations
    setTimeout(() => taskContainerElement.remove(), 250);
  });
};

export default addEventListenerForTask;
