// Supports addition (+), subtraction (-), multiplication (*), and division (/).
const operations = {
  "+": (left, right) => left + right,
  add: (left, right) => left + right,
  "-": (left, right) => left - right,
  subtract: (left, right) => left - right,
  "*": (left, right) => left * right,
  "×": (left, right) => left * right,
  multiply: (left, right) => left * right,
  "/": (left, right) => left / right,
  "÷": (left, right) => left / right,
  divide: (left, right) => left / right,
};

function calculate(operation, left, right) {
  if (!Object.prototype.hasOwnProperty.call(operations, operation)) {
    throw new Error(`Unsupported operation: ${operation}`);
  }
  const operationHandler = operations[operation];

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Operands must be finite numbers");
  }
  if (operation === "/" || operation === "÷" || operation === "divide") {
    if (right === 0) {
      throw new Error("Cannot divide by zero");
    }
  }

  return operationHandler(left, right);
}

if (require.main === module) {
  const [operation, leftInput, rightInput, ...extraArguments] =
    process.argv.slice(2);

  try {
    if (
      !operation ||
      leftInput === undefined ||
      rightInput === undefined ||
      extraArguments.length > 0
    ) {
      throw new Error(
        "Usage: node src/calculator.js <+|-|*|/|add|subtract|multiply|divide> <first> <second>",
      );
    }
    if (leftInput.trim() === "" || rightInput.trim() === "") {
      throw new Error("Operands must be finite numbers");
    }

    const left = Number(leftInput);
    const right = Number(rightInput);
    const result = calculate(operation, left, right);
    if (!Number.isFinite(result)) {
      throw new Error("The result is not a finite number");
    }

    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate };
