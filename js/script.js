const calculator = {
    memory: 0,
    waitingForNewOperator: false,
    add(val) {
        this.memory += val;
        this.waitingForNewOperator = true;
        return this.memory;
    },
    subtract(val) {
        this.memory -= val;
        this.waitingForNewOperator = true;
        return this.memory;
    },
    multiply(val) {
        this.memory *= val;
        this.waitingForNewOperator = true;
        return this.memory;
    },
    divide(val) {
        this.memory /= val;
        this.waitingForNewOperator = true;
        return this.memory;
    },
    clear() {
        this.memory = 0;
        this.waitingForNewOperator = false;
        return this.memory;
    }
};

const display = document.querySelector('.display');
document.addEventListener('keydown', keyDownHandler);

function keyDownHandler(event) {
    if (event.keyCode < 49 || event.keyCode > 57) return;
    if (display.textContent.length >= 9) return;
    if (event.keyCode === 49 && +display.textContent === 0) return;

    const number = event.keyCode - 49;
    display.textContent += number;
}