const { ADT_Control } = require('../components/ADT_Control');
const { Operations } = require('../components/ADT_Proc');
const { MemoryCommand } = require('../components/TMemory');
const TPNumber = require('../components/TPNumber');

class CalculatorUI {
    constructor() {
        this.control = new ADT_Control(16, 2); // 16-ричная система по умолчанию
        this.display = document.getElementById('display');
        this.initButtons();
        this.initNotationSelector();
        this.initPrecisionSelector();
        this.updateDisplay();
        this.initTabs();
        this.updateNotationDisplay();
        this.updateMemoryIndicator();
    }

    initButtons() {
        // Цифровые кнопки
        const digits = '0123456789ABCDEF';
        for (const digit of digits) {
            const btn = document.getElementById(digit.toLowerCase());
            if (btn) {
                btn.addEventListener('click', () => {
                    this.control.editNumber(digit);
                    this.updateDisplay();
                });
            }
        }

        // Операции
        const operations = {
            'add': Operations.Add,
            'sub': Operations.Sub,
            'mul': Operations.Mul,
            'div': Operations.Div
        };

        for (const [id, op] of Object.entries(operations)) {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.control.setOperation(op);
                    this.updateDisplay();
                });
            }
        }

        // Функциональные кнопки
        document.getElementById('equals')?.addEventListener('click', () => {
            this.control.getResult();
            this.updateDisplay();
        });

        document.getElementById('ce')?.addEventListener('click', () => {
            this.control.clear();
            this.updateDisplay();
        });

        document.getElementById('sign')?.addEventListener('click', () => {
            this.control.editNumber('Sign');
            this.updateDisplay();
        });

        document.getElementById('separator')?.addEventListener('click', () => {
            this.control.editNumber('Separator');
            this.updateDisplay();
        });

        document.getElementById('backspace')?.addEventListener('click', () => {
            this.control.editNumber('BS');  // BS - команда для удаления символа
            this.updateDisplay();
        });

        // Кнопки памяти
        document.getElementById('mc')?.addEventListener('click', () => {
            this.control._memory.edit(MemoryCommand.Clear);
            this.updateMemoryIndicator();
        });

        document.getElementById('mr')?.addEventListener('click', () => {
            const [result, hasValue] = this.control._memory.edit(MemoryCommand.Copy);
            if (hasValue) {
                this.control._displayResult(result);
                this.updateDisplay();
            }
        });

        document.getElementById('ms')?.addEventListener('click', () => {
            const currentNumber = this.control._parseEditorNumber();
            this.control._memory.edit(MemoryCommand.Store, currentNumber);
            this.updateMemoryIndicator();
        });

        document.getElementById('m-plus')?.addEventListener('click', () => {
            const currentNumber = this.control._parseEditorNumber();
            this.control._memory.edit(MemoryCommand.Add, currentNumber);
            this.updateMemoryIndicator();
        });

        // Добавляем обработчик для sqr
        document.getElementById('sqr')?.addEventListener('click', () => {
            this.control.setOperation(Operations.Sqr);
            this.control.getResult();  // Сразу получаем результат
            this.updateDisplay();
        });
    }

    initNotationSelector() {
        const notationSelect = document.getElementById('notation');
        if (notationSelect) {
            notationSelect.addEventListener('change', () => {
                const newNotation = parseInt(notationSelect.value);
                this.updateNotation(newNotation);
            });
        }
    }

    initPrecisionSelector() {
        const precisionInput = document.getElementById('precision');
        const precisionValue = document.getElementById('precision-value');
        
        if (precisionInput && precisionValue) {
            precisionInput.addEventListener('input', () => {
                const newPrecision = parseInt(precisionInput.value);
                precisionValue.textContent = newPrecision;
                this.updatePrecision(newPrecision);
            });
        }
    }

    initTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const contents = document.querySelectorAll('.tab-content');
                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });
    }

    updateNotationDisplay() {
        const notationMap = {
            2: 'BIN',
            8: 'OCT',
            10: 'DEC',
            16: 'HEX'
        };
        
        const display = document.getElementById('current-notation');
        if (display) {
            display.textContent = notationMap[this.control.notation] || '';
        }
    }

    updateNotation(newNotation) {
        try {
            // Сохраняем текущее значение и состояние памяти
            const currentValue = this.control._parseEditorNumber();
            const memoryValue = this.control._memory.value;
            const hasMemory = this.control._memory.hasValue;
            
            // Создаем новый калькулятор с новой системой счисления
            this.control = new ADT_Control(newNotation, this.control.precision);
            
            // Восстанавливаем значение памяти
            if (hasMemory) {
                const convertedMemory = new TPNumber(memoryValue.getNumber(), newNotation, this.control.precision);
                this.control._memory.edit(MemoryCommand.Store, convertedMemory);
            }
            
            // Конвертируем и отображаем текущее значение
            const convertedValue = new TPNumber(currentValue.getNumber(), newNotation, this.control.precision);
            this.control._displayResult(convertedValue);
            this.updateDisplay();

            // Обновляем доступность кнопок и индикаторы
            this.updateButtonsAvailability(newNotation);
            this.updateNotationDisplay();
            this.updateMemoryIndicator();
        } catch (error) {
            console.error('Error changing notation:', error);
        }
    }

    updateButtonsAvailability(notation) {
        // Отключаем кнопки, недоступные в текущей системе счисления
        const digits = '0123456789ABCDEF';
        for (let i = 0; i < digits.length; i++) {
            const btn = document.getElementById(digits[i].toLowerCase());
            if (btn) {
                btn.disabled = i >= notation;
                btn.classList.toggle('disabled', i >= notation);
            }
        }
    }

    updatePrecision(newPrecision) {
        try {
            // Сохраняем текущее значение
            const currentValue = this.control._parseEditorNumber();
            
            // Создаем новый калькулятор с новой точностью
            this.control = new ADT_Control(this.control.notation, newPrecision);
            
            // Отображаем значение с новой точностью
            const convertedValue = new TPNumber(
                currentValue.getNumber(), 
                this.control.notation, 
                newPrecision
            );
            
            this.control._displayResult(convertedValue);
            this.updateDisplay();
        } catch (error) {
            console.error('Error changing precision:', error);
        }
    }

    updateDisplay(value) {
        this.display.textContent = value || this.control.display;
    }

    updateMemoryIndicator() {
        const indicator = document.getElementById('memory-indicator');
        const hasMemory = this.control._memory.hasValue;
        
        if (indicator) {
            indicator.classList.toggle('active', hasMemory);
        }

        // Обновляем доступность кнопок MC и MR
        const mcButton = document.getElementById('mc');
        const mrButton = document.getElementById('mr');
        
        if (mcButton) mcButton.classList.toggle('active', hasMemory);
        if (mrButton) mrButton.classList.toggle('active', hasMemory);
    }
}

// Создаем калькулятор после загрузки DOM
window.addEventListener('DOMContentLoaded', () => {
    try {
        const calc = new CalculatorUI();
        console.log('Calculator UI loaded successfully');
    } catch (error) {
        console.error('Failed to initialize calculator:', error);
    }
}); 