let expression = '';
let history = JSON.parse(localStorage.getItem("calc-history")) || [];

function append(value) {
  expression += value;
  updateDisplay(expression);
}

function calculate() {
  try {
    const result = eval(expression);
    const formatted = Number(result).toLocaleString('en-US');
    updateDisplay(formatted);

    history.unshift(`${expression} = ${formatted}`);
    if (history.length > 20) history.pop();
    localStorage.setItem("calc-history", JSON.stringify(history));

    expression = result.toString();
  } catch {
    updateDisplay('Error');
  }
}

function clearDisplay() {
  expression = '';
  updateDisplay('0');
}

function updateDisplay(value) {
  document.getElementById('display').innerText = value;
}

function updateHistory() {
  // Support both inline history (if present) and full history page
  const list1 = document.getElementById('historyList');        // ⬅ used in fullscreen
  const list2 = document.getElementById('historyListPage');    // ⬅ used in inline or main layout

  [list1, list2].forEach(list => {
    if (!list) return; // Skip if not present
    list.innerHTML = '';
    history.forEach(item => {
      const li = document.createElement('li');
      li.innerText = item;
      list.appendChild(li);
    });
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem("calc-history");
  updateHistory();
}

function toggleHistory() {
  hideAllSections();

  let historyPage = document.getElementById('historyPage');
  if (!historyPage) {
    historyPage = document.createElement('div');
    historyPage.className = 'history-page';
    historyPage.id = 'historyPage';
    historyPage.innerHTML = `
      <div class="history-header">
        <h2>🕓 Calculation History</h2>
        <div>
          <button onclick="clearHistory(); closeHistory()">🗑 Clear All</button>
          <button onclick="closeHistory()">❌ Close</button>
        </div>
      </div>
      <ul class="history-list" id="historyList"></ul>
    `;
    document.body.appendChild(historyPage);
  } else {
    historyPage.style.display = 'block';
  }

  updateHistory();
}

function closeHistory() {
  const page = document.getElementById('historyPage');
  if (page) page.style.display = 'none';
  showCalculator(); // Restore calculator view by default
}

function showCalculator() {
  hideAllSections();
  document.getElementById('calculatorSection').style.display = 'block';

  // Optional: Scroll into view
  setTimeout(() => {
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }, 100);
}

function showPlanner() {
  hideAllSections();
  document.getElementById('plannerSection').style.display = 'block';
}

function showGoalPlanner() {
  hideAllSections();
  document.getElementById('goalPlannerSection').style.display = 'block';
}

function hideAllSections() {
  const sections = ['calculatorSection', 'plannerSection', 'goalPlannerSection'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const histPage = document.getElementById('historyPage');
  if (histPage) histPage.style.display = 'none';
}

// === Smart Monthly Planner ===
function calculatePlanner() {
  const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;

  const gfSpending = income * 0.30;
  const gfSaving = income * 0.20;
  const youSpending = income * 0.30;
  const youSaving = income * 0.20;

  document.getElementById('gfSpend').innerText = gfSpending.toLocaleString('en-IN');
  document.getElementById('gfSave').innerText = gfSaving.toLocaleString('en-IN');
  document.getElementById('youSpend').innerText = youSpending.toLocaleString('en-IN');
  document.getElementById('youSave').innerText = youSaving.toLocaleString('en-IN');
}

// === Daily Goal Planner ===
function calculateDailyGoal() {
  const target = parseFloat(document.getElementById("targetAmount").value);
  const days = parseInt(document.getElementById("daysCount").value);
  const output = document.getElementById("dailyGoalOutput");

  if (!target || !days || days <= 0) {
    output.innerText = "❌ Please enter a valid amount and days.";
    return;
  }

  const daily = target / days;
  output.innerText = `✅ You need to earn ₹${daily.toFixed(2)} per day.`;
}

function saveGoal() {
  const target = parseFloat(document.getElementById("targetAmount").value);
  const days = parseInt(document.getElementById("daysCount").value);
  if (!target || !days || days <= 0) return;

  const daily = target / days;
  const entry = `₹${target.toLocaleString()} in ${days} days → ₹${daily.toFixed(2)} / day`;

  let saved = JSON.parse(localStorage.getItem("daily-goals")) || [];
  saved.unshift(entry);
  if (saved.length > 10) saved.pop();
  localStorage.setItem("daily-goals", JSON.stringify(saved));

  renderSavedGoals();
}

function renderSavedGoals() {
  const list = document.getElementById("savedGoals");
  const saved = JSON.parse(localStorage.getItem("daily-goals")) || [];
  list.innerHTML = "";

  if (saved.length === 0) {
    list.innerHTML = "<li>No saved goals yet.</li>";
    return;
  }

  saved.forEach((goal) => {
    const li = document.createElement("li");
    li.innerText = goal;
    list.appendChild(li);
  });
}

// === Keyboard Enter Support ===
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculate();
  }
});

// === Initial Load ===
window.addEventListener("DOMContentLoaded", () => {
  updateHistory();
  renderSavedGoals();
  showCalculator(); // Default screen
});
