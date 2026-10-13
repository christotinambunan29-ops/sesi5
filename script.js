let current = "";
let previous = "";
let operator = "";
let justCalculated = false;

const resultEl = document.getElementById("result");
const historyEl = document.getElementById("history");

function updateDisplay() {
  resultEl.classList.remove("error");
  resultEl.textContent = current !== "" ? current : (previous !== "" ? previous : "0");
  historyEl.textContent = previous !== "" && operator !== "" ? previous + " " + operator : "";
}

function showError(message) {
  current = "";
  previous = "";
  operator = "";
  justCalculated = false;
  historyEl.textContent = "";
  resultEl.textContent = message;
  resultEl.classList.add("error");
}

function addNumber(num) {
  if (justCalculated) {
    current = "";
    justCalculated = false;
  }
  if (current === "0") {
    current = num;
  } else if (current.length < 15) {
    current += num;
  }
  updateDisplay();
}

function addDecimal() {
  if (justCalculated) {
    current = "";
    justCalculated = false;
  }
  if (current.includes(".")) return;
  current = current === "" ? "0." : current + ".";
  updateDisplay();
}

function chooseOperator(op) {
  if (current === "" && previous === "") {
    showError("Masukkan angka dulu");
    return;
  }
  if (current === "") {
    operator = op;
    updateDisplay();
    return;
  }
  if (previous !== "" && operator !== "") {
    if (!calculate()) return;
  }
  previous = current;
  current = "";
  operator = op;
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (previous === "" || operator === "" || current === "") {
    if (operator !== "") showError("Lengkapi angka dulu");
    return false;
  }

  const a = parseFloat(previous);
  const b = parseFloat(current);

  if (isNaN(a) || isNaN(b)) {
    showError("Input tidak valid");
    return false;
  }

  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "×":
      result = a * b;
      break;
    case "÷":
      if (b === 0) {
        showError("Tidak bisa dibagi 0");
        return false;
      }
      result = a / b;
      break;
    case "%":
      if (b === 0) {
        showError("Tidak bisa dibagi 0");
        return false;
      }
      result = a % b;
      break;
  }

  result = Math.round(result * 1e10) / 1e10;

  historyEl.textContent = previous + " " + operator + " " + current + " =";
  current = String(result);
  previous = "";
  operator = "";
  justCalculated = true;
  resultEl.classList.remove("error");
  resultEl.textContent = current;
  return true;
}

function clearAll() {
  current = "";
  previous = "";
  operator = "";
  justCalculated = false;
  updateDisplay();
}

function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  current = current.slice(0, -1);
  updateDisplay();
}

document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") addNumber(e.key);
  else if (e.key === ".") addDecimal();
  else if (e.key === "+" || e.key === "-") chooseOperator(e.key);
  else if (e.key === "*") chooseOperator("×");
  else if (e.key === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (e.key === "%") chooseOperator("%");
  else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); calculate(); }
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape") clearAll();
});