import Task from "../interfaces/task";
import {
  ACTIVE_TASK,
  COMPLETED_TASK,
  FILTER_SELECT_ID,
} from "./constant-service";
import { GetState, SetState } from "./hooks-service";

// Get the filter select element by its ID
const filterSelect = document.getElementById(
  FILTER_SELECT_ID
) as HTMLInputElement;

// Define a class for filtering tasks
class Filter {
  setFilteredTasks: SetState<Task[]>;
  getAllTasks: GetState<Task[]>;

  constructor(
    setFilteredTasks: SetState<Task[]>,
    getAllTasks: GetState<Task[]>
  ) {
    this.setFilteredTasks = setFilteredTasks;
    this.getAllTasks = getAllTasks;
  }
  // Method to apply the selected filter
  applyFilter = () => {
    // Get the currently selected value from the filter select element
    const selectedValue = filterSelect.value;
    // Use a switch statement to determine the filter logic based on the selected value
    switch (selectedValue) {
      case ACTIVE_TASK:
        this.setFilteredTasks(
          this.getAllTasks().filter((task) => !task.completed)
        );
        break;
      case COMPLETED_TASK:
        this.setFilteredTasks(
          this.getAllTasks().filter((task) => task.completed)
        );
        break;
      default:
        this.setFilteredTasks(this.getAllTasks());
    }
  };
}

export default Filter;
