const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const { calculate } = require("../calculator");
const calculatorPath = path.join(__dirname, "..", "calculator.js");

test("calculates the four examples from the image", () => {
  assert.equal(calculate("+", 2, 3), 5);
  assert.equal(calculate("-", 10, 4), 6);
  assert.equal(calculate("*", 45, 2), 90);
  assert.equal(calculate("/", 20, 5), 4);
});

test("supports operation names and multiplication/division symbols", () => {
  assert.equal(calculate("add", 1, 2), 3);
  assert.equal(calculate("subtract", 5, 2), 3);
  assert.equal(calculate("multiply", 3, 4), 12);
  assert.equal(calculate("×", 3, 4), 12);
  assert.equal(calculate("divide", 9, 3), 3);
  assert.equal(calculate("÷", 9, 3), 3);
});

test("handles negative and fractional operands", () => {
  assert.equal(calculate("+", -2, 0.5), -1.5);
  assert.equal(calculate("-", -2, -3), 1);
  assert.equal(calculate("*", -2, 2.5), -5);
  assert.equal(calculate("/", -7.5, 2.5), -3);
});

test("rejects division by positive or negative zero", () => {
  for (const operation of ["/", "÷", "divide"]) {
    assert.throws(() => calculate(operation, 1, 0), {
      message: "Cannot divide by zero",
    });
    assert.throws(() => calculate(operation, 1, -0), {
      message: "Cannot divide by zero",
    });
  }
});

test("rejects unsupported operations", () => {
  for (const operation of ["%", "power", "constructor"]) {
    assert.throws(() => calculate(operation, 2, 3), {
      message: `Unsupported operation: ${operation}`,
    });
  }
});

test("rejects non-finite operands", () => {
  for (const operand of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculate("+", operand, 1), {
      message: "Operands must be finite numbers",
    });
    assert.throws(() => calculate("+", 1, operand), {
      message: "Operands must be finite numbers",
    });
  }
});

test("CLI prints a result for a valid operation", () => {
  const result = spawnSync(
    process.execPath,
    [calculatorPath, "*", "45", "2"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "90\n");
  assert.equal(result.stderr, "");
});

test("CLI reports division by zero and invalid input", () => {
  const divisionByZero = spawnSync(
    process.execPath,
    [calculatorPath, "/", "20", "0"],
    { encoding: "utf8" },
  );
  assert.equal(divisionByZero.status, 1);
  assert.match(divisionByZero.stderr, /Cannot divide by zero/);

  const invalidInput = spawnSync(
    process.execPath,
    [calculatorPath, "+", "not-a-number", "2"],
    { encoding: "utf8" },
  );
  assert.equal(invalidInput.status, 1);
  assert.match(invalidInput.stderr, /Operands must be finite numbers/);
});

test("CLI displays usage when arguments are missing", () => {
  const result = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage: node src\/calculator\.js/);
});
