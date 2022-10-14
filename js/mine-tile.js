export default class MineTile {

  static get EXPLOSION() { return '💥' };
  static get FALSE_FLAG() { return '🚩❌' }
  static get FLAG() { return '🚩' }
  static get MINE() { return '💣' }
  static get EMPTY() { return 0 }
  static get ONE() { return 1 }
  static get TWO() { return 2 }
  static get THREE() { return 3 }
  static get FOUR() { return 4 }
  static get FIVE() { return 5 }
  static get SIX() { return 6 }
  static get SEVEN() { return 7 }
  static get EIGHT() { return 8 }

  get #VALID_VALUES() {
    return [
      MineTile.MINE,
      MineTile.EMPTY,
      MineTile.ONE,
      MineTile.TWO,
      MineTile.THREE,
      MineTile.FOUR,
      MineTile.FIVE,
      MineTile.SIX,
      MineTile.SEVEN,
      MineTile.EIGHT
    ]
  };

  #value;
  #hidden;
  #element;

  get value() { return this.#value };
  set value(value) { this.#value = value };
  get element() { return this.#element };
  get hidden() { return this.#hidden };
  get flagged() { return this.#element.value === MineTile.FLAG };

  set flagged(value) {
    if (value) {
      this.#element.value = MineTile.FLAG;
      this.#element.dispatchEvent(new Event('flag'));
    } else this.#element.removeAttribute('value');
  }

  constructor(value = MineTile.EMPTY) {
    if (!this.#VALID_VALUES.includes(value)) {
      throw new Error(`Invalid tile value: ${value}`);
    } else {

      this.#value = value;
      this.#hidden = true;
      this.#element = document.createElement('input');
      this.#element.type = 'button';
      this.#element.classList.add('mine-tile');

      this.#element.addEventListener('click', () => {
        if (this.hidden && this.#value === MineTile.MINE) this.#element.value = MineTile.EXPLOSION;
        this.reveal();
      });

      this.#element.addEventListener('contextmenu', event => event.preventDefault());
      this.#element.addEventListener('mousedown', (e) => { if (e.button === 2) this.flag() }

      );
    }
  }

  flag() {
    if (this.#hidden && this.#element.value !== MineTile.EXPLOSION) {
      if (this.#element.value === MineTile.FLAG) this.#element.removeAttribute('value');
      else {
        this.#element.value = MineTile.FLAG;
      }
    }

    this.#element.dispatchEvent(new Event('flag'));
  }

  reveal() {
    if (this.#hidden && this.#element.value !== MineTile.EXPLOSION) {
      this.#hidden = false;

      if (this.#element.value === MineTile.FLAG && this.value !== MineTile.MINE) this.#element.value = MineTile.FALSE_FLAG;
      else if (this.#element.value !== MineTile.FLAG) this.#element.value = this.#value;
    }
  }

  reset() {
    this.#element.removeAttribute('value');
    this.#hidden = true;
    this.#value = MineTile.EMPTY;
  }
}