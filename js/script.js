const screen = document.querySelector('span.screen');
const operatorButtons = document.querySelectorAll('button.operator')
const numberButtons = document.querySelectorAll('button.number');
const deleteButton = document.querySelector('button.backspace');
const clearButton = document.querySelector('button.clear');

const calculator = {
    screen: '0',
    memory: 0,
    lastOperator: null,
    waitingForNewOperand: false,
    evaluate(operator) {
        const operand = +this.screen;
        if (this.waitingForNewOperand) {
            this.lastOperator = operator;
            return;
        }
        switch (this.lastOperator) {
            case '+':
                this.memory += operand;
                break;
            case '-':
                this.memory -= operand;
                break;
            case 'x':
                this.memory *= operand;
                break;
            case '/':
                if (operand === 0) {
                    this.waitingForNewOperand = true;
                    this.lastOperator = null;
                    this.screen = 'error!';
                    return;
                }
                this.memory /= operand;
                break;
            case '=':
            case null:
                this.memory = operand;
                break;
        }

        if (this.memory.toFixed(0).toString().length > 9) { // result is too big
            this.waitingForNewOperand = true;
            this.lastOperator = null;
            this.screen = 'error!';
            return;
        }

        this.screen = this.memory.toString().length > 9 ?  // decimal places won't fit
            this.memory.toString().split('').slice(0, 9).join('') :
            this.screen = this.memory.toString();
        this.waitingForNewOperand = operator === '=' ? false : true;
        this.lastOperator = operator;
    },
    appendChar(char) {
        if (this.screen.length >= 9 && !this.waitingForNewOperand) return;
        if (char === '0' && screenText === '0') return;

        if (char >= 0 && char <= 9) {
            if (this.screen === '0' || this.waitingForNewOperand) {
                this.waitingForNewOperand = false;
                this.screen = char;
            } else {
                this.screen += char;
            }
        } else if (char === '.') {
            if (screen.textContent.includes('.')) return;

            this.screen += '.';
        }
    },
    clear() {
        this.screen = '0';
        this.memory = 0;
        this.lastOperator = null;
        this.waitingForNewOperand = false;
    },
    backspace() {
        if (this.screen.length > 1) {
            this.screen = this.screen.split('').slice(0, -1).join('');
        } else {
            this.screen = '0';
        }
    }
};

document.addEventListener('keydown', keyDownHandler);
operatorButtons.forEach(button => button.addEventListener('click', arithmeticHandler));
numberButtons.forEach(button => button.addEventListener('click', numberClickHandler));
clearButton.addEventListener('click', clearButtonHandler);
deleteButton.addEventListener('click', backspaceButtonHandler);

function keyDownHandler(event) {
    const char = String.fromCharCode(event.keyCode);
    if (event.shiftKey === true) {
        if (event.keyCode === 187) {
            calculator.evaluate('+');
        } else if (event.keyCode === 56) {
            calculator.evaluate('x');
        }
    } else if (char >= 0 && char <= 9) {
        calculator.appendChar(char);
    } else if (event.keyCode === 190) {
        calculator.appendChar('.');
    } else if (char === '\b') {
        calculator.backspace();
    } else if (char === 'C') {
        calculator.clear();
    } else if (event.keyCode === 187) {
        calculator.evaluate('=');
    } else if (event.keyCode === 189) {
        calculator.evaluate('-');
    } else if (event.keyCode === 191) {
        calculator.evaluate('/');
    }
    screen.textContent = calculator.screen;
}

function numberClickHandler(event) {
    calculator.appendChar(this.textContent);
    screen.textContent = calculator.screen;
}

function arithmeticHandler(event) {
    const operator = this.textContent;
    calculator.evaluate(operator);
    screen.textContent = calculator.screen;
}

function clearButtonHandler() {
    calculator.clear();
    screen.textContent = calculator.screen;
}

function backspaceButtonHandler() {
    calculator.backspace();
    screen.textContent = calculator.screen;
}