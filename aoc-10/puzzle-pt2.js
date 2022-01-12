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

function readChar(stack, [char, ...rest]) {
  if (rest.length > 0) {
    if (Object.keys(CHUNK_PAIRS).includes(char)) {
      stack.push(char);
      return readChar(stack, rest);
    }

    if (Object.values(CHUNK_PAIRS).includes(char)) {
      const expected = CHUNK_PAIRS[stack.pop()];
      if (expected !== char) {
        console.error(`Expected ${expected}, but found ${char} instead.`);
        return false;
      }

      return readChar(stack, rest);
    }

    throw new Error(`Illegal character ${char} encountered`);
  }

  return true;
}

function solve(lines) {
  const a = lines.reduce((nl, line) => {
    const stack = [];
    if (readChar(stack, line)) {
      nl.push(stack);
    }

    return nl;
  }, []);

  const total = a.map((line) => line.reduceRight((score, token) => score * 5 + SCORE_TABLE[token], 0));

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
  //await solveForFile('input.txt');
}

main();
