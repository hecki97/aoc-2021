const fs = require('fs/promises');

function calcNewPos(oldPos, direction, val) {
  const [horizontalPos, depth, aim] = oldPos;
  switch (direction) {
    case 'forward':
      return [horizontalPos + val, depth + aim * val, aim];
    case 'down':
      return [horizontalPos, depth, aim + val];
    case 'up':
      return [horizontalPos, depth, aim - val];
    default:
      throw new Error(`Invalid direction '${direction}' encountered!`);
  }
}

function solve(lines) {
  const input = lines.map((line) => {
    // Splits a line into its direction and value
    const [, direction, value] = line.match(/(.*?)\s+(\d+)/);
    return [direction, Number(value)];
  });

  const [horizontalPos, depth] = input.reduce(
    (prevPos, [direction, val]) => calcNewPos(prevPos, direction, val),
    [0, 0, 0],
  );

  console.log(
    'After following these instructions,'
    + ` you would have a horizontal position of ${horizontalPos} and a depth of ${depth}.`
    + ` (Multiplying these together produces ${horizontalPos * depth})`,
  );
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
