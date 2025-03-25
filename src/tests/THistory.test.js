const { THistory, HistoryOperation } = require('../components/THistory');

describe('THistory', () => {
    let history;

    beforeEach(() => {
        history = new THistory();
    });

    describe('Базовые операции', () => {
        test('начальное состояние', () => {
            expect(history.getCurrent()).toBeNull();
            expect(history.getAll()).toHaveLength(0);
        });

        test('добавление операции', () => {
            const operation = new HistoryOperation('Add', '2', '3', '5');
            history.add(operation);
            expect(history.getCurrent()).toBe(operation);
        });

        test('очистка истории', () => {
            history.add(new HistoryOperation('Add', '2', '3', '5'));
            history.clear();
            expect(history.getCurrent()).toBeNull();
            expect(history.getAll()).toHaveLength(0);
        });
    });

    describe('Навигация по истории', () => {
        beforeEach(() => {
            history.add(new HistoryOperation('Add', '2', '3', '5'));
            history.add(new HistoryOperation('Mul', '5', '2', '10'));
            history.add(new HistoryOperation('Sub', '10', '3', '7'));
        });

        test('получение предыдущей операции', () => {
            const prev = history.getPrevious();
            expect(prev.type).toBe('Mul');
            expect(prev.result).toBe('10');
        });

        test('получение следующей операции', () => {
            history.getPrevious(); // перемещаемся назад
            const next = history.getNext();
            expect(next.type).toBe('Sub');
            expect(next.result).toBe('7');
        });

        test('достижение границ истории', () => {
            // Пытаемся выйти за начало истории
            history.getPrevious();
            history.getPrevious();
            expect(history.getPrevious()).toBeNull();

            // Пытаемся выйти за конец истории
            history.getNext();
            history.getNext();
            expect(history.getNext()).toBeNull();
        });
    });

    describe('Модификация истории', () => {
        test('добавление после отката назад', () => {
            history.add(new HistoryOperation('Add', '2', '3', '5'));
            history.add(new HistoryOperation('Mul', '5', '2', '10'));
            history.getPrevious(); // возвращаемся к первой операции
            
            // Добавляем новую операцию
            const newOp = new HistoryOperation('Sub', '5', '1', '4');
            history.add(newOp);
            
            // Проверяем, что вторая операция была удалена
            expect(history.getAll()).toHaveLength(2);
            expect(history.getCurrent()).toBe(newOp);
        });
    });

    describe('Форматирование операций', () => {
        test('преобразование операции в строку', () => {
            const operation = new HistoryOperation('Add', '2', '3', '5');
            expect(operation.toString()).toBe('2 Add 3 = 5');
        });

        test('сохранение временной метки', () => {
            const operation = new HistoryOperation('Add', '2', '3', '5');
            expect(operation.timestamp).toBeInstanceOf(Date);
        });
    });
});