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
    if (history.length > 10) history.pop(); // max 10 items
    localStorage.setItem("calc-history", JSON.stringify(history));
    updateHistory();

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

window.onload = updateHistory;
