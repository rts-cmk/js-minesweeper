import MineBoard from "./mine-board.js";

let resetButton = document.createElement('button');
let board = new MineBoard();

resetButton.addEventListener('click', () => board.reset());

resetButton.textContent = 'Reset';
resetButton.classList.add('mine-button');

document.body.appendChild(board.element);
document.body.appendChild(resetButton);
