import MineTile from "./mine-tile.js";

export default class MineBoard {
    get #DEFAULT_WIDTH() { return 9 };
    get #DEFAULT_HEIGHT() { return 9 };
    get #DEFAULT_MINES() { return 10 };


    #grid;
    #element;
    #initialMineCount;

    get width() { return this.#grid[0].length };
    get height() { return this.#grid.length };
    get element() { return this.#element };
    get tiles() { return this.#grid.flat() };
    get minesRemaining() { return this.#grid.flat().filter(tile => tile.value === MineTile.MINE).length };

    constructor(width = this.#DEFAULT_WIDTH, height = this.#DEFAULT_HEIGHT, mineCount = this.#DEFAULT_MINES) {

        this.#grid = this.#createGrid(width, height);
        this.#initialMineCount = mineCount;

        this.#element = document.createElement('div');
        this.#element.classList.add('mine-board');
        this.#element.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

        this.#placeRandomMines(mineCount);

        this.tiles.forEach(tile => {
            this.#element.appendChild(tile.element)

            tile.element.addEventListener('click', () => {
                if (tile.value === MineTile.EMPTY) this.#revealAdjacentTiles(tile)
                else if (tile.value === MineTile.MINE) this.#revealAll();
            });
        });
    }

    #createGrid(width, height) {
        return Array(height).fill().map(() => Array(width).fill().map(() => new MineTile()));
    }

    #placeRandomMines(mineCount) {
        let tiles = this.tiles;

        for (let i = 0; i < mineCount; i++) {
            let randomIndex = Math.floor(Math.random() * tiles.length);
            tiles[randomIndex].value = MineTile.MINE;
            tiles.splice(randomIndex, 1);
        }

        this.#updateTileValues();
    }

    #updateTileValues() {
        this.tiles.forEach(tile => { if (tile.value !== MineTile.MINE) tile.value = this.#getAdjacentMineCount(tile) });
    }

    #getTileCoordinates(tile) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.#grid[y][x] === tile) {
                    return { x, y };
                }
            }
        }
    }

    #revealAdjacentTiles(tile) {
        this.#getAdjacentTiles(tile).forEach(tile => {
            if (tile.hidden) {
                tile.reveal();
                if (tile.value === MineTile.EMPTY) {
                    this.#revealAdjacentTiles(tile);
                }
            }
        });
    }

    #revealAll() {
        this.tiles.forEach(tile => tile.reveal());
    }

    #getAdjacentTiles(tile) {
        let { x, y } = this.#getTileCoordinates(tile);
        let adjacentTiles = [];

        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
                let tile = this.#grid[y + yOffset]?.[x + xOffset];
                if (tile) adjacentTiles.push(tile);
            }
        }

        return adjacentTiles;
    }

    #getAdjacentMineCount(tile) {
        return this.#getAdjacentTiles(tile).filter(tile => tile.value === MineTile.MINE).length;
    }

    reset() {
        this.tiles.forEach(tile => tile.reset());
        this.#placeRandomMines(this.#initialMineCount);
    }
}