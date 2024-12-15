const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("Please Input Task");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;

    let buttonsDiv = document.createElement("div");
    let spanDelete = document.createElement("span");
    spanDelete.innerHTML = "\u00D7"; // × icon for delete
    buttonsDiv.appendChild(spanDelete);

    li.appendChild(buttonsDiv);
    listContainer.appendChild(li);
  }
  inputBox.value = "";
  saveData();
}

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.innerHTML === "\u00D7") {
      e.target.parentElement.parentElement.remove();
      saveData();
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
let paused = false;
let elapsedTime = 0;

document.getElementById("start-timer").addEventListener("click", () => {
  if (paused) {
    startTime = Date.now() - elapsedTime;
  } else {
    startTime = Date.now();
  }

  if (int != null) {
    clearInterval(int);
  }

  int = setInterval(() => displayTimer(startTime), 10);
  paused = false;
  localStorage.setItem("timerState", "running");
});

document.getElementById("pause-timer").addEventListener("click", () => {
  clearInterval(int);
  elapsedTime = Date.now() - startTime;
  paused = true;
  localStorage.setItem("elapsedTime", elapsedTime);
  localStorage.setItem("timerState", "paused");
});

document.getElementById("reset-timer").addEventListener("click", () => {
  clearInterval(int);
  timeRef.innerHTML = "00 : 00 : 00 : 00";
  localStorage.removeItem("elapsedTime");
  localStorage.removeItem("timerState");
  elapsedTime = 0;
  paused = false;
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

  if (timerState === "running" && savedElapsedTime) {
    startTime = Date.now() - Number(savedElapsedTime);
    int = setInterval(() => displayTimer(startTime), 10);
    paused = false;
  } else if (timerState === "paused" && savedElapsedTime) {
    elapsedTime = Number(savedElapsedTime);
    displayTimer(Date.now() - elapsedTime);
    paused = true;
  }
});
