const { TMemory, MemoryCommand, MemoryState } = require('../components/TMemory');
const TPNumber = require('../components/TPNumber');

describe('TMemory', () => {
    let memory;

    beforeEach(() => {
        memory = new TMemory(TPNumber);
    });

    describe('Конструктор', () => {
        test('требует NumberClass', () => {
            expect(() => new TMemory()).toThrow('NumberClass is required');
        });

        test('инициализирует память в выключенном состоянии', () => {
            expect(memory.FState).toBe(MemoryState._Off);
            expect(memory.FNumber.toString()).toBe('0');
        });
    });

    describe('Состояние Выключена (_Off)', () => {
        test('MR возвращает 0 и состояние _Off', () => {
            const [result, state] = memory.edit(MemoryCommand.Copy);
            expect(result.toString()).toBe('0');
            expect(state).toBe(false);
        });

        test('MC не меняет состояние', () => {
            memory.edit(MemoryCommand.Clear);
            expect(memory.FState).toBe(MemoryState._Off);
            expect(memory.FNumber.toString()).toBe('0');
        });

        test('MS переводит в состояние _On', () => {
            const num = new TPNumber(5);
            memory.edit(MemoryCommand.Store, num);
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('5');
        });

        test('MA переводит в состояние _On', () => {
            const num = new TPNumber(5);
            memory.edit(MemoryCommand.Add, num);
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('5');
        });
    });

    describe('Состояние Включена (_On)', () => {
        beforeEach(() => {
            memory.edit(MemoryCommand.Store, new TPNumber(10));
        });

        test('память хранит значение', () => {
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('10');
        });

        test('MS обновляет значение', () => {
            memory.edit(MemoryCommand.Store, new TPNumber(20));
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('20');
        });

        test('MA добавляет к текущему значению', () => {
            memory.edit(MemoryCommand.Add, new TPNumber(5));
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('15');
        });

        test('MR возвращает текущее значение и состояние', () => {
            const [result, state] = memory.edit(MemoryCommand.Copy);
            expect(result.toString()).toBe('10');
            expect(state).toBe(true);
        });

        test('MC очищает память и переводит в _Off', () => {
            memory.edit(MemoryCommand.Clear);
            expect(memory.FState).toBe(MemoryState._Off);
            expect(memory.FNumber.toString()).toBe('0');
        });
    });

    describe('Проверка команд', () => {
        test('отклоняет неизвестные команды', () => {
            expect(() => memory.edit('Unknown')).toThrow('Invalid command');
        });

        test('требует число для Store', () => {
            expect(() => memory.edit(MemoryCommand.Store)).toThrow('Number is required');
        });

        test('требует число для Add', () => {
            expect(() => memory.edit(MemoryCommand.Add)).toThrow('Number is required');
        });
    });

    describe('Сложные сценарии', () => {
        test('последовательность операций', () => {
            // Store -> Add -> Add -> Clear -> Store
            memory.edit(MemoryCommand.Store, new TPNumber(10));
            expect(memory.FState).toBe(MemoryState._On);
            
            memory.edit(MemoryCommand.Add, new TPNumber(5));
            expect(memory.FNumber.toString()).toBe('15');
            
            memory.edit(MemoryCommand.Add, new TPNumber(3));
            expect(memory.FNumber.toString()).toBe('18');
            
            memory.edit(MemoryCommand.Clear);
            expect(memory.FState).toBe(MemoryState._Off);
            
            memory.edit(MemoryCommand.Store, new TPNumber(7));
            expect(memory.FState).toBe(MemoryState._On);
            expect(memory.FNumber.toString()).toBe('7');
        });

        test('работа с отрицательными числами', () => {
            memory.edit(MemoryCommand.Store, new TPNumber(-5));
            memory.edit(MemoryCommand.Add, new TPNumber(-3));
            expect(memory.FNumber.toString()).toBe('-8');
        });
    });
});