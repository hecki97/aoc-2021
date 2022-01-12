const fs = require('fs/promises');

const CHUNK_PAIRS = {
  '{': '}',
  '(': ')',
  '[': ']',
  '<': '>',
};

const SCORE_TABLE = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
};

function parse(stack, [char, ...rest]) {
  if (char) {
    if (Object.keys(CHUNK_PAIRS).includes(char)) {
      stack.unshift(char);
      return parse(stack, rest);
    }

    if (Object.values(CHUNK_PAIRS).includes(char)) {
      const expected = CHUNK_PAIRS[stack.shift()];
      if (expected !== char) {
        console.error(`Expected ${expected}, but found ${char} instead.`);
        return false;
      }

      return parse(stack, rest);
    }

    throw new Error(`Illegal character ${char} encountered`);
  }

  return stack;
}

function solve(lines) {
  const calcLineCompletionScore = (line) => line.reduce((score, token) => score * 5 + SCORE_TABLE[token], 0);

  const totalScores = lines
    .map((line) => parse([], line))
    .filter((line) => Array.isArray(line))
    .map((line) => calcLineCompletionScore(line))
    .sort((a, b) => a - b);

  console.log(totalScores[Math.floor(totalScores.length / 2)]);
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
