class Task {
  constructor(description) {
    this.id = crypto.randomUUID();
    this.description = description;
    this.isCompleted = false;
  }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
const newTaskInputElement = document.querySelector("#new-task-container > input");
const newTaskButtonElement = document.querySelector("#new-task-container > button");
const tasksContainerElement = document.querySelector("#tasks-container");

function addTaskToScreen(task) {
  // <div class="task-row" id="<TASK_UUID>">
  //   <input type="text" value="Eat dinner."></input>
  //   <button>Mark As Complete</button>
  //   <button class="edit">Edit</button>
  //   <button class="delete">Delete</button>
  // </div>

  const newTaskContainer = document.createElement("div");
  newTaskContainer.classList.add("task-row");
  newTaskContainer.setAttribute("id", task.id);

  const newTaskInputElement = document.createElement("input");
  newTaskInputElement.setAttribute("type", "text");
  newTaskInputElement.setAttribute("value", task.description);
  newTaskInputElement.setAttribute("disabled", true);
  newTaskContainer.appendChild(newTaskInputElement);

  const markAsCompleteButton = document.createElement("button");
  changeTaskCompletionStyle(newTaskInputElement, markAsCompleteButton, task);
  markAsCompleteButton.addEventListener("click", function () {
    task.isCompleted = !task.isCompleted;
    changeTaskCompletionStyle(newTaskInputElement, markAsCompleteButton, task);
    editButton.disabled = !editButton.disabled;
  });
  newTaskContainer.appendChild(markAsCompleteButton);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit");
  editButton.addEventListener("click", function () {
    newTaskInputElement.disabled = !newTaskInputElement.disabled;
    editButton.textContent = newTaskInputElement.disabled ? "Edit" : "Save";
    markAsCompleteButton.disabled = !markAsCompleteButton.disabled;

    if (newTaskInputElement.disabled) {
      const foundTask = tasks.find(currTask => currTask.id === task.id);
      foundTask.description = newTaskInputElement.value;
    }
  });
  newTaskContainer.append(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete");
  deleteButton.addEventListener("click", function () {
    newTaskContainer.remove();
    tasks = tasks.filter(currTask => currTask.id !== task.id);
  });
  newTaskContainer.append(deleteButton);

  tasksContainerElement.appendChild(newTaskContainer);
}

function changeTaskCompletionStyle(taskInputElement, markAsCompleteButtonElement, task) {
  taskInputElement.style.textDecoration = task.isCompleted
    ? "line-through"
    : "none";
  markAsCompleteButtonElement.textContent = task.isCompleted
    ? "Mark as Uncomplete"
    : "Mark as Complete";
}

newTaskButtonElement.addEventListener("click", function () {
  const newTask = new Task(newTaskInputElement.value);
  newTaskInputElement.value = "";
  tasks.push(newTask);
  addTaskToScreen(newTask);
});

window.addEventListener("DOMContentLoaded", function () {
  for (const task of tasks) {
    addTaskToScreen(task);
  }
});

window.addEventListener("beforeunload", function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
});
