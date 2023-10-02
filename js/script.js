class Calculator {
  constructor() {
    this.memory = 0;
    this.screen = '0';
    this.operator = null;
    this.waitingNewOperand = false;
    this.errorOccurred = false;
  }

  #clone() {
    const clone = new Calculator();
    clone.memory = this.memory;
    clone.screen = this.screen;
    clone.operator = this.operator;
    clone.waitingNewOperand = this.waitingNewOperand;
    clone.errorOccurred = this.errorOccurred;
    return clone;
  }
 
  #set (keyVal) {
    const next = this.#clone();
    const key = Object.keys(keyVal)[0];
    next[key] = keyVal[key];
    return next;
  }

  calculate(operator) {
    function issueError() {
      return new Calculator()
        .#set({ memory: 0 })
        .#set({ screen: 'error!' })
        .#set({ operator: null })
        .#set({ waitingNewOperand: true })
        .#set({ errorOccurred: true });
    }

    function formatResult(result) {
      const integerPart = +result.toString().split('.')[0];

      if (result.toString()[8] === '.') return integerPart;
      if (result < 0.0000001) return 'error!';

      if (result.toString().includes('e')) {
        if (result.toString().includes('-')) {
          return parseFloat(result.toFixed(7));
        }
      }

      if (result.toString().length > 9) {
        if (result.toString().includes('.')) {
          if (integerPart.toString().length > 10) return 'error!';
          return result.toFixed(8 - integerPart.toString().length);
        }
        return 'error!'
      }

      return result;
    }

    const operand = +this.screen;
    
    if (this.operator === '/' && operand === 0) {
      return issueError();
    }
    
    if (this.waitingNewOperand) {
      return this.#set({ operator: operator });
    }

    let result;

    switch (this.operator) {
      case '+':
        result = this.memory + operand;
        break;
      case '-':
        result = this.memory - operand;
        break;
      case 'x':
      case '*':
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

    result = formatResult(result);

    if (result === 'error!') {
      return issueError();
    }
    
    return this
      .#set({ memory: result })
      .#set({ screen: result })
      .#set({ operator })
      .#set({ waitingNewOperand: operator === '=' ? false : true })
      .#set({ errorOccurred: false });
  }

  appendChar(input) {
    if (!/[0-9.]/.test(input)) return this;
    if (!this.waitingNewOperand && this.screen.length >= 9) return this;
    if (input === '0' && this.screen === '0') return this;
    if (input === '.' && this.screen.includes('.')) return this;

    if (input >= 0 && input <= 9 && (this.screen === '0' || this.waitingNewOperand)) {
      return this
        .#set({ screen: input })
        .#set({ waitingNewOperand: false })
        .#set({ errorOccurred: false });
    }

    return this
      .#set({ screen: this.screen + input })
      .#set({ errorOccurred: false });
  }

  backspace() {
    if (this.errorOccurred) return this;
    return this.set({ screen: this.screen.length > 1 ? this.screen.split('').slice(0, -1).join('') : '0' });
  }

  clear() {
    return new Calculator();
  }
};

let calculator = new Calculator();

document.addEventListener('keydown', function(event) {
  if (['+', '-', 'x', '*', '/', '=', 'Enter'].includes(event.key)) {
    calculator = calculator.calculate(event.key === 'Enter' ? '=' : event.key);
  } else if (event.key >= 0 && event.key <= 9 || event.key === '.') {
    calculator = calculator.appendChar(event.key);
  } else if (event.key === 'Backspace') {
    calculator = calculator.backspace();
  } else if (event.key === 'C') {
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
