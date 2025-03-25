const { ADT_Control } = require('../components/ADT_Control');
const { Operations } = require('../components/ADT_Proc');

class CalculatorUI {
    constructor() {
        // Инициализация калькулятора
        this.control = new ADT_Control(10, 2); // 10-чная система, точность 2
        this.display = document.getElementById('display');
        
        console.log('Calculator initialized');
        this.testCalculator();
    }

    testCalculator() {
        // Тестовая операция
        this.control.editNumber('5');
        this.control.setOperation(Operations.Add);
        this.control.editNumber('3');
        const result = this.control.getResult();
        
        console.log('Test calculation: 5 + 3 =', result);
        this.display.textContent = result;
    }

    // Метод для обновления отображения
    updateDisplay(value) {
        this.display.textContent = value || this.control.display;
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