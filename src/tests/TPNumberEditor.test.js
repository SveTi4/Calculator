const TPNumberEditor = require('../components/TPNumberEditor');

describe('TPNumberEditor', () => {
    let editor;

    beforeEach(() => {
        editor = new TPNumberEditor(10, 2);
    });

    describe('Инициализация', () => {
        test('создание с параметрами по умолчанию', () => {
            const defaultEditor = new TPNumberEditor();
            expect(defaultEditor.number).toBe('0');
            expect(defaultEditor.notation).toBe(10);
            expect(defaultEditor.precision).toBe(5);
        });

        test('создание с заданными параметрами', () => {
            const customEditor = new TPNumberEditor(16, 3);
            expect(customEditor.number).toBe('0');
            expect(customEditor.notation).toBe(16);
            expect(customEditor.precision).toBe(3);
        });
    });

    describe('Ввод цифр', () => {
        test('ввод одиночных цифр', () => {
            editor.edit('5');
            expect(editor.number).toBe('5');
        });

        test('последовательный ввод цифр', () => {
            editor.edit('1');
            editor.edit('2');
            editor.edit('3');
            expect(editor.number).toBe('123');
        });

        test('замена начального нуля', () => {
            editor.edit('0');
            editor.edit('0');
            editor.edit('5');
            expect(editor.number).toBe('5');
        });

        test('сохранение нуля перед точкой', () => {
            editor.edit('0');
            editor.edit('Separator');
            editor.edit('5');
            expect(editor.number).toBe('0.5');
        });
    });

    describe('Работа со знаком', () => {
        test('добавление знака минус', () => {
            editor.edit('5');
            editor.edit('Sign');
            expect(editor.number).toBe('-5');
        });

        test('удаление знака минус', () => {
            editor.edit('5');
            editor.edit('Sign');
            editor.edit('Sign');
            expect(editor.number).toBe('5');
        });

        test('игнорирование знака для нуля', () => {
            editor.edit('Sign');
            expect(editor.number).toBe('0');
        });

        test('сохранение знака при вводе цифр', () => {
            editor.edit('5');
            editor.edit('Sign');
            editor.edit('3');
            expect(editor.number).toBe('-53');
        });
    });

    describe('Дробные числа', () => {
        test('добавление десятичной точки', () => {
            editor.edit('5');
            editor.edit('Separator');
            expect(editor.number).toBe('5.');
        });

        test('ввод после десятичной точки', () => {
            editor.edit('5');
            editor.edit('Separator');
            editor.edit('3');
            expect(editor.number).toBe('5.3');
        });

        test('игнорирование повторной точки', () => {
            editor.edit('5');
            editor.edit('Separator');
            editor.edit('3');
            editor.edit('Separator');
            expect(editor.number).toBe('5.3');
        });

        test('точка в отрицательном числе', () => {
            editor.edit('5');
            editor.edit('Sign');
            editor.edit('Separator');
            editor.edit('3');
            expect(editor.number).toBe('-5.3');
        });
    });

    describe('Редактирование', () => {
        test('удаление цифр', () => {
            editor.edit('1');
            editor.edit('2');
            editor.edit('3');
            editor.edit('BS');
            expect(editor.number).toBe('12');
        });

        test('удаление до нуля', () => {
            editor.edit('1');
            editor.edit('BS');
            expect(editor.number).toBe('0');
        });

        test('удаление точки', () => {
            editor.edit('1');
            editor.edit('Separator');
            editor.edit('5');
            editor.edit('BS');
            editor.edit('BS');
            expect(editor.number).toBe('1');
        });

        test('удаление знака минус', () => {
            editor.edit('1');
            editor.edit('2');
            editor.edit('Sign');
            editor.edit('BS');
            expect(editor.number).toBe('-1');
        });

        test('полная очистка', () => {
            editor.edit('1');
            editor.edit('2');
            editor.edit('Separator');
            editor.edit('3');
            editor.edit('CE');
            expect(editor.number).toBe('0');
        });
    });

    describe('Системы счисления', () => {
        test('шестнадцатеричный ввод', () => {
            editor = new TPNumberEditor(16, 2);
            editor.edit('A');
            editor.edit('B');
            editor.edit('F');
            expect(editor.number).toBe('ABF');
        });

        test('ограничение по системе счисления', () => {
            editor = new TPNumberEditor(8, 2);
            editor.edit('7');
            editor.edit('8'); // Должно игнорироваться
            editor.edit('9'); // Должно игнорироваться
            expect(editor.number).toBe('7');
        });

        test('двоичный ввод', () => {
            editor = new TPNumberEditor(2, 2);
            editor.edit('1');
            editor.edit('0');
            editor.edit('1');
            editor.edit('2'); // Должно игнорироваться
            expect(editor.number).toBe('101');
        });
    });
});