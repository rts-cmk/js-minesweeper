export default class Timer extends EventTarget {
        
    #currentTime;
    #interval;

    get value() { return this.#currentTime };
    get timeCode() { return Timer.formatTimeCode(this.#currentTime) };

    constructor(startTime = 0) {
        super();

        this.#currentTime = startTime;
        this.#interval = null;
    }

    start(reset = false) {
        
        clearInterval(this.#interval);

        this.dispatchEvent(new Event('start'));

        if (reset) this.reset();

        this.#interval = setInterval(() => {
            this.#currentTime++;

            this.dispatchEvent(new Event('tick'));
        }, 1000);
    }

    stop() {
        this.dispatchEvent(new Event('stop'));

        clearInterval(this.#interval);
    }

    reset() {
        this.dispatchEvent(new Event('reset'));
        
        this.#currentTime = 0;
        
        this.dispatchEvent(new Event('tick'));
    }

    static formatTimeCode(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
}