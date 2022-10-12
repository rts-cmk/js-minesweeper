import MineBoard from "./mine-board.js";

let uiContainer = document.createElement('div');
let resetButton = document.createElement('button');
let mineCountLabel= document.createElement('label');
let mineCountInput = document.createElement('input');
let boardSizeLabel = document.createElement('label');
let boardSizeInput = document.createElement('input');
let board = new MineBoard();

resetButton.textContent = 'Reset';
mineCountLabel.textContent = '💣';
mineCountInput.type = 'number';
mineCountInput.value = board.minesRemaining;

boardSizeLabel.textContent = '📏';
boardSizeInput.type = 'number';
boardSizeInput.value = board.width;

uiContainer.classList.add('mine-ui-container');

document.body.appendChild(board.element);
document.body.appendChild(uiContainer);
uiContainer.appendChild(resetButton);
uiContainer.appendChild(mineCountLabel);
uiContainer.appendChild(boardSizeLabel);
mineCountLabel.appendChild(mineCountInput);
boardSizeLabel.appendChild(boardSizeInput);

resetButton.addEventListener('click', () => board.reset());

[mineCountLabel, boardSizeInput].forEach(input => input.addEventListener('change', () => {
    let oldBoardElement = board.element;
    board = new MineBoard(+boardSizeInput.value, +boardSizeInput.value, mineCountInput.value);
    document.body.replaceChild(board.element, oldBoardElement);

    resetButton.addEventListener('click', () => board.reset());
}));