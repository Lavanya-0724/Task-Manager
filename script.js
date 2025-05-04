document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const tasksLeft = document.getElementById("tasksLeft");
  const clearCompletedBtn = document.getElementById("clearCompleted");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Initialize the app
  renderTasks();
  updateTasksLeft();

  // Add new task
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  // Filter tasks
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });

  // Clear completed tasks
  clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
    updateTasksLeft();
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false,
      });
      saveTasks();
      renderTasks();
      updateTasksLeft();
      taskInput.value = "";
    }
  }

  function renderTasks() {
    taskList.innerHTML = "";
    const filteredTasks = filterTasks();

    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${
                  task.completed ? "checked" : ""
                }>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;

      const checkbox = li.querySelector(".task-checkbox");
      const deleteBtn = li.querySelector(".delete-btn");

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
        updateTasksLeft();
      });

      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveTasks();
        renderTasks();
        updateTasksLeft();
      });

      taskList.appendChild(li);
    });
  }

  function filterTasks() {
    switch (currentFilter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }

  function updateTasksLeft() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    tasksLeft.textContent = `${activeTasks} task${
      activeTasks !== 1 ? "s" : ""
    } left`;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
