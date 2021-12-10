const fs = require('fs/promises');

function solve(lines) {
  const input = lines.map((v) => Number(v));
  const [, result] = input.reduce(
    ([pv, sum], v) => ((v > pv) ? [v, sum + 1] : [v, sum]),
    [input[0], 0],
  );

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
