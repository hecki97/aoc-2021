const fs = require('fs/promises');

function solve(lines) {
  const input = lines.map((v) => Number(v));
  const [, result] = input.reduce(
    ([prevSum, count], v, i) => {
      if (i + 3 < input.length) {
        const sum = v + input[i + 1] + input[i + 2];
        return (sum > prevSum) ? [sum, count + 1] : [sum, count];
      }

      return [prevSum, count];
    },
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
