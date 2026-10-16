/* =====================================================
   SIMPLE CALCULATOR - JavaScript
   Idea: we keep 3 pieces of information (variables):
     1. firstNumber  -> the number typed before the operator
     2. operator     -> + - * / %
     3. currentInput -> the number the user is typing now
   ===================================================== */

// ---------- 1. Get elements from the HTML ----------
const displayEl = document.getElementById("screen");
const historyEl = document.getElementById("history");
const keys    = document.querySelector(".keys");

// ---------- 2. Variables that store the calculator's state ----------
let currentInput = "0";   // what the user is typing (kept as text)
let firstNumber  = null;  // first number (null = nothing yet)
let operator     = null;  // chosen operator
let justCalculated = false; // true right after pressing "="

// ---------- 3. Show the current value on the screen ----------
function updateScreen() {
  displayEl.textContent = currentInput;
  displayEl.classList.remove("error");
}

// ---------- 4. Handle number buttons (0-9) ----------
function inputNumber(digit) {
  // If we just finished a calculation, start fresh
  if (justCalculated) {
    currentInput = digit;
    justCalculated = false;
  } else if (currentInput === "0") {
    currentInput = digit;            // replace the starting 0
  } else if (currentInput.length < 12) {
    currentInput += digit;           // add digit at the end
  }
  updateScreen();
}

// ---------- 5. Handle the decimal point ----------
function inputDecimal() {
  if (justCalculated) {
    currentInput = "0";
    justCalculated = false;
  }
  // if-condition: allow only ONE dot in a number
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateScreen();
}

// ---------- 6. Handle operator buttons (+ - * / %) ----------
function chooseOperator(op) {
  // If user already typed a first number and an operator, calculate first
  if (operator !== null && !justCalculated) {
    calculate();
  }
  firstNumber = parseFloat(currentInput);
  operator = op;
  justCalculated = false;
  historyEl.textContent = firstNumber + " " + symbol(op);
  currentInput = "0";
}

// ---------- 7. The main calculation (if / else / switch) ----------
function calculate() {
  // Condition: do nothing if we don't have an operator yet
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
      // Condition: cannot divide by zero
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

  // Round to avoid problems like 0.1 + 0.2 = 0.30000000000000004
  result = Math.round(result * 1e10) / 1e10;

  historyEl.textContent = firstNumber + " " + symbol(operator) + " " + secondNumber + " =";
  currentInput = String(result);
  firstNumber = null;
  operator = null;
  justCalculated = true;
  updateScreen();
}

// ---------- 8. Clear and delete ----------
function clearAll() {
  currentInput = "0";
  firstNumber = null;
  operator = null;
  justCalculated = false;
  historyEl.textContent = "";
  updateScreen();
}

function deleteLast() {
  // if-else: remove last character, or reset to 0 if only one is left
  if (currentInput.length > 1 && !justCalculated) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }
  updateScreen();
}

// ---------- 9. Helper functions ----------
function showError(message) {
  clearAll();
  displayEl.textContent = message;
  displayEl.classList.add("error");
}

// Convert * and / to the nicer symbols for the history line
function symbol(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  if (op === "-") return "−";
  return op;
}

// ---------- 10. Button clicks (one listener for ALL buttons) ----------
keys.addEventListener("click", function (event) {
  const button = event.target;

  // Ignore clicks that are not on a button
  if (!button.matches("button")) return;

  const action = button.dataset.action;
  const value  = button.dataset.value;

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

// ---------- 11. Keyboard support (bonus feature) ----------
document.addEventListener("keydown", function (event) {
  const k = event.key;

  if (k >= "0" && k <= "9") inputNumber(k);
  else if (["+", "-", "*", "/", "%"].includes(k)) chooseOperator(k);
  else if (k === ".") inputDecimal();
  else if (k === "Enter" || k === "=") calculate();
  else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearAll();
});