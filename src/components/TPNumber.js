const ANumber = require('./ANumber');

class TPNumber extends ANumber {
    constructor(num = 0, notation = 10, precision = 5) {
        super();
        
        // Валидация параметров
        if (notation < 2 || notation > 16) {
            throw new Error('Основание должно быть между 2 и 16');
        }
        if (precision < 0) {
            throw new Error('Точность должна быть неотрицательной');
        }

        this.notation = notation;
        this.precision = precision;
        this.number = 0;

        // Инициализация значения
        if (typeof num === 'string') {
            this.setString(num);
        } else if (num instanceof TPNumber) {
            this.number = num.number;
            this.notation = num.notation;  // Сохраняем исходные параметры
            this.precision = num.precision;
        } else {
            this.number = Number(num);
        }
    }

    getNumber() {
        return this.number;
    }

    setNotation(newNotation) {
        if (newNotation < 2 || newNotation > 16) {
            throw new Error('Основание должно быть между 2 и 16');
        }

        // Получаем десятичное значение числа
        const decimalValue = this.number;

        // Создаем временный объект с новым основанием
        const tempNumber = new TPNumber(decimalValue, newNotation, this.precision);

        // Обновляем параметры текущего объекта
        this.notation = newNotation;
        this.number = tempNumber.number;
    }

    setPrecision(newPrecision) {
        if (newPrecision < 0) {
            throw new Error('Точность должна быть неотрицательной');
        }

        // Округление через toFixed(), которое учитывает точность лучше
        this.number = Number(this.number.toFixed(newPrecision));
        this.precision = newPrecision;
    }

    withNotation(newNotation) {
        const copy = new TPNumber(this);
        copy.setNotation(newNotation);
        return copy;
    }

    withPrecision(newPrecision) {
        const copy = new TPNumber(this.number, this.notation, this.precision);
        copy.setPrecision(newPrecision);
        return copy;
    }

    setString(str) {
        try {
            this.number = this.parseFromBase(str);
        } catch (e) {
            throw new Error(`Ошибка преобразования строки: ${e.message}`);
        }
    }

    parseFromBase(pNum) {
        const cleaned = pNum.trim().toUpperCase();
        if (!cleaned) return 0;

        let sign = 1;
        let numStr = cleaned;
        if (cleaned[0] === '-') {
            sign = -1;
            numStr = cleaned.slice(1);
        }

        const parts = numStr.split('.');
        const intPart = parts[0];
        const fracPart = parts[1];  // Убираем значение по умолчанию

        let integer = [...intPart].reduce((acc, char) => {
            const digit = this.charToValue(char);
            return acc * this.notation + digit;
        }, 0);

        let fraction = 0;
        if (fracPart) {  // Проверяем наличие дробной части
            fraction = [...fracPart].reduce((acc, char, idx) => {
                const digit = this.charToValue(char);
                return acc + digit * Math.pow(this.notation, -(idx + 1));
            }, 0);
        }

        return sign * (integer + fraction);
    }

    formatToBase() {
        const digits = '0123456789ABCDEF';
        let num = Math.abs(this.number);

        // Целая часть
        let intPart = Math.floor(num);
        let intStr = '';
        do {
            intStr = digits[intPart % this.notation] + intStr;
            intPart = Math.floor(intPart / this.notation);
        } while (intPart > 0);
        if (intStr === '') intStr = '0';

        // Дробная часть
        let fracStr = '';
        let frac = num - Math.floor(num);

        for (let i = 0; i < this.precision; i++) {
            frac *= this.notation;
            const digit = Math.floor(frac + 1e-10); // Избегаем ошибок округления
            fracStr += digits[digit];
            frac -= digit;
        }

        // Округляем последний разряд
        if (frac >= 0.5 / Math.pow(this.notation, this.precision)) {
            let carry = true;
            let fracArr = fracStr.split('').reverse();

            for (let i = 0; i < fracArr.length && carry; i++) {
                let digitValue = digits.indexOf(fracArr[i]) + 1;
                if (digitValue >= this.notation) {
                    fracArr[i] = '0';
                } else {
                    fracArr[i] = digits[digitValue];
                    carry = false;
                }
            }

            if (carry) {
                // Округление переполнилось — увеличиваем целую часть
                intStr = (parseInt(intStr, this.notation) + 1).toString(this.notation).toUpperCase();
                fracArr = [];
            }

            fracStr = fracArr.reverse().join('');
        }

        // Удаляем завершающие нули, но оставляем точку
        fracStr = fracStr.replace(/0+$/, '');
        const hasFraction = fracStr.length > 0 || this.number.toString().includes('.');

        // Сборка результата
        const sign = this.number < 0 ? '-' : '';
        return hasFraction
          ? `${sign}${intStr}.${fracStr}`
          : `${sign}${intStr}`;
    }


    // Арифметические операции
    add(other) {
        this.validateOperand(other);
        return this.createNew(this.number + other.number);
    }

    sub(other) {
        this.validateOperand(other);
        return this.createNew(this.number - other.number);
    }

    mul(other) {
        this.validateOperand(other);
        return this.createNew(this.number * other.number);
    }

    div(other) {
        this.validateOperand(other);
        if (other.number === 0) throw new Error('Деление на ноль');
        const result = this.number / other.number;
        return this.createNew(Number(result.toFixed(this.precision))); // <-- Округляем сразу
    }

    // Вспомогательные методы
    charToValue(char) {
        const value = parseInt(char, 16); // Максимальное основание 16
        if (isNaN(value) || value >= this.notation) {
            throw new Error(`Недопустимый символ '${char}' для основания ${this.notation}`);
        }
        return value;
    }

    validateOperand(other) {
        if (!(other instanceof TPNumber)) {
            throw new Error('Операнд должен быть TPNumber');
        }
        if (this.notation !== other.notation) {
            throw new Error('Разные системы счисления');
        }
    }

    createNew(value) {
        return new TPNumber(
            value, 
            this.notation, 
            Math.max(this.precision, this.precision) // Можно настроить логику
        );
    }

    toString() {
        return this.formatToBase();
    }
}

module.exports = TPNumber;