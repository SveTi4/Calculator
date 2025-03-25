class THistory {
    constructor() {
        this._operations = [];  // Массив для хранения операций
        this._currentIndex = -1; // Индекс текущей операции
    }

    // Добавить операцию в историю
    add(operation) {
        // Удаляем все операции после текущей позиции
        this._operations.splice(this._currentIndex + 1);
        
        // Добавляем новую операцию
        this._operations.push(operation);
        this._currentIndex = this._operations.length - 1;
        
        return this._currentIndex;
    }

    // Получить предыдущую операцию (Undo)
    getPrevious() {
        if (this._currentIndex > 0) {
            this._currentIndex--;
            return this._operations[this._currentIndex];
        }
        return null;
    }

    // Получить следующую операцию (Redo)
    getNext() {
        if (this._currentIndex < this._operations.length - 1) {
            this._currentIndex++;
            return this._operations[this._currentIndex];
        }
        return null;
    }

    // Очистить историю
    clear() {
        this._operations = [];
        this._currentIndex = -1;
    }

    // Получить текущую операцию
    getCurrent() {
        if (this._currentIndex >= 0) {
            return this._operations[this._currentIndex];
        }
        return null;
    }

    // Получить все операции
    getAll() {
        return [...this._operations];
    }
}

// Структура для хранения операции
class HistoryOperation {
    constructor(type, operand1, operand2, result) {
        this.type = type;         // Тип операции (Add, Sub, Mul, Div)
        this.operand1 = operand1; // Первый операнд
        this.operand2 = operand2; // Второй операнд
        this.result = result;     // Результат операции
        this.timestamp = new Date(); // Время выполнения операции
    }

    toString() {
        return `${this.operand1} ${this.type} ${this.operand2} = ${this.result}`;
    }
}

module.exports = { THistory, HistoryOperation }; 