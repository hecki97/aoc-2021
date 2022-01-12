const fs = require('fs/promises');

const INPUT_PATH = './tmp.txt';
const OUTPUT_PATH = './tmp~2.txt';

async function solve(initialTimers) {
  await fs.writeFile(INPUT_PATH, initialTimers.map((timer) => `1x${timer}`).join(''));

  for await (const i of Array(5).keys()) {
    let total = 0;
    let children = 0;

    const tmp = await fs.readFile(INPUT_PATH, { encoding: 'utf8' });
    const transformed = tmp.match(/\d+x\d/g).map((v) => {
      const [count, timer] = v.split('x').map((val) => Number(val));
      total += count;
      if (timer === 0) {
        children += count;
        return `${count}x6`;
      }

      return `${count}x${timer - 1}`;
    });

    if (children > 0) {
      transformed.push(`${children}x8`);
      total += children;
    }

    console.log(tmp);
    console.log(transformed);

    if ((i + 1) % 10 === 0) {
      console.log(`After ${i + 1} days there would be ${total} lanternfish`);
    }

    await fs.writeFile(OUTPUT_PATH, transformed.join(''));
    await fs.rm(INPUT_PATH);
    await fs.rename(OUTPUT_PATH, INPUT_PATH);
  }
}

async function solveForFile(filename) {
  let data;
  try {
    data = await fs.readFile(filename, 'utf8');
  } catch (err) {
    console.error(err);
  }

  const empty = /^\s*$/;
  const [line] = data.split(/\r?\n/).filter((v) => !empty.test(v));
  const initialTimers = line.split(',').map((v) => Number(v));

  solve(initialTimers);
}

async function main() {
  await solveForFile('input-test.txt');
  // await solveForFile('input.txt');
}

main();
