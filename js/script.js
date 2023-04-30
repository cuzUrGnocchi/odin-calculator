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
    errorOccurred: false,
    
    evaluate: function evaluate(operator) {
        let result;
        const operand = +this.screen;

        if (this.lastOperator === '/' && operand === 0) {
            this.memory = 0;
            this.screen = 'error!';
            this.lastOperator = null;
            this.waitingNewOperand = true;
            this.errorOccurred = true;
            return;
        }
        if (this.waitingNewOperand) {
            this.lastOperator = operator;
            return;
        }
        switch (this.lastOperator) {
            case '+':
                result = this.memory + operand;
                break;
            case '-':
                result = this.memory - operand;
                break;
            case 'x':
                result = this.memory * operand;
                break;
            case '/':
                result = this.memory / operand;
                break;
            case '=':
            case null:
                result = operand;
                break;
        }

        // treat a result that is too big or too small for the screen as an error 
        if (result.toFixed(0).length > 9 || (result > 0 && result < 1 && parseFloat(result.toFixed(7)) === 0)) {
            this.memory = 0;
            this.screen = 'error!';
            this.lastOperator = null;
            this.waitingNewOperand = true;
            this.errorOccurred = true;
            return;
        }
        
        this.memory = result;
        // make sure result doesn't overflow on screen with too many decimal digits and remove scientific notation
        this.screen = result.toString().length > 9 || result.toString().includes('e')
                ? result.toFixed(7)
                : result.toString();
        this.lastOperator = operator;
        this.waitingNewOperand = operator === '=' ? false : true;
        this.errorOccurred = false;
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

        this.errorOccurred = false;
    },

    clear: function clear() {
        this.memory = 0;
        this.screen = '0';
        this.lastOperator = null;
        this.waitingNewOperand = false;
        this.errorOccurred = false;
    },

    backspace: function backspace() {
        if (this.errorOccurred) return;
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
    } else if (event.keyCode === 226) {
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

const numberPressHandler = function numberPressHandler(event) {
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
