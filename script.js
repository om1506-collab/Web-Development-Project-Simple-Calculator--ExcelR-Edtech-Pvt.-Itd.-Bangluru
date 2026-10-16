
const displayEl = document.getElementById("screen");
const historyEl = document.getElementById("history");
const keys = document.querySelector(".keys");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let justCalculated = false;

function updateScreen() {
  displayEl.textContent = currentInput;
  displayEl.classList.remove("error");
}

function inputNumber(digit) {
  if (justCalculated) {
    currentInput = digit;
    justCalculated = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.length < 12) {
    currentInput += digit;
  }
  updateScreen();
}

function inputDecimal() {
  if (justCalculated) {
    currentInput = "0";
    justCalculated = false;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateScreen();
}

function chooseOperator(op) {
  if (operator !== null && !justCalculated) {
    calculate();
  }
  firstNumber = parseFloat(currentInput);
  operator = op;
  justCalculated = false;
  historyEl.textContent = firstNumber + " " + symbol(op);
  currentInput = "0";
}

function calculate() {
  if (operator === null) {
    return;
  }

  const secondNumber = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "*":
      result = firstNumber * secondNumber;
      break;
    case "/":
      if (secondNumber === 0) {
        showError("Cannot divide by 0");
        return;
      }
      result = firstNumber / secondNumber;
      break;
    case "%":
      result = firstNumber % secondNumber;
      break;
  }

  result = Math.round(result * 1e10) / 1e10;

  historyEl.textContent = firstNumber + " " + symbol(operator) + " " + secondNumber + " =";
  currentInput = String(result);
  firstNumber = null;
  operator = null;
  justCalculated = true;
  updateScreen();
}

function clearAll() {
  currentInput = "0";
  firstNumber = null;
  operator = null;
  justCalculated = false;
  historyEl.textContent = "";
  updateScreen();
}

function deleteLast() {
  if (currentInput.length > 1 && !justCalculated) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateScreen();
}

function showError(message) {
  clearAll();
  displayEl.textContent = message;
  displayEl.classList.add("error");
}

function symbol(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  if (op === "-") return "−";
  return op;
}

keys.addEventListener("click", function (event) {
  const button = event.target;

  if (!button.matches("button")) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "number") {
    inputNumber(value);
  } else if (action === "operator") {
    chooseOperator(value);
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "equals") {
    calculate();
  } else if (action === "clear") {
    clearAll();
  } else if (action === "delete") {
    deleteLast();
  }
});

document.addEventListener("keydown", function (event) {
  const k = event.key;

  if (k >= "0" && k <= "9") inputNumber(k);
  else if (["+", "-", "*", "/", "%"].includes(k)) chooseOperator(k);
  else if (k === ".") inputDecimal();
  else if (k === "Enter" || k === "=") calculate();
  else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearAll();
});
