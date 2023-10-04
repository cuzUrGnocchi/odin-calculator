const DIGIT_LIMIT = 9;

class Calculator {
  constructor() {
    this.leftOperand = 0;
    this.rightOperand = 0;
    this.screen = '0';
    this.queuedOperation = null;
    this.lastOperation = null;
    this.waitingNewOperand = false;
    this.errorOccurred = false;
  }

  #clone() {
    const clone = new Calculator();
    clone.leftOperand = this.leftOperand;
    clone.rightOperand = this.rightOperand;
    clone.screen = this.screen;
    clone.queuedOperation = this.queuedOperation;
    clone.lastOperation = this.lastOperation;
    clone.waitingNewOperand = this.waitingNewOperand;
    clone.errorOccurred = this.errorOccurred;
    return clone;
  }
 
  set (keyVal) {
    const next = this.#clone();
    const key = Object.keys(keyVal)[0];
    next[key] = keyVal[key];
    return next;
  }

  calculate(operation) {
    function issueError() {
      return new Calculator()
        .set({ leftOperand: 0 })
        .set({ rightOperand: 0 })
        .set({ screen: 'error!' })
        .set({ queuedOperation: null })
        .set({ lastOperation: null })
        .set({ waitingNewOperand: true })
        .set({ errorOccurred: true })
    }

    function formatResult(result) {
      if (result < 1 / 10**(DIGIT_LIMIT - 2) && result > 0) return 'error!';
      
      if (result.toString().includes('e')) {
        if (result.toString().includes('-')) {
          return parseFloat(result.toFixed(DIGIT_LIMIT - 2));
        }
      }
      
      if (result.toString().includes('.')) {
        const integerPart = +result.toString().split('.')[0];
        if (result.toString()[DIGIT_LIMIT - 1] === '.') {
          return integerPart;
        }
        if (result.toString().length > 9) {
          if (integerPart.toString().length > DIGIT_LIMIT) {
            return 'error!';  
          }
          
          return parseFloat(result.toFixed(DIGIT_LIMIT - integerPart.toString().length - 1));
        }
      }
      
      if (result.toString().length > DIGIT_LIMIT) return 'error!';

      return result;
    }
    
    if (this.queuedOperation === '/' && this.rightOperand === 0) {
      return issueError();
    }
    
    if (operation !== '=' && this.waitingNewOperand) {
      return this
        .set({ queuedOperation: operation })
        .set({ lastOperation: operation });
    }

    let result;

    if (this.lastOperation === '=' && operation !== '=') {
      result = +this.screen;
    } else {
      switch (this.queuedOperation) {
        case '+':
          result = this.leftOperand + this.rightOperand;
          break;
        case '-':
          result = this.leftOperand - this.rightOperand;
          break;
        case 'x':
        case '*':
          result = this.leftOperand * this.rightOperand;
          break;
        case '/':
          result = this.leftOperand / this.rightOperand;
          break;
        case null:
          result = this.leftOperand;
          break;
        }
      }
        
    result = formatResult(result);
        
    if (result === 'error!') {
      return issueError();
    }

    return this
      .set({ leftOperand: result })
      .set({ rightOperand: (operation === '=' && this.lastOperation === '=') ? this.rightOperand : +this.screen })
      .set({ screen: result })
      .set({ queuedOperation: operation === '=' ? this.queuedOperation : operation })
      .set({ lastOperation: operation })
      .set({ waitingNewOperand: true })
      .set({ errorOccurred: false });
  }

  appendChar(input) {
    if (!/[0-9.]/.test(input)) return this;
    if (!this.waitingNewOperand && this.screen.length >= DIGIT_LIMIT) return this;
    if (input === '0' && this.screen === '0') return this;
    if (input === '.' && this.screen.includes('.')) return this;

    let nextState = this.#clone();

    if (input >= 0 && input <= 9 && (this.screen === '0' || this.waitingNewOperand)) {
      nextState = nextState
        .set({ leftOperand: +this.screen })
        .set({ screen: input });
    } else {
      nextState = nextState
        .set({ screen: this.screen + input });
    }
    
    if (this.lastOperation === '=' || this.lastOperation === null) {
      nextState = nextState.set({ leftOperand: +(nextState.screen) });
    } else {
      nextState = nextState.set({ rightOperand: +(nextState.screen) });
    }

    return nextState
      .set({ waitingNewOperand: false })
      .set({ errorOccurred: false });
  }

  backspace() {
    if (this.errorOccurred) {
      return this;
    }
    if (this.screen.length === 1) {
      return this
        .set({ screen: '0' })
        .set({ rightOperand: 0 });
    }

    const screen = this.screen[this.screen.length - 2] === '.'
      ? this.screen.split('').slice(0, -2).join('')
      : this.screen.split('').slice(0, -1).join('');

    return this
      .set({ screen })
      .set({ rightOperand: +screen });
  }

  clear() {
    return new Calculator();
  }
};

let calculator = new Calculator();

document.querySelector('.screen').style.width = `calc(${ DIGIT_LIMIT }ch + 20px)`;

document.addEventListener('keydown', function(event) {
  if (['+', '-', 'x', '*', '/', '=', 'Enter'].includes(event.key)) {
    calculator = calculator.calculate(event.key === 'Enter' ? '=' : event.key);
  } else if (event.key >= 0 && event.key <= 9 || event.key === '.') {
    calculator = calculator.appendChar(event.key);
  } else if (event.key === 'Backspace') {
    calculator = calculator.backspace();
  } else if (event.key === 'c') {
    calculator = calculator.clear();
  }
  
  document.querySelector('span.screen').textContent = calculator.screen;
});

document.querySelectorAll('button.operator').forEach(button => button.addEventListener('click', function() {
  calculator = calculator.calculate(this.textContent);
  document.querySelector('span.screen').textContent = calculator.screen;
}));

document.querySelectorAll('button.number').forEach(button => button.addEventListener('click', function() {
  calculator = calculator.appendChar(this.textContent);
  document.querySelector('span.screen').textContent = calculator.screen;
}));

document.querySelector('button.clear').addEventListener('click', function() {
  calculator = calculator.clear();
  document.querySelector('span.screen').textContent = calculator.screen;
});

document.querySelector('button.backspace').addEventListener('click', function() {
  calculator = calculator.backspace();
  document.querySelector('span.screen').textContent = calculator.screen;
});
