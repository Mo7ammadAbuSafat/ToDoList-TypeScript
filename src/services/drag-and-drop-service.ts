import Task from "../interfaces/task";
import { TASKS_CONTAINER_ID } from "./constant-service";
import { GetState } from "./hooks-service";

//Interfaces for services
interface FilterServiceInterface {
  applyFilter: () => void;
}

interface RenderServiceInterface {
  renderSingleTask: (task: Task) => HTMLElement;
  renderTasks: () => void;
}

// Get tasks container element by ID
let tasksContainerElement = document.getElementById(
  TASKS_CONTAINER_ID
) as HTMLTableElement | null;

// Class for handling drag and drop functionality
class DragAndDropService {
  draggedTask: Task | null = null;

  constructor(
    getAllTasks: GetState<Task[]>,
    filterService: FilterServiceInterface,
    renderService: RenderServiceInterface
  ) {
    getAllTasks = getAllTasks;

    // Event listeners for drag and drop
    tasksContainerElement?.addEventListener("dragstart", (e) => {
      // Target will be the element that I moved
      const target = e.target as HTMLElement;
      const taskId = target.getAttribute("data-task-id");
      this.draggedTask =
        getAllTasks().find((task) => task.id === taskId) || null;
    });

    tasksContainerElement?.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    tasksContainerElement?.addEventListener("drop", (e) => {
      // Prevent the default drop behavior (e.g., opening a dropped file)
      e.preventDefault();
      let target = e.target as HTMLElement;
      // Perform a maximum of 4 iterations, climbing up the DOM tree to find the actual drop target
      let i = 4;
      while (i--) {
        if (target.parentElement == tasksContainerElement) {
          break;
        }
        target = target.parentElement;
      }

      // Get the task ID of the target element
      const targetPositionTaskId = target.getAttribute("data-task-id");

      // Find the index of the target task in the list of all tasks
      const targetIndex = getAllTasks().findIndex(
        (t) => t.id === targetPositionTaskId
      );

      // Find the index of the dragged task in the list of all tasks
      const draggedTaskIndex = getAllTasks().findIndex(
        (t) => t.id === this.draggedTask.id
      );

      // Move the dragged task within the array of all tasks to the target position
      moveElementInArray(getAllTasks(), draggedTaskIndex, targetIndex);
      filterService.applyFilter();
      renderService.renderTasks();
    });

    tasksContainerElement?.addEventListener("dragend", () => {
      this.draggedTask = null;
    });
  }
}

const moveElementInArray = (
  array: any[],
  initPosition: number,
  targetPosition: number
) => {
  const elementToMove = array[initPosition];
  array.splice(initPosition, 1);
  array.splice(targetPosition, 0, elementToMove);
};

export default DragAndDropService;
