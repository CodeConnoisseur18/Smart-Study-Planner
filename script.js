
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const allFilter = document.getElementById("allFilter");
const pendingFilter = document.getElementById("pendingFilter");
const completedFilter = document.getElementById("completedFilter");
const taskCounter = document.getElementById("taskCounter");
let currentFilter = "all";
function addTask(taskText = taskInput.value.trim(), completed = false) {
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");
    const taskName = document.createElement("span");
    const completeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    taskName.textContent = taskText;
    completeButton.textContent = "Done";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    if (completed) {
        li.classList.add("completed");
    }

    completeButton.addEventListener("click", function () {
        li.classList.toggle("completed");
        updateCounter();
        applyFilter();
        saveTasks();
    });

    deleteButton.addEventListener("click", function () {
        li.remove();
        updateCounter();
        applyFilter();
        saveTasks();
    });

    li.append(taskName, completeButton, deleteButton);
    taskList.appendChild(li);
    applyFilter();
    updateCounter();

    // Save only when adding a task manually
    if (arguments.length === 0 || taskText !== "") {
        saveTasks();
    }

    taskInput.value = "";
    taskInput.focus();
}

addButton.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        addTask(taskText);
    } else {
        alert("Please enter a task!");
    }
});

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addButton.click();
    }
});

function updateCounter() {
    const tasks = taskList.querySelectorAll("li");
    const completedTasks = taskList.querySelectorAll("li.completed");

    taskCounter.textContent =
        `Tasks completed: ${completedTasks.length}/${tasks.length}`;
}

function saveTasks() {
    const tasks = Array.from(taskList.querySelectorAll("li")).map(function (li) {
        return {
            text: li.querySelector("span").textContent,
            completed: li.classList.contains("completed")
        };
    });

    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("studyTasks")) || [];

    savedTasks.forEach(function (task) {
        addTask(task.text, task.completed);
    });

    updateCounter();
}

// Load saved tasks when the page opens
loadTasks();
function applyFilter() {
  const tasks = taskList.querySelectorAll("li");

  tasks.forEach(function (task) {
    const isCompleted = task.classList.contains("completed");

    if (currentFilter === "all") {
      task.hidden = false;
    } else if (currentFilter === "pending") {
      task.hidden = isCompleted;
    } else if (currentFilter === "completed") {
      task.hidden = !isCompleted;
    }
  });

  allFilter.classList.toggle("active", currentFilter === "all");
  pendingFilter.classList.toggle("active", currentFilter === "pending");
  completedFilter.classList.toggle("active", currentFilter === "completed");
}
allFilter.addEventListener("click", function () {
  currentFilter = "all";
  applyFilter();
});

pendingFilter.addEventListener("click", function () {
  currentFilter = "pending";
  applyFilter();
});

completedFilter.addEventListener("click", function () {
  currentFilter = "completed";
  applyFilter();
});
