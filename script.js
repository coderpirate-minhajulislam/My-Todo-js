const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
let editTaskElement = null;

function addTask() {
  if (inputBox.value === "") {
    alert("Please Input Task");
  } else {
    if (editTaskElement) {
      editTaskElement.querySelector(".task-text").innerText = inputBox.value;
      editTaskElement = null;
    } else {
      let li = document.createElement("li");

      let taskText = document.createElement("span");
      taskText.innerText = inputBox.value;
      taskText.classList.add("task-text");

      let buttonsDiv = document.createElement("div");

      let spanEdit = document.createElement("span");
      spanEdit.innerHTML = "\u270E"; // Pencil icon for edit
      spanEdit.classList.add("button-icon");
      buttonsDiv.appendChild(spanEdit);

      let spanDelete = document.createElement("span");
      spanDelete.innerHTML = "\u00D7"; // × icon for delete
      spanDelete.classList.add("button-icon");
      buttonsDiv.appendChild(spanDelete);

      li.appendChild(taskText);
      li.appendChild(buttonsDiv);
      listContainer.appendChild(li);
    }
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.classList.contains("task-text")) {
      e.target.parentElement.classList.toggle("checked");
      saveData();
    } else if (e.target.innerHTML === "\u00D7") {
      e.target.parentElement.parentElement.remove();
      saveData();
    } else if (e.target.innerHTML === "\u270E") {
      editTaskElement = e.target.parentElement.parentElement;
      inputBox.value = editTaskElement.querySelector(".task-text").innerText;
      inputBox.focus();
    }
  },
  false
);

inputBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
  listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

// Timer functionality
let timeRef = document.querySelector(".timer-display");
let int = null;
let startTime = null;
let paused = true;
let elapsedTime = 0;

document.getElementById("start-timer").addEventListener("click", () => {
  if (paused) {
    startTime = Date.now() - elapsedTime;
    int = setInterval(() => displayTimer(startTime), 10);
    paused = false;
    localStorage.setItem("timerState", "running");
    localStorage.setItem("startTime", startTime);
  }
});

document.getElementById("pause-timer").addEventListener("click", () => {
  if (!paused) {
    clearInterval(int);
    elapsedTime = Date.now() - startTime;
    paused = true;
    localStorage.setItem("elapsedTime", elapsedTime);
    localStorage.setItem("timerState", "paused");
  }
});

document.getElementById("reset-timer").addEventListener("click", () => {
  clearInterval(int);
  timeRef.innerHTML = "00 : 00 : 00 : 00";
  localStorage.removeItem("elapsedTime");
  localStorage.removeItem("timerState");
  localStorage.removeItem("startTime");
  elapsedTime = 0;
  paused = true;
});

function displayTimer(startTime) {
  const now = Date.now();
  elapsedTime = now - startTime;

  const h = Math.floor(elapsedTime / 3600000);
  const m = Math.floor((elapsedTime % 3600000) / 60000);
  const s = Math.floor((elapsedTime % 60000) / 1000);
  const ms = Math.floor((elapsedTime % 1000) / 10); // Convert to 2-digit milliseconds

  timeRef.innerHTML = `${h < 10 ? "0" + h : h} : ${m < 10 ? "0" + m : m} : ${s < 10 ? "0" + s : s} : ${ms < 10 ? "0" + ms : ms}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const savedElapsedTime = localStorage.getItem("elapsedTime");
  const timerState = localStorage.getItem("timerState");
  const savedStartTime = localStorage.getItem("startTime");

  if (timerState === "running" && savedStartTime) {
    startTime = Number(savedStartTime);
    int = setInterval(() => displayTimer(startTime), 10);
    paused = false;
  } else if (timerState === "paused" && savedElapsedTime) {
    elapsedTime = Number(savedElapsedTime);
    displayTimer(Date.now() - elapsedTime);
    paused = true;
  }
});
