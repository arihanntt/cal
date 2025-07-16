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

    // Save to history
    history.unshift(`${expression} = ${formatted}`);
    if (history.length > 20) history.pop(); // Keep latest 20
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
  const ul = document.getElementById('historyList');
  ul.innerHTML = '';

  history.forEach(item => {
    const li = document.createElement('li');
    li.innerText = item;
    ul.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem("calc-history");
  updateHistory();
}

// Show Planner / Calculator
function showCalculator() {
  document.getElementById('calculatorSection').style.display = 'block';
  document.getElementById('plannerSection').style.display = 'none';

  // ✅ Scroll down to keep calculator in view
  setTimeout(() => {
    window.scrollTo({ top: 100, behavior: 'smooth' });
  }, 50);
}

function showPlanner() {
  document.getElementById('calculatorSection').style.display = 'none';
  document.getElementById('plannerSection').style.display = 'block';
}

// Smart Monthly Planner Logic
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

// Open full history page
function toggleHistory() {
  const historyPage = document.createElement('div');
  historyPage.classList.add('history-page');
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
  updateHistory();
}

function closeHistory() {
  const page = document.querySelector('.history-page');
  if (page) page.remove();
}

// Allow pressing Enter to calculate
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    calculate();
  }
});

// Initial load
window.onload = () => {
  updateHistory();
};
