let ms = 0, interval = null, running = false;
let laps = JSON.parse(localStorage.getItem("laps")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const lapsList = document.getElementById("laps");
  const deleteBtn = document.getElementById("deleteLapsBtn");
  const circle = document.querySelector("circle");

  /* ---------------- FORMAT TIME ---------------- */
  const format = (ms) => {
    let cs = Math.floor(ms / 10) % 100;
    let s = Math.floor(ms / 1000) % 60;
    let m = Math.floor(ms / 60000);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(cs).padStart(2, "0")}`;
  };

  /* ---------------- UPDATE DISPLAY ---------------- */
  function updateUI() {
    display.textContent = format(ms);
    updateCircle();
  }

  /* ---------------- CIRCLE ANIMATION ---------------- */
  function updateCircle() {
    if (!circle) return;
    let r = circle.r.baseVal.value;
    let c = 2 * Math.PI * r;

    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c - ((ms / 60000) % 1) * c;
  }

  /* ---------------- LAPS DISPLAY ---------------- */
  function showLaps() {
    lapsList.innerHTML = laps.length
      ? laps.map((t, i) => `<li>Lap ${i + 1}: ${t}</li>`).join("")
      : `<li>No laps recorded.</li>`;
  }
  showLaps();

  /* ---------------- DELETE ALL LAPS ---------------- */
  deleteBtn.addEventListener("click", () => {
    laps = [];
    localStorage.removeItem("laps");
    showLaps(); // No popup
  });

  /* ---------------- BUTTON ACTIONS ---------------- */
  window.startTimer = () => {
    if (running) return;
    running = true;
    let start = Date.now() - ms;

    interval = setInterval(() => {
      ms = Date.now() - start;
      updateUI();
    }, 10);
  };

  window.pauseTimer = () => {
    running = false;
    clearInterval(interval);
  };

  window.resetTimer = () => {
    running = false;
    clearInterval(interval);
    ms = 0;
    updateUI();
  };

  window.addLap = () => {
    if (ms === 0) return;
    let lapTime = format(ms);
    laps.push(lapTime);
    localStorage.setItem("laps", JSON.stringify(laps));
    showLaps();
  };
});

