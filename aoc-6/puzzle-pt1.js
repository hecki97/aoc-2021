const fs = require('fs/promises');

function createLanternFish(initialTimer) {
  return {
    timer: initialTimer,
    successor: null,
    decrease() {
      this.successor = null;

      if (this.timer === 0) {
        this.timer = 6;
        this.successor = createLanternFish(8);
        return true;
      }

      this.timer -= 1;
      return false;
    },
  };
}

function solve(initialTimers) {
  const fishs = initialTimers.map((timer) => createLanternFish(timer));
  console.log(`Initial state: ${initialTimers}`);

  for (let i = 0; i < 80; i += 1) {
    fishs.forEach((fish) => {
      if (fish.decrease()) {
        fishs.push(fish.successor);
      }
    });

    if ((i + 1) % 10 === 0) {
      console.log(`After ${i + 1} days there would be ${fishs.length} lanternfish`);
    }
  }

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
  const [line] = data.split(/\r?\n/).filter((v) => !empty.test(v));
  const initialTimers = line.split(',').map((v) => Number(v));

  solve(initialTimers);
}

async function main() {
  await solveForFile('input-test.txt');
  await solveForFile('input.txt');
}

main();
