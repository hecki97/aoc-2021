const fs = require('fs/promises');

const CHUNK_PAIRS = {
  '{': '}',
  '(': ')',
  '[': ']',
  '<': '>',
};

const SCORE_TABLE = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

function readChar(stack, [char, ...rest]) {
  if (char) {
    if (Object.keys(CHUNK_PAIRS).includes(char)) {
      stack.push(char);
      return readChar(stack, rest);
    }

    if (Object.values(CHUNK_PAIRS).includes(char)) {
      const expected = CHUNK_PAIRS[stack.pop()];
      if (expected !== char) {
        console.error(`Expected ${expected}, but found ${char} instead.`);
        return SCORE_TABLE[char];
      }

      return readChar(stack, rest);
    }

    throw new Error(`Illegal character ${char} encountered`);
  }

  return 0;
}

function solve(lines) {
  const total = lines.reduce((sum, line) => sum + readChar([], line), 0);
  console.log(total);
  console.log();
}

async function solveForFile(filename) {
  let data;
  try {
    data = await fs.readFile(filename, 'utf8');
  } catch (err) {
    console.error(err);
  }

  const empty = /^\s*$/;
  const lines = data.split(/\r?\n/).filter((v) => !empty.test(v));

  solve(lines);
}

async function main() {
  await solveForFile('input-test.txt');
  await solveForFile('input.txt');
}

main();
