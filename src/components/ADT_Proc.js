class ADT_Proc {
    constructor() {
        this._operations = {
            'Add': (a, b) => a.add(b),
            'Sub': (a, b) => a.sub(b),
            'Mul': (a, b) => a.mul(b),
            'Div': (a, b) => {
                if (b.getNumber() === 0) {
                    throw new Error('Division by zero');
                }
                return a.div(b);
            }
        };
    }

    execute(operation, leftOperand, rightOperand) {
        if (!this._operations[operation]) {
            throw new Error(`Unknown operation: ${operation}`);
        }

        try {
            return this._operations[operation](leftOperand, rightOperand);
        } catch (error) {
            throw new Error(`Operation error: ${error.message}`);
        }
    }
}

// Константы для операций
const Operations = {
    Add: 'Add',
    Sub: 'Sub',
    Mul: 'Mul',
    Div: 'Div'
};

module.exports = { ADT_Proc, Operations }; 