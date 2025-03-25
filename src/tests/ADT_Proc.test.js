const { ADT_Proc, Operations } = require('../components/ADT_Proc');
const TPNumber = require('../components/TPNumber');

describe('ADT_Proc', () => {
    let processor;
    let num1;
    let num2;

    beforeEach(() => {
        processor = new ADT_Proc();
        num1 = new TPNumber(10, 10, 2);
        num2 = new TPNumber(5, 10, 2);
    });

    describe('Базовые операции', () => {
        test('сложение', () => {
            const result = processor.execute(Operations.Add, num1, num2);
            expect(result.toString()).toBe('15');
        });

        test('вычитание', () => {
            const result = processor.execute(Operations.Sub, num1, num2);
            expect(result.toString()).toBe('5');
        });

        test('умножение', () => {
            const result = processor.execute(Operations.Mul, num1, num2);
            expect(result.toString()).toBe('50');
        });

        test('деление', () => {
            const result = processor.execute(Operations.Div, num1, num2);
            expect(result.toString()).toBe('2');
        });

        test('сложение отрицательных чисел', () => {
            const neg1 = new TPNumber(-10, 10, 2);
            const neg2 = new TPNumber(-5, 10, 2);
            const result = processor.execute(Operations.Add, neg1, neg2);
            expect(result.toString()).toBe('-15');
        });

        test('вычитание с отрицательным результатом', () => {
            const result = processor.execute(Operations.Sub, num2, num1);
            expect(result.toString()).toBe('-5');
        });

        test('умножение на отрицательное число', () => {
            const neg = new TPNumber(-2, 10, 2);
            const result = processor.execute(Operations.Mul, num1, neg);
            expect(result.toString()).toBe('-20');
        });

        test('деление отрицательных чисел', () => {
            const neg1 = new TPNumber(-10, 10, 2);
            const neg2 = new TPNumber(-2, 10, 2);
            const result = processor.execute(Operations.Div, neg1, neg2);
            expect(result.toString()).toBe('5');
        });
    });

    describe('Граничные случаи', () => {
        test('операции с нулем', () => {
            const zero = new TPNumber(0, 10, 2);
            expect(processor.execute(Operations.Add, num1, zero).toString()).toBe('10');
            expect(processor.execute(Operations.Sub, num1, zero).toString()).toBe('10');
            expect(processor.execute(Operations.Mul, num1, zero).toString()).toBe('0');
        });

        test('операции с единицей', () => {
            const one = new TPNumber(1, 10, 2);
            expect(processor.execute(Operations.Mul, num1, one).toString()).toBe('10');
            expect(processor.execute(Operations.Div, num1, one).toString()).toBe('10');
        });

        test('операции с максимальными значениями', () => {
            const max = new TPNumber('FF', 16, 2);
            const result = processor.execute(Operations.Add, max, max);
            expect(result.toString()).toBe('1FE');
        });
    });

    describe('Работа с разными системами счисления', () => {
        test('операции в шестнадцатеричной системе', () => {
            const hex1 = new TPNumber('A', 16, 2);
            const hex2 = new TPNumber('5', 16, 2);
            const result = processor.execute(Operations.Add, hex1, hex2);
            expect(result.toString()).toBe('F');
        });

        test('операции в двоичной системе', () => {
            const bin1 = new TPNumber('1010', 2, 2);
            const bin2 = new TPNumber('101', 2, 2);
            const result = processor.execute(Operations.Add, bin1, bin2);
            expect(result.toString()).toBe('1111');
        });

        test('операции в восьмеричной системе', () => {
            const oct1 = new TPNumber('10', 8, 2);
            const oct2 = new TPNumber('7', 8, 2);
            const result = processor.execute(Operations.Add, oct1, oct2);
            expect(result.toString()).toBe('17');
        });

        test('сохранение системы счисления после операции', () => {
            const hex = new TPNumber('FF', 16, 2);
            const result = processor.execute(Operations.Add, hex, hex);
            expect(result.notation).toBe(16);
        });

        test('сохранение точности после операции', () => {
            const precise = new TPNumber('1.23456', 10, 5);
            const result = processor.execute(Operations.Add, precise, precise);
            expect(result.precision).toBe(5);
        });
    });

    describe('Работа с дробными числами', () => {
        test('сложение дробных чисел', () => {
            const num1 = new TPNumber('1.5', 10, 2);
            const num2 = new TPNumber('2.7', 10, 2);
            const result = processor.execute(Operations.Add, num1, num2);
            expect(result.toString()).toBe('4.2');
        });

        test('деление с дробным результатом', () => {
            const num1 = new TPNumber('10', 10, 2);
            const num2 = new TPNumber('3', 10, 2);
            const result = processor.execute(Operations.Div, num1, num2);
            expect(result.toString()).toBe('3.33');
        });

        test('умножение дробных чисел', () => {
            const frac1 = new TPNumber('1.5', 10, 2);
            const frac2 = new TPNumber('2.5', 10, 2);
            const result = processor.execute(Operations.Mul, frac1, frac2);
            expect(result.toString()).toBe('3.75');
        });

        test('сложение чисел с разной точностью', () => {
            const num1 = new TPNumber('1.5', 10, 2);
            const num2 = new TPNumber('2.125', 10, 3);
            const result = processor.execute(Operations.Add, num1, num2);
            expect(result.toString()).toBe('3.63');
        });

        test('вычитание с переносом через разряд', () => {
            const num1 = new TPNumber('10.1', 10, 2);
            const num2 = new TPNumber('3.2', 10, 2);
            const result = processor.execute(Operations.Sub, num1, num2);
            expect(result.toString()).toBe('6.9');
        });
    });

    describe('Обработка ошибок', () => {
        test('деление на ноль', () => {
            const zero = new TPNumber(0, 10, 2);
            expect(() => {
                processor.execute(Operations.Div, num1, zero);
            }).toThrow('Division by zero');
        });

        test('неизвестная операция', () => {
            expect(() => {
                processor.execute('Unknown', num1, num2);
            }).toThrow('Unknown operation');
        });

        test('операции с некорректными операндами', () => {
            expect(() => {
                processor.execute(Operations.Add, null, num2);
            }).toThrow();

            expect(() => {
                processor.execute(Operations.Add, num1, undefined);
            }).toThrow();
        });

        test('операции с разными системами счисления', () => {
            const hex = new TPNumber('10', 16, 2);
            expect(() => {
                processor.execute(Operations.Add, num1, hex);
            }).toThrow();
        });
    });
});