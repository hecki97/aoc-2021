const fs = require('fs/promises');

function solve(lines) {
  const flattenedLines = lines.reduce(
    (prev, line) => {
      const bitArray = [...line].map((v) => Number(v));
      return prev.map((count, i) => count + bitArray[i]);
    },
    new Array(lines[0].length).fill(0),
  );

  const gamma = flattenedLines.map((count) => Number(count / lines.length > 0.5));
  const gammaStr = gamma.join('');
  const gammaDec = parseInt(gammaStr, 2);

  const epsilon = gamma.map((bit) => Number(!bit));
  const epsilonStr = epsilon.join('');
  const epsilonDec = parseInt(epsilonStr, 2);

  console.log(
    `The gamma rate is the binary number ${gammaStr}, or ${gammaDec} in decimal.\n`
    + `The epsilon rate is the binary number ${epsilonStr}, or ${epsilonDec} in decimal.\n`
    + `Multiplying the gamma rate (${gammaDec}) by the epsilon rate (${epsilonDec}) produces the power consumption, ${gammaDec * epsilonDec}.\n`,
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
