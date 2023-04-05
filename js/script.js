const display = document.querySelector('span.display');
const operatorButtons = document.querySelectorAll('button.operator')
const numberButtons = document.querySelectorAll('button.number');

const calculator = {
    memory: 0,
    lastOperator: null,
    waitingForNewOperand: false,
    evaluate(operator, val) {
        if (this.waitingForNewOperand) {
            this.lastOperator = operator;
            return this.memory;
        }
        switch (this.lastOperator) {
            case '+':
                this.memory += val;
                break;
            case '-':
                this.memory -= val;
                break;
            case 'x':
                this.memory *= val;
                break;
            case '/':
                this.memory /= val;
                break;
            case '=':
            case null:
                this.memory = val;
                break;
        }
        this.waitingForNewOperand = operator !== '=';
        this.lastOperator = operator;
        return this.memory;
    },
    clear() {
        this.memory = 0;
        this.waitingForNewOperand = false;
        return this.memory;
    }
};

operatorButtons.forEach(button => button.addEventListener('click', operationHandler));
numberButtons.forEach(button => button.addEventListener('click', numberInputHandler));

function numberInputHandler(event) {
    let input;
    if (event.type === 'keydown') {
        if (event.keyCode >= 49 && event.keyCode <= 57) {
            input = event.keyCode - 49;
        } else if (event.keyCode === 190) { // e.g. dot
            input = '.';
        }
    } else if (event.type === 'click') {
        input = this.textContent === '.' ? '.' : +this.textContent;
    }

    if (typeof input === 'number') {
        if (display.textContent.length >= 9 && !calculator.waitingForNewOperand) return;
        if (input === 0 && display.textContent === '0') return;
        
        if (display.textContent === '0' || calculator.waitingForNewOperand) {
            calculator.waitingForNewOperand = false;
            display.textContent = input;
        } else {
            display.textContent += input; 
        }
    } else if (input === '.') {
        if (display.textContent.includes('.')) return;
        
        display.textContent += '.';
    }
}

function operationHandler(event) {
    const numberInDisplay = +display.textContent;
    const operator = this.textContent;
    display.textContent = calculator.evaluate(operator, numberInDisplay);
}