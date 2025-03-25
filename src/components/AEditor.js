class AEditor {
    get number() {
        throw new Error("Method 'get number()' must be implemented.");
    }
    
    set number(value) {
        throw new Error("Method 'set number()' must be implemented.");
    }
    
    addNumber(num) {
        throw new Error("Method 'addNumber()' must be implemented.");
    }
    
    toggleMinus() {
        throw new Error("Method 'toggleMinus()' must be implemented.");
    }
    
    addSeparator() {
        throw new Error("Method 'addSeparator()' must be implemented.");
    }
    
    removeSymbol() {
        throw new Error("Method 'removeSymbol()' must be implemented.");
    }
    
    clear() {
        throw new Error("Method 'clear()' must be implemented.");
    }
    
    edit(command) {
        throw new Error("Method 'edit()' must be implemented.");
    }
}

module.exports = AEditor; 