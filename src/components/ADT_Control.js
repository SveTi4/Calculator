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

        const currentNumber = this._parseEditorNumber();

        if (!this._hasFirstOperand) {
            // Сохраняем первый операнд
            this._memory.edit('Store', currentNumber);
            this._hasFirstOperand = true;
            this._currentOperation = operation;
            this._awaitingSecondOperand = true;
            return this.display;
        } else if (this._awaitingSecondOperand) {
            // Если второй операнд еще не введен, просто меняем операцию
            this._currentOperation = operation;
            return this.display;
        } else {
            // Выполняем предыдущую операцию
            const firstOperand = this._memory.value;
            const result = this._processor.execute(
                this._currentOperation,
                firstOperand,
                currentNumber
            );

            // Сохраняем результат и новую операцию
            this._memory.edit('Store', result);
            this._currentOperation = operation;
            this._awaitingSecondOperand = true;

            // Отображаем результат
            this._displayResult(result);
            return this.display;
        }
    }

    // Получение результата
    getResult() {
        if (!this._hasFirstOperand || !this._currentOperation) {
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

            // Сброс состояния
            this._hasFirstOperand = false;
            this._currentOperation = null;
            this._awaitingSecondOperand = true;

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
        // Убираем очистку памяти
        // this._memory.edit('Clear');
        this._currentOperation = null;
        this._hasFirstOperand = false;
        this._awaitingSecondOperand = false;
        return this.display;
    }
}

module.exports = { ADT_Control, Operations }; 