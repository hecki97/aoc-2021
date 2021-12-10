const fs = require('fs/promises');

function solve(lines) {
  let prevIndex = 0;
  let result = 0;
  const input = lines.map((v) => Number(v));
  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[prevIndex]) {
      result += 1;
    }
    prevIndex += 1;
  }

  console.log(`There are ${result} measurements that are larger than the previous one`);
}

async function solveForFile(filename) {
  let data;
  try {
    data = await fs.readFile(filename, 'utf8');
  } catch (err) {
    console.error(err);
  }

  const empty = /^\s$/;
  const lines = data.split(/\r?\n/).filter((v) => !empty.test(v));
  solve(lines);
}

async function main() {
  await solveForFile('input-test.txt');
  await solveForFile('input.txt');
}

main();
