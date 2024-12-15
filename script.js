const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  if (inputBox.value === "") {
    alert("Please Input Task");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    listContainer.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00D7"; // × icon for delete
    li.appendChild(span);
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
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
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
let elapsedTime = 0;

document.getElementById("start-timer").addEventListener("click", () => {
  const startTime = Date.now() - elapsedTime;
  localStorage.setItem("startTime", startTime);

  if (int != null) {
    clearInterval(int);
  }

  int = setInterval(() => displayTimer(startTime), 10);
});

document.getElementById("pause-timer").addEventListener("click", () => {
  clearInterval(int);
  elapsedTime = Date.now() - Number(localStorage.getItem("startTime"));
  localStorage.removeItem("startTime");
});

document.getElementById("reset-timer").addEventListener("click", () => {
  clearInterval(int);
  timeRef.innerHTML = "00 : 00 : 00 : 00";
  localStorage.removeItem("startTime");
  elapsedTime = 0;
});

function displayTimer(startTime) {
  const now = Date.now();
  const elapsedTime = now - startTime;

  const h = Math.floor(elapsedTime / 3600000);
  const m = Math.floor((elapsedTime % 3600000) / 60000);
  const s = Math.floor((elapsedTime % 60000) / 1000);
  const ms = Math.floor((elapsedTime % 1000) / 10); // Convert to 2-digit milliseconds

  timeRef.innerHTML = `${h < 10 ? "0" + h : h} : ${m < 10 ? "0" + m : m} : ${s < 10 ? "0" + s : s} : ${ms < 10 ? "0" + ms : ms}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const startTime = localStorage.getItem("startTime");
  if (startTime) {
    elapsedTime = Date.now() - Number(startTime);
    int = setInterval(() => displayTimer(Number(startTime)), 10);
  }
});
