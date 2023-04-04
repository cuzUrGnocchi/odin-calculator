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