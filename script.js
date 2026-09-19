// 1. Load saved tasks or start empty
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// 2. Grab DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const dateDisplay = document.getElementById("dateDisplay");

// 3. Display today's date
if (dateDisplay) {
  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  dateDisplay.textContent = new Date().toLocaleDateString(undefined, options);
}

// 4. Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 5. Render tasks to screen
function render() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "task-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    contentDiv.appendChild(checkbox);
    contentDiv.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&times;";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount === 1 ? "" : "s"} remaining`;
}

// 6. Add, Toggle, Delete Functions
function addTask(text) {
  const newTask = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

// 7. Event listeners
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value);
    taskInput.value = "";
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  render();
});

// Run render on load
render();