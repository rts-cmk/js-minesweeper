import MineTile from "./mine-tile.js";

export default class MineBoard {
    get #DEFAULT_WIDTH() { return 9 };
    get #DEFAULT_HEIGHT() { return 9 };
    get #DEFAULT_MINES() { return 10 };

    #grid;
    #element;
    #initialMineCount;

    #firstTileProtection;

    get width() { return this.#grid[0].length };
    get height() { return this.#grid.length };
    get element() { return this.#element };
    get tiles() { return this.#grid.flat() };
    get minesRemaining() { 
        let mines = this.tiles.filter(tile => tile.value === MineTile.MINE).length;
        let flags = this.tiles.filter(tile => tile.flagged).length;
        return mines - flags > 0 ? mines - flags : 0;
    };

    get revealed() { return this.tiles.filter(tile => !tile.hidden).length };

    constructor(width = this.#DEFAULT_WIDTH, height = this.#DEFAULT_HEIGHT, mineCount = this.#DEFAULT_MINES) {

        this.#grid = this.#createGrid(width, height);
        this.#initialMineCount = mineCount > width * height ? width * height - 1 : mineCount;

        this.#element = document.createElement('div');
        this.#element.classList.add('mine-board');
        this.#element.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

        this.#firstTileProtection = true;

        this.#placeRandomMines(mineCount);

        this.tiles.forEach(tile => {
            this.#element.appendChild(tile.element);
            tile.element.addEventListener('flag', () => this.#element.dispatchEvent(new CustomEvent('flag')));

            tile.element.addEventListener('click', () => {

                if (this.#firstTileProtection && tile.value === MineTile.MINE) {
                    this.#getEmptyTile().value = MineTile.MINE;
                    tile.value = MineTile.EMPTY;
                    this.#updateTileValues();
                    tile.element.value = tile.value;
                    tile.reveal();
                }

                this.#firstTileProtection = false;

                if (tile.value === MineTile.EMPTY) this.#revealAdjacentTiles(tile)
                else if (tile.value === MineTile.MINE) {
                    this.#revealAll();
                    this.#element.dispatchEvent(new Event('game-over'));
                } else if (this.revealed === this.tiles.length - this.#initialMineCount) {
                    this.tiles.forEach(tile => { if (tile.value === MineTile.MINE) tile.flagged = true });
                    this.#element.dispatchEvent(new Event('game-won'));
                } else { console.log(this.revealed) }

            });
        });
    }

    #createGrid(width, height) {
        return Array(height).fill().map(() => Array(width).fill().map(() => new MineTile()));
    }

    #getEmptyTile() {
        let emptyTiles = this.tiles.filter(tile => tile.value !== MineTile.MINE);
        return emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    }


    #placeRandomMines(mineCount) {
        let tiles = this.tiles;

        if (mineCount > tiles.length) mineCount = tiles.length - 1;

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
        this.#firstTileProtection = true;
        this.tiles.forEach(tile => tile.reset());
        this.#placeRandomMines(this.#initialMineCount);
    }
}