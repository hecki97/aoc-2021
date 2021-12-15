const fs = require('fs/promises');

function solve(drawOrder, boards) {
  const picks = [];
  let last;
  let unsolved = boards;
  for (const pick of drawOrder) {
    picks.push(pick);
    unsolved = unsolved.filter((board) => !board.checkBoard(picks));
    if (last) {
      const unmarkedSum = last.calculateUnmarked(picks);

      console.log(`The ${last.id + 1}th board is the one to win last after ${picks.length} picks`);
      console.log(`[${picks}]`);
      console.log(`${unmarkedSum} * ${pick} = ${unmarkedSum * pick}`);
      return;
    }

    if (unsolved.length === 1) {
      [last] = unsolved;
    }
  }
}

function parseData(data) {
  // Match all digits globally (don't return after first match) and cast them to a Number
  const parseRow = (row) => row.match(/(\d+)/g).map((v) => Number(v));
  // Convert string of digits into array and then cast them to a Number
  const parseDrawOrder = (order) => order.split(',').map((v) => Number(v));

  const getBoardObj = (lines, id) => ({
    id,
    rows: lines,
    columns: lines.map(
      (row, i) => row.map(
        (v, j) => lines[j][i],
      ),
    ),
    checkBoard(picks) {
      const testRows = (rows) => rows
        .map((row) => row.every((val) => picks.includes(val)))
        .some((row) => row);

      const testColumns = (columns) => columns
        .map((column) => column.every((val) => picks.includes(val)))
        .some((column) => column);

      return testRows(this.rows) || testColumns(this.columns);
    },
    calculateUnmarked(picks) {
      const unmarked = this.rows.reduce(
        (rv, row) => [...rv, ...row.filter((val) => !picks.includes(val))],
        [],
      );

      return unmarked.reduce((rv, v) => rv + v, 0);
    },
  });

  const slicedBoards = [];
  const [order, ...boardBlob] = data;

  for (let i = 0; i < boardBlob.length; i += 5) {
    slicedBoards.push(boardBlob.slice(i, i + 5));
  }

  const boards = slicedBoards.map(
    (board) => board.map((row) => parseRow(row)),
  );

  return [
    parseDrawOrder(order),
    boards.map((board, id) => getBoardObj(board, id)),
  ];
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
  const [drawOrder, boards] = parseData(lines);

  solve(drawOrder, boards);
}

async function main() {
  await solveForFile('input-test.txt');
  await solveForFile('input.txt');
}

main();
