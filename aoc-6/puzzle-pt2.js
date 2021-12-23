const fs = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const { Transform } = require('stream');

const INPUT_PATH = './tmp.txt';
const OUTPUT_PATH = './tmp~2.txt';

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

async function simulateSockets(lanternfish) {
  const timer = lanternfish.map((fish) => fish.timer);
  await fs.writeFile(INPUT_PATH, timer.join(''), { encoding: 'binary' });

  for await (const i of Array(156).keys()) {
    //await new Promise((resolve) => {
      let count = 0;
      const batchAppend = [];

      const readStream = createReadStream(INPUT_PATH, { encoding: 'ascii' });
      const writeStream = createWriteStream(OUTPUT_PATH, { encoding: 'binary' });

      const transform = new Transform({
        transform(chunk, encoding, callback) {
          const n = Number(chunk);
          if (n === 0) {
            batchAppend.push(8);
            this.push('6');
            count += 1;
          } else {
            this.push(String(n - 1));
          }

          count += 1;
          callback();
        },
      });

      readStream
        .pipe(transform)
        .pipe(writeStream);

      readStream.on('readable', () => {
        let chunk;
        while (null !== (chunk = readStream.read(1))) {
          const n = Number(chunk);
          if (n === 0) {
            batchAppend.push(8);
            writeStream.write('6');
            count += 1;
          } else {
            writeStream.write(String(n - 1));
          }

          count += 1;
        }
      });

      readStream.on('end', async () => {
        if ((i + 1) % 10 === 0) {
          console.log(`After ${i + 101} days there would be ${count} lanternfish`);
        }

        writeStream.write(batchAppend.join(''));

        readStream.close();
        writeStream.close();

        await fs.rm(INPUT_PATH);
        await fs.rename(OUTPUT_PATH, INPUT_PATH);
        resolve();
      });
    //});
  }
  console.log();
}

function solve(initialTimers) {
  const fishs = initialTimers.map((timer) => createLanternFish(timer));
  console.log(`Initial state: ${initialTimers}`);

  for (let i = 0; i < 100; i += 1) {
    fishs.forEach((fish) => {
      if (fish.decrease()) {
        fishs.push(fish.successor);
      }
    });

    if ((i + 1) % 10 === 0) {
      console.log(`After ${i + 1} days there would be ${fishs.length} lanternfish`);
    }
  }

  simulateSockets(fishs);
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
  //await solveForFile('input.txt');
}

main();
