const TPNumber = require('./TPNumber');
const TPNumberEditor = require('./TPNumberEditor');
const { TMemory } = require('./TMemory');
const { ADT_Proc, Operations } = require('./ADT_Proc');

class ADT_Control {
    constructor(notation = 10, precision = 5) {
        // Инициализация компонентов
        this._editor = new TPNumberEditor(notation, precision);
        this._memory = new TMemory(TPNumber);
        this._processor = new ADT_Proc();
        
        // Параметры
        this.notation = notation;
        this.precision = precision;
        
        // Состояние калькулятора
        this._currentOperation = null;
        this._hasFirstOperand = false;
        this._awaitingSecondOperand = false;
        this._lastOperation = null;  // Сохраняем последнюю операцию
        this._lastOperand = null;    // Сохраняем последний операнд
    }

    // Получение текущего отображаемого значения
    get display() {
        return this._editor.number;
    }

    // Обработка команд редактирования
    editNumber(command) {
        // Если начинаем новый ввод после результата или второго операнда
        if (this._awaitingSecondOperand) {
            this._editor.edit('CE');
            this._awaitingSecondOperand = false;
        }
        
        return this._editor.edit(command);
    }

    // Обработка операций
    setOperation(operation) {
        // Проверяем, что операция допустима
        if (!Operations[operation]) {
            throw new Error(`Unknown operation: ${operation}`);
        }

        if (this._awaitingSecondOperand) {
            // Если ждем второй операнд, но получили операцию,
            // используем текущее значение как второй операнд
            this._lastOperand = this._parseEditorNumber();
            this.getResult();
        }

        const currentNumber = this._parseEditorNumber();
        this._memory.edit('Store', currentNumber);
        this._currentOperation = operation;
        this._lastOperation = operation;
        this._hasFirstOperand = true;
        this._awaitingSecondOperand = true;
        return this.display;
    }

    // Получение результата
    getResult() {
        if (!this._hasFirstOperand && this._lastOperation && this._lastOperand) {
            // Случай 2: операция с одним операндом (5 * = 25)
            const currentNumber = this._parseEditorNumber();
            const result = this._processor.execute(
                this._lastOperation,
                currentNumber,
                this._lastOperand
            );
            this._displayResult(result);
            return this.display;
        }

        if (!this._hasFirstOperand || !this._currentOperation) {
            if (this._lastOperation && this._lastOperand) {
                // Случай 3: повторное выполнение последней операции
                const currentNumber = this._parseEditorNumber();
                const result = this._processor.execute(
                    this._lastOperation,
                    currentNumber,
                    this._lastOperand
                );
                this._displayResult(result);
            }
            return this.display;
        }

        const firstOperand = this._memory.value;
        const secondOperand = this._parseEditorNumber();
        
        try {
            const result = this._processor.execute(
                this._currentOperation,
                firstOperand,
                secondOperand
            );

            // Сохраняем операнд для повторного использования
            this._lastOperand = secondOperand;
            
            // Сброс состояния
            this._hasFirstOperand = false;
            this._currentOperation = null;
            this._awaitingSecondOperand = false;

            // Отображаем результат
            this._displayResult(result);
            return this.display;
        } catch (error) {
            this.clear();
            throw error;
        }
    }

    // Преобразование строки из редактора в TPNumber
    _parseEditorNumber() {
        return new TPNumber(
            this._editor.number,
            this.notation,
            this.precision
        );
    }

    // Отображение результата в редакторе
    _displayResult(result) {
        this._editor.edit('CE');
        const resultStr = result.toString();
        
        // Обрабатываем целую часть и знак
        if (resultStr.startsWith('-')) {
            // Для отрицательных чисел сначала вводим число, потом знак
            for (const char of resultStr.slice(1)) {
                if (char === '.') break;
                this._editor.edit(char);
            }
            this._editor.edit('Sign');
        } else {
            // Для положительных просто вводим цифры до точки
            for (const char of resultStr) {
                if (char === '.') break;
                this._editor.edit(char);
            }
        }

        // Добавляем десятичную точку и дробную часть, если есть
        const parts = resultStr.split('.');
        if (parts.length > 1) {
            this._editor.edit('Separator');
            for (const digit of parts[1]) {
                this._editor.edit(digit);
            }
        }
    }

    // Очистка калькулятора
    clear() {
        this._editor.edit('CE');
        this._currentOperation = null;
        this._hasFirstOperand = false;
        this._awaitingSecondOperand = false;
        // Не очищаем _lastOperation и _lastOperand
        return this.display;
    }
}

module.exports = { ADT_Control, Operations }; 