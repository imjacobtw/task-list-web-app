class Task {
  constructor(description) {
    this.id = crypto.randomUUID();
    this.description = description;
    this.isCompleted = false;
  }
}

let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
const newTaskInput = document.querySelector("#new-task-container > input");
const newTaskButton = document.querySelector("#new-task-container > button");
const tasksContainer = document.querySelector("#tasks-container");

function renderTasks() {
  for (const task of tasks) {
    renderTask(task);
  }
}

function renderTask(task) {
  // <div class="task" id="<TASK_UUID>">
  //   <input type="text" value="Eat dinner."></input>
  //   <button>Mark As Complete</button>
  //   <button class="edit">Edit</button>
  //   <button class="delete">Delete</button>
  // </div>

  const newTaskContainer = document.createElement("div");
  newTaskContainer.classList.add("task");
  newTaskContainer.setAttribute("id", task.id);

  const newTaskInput = document.createElement("input");
  newTaskInput.setAttribute("type", "text");
  newTaskInput.setAttribute("value", task.description);
  newTaskInput.setAttribute("disabled", true);

  const completionButton = document.createElement("button");
  newTaskInput.style.textDecoration = task.isCompleted ? "line-through" : "none";
  completionButton.textContent = task.isCompleted ? "Mark as Ongoing" : "Mark as Complete";

  const editButton = document.createElement("button");
  editButton.disabled = task.isCompleted;
  editButton.textContent = "Edit";
  editButton.classList.add("edit");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete");

  completionButton.addEventListener("click", function () {
    task.isCompleted = !task.isCompleted;
    saveTasksToStorage();
    newTaskInput.style.textDecoration = task.isCompleted ? "line-through" : "none";
    completionButton.textContent = task.isCompleted ? "Mark as Ongoing" : "Mark as Complete";
    editButton.disabled = task.isCompleted;
  });

  editButton.addEventListener("click", function () {
    newTaskInput.disabled = !newTaskInput.disabled;
    editButton.textContent = newTaskInput.disabled ? "Edit" : "Save";
    completionButton.disabled = !completionButton.disabled;

    if (newTaskInput.disabled) {
      task.description = newTaskInput.value;
      saveTasksToStorage();
    }
  });

  deleteButton.addEventListener("click", function () {
    newTaskContainer.remove();
    tasks = tasks.filter(currTask => currTask.id !== task.id);
    saveTasksToStorage();
  });
  
  newTaskContainer.appendChild(newTaskInput);
  newTaskContainer.appendChild(completionButton);
  newTaskContainer.appendChild(editButton);
  newTaskContainer.appendChild(deleteButton);
  tasksContainer.appendChild(newTaskContainer);
}

function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

newTaskButton.addEventListener("click", function () {
  const newTask = new Task(newTaskInput.value);
  newTaskInput.value = "";
  tasks.push(newTask);
  saveTasksToStorage();
  renderTask(newTask);
});

window.addEventListener("DOMContentLoaded", renderTasks);
