const { ADT_Control } = require('../components/ADT_Control');
const { Operations } = require('../components/ADT_Proc');

describe('ADT_Control', () => {
    let control;

    beforeEach(() => {
        control = new ADT_Control(10, 2);
    });

    describe('Инициализация', () => {
        test('создание с параметрами по умолчанию', () => {
            const defaultControl = new ADT_Control();
            expect(defaultControl.display).toBe('0');
        });

        test('создание с заданными параметрами', () => {
            expect(control.display).toBe('0');
        });

        test('создание с разными системами счисления', () => {
            const hexControl = new ADT_Control(16, 2);
            hexControl.editNumber('A');
            hexControl.editNumber('B');
            expect(hexControl.display).toBe('AB');
        });
    });

    describe('Ввод чисел', () => {
        test('последовательный ввод цифр', () => {
            control.editNumber('1');
            control.editNumber('2');
            control.editNumber('3');
            expect(control.display).toBe('123');
        });

        test('ввод дробного числа', () => {
            control.editNumber('1');
            control.editNumber('Separator');
            control.editNumber('5');
            expect(control.display).toBe('1.5');
        });

        test('ввод отрицательного числа', () => {
            control.editNumber('5');
            control.editNumber('Sign');
            expect(control.display).toBe('-5');
        });

        test('ввод в разных системах счисления', () => {
            const hexControl = new ADT_Control(16, 2);
            hexControl.editNumber('F');
            hexControl.editNumber('F');
            expect(hexControl.display).toBe('FF');
        });

        test('игнорирование недопустимых цифр', () => {
            const binControl = new ADT_Control(2, 2);
            binControl.editNumber('1');
            binControl.editNumber('0');
            binControl.editNumber('2'); // должно игнорироваться
            expect(binControl.display).toBe('10');
        });
    });

    describe('Выполнение операций', () => {
        test('простое сложение', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            expect(control.getResult()).toBe('8');
        });

        test('цепочка операций', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            control.getResult()
            control.setOperation(Operations.Mul);
            control.editNumber('2');
            expect(control.getResult()).toBe('16');
        });

        test('работа с дробными числами', () => {
            control.editNumber('1');
            control.editNumber('Separator');
            control.editNumber('5');
            control.setOperation(Operations.Mul);
            control.editNumber('2');
            expect(control.getResult()).toBe('3');
        });

        test('операции с отрицательными числами', () => {
            control.editNumber('5');
            control.editNumber('Sign');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            expect(control.getResult()).toBe('-2');
        });

        test('длинная цепочка операций', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            control.getResult()
            control.setOperation(Operations.Mul);
            control.editNumber('2');
            control.getResult()
            control.setOperation(Operations.Sub);
            control.editNumber('4');
            expect(control.getResult()).toBe('12');
        });

        test('операции с дробными числами разной точности', () => {
            control.editNumber('1');
            control.editNumber('Separator');
            control.editNumber('5');
            control.setOperation(Operations.Mul);
            control.editNumber('2');
            control.editNumber('Separator');
            control.editNumber('5');
            expect(control.getResult()).toBe('3.75');
        });
    });

    describe('Работа с памятью', () => {
        test('сохранение промежуточных результатов', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            control.getResult()
            control.setOperation(Operations.Add);
            expect(control.display).toBe('8');
        });

        test('использование результата в новой операции', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            control.getResult(); // получаем 8
            control.setOperation(Operations.Mul);
            control.editNumber('2');
            expect(control.getResult()).toBe('16');
        });
    });

    describe('Очистка и сброс', () => {
        test('очистка дисплея', () => {
            control.editNumber('1');
            control.editNumber('2');
            control.editNumber('3');
            control.clear();
            expect(control.display).toBe('0');
        });

        test('сброс после операции', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('3');
            control.clear();
            control.editNumber('1');
            expect(control.display).toBe('1');
        });

        test('сброс после ошибки', () => {
            control.editNumber('5');
            control.setOperation(Operations.Div);
            control.editNumber('0');
            try {
                control.getResult();
            } catch (e) {
                // ожидаем ошибку
            }
            expect(control.display).toBe('0');
        });

        test('очистка в середине операции', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.clear();
            control.editNumber('3');
            expect(control.display).toBe('3');
        });
    });

    describe('Обработка ошибок', () => {
        test('деление на ноль', () => {
            control.editNumber('5');
            control.setOperation(Operations.Div);
            control.editNumber('0');
            expect(() => control.getResult()).toThrow();
        });

        test('некорректная операция', () => {
            control.editNumber('5');
            expect(() => control.setOperation('Invalid')).toThrow();
        });

        test('операции с некорректными числами', () => {
            control.editNumber('5');
            control.setOperation(Operations.Add);
            control.editNumber('Separator');
            expect(() => control.getResult()).not.toThrow();
        });

        test('последовательные ошибочные операции', () => {
            control.editNumber('5');
            control.setOperation(Operations.Div);
            control.editNumber('0');
            try {
                control.getResult();
            } catch (e) {
                // ожидаем ошибку
            }
            control.editNumber('1');
            control.setOperation(Operations.Add);
            control.editNumber('2');
            expect(control.getResult()).toBe('3');
        });
    });

    describe('Специальные случаи', () => {
        test('работа с очень длинными числами', () => {
            control.editNumber('9');
            control.editNumber('9');
            control.editNumber('9');
            control.setOperation(Operations.Mul);
            control.editNumber('9');
            control.editNumber('9');
            control.editNumber('9');
            expect(control.getResult()).toBe('998001');
        });
    });
});