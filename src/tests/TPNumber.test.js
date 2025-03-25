const TPNumber = require('../components/TPNumber');

describe('TPNumber', () => {
    describe('Конструктор и валидация', () => {
        test('создание с значениями по умолчанию', () => {
            const num = new TPNumber();
            expect(num.toString()).toBe('0');
            expect(num.notation).toBe(10);
            expect(num.precision).toBe(5);
        });

        test('выбрасывает ошибку при некорректном основании', () => {
            expect(() => new TPNumber(0, 1)).toThrow('Основание должно быть между 2 и 16');
            expect(() => new TPNumber(0, 17)).toThrow('Основание должно быть между 2 и 16');
        });

        test('выбрасывает ошибку при отрицательной точности', () => {
            expect(() => new TPNumber(0, 10, -1)).toThrow('Точность должна быть неотрицательной');
        });

        test('создание из другого TPNumber', () => {
            const original = new TPNumber(42, 16, 2);
            const copy = new TPNumber(original);
            expect(copy.toString()).toBe('2A');
            expect(copy.notation).toBe(16);
            expect(copy.precision).toBe(2);
        });
    });

    describe('Преобразование систем счисления', () => {
        test('преобразование между системами', () => {
            const num = new TPNumber(255, 10, 2);
            expect(num.withNotation(16).toString()).toBe('FF');
            expect(num.withNotation(2).toString()).toBe('11111111');
            expect(num.withNotation(8).toString()).toBe('377');
        });

        test('сохранение знака при преобразовании', () => {
            const num = new TPNumber(-255, 10, 2);
            expect(num.withNotation(16).toString()).toBe('-FF');
        });

        test('преобразование дробных чисел', () => {
            const num = new TPNumber('10.5', 10, 2);
            expect(num.withNotation(16).toString()).toBe('A.8');
            expect(num.withNotation(2).toString()).toBe('1010.1');
        });

        test('округление при изменении точности', () => {
            const num = new TPNumber('1.23456', 10, 5);
            expect(num.withPrecision(2).toString()).toBe('1.23');
            expect(num.withPrecision(3).toString()).toBe('1.235');
        });
    });

    describe('Парсинг строк', () => {
        test('парсинг целых чисел в разных системах', () => {
            expect(new TPNumber('FF', 16).getNumber()).toBe(255);
            expect(new TPNumber('377', 8).getNumber()).toBe(255);
            expect(new TPNumber('11111111', 2).getNumber()).toBe(255);
        });

        test('парсинг дробных чисел', () => {
            const num = new TPNumber('10.5', 10);
            expect(num.getNumber()).toBe(10.5);
        });

        test('парсинг отрицательных чисел', () => {
            expect(new TPNumber('-FF', 16).getNumber()).toBe(-255);
            expect(new TPNumber('-10.5', 10).getNumber()).toBe(-10.5);
        });

        test('обработка некорректного ввода', () => {
            expect(() => new TPNumber('G', 16)).toThrow();
            expect(() => new TPNumber('2', 2)).toThrow();
            expect(() => new TPNumber('8', 8)).toThrow();
            const num = new TPNumber("12.", 10, 2);
        });
    });

    describe('Арифметические операции', () => {
        let num1, num2;
        
        beforeEach(() => {
            num1 = new TPNumber(5, 10, 2);
            num2 = new TPNumber(3, 10, 2);
        });

        test('сложение', () => {
            expect(num1.add(num2).toString()).toBe('8');
            expect(num1.add(new TPNumber(-3, 10, 2)).toString()).toBe('2');
        });

        test('вычитание', () => {
            expect(num1.sub(num2).toString()).toBe('2');
            expect(num1.sub(new TPNumber(-3, 10, 2)).toString()).toBe('8');
        });

        test('умножение', () => {
            expect(num1.mul(num2).toString()).toBe('15');
            expect(num1.mul(new TPNumber(-3, 10, 2)).toString()).toBe('-15');
        });

        test('деление', () => {
            expect(num1.div(num2).toString()).toBe('1.67');
            expect(num1.div(new TPNumber(2, 10, 2)).toString()).toBe('2.5');
        });

        test('операции с разными системами счисления', () => {
            const hex = new TPNumber('A', 16, 2);
            expect(() => num1.add(hex)).toThrow('Разные системы счисления');
        });

        test('операции с некорректными операндами', () => {
            expect(() => num1.add(5)).toThrow('Операнд должен быть TPNumber');
        });
    });

    describe('Форматирование', () => {
        test('удаление завершающих нулей', () => {
            const num = new TPNumber('1.500', 10, 3);
            expect(num.toString()).toBe('1.5');
        });

        test('форматирование больших чисел', () => {
            const num = new TPNumber(1000000, 16, 2);
            expect(num.toString()).toBe('F4240');
        });

        test('сохранение нулей в середине числа', () => {
            const num = new TPNumber('1.0501', 10, 4);
            expect(num.toString()).toBe('1.0501');
        });
    });
}); 