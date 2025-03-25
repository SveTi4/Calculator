const AEditor = require('./AEditor');

class TPNumberEditor extends AEditor {
    constructor(notation = 10, precision = 5) {
        super();
        this.notation = notation;
        this.precision = precision;
        this._buffer = '0';  // Строковый буфер для ввода
        this._isEditingFraction = false;
    }

    get number() {
        return this._buffer;
    }

    edit(command) {
        const handlers = {
            '0': () => this._addDigit(0),
            '1': () => this._addDigit(1),
            '2': () => this._addDigit(2),
            '3': () => this._addDigit(3),
            '4': () => this._addDigit(4),
            '5': () => this._addDigit(5),
            '6': () => this._addDigit(6),
            '7': () => this._addDigit(7),
            '8': () => this._addDigit(8),
            '9': () => this._addDigit(9),
            'A': () => this._addDigit(10),
            'B': () => this._addDigit(11),
            'C': () => this._addDigit(12),
            'D': () => this._addDigit(13),
            'E': () => this._addDigit(14),
            'F': () => this._addDigit(15),
            'Sign': () => this._toggleSign(),
            'Separator': () => this._addSeparator(),
            'BS': () => this._backspace(),
            'CE': () => this._clear()
        };

        return handlers[command]?.() || this.number;
    }

    _addDigit(digit) {
        if (digit >= this.notation) return this.number;

        const digitStr = digit.toString(this.notation).toUpperCase();
        
        if (this._buffer === '0' && !this._isEditingFraction) {
            this._buffer = digitStr;
        } else {
            this._buffer += digitStr;
        }
        
        return this.number;
    }

    _toggleSign() {
        if (this._buffer === '0') return this.number;
        
        if (this._buffer.startsWith('-')) {
            this._buffer = this._buffer.slice(1);
        } else {
            this._buffer = '-' + this._buffer;
        }
        return this.number;
    }

    _addSeparator() {
        if (!this._buffer.includes('.')) {
            this._isEditingFraction = true;
            this._buffer += '.';
        }
        return this.number;
    }

    _backspace() {
        // Если осталась только одна цифра или минус с цифрой
        if (this._buffer.length === 1 || 
            (this._buffer.length === 2 && this._buffer.startsWith('-'))) {
            this._buffer = '0';
            this._isEditingFraction = false;
            return this.number;
        }

        // Удаляем последний символ
        const lastChar = this._buffer[this._buffer.length - 1];
        this._buffer = this._buffer.slice(0, -1);

        // Если удалили точку
        if (lastChar === '.') {
            this._isEditingFraction = false;
        }
        // Если после удаления не осталось точки
        else if (!this._buffer.includes('.')) {
            this._isEditingFraction = false;
        }

        // Если после удаления остался только минус, заменяем на ноль
        if (this._buffer === '-') {
            this._buffer = '0';
        }

        return this.number;
    }

    _clear() {
        this._buffer = '0';
        this._isEditingFraction = false;
        return this.number;
    }
}

module.exports = TPNumberEditor;