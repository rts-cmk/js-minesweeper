import Timer from './timer.js';
import MineBoard from "./mine-board.js";

let uiContainerTop = document.createElement('div');
let uiContainerBottom = document.createElement('div');
let mineCounterElement = document.createElement('div');
let timerElement = document.createElement('div');
let resetButton = document.createElement('button');
let mineCountLabel= document.createElement('label');
let mineCountInput = document.createElement('input');
let boardSizeLabel = document.createElement('label');
let boardSizeInput = document.createElement('input');
let board = new MineBoard();
let timer = new Timer();

timerElement.textContent = '00:00';
resetButton.textContent = 'Reset';
mineCountLabel.textContent = '💣';
mineCountInput.type = 'number';
mineCountInput.value = board.minesRemaining;
mineCounterElement.textContent = board.minesRemaining;
boardSizeLabel.textContent = '📏';
boardSizeInput.type = 'number';
boardSizeInput.value = board.width;

uiContainerTop.classList.add('mine-ui-container');
uiContainerBottom.classList.add('mine-ui-container');

document.body.appendChild(uiContainerTop);
document.body.appendChild(board.element);
document.body.appendChild(uiContainerBottom);
uiContainerTop.appendChild(mineCounterElement);
uiContainerTop.appendChild(timerElement);
uiContainerBottom.appendChild(resetButton);
uiContainerBottom.appendChild(mineCountLabel);
uiContainerBottom.appendChild(boardSizeLabel);
mineCountLabel.appendChild(mineCountInput);
boardSizeLabel.appendChild(boardSizeInput);

resetButton.addEventListener('click', () => board.reset());
timer.addEventListener('tick', () => timerElement.textContent = timer.timeCode);

createBoardEventListeners(board);

[mineCountLabel, boardSizeInput].forEach(input => input.addEventListener('change', () => {
    let oldBoardElement = board.element;
    board = new MineBoard(+boardSizeInput.value, +boardSizeInput.value, mineCountInput.value);
    document.body.replaceChild(board.element, oldBoardElement);

    createBoardEventListeners(board);
}));

resetButton.addEventListener('click', () => {
    board.reset();
    timer.stop();
    timer.reset();
    mineCounterElement.textContent = board.minesRemaining;
});

function createBoardEventListeners(board) {
    board.element.addEventListener('click', () => timer.start(), { once: true });
    board.element.addEventListener('game-over', () => timer.stop());
    board.element.addEventListener('flag', () => mineCounterElement.textContent = board.minesRemaining < 10 ? `0${board.minesRemaining}` : board.minesRemaining);
    board.element.addEventListener('game-won', () => {
        timer.stop();
        setTimeout (() => alert('You won!'), 100);
    });
}
