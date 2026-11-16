// Supports addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^), and square root (sqrt).
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
  "%": (left, right) => left % right,
  modulo: (left, right) => left % right,
  "^": (left, right) => left ** right,
  power: (left, right) => left ** right,
};

function calculate(operation, left, right) {
  const isSquareRoot = operation === "sqrt" || operation === "√";
  if (
    !isSquareRoot &&
    !Object.prototype.hasOwnProperty.call(operations, operation)
  ) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  if (!Number.isFinite(left)) {
    throw new Error("Operands must be finite numbers");
  }
  if (isSquareRoot) {
    if (right !== undefined) {
      throw new Error("Square root accepts one operand");
    }
    if (left < 0) {
      throw new Error("Cannot take the square root of a negative number");
    }
    return Math.sqrt(left);
  }
  if (!Number.isFinite(right)) {
    throw new Error("Operands must be finite numbers");
  }
  if (operation === "/" || operation === "÷" || operation === "divide") {
    if (right === 0) {
      throw new Error("Cannot divide by zero");
    }
  }
  if (operation === "%" || operation === "modulo") {
    if (right === 0) {
      throw new Error("Cannot modulo by zero");
    }
  }

  const result = operations[operation](left, right);
  if (!Number.isFinite(result)) {
    throw new Error("The result is not a finite number");
  }
  return result;
}

if (require.main === module) {
  const [operation, ...operandInputs] = process.argv.slice(2);
  const isSquareRoot = operation === "sqrt" || operation === "√";
  const expectedOperandCount = isSquareRoot ? 1 : 2;

  try {
    if (
      !operation ||
      operandInputs.length !== expectedOperandCount
    ) {
      throw new Error(
        "Usage: node src/calculator.js <+|-|*|/|%|^|add|subtract|multiply|divide|modulo|power|sqrt> <operand> [second operand]",
      );
    }
    if (operandInputs.some((input) => input.trim() === "")) {
      throw new Error("Operands must be finite numbers");
    }

    const operands = operandInputs.map(Number);
    const result = calculate(operation, ...operands);
    console.log(result);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate };
