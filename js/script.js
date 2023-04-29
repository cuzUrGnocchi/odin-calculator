const screen = document.querySelector('span.screen');
const operatorButtons = document.querySelectorAll('button.operator')
const numberButtons = document.querySelectorAll('button.number');
const deleteButton = document.querySelector('button.backspace');
const clearButton = document.querySelector('button.clear');

const calculator = {
    memory: 0,
    screen: '0',
    lastOperator: null,
    waitingNewOperand: false,
    
    evaluate: function evaluate(operator) {
        const operand = +this.screen;
        if (this.operator === '/' && operand === 0) {
            this.memory = 0;
            this.screen = 'error!';
            this.lastOperator = null;
            this.waitingNewOperand = true;
            return;
        }
        if (this.waitingNewOperand) {
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
                this.memory /= operand;
                break;
            case '=':
            case null:
                this.memory = operand;
                break;
        }
        if (this.memory.toFixed(0).toString().length > 9) {
            this.memory = 0;
            this.screen = 'error!';
            this.lastOperator = null;
            this.waitingNewOperand = true;
        } else {
            this.screen = this.memory.toString().length > 9
                    ? this.memory.toString().split('').slice(0, 9).join('')
                    : this.memory.toString();
            this.lastOperator = operator;
            this.waitingNewOperand = operator === '=' ? false : true;
        }
    },

    appendChar: function appendChar(input) {
        if (/[0-9.]/.test(input) === false) return;
        if (input === '0' && this.screen === '0') return;
        if (!this.waitingNewOperand && this.screen.length >= 9) return;

        if (input >= 0 && input <= 9) {
            if (this.screen === '0' || this.waitingNewOperand) {
                this.screen = input;
                this.waitingNewOperand = false;
            } else {
                this.screen += input;
            }
        } else if (input === '.') {
            if (screen.textContent.includes('.')) return;
            this.screen += '.';
        }
    },

    clear: function clear() {
        this.memory = 0;
        this.screen = '0';
        this.lastOperator = null;
        this.waitingNewOperand = false;
    },

    backspace: function backspace() {
        this.screen = this.screen.length > 1 
                ? this.screen.split('').slice(0, -1).join('')
                : '0';
    }
};

const keyDownHandler = function keyDownHandler(event) {
    const char = String.fromCharCode(event.keyCode);
    if (event.shiftKey && event.keyCode === 187) {
        calculator.evaluate('+');
    } else if (event.shiftKey && event.keyCode === 56) {
        calculator.evaluate('x');
    } else if (event.keyCode === 189) {
        calculator.evaluate('-');
    } else if (event.keyCode === 191) {
        calculator.evaluate('/');
    } else if (event.keyCode === 187 || event.keyCode === 13) {
        calculator.evaluate('=');
    } else if (char >= 0 && char <= 9) {
        calculator.appendChar(char);
    } else if (event.keyCode === 190) {
        calculator.appendChar('.');
    } else if (char === '\b') {
        calculator.backspace();
    } else if (char === 'C') {
        calculator.clear();
    }
    screen.textContent = calculator.screen;
}

const numberPressHandlerfunction = function numberPressHandler(event) {
    calculator.appendChar(this.textContent);
    screen.textContent = calculator.screen;
}

const arithmeticPressHandler = function arithmeticPressHandler(event) {
    const operator = this.textContent;
    calculator.evaluate(operator);
    screen.textContent = calculator.screen;
}

const clearPressHandler = function clearPressHandler() {
    calculator.clear();
    screen.textContent = calculator.screen;
}

const backspacePressHandler = function backspacePressHandler() {
    calculator.backspace();
    screen.textContent = calculator.screen;
}

document.addEventListener('keydown', keyDownHandler);
operatorButtons.forEach(button => button.addEventListener('click', arithmeticPressHandler));
numberButtons.forEach(button => button.addEventListener('click', numberPressHandler));
clearButton.addEventListener('click', clearPressHandler);
deleteButton.addEventListener('click', backspacePressHandler);
