// 複數類
class Complex {
    constructor(real = 0, imaginary = 0) {
        this.real = real;
        this.imaginary = imaginary;
    }

    add(other) {
        return new Complex(this.real + other.real, this.imaginary + other.imaginary);
    }

    subtract(other) {
        return new Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    multiply(other) {
        const real = this.real * other.real - this.imaginary * other.imaginary;
        const imaginary = this.real * other.imaginary + this.imaginary * other.real;
        return new Complex(real, imaginary);
    }

    divide(other) {
        const denominator = other.real * other.real + other.imaginary * other.imaginary;
        if (denominator === 0) {
            throw new Error('除零錯誤');
        }
        const real = (this.real * other.real + this.imaginary * other.imaginary) / denominator;
        const imaginary = (this.imaginary * other.real - this.real * other.imaginary) / denominator;
        return new Complex(real, imaginary);
    }

    power(n) {
        if (n === 0) return new Complex(1, 0);
        if (n === 1) return new Complex(this.real, this.imaginary);
        if (n === 2) return this.multiply(this);
        if (n === 3) return this.multiply(this.multiply(this));
        
        // 使用極座標形式計算
        const r = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
        const theta = Math.atan2(this.imaginary, this.real);
        const newR = Math.pow(r, n);
        const newTheta = theta * n;
        return new Complex(newR * Math.cos(newTheta), newR * Math.sin(newTheta));
    }

    powerComplex(other) {
        // 複數的複數次方：a^b = e^(b * ln(a))
        const lnA = this.log();
        const product = other.multiply(lnA);
        return new Complex(Math.E, 0).powerComplex(product);
    }

    exp() {
        // e^z = e^(x+iy) = e^x * (cos(y) + i*sin(y))
        const expX = Math.exp(this.real);
        return new Complex(expX * Math.cos(this.imaginary), expX * Math.sin(this.imaginary));
    }

    sqrt() {
        const r = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
        const theta = Math.atan2(this.imaginary, this.real);
        const sqrtR = Math.sqrt(r);
        const halfTheta = theta / 2;
        return new Complex(sqrtR * Math.cos(halfTheta), sqrtR * Math.sin(halfTheta));
    }

    sin() {
        return new Complex(
            Math.sin(this.real) * Math.cosh(this.imaginary),
            Math.cos(this.real) * Math.sinh(this.imaginary)
        );
    }

    cos() {
        return new Complex(
            Math.cos(this.real) * Math.cosh(this.imaginary),
            -Math.sin(this.real) * Math.sinh(this.imaginary)
        );
    }

    tan() {
        const sin = this.sin();
        const cos = this.cos();
        return sin.divide(cos);
    }

    log() {
        const r = Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
        const theta = Math.atan2(this.imaginary, this.real);
        return new Complex(Math.log(r), theta);
    }

    ln() {
        return this.log();
    }

    abs() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    factorial() {
        if (this.imaginary !== 0) {
            throw new Error('階乘只適用於實數');
        }
        if (this.real < 0 || !Number.isInteger(this.real)) {
            throw new Error('階乘只適用於非負整數');
        }
        let result = 1;
        for (let i = 2; i <= this.real; i++) {
            result *= i;
        }
        return new Complex(result, 0);
    }

    floor() {
        return new Complex(Math.floor(this.real), Math.floor(this.imaginary));
    }

    ceil() {
        return new Complex(Math.ceil(this.real), Math.ceil(this.imaginary));
    }

    round() {
        return new Complex(Math.round(this.real), Math.round(this.imaginary));
    }

    toString() {
        if (this.imaginary === 0) {
            return this.real.toString();
        } else if (this.real === 0) {
            return this.imaginary === 1 ? 'i' : this.imaginary === -1 ? '-i' : this.imaginary + 'i';
        } else {
            const sign = this.imaginary > 0 ? '+' : '';
            const imaginaryPart = this.imaginary === 1 ? 'i' : this.imaginary === -1 ? '-i' : this.imaginary + 'i';
            return this.real + sign + imaginaryPart;
        }
    }

    static fromString(str) {
        str = str.trim();
        if (str === 'i') return new Complex(0, 1);
        if (str === '-i') return new Complex(0, -1);
        if (str === 'e') return new Complex(Math.E, 0);
        if (str === 'π' || str === 'pi') return new Complex(Math.PI, 0);
        if (str === 'e^(πi)' || str === 'e^(pi*i)') return new Complex(-1, 0);
        
        // 檢查是否包含i
        if (str.includes('i')) {
            const parts = str.split(/(?=[+-])/);
            let real = 0, imaginary = 0;
            
            for (let part of parts) {
                part = part.trim();
                if (part === '') continue;
                
                if (part.includes('i')) {
                    const num = part.replace('i', '');
                    if (num === '' || num === '+') {
                        imaginary += 1;
                    } else if (num === '-') {
                        imaginary -= 1;
                    } else {
                        imaginary += parseFloat(num);
                    }
                } else {
                    real += parseFloat(part);
                }
            }
            return new Complex(real, imaginary);
        } else {
            return new Complex(parseFloat(str), 0);
        }
    }
}

// 常數定義
const CONSTANTS = {
    'e': Math.E,
    'π': Math.PI,
    'e^(πi)': -1
};

// 單位換算定義
const UNIT_CONVERSIONS = {
    length: {
        '米': 1,
        '公里': 1000,
        '厘米': 0.01,
        '毫米': 0.001,
        '英里': 1609.344,
        '碼': 0.9144,
        '英尺': 0.3048,
        '英寸': 0.0254,
        '海里': 1852,
        '微米': 0.000001,
        '納米': 0.000000001
    },
    area: {
        '平方米': 1,
        '平方公里': 1000000,
        '平方厘米': 0.0001,
        '平方英里': 2589988.110336,
        '平方碼': 0.83612736,
        '平方英尺': 0.09290304,
        '平方英寸': 0.00064516,
        '公頃': 10000,
        '英畝': 4046.8564224
    },
    volume: {
        '立方米': 1,
        '升': 0.001,
        '毫升': 0.000001,
        '加侖': 0.00378541,
        '立方英尺': 0.0283168,
        '立方英寸': 0.000016387,
        '立方厘米': 0.000001,
        '立方碼': 0.764554857984
    },
    weight: {
        '公斤': 1,
        '克': 0.001,
        '毫克': 0.000001,
        '磅': 0.45359237,
        '盎司': 0.028349523125,
        '噸': 1000,
        '公噸': 1000,
        '英噸': 1016.0469088,
        '美噸': 907.18474
    },
    temperature: {
        '攝氏度': 'C',
        '華氏度': 'F',
        '開爾文': 'K',
        '蘭金': 'R'
    },
    speed: {
        '米/秒': 1,
        '公里/時': 0.277778,
        '英里/時': 0.44704,
        '節': 0.514444,
        '英尺/秒': 0.3048,
        '光速': 299792458
    }
};

// 溫度轉換函數
function convertTemperature(fromUnit, toUnit, value) {
    let celsius;
    
    // 先轉換為攝氏度
    switch (fromUnit) {
        case 'C': celsius = value; break;
        case 'F': celsius = (value - 32) * 5/9; break;
        case 'K': celsius = value - 273.15; break;
        case 'R': celsius = (value - 491.67) * 5/9; break;
        default: return value;
    }
    
    // 從攝氏度轉換為目標單位
    switch (toUnit) {
        case 'C': return celsius;
        case 'F': return celsius * 9/5 + 32;
        case 'K': return celsius + 273.15;
        case 'R': return celsius * 9/5 + 491.67;
        default: return celsius;
    }
}

// 全局變量
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;
let currentMode = 'real'; // 'real', 'complex', 'unit'
let currentUnitCategory = 'length';

const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const modeIndicatorElement = document.getElementById('mode-indicator');
const unitPanelElement = document.getElementById('unit-panel');
const unitConvertersElement = document.getElementById('unit-converters');

function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
    modeIndicatorElement.textContent = currentMode === 'real' ? '實數模式' : 
                                     currentMode === 'complex' ? '複數模式' : '單位換算模式';
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (mode === 'unit') {
        unitPanelElement.style.display = 'block';
        generateUnitConverters();
    } else {
        unitPanelElement.style.display = 'none';
    }
    
    updateDisplay();
}

function switchUnitCategory(category) {
    currentUnitCategory = category;
    document.querySelectorAll('.unit-cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    generateUnitConverters();
}

function generateUnitConverters() {
    const units = UNIT_CONVERSIONS[currentUnitCategory];
    const unitNames = Object.keys(units);
    
    unitConvertersElement.innerHTML = '';
    
    unitNames.forEach(unit => {
        const converter = document.createElement('div');
        converter.className = 'unit-converter';
        converter.innerHTML = `
            <input type="number" placeholder="輸入數值" onchange="convertUnit('${unit}', this.value)">
            <select onchange="convertUnit('${unit}', this.previousElementSibling.value)">
                ${unitNames.map(u => `<option value="${u}" ${u === unit ? 'selected' : ''}>${u}</option>`).join('')}
            </select>
        `;
        unitConvertersElement.appendChild(converter);
    });
}

function convertUnit(fromUnit, value) {
    if (!value || isNaN(value)) return;
    
    const units = UNIT_CONVERSIONS[currentUnitCategory];
    
    // 特殊處理溫度轉換
    if (currentUnitCategory === 'temperature') {
        const converters = unitConvertersElement.querySelectorAll('.unit-converter');
        converters.forEach(converter => {
            const input = converter.querySelector('input');
            const select = converter.querySelector('select');
            const toUnit = select.value;
            const convertedValue = convertTemperature(fromUnit, toUnit, parseFloat(value));
            input.value = convertedValue.toFixed(2);
        });
        return;
    }
    
    // 其他單位的標準轉換
    const baseValue = value * units[fromUnit];
    
    // 更新所有轉換器
    const converters = unitConvertersElement.querySelectorAll('.unit-converter');
    converters.forEach(converter => {
        const input = converter.querySelector('input');
        const select = converter.querySelector('select');
        const toUnit = select.value;
        const convertedValue = baseValue / units[toUnit];
        input.value = convertedValue.toFixed(6);
    });
}

function calculateEuler() {
    // 計算 e^(πi) = -1 (歐拉恆等式)
    if (currentMode === 'complex') {
        const piI = new Complex(0, Math.PI);
        const e = new Complex(Math.E, 0);
        const result = e.exp().powerComplex(piI);
        currentOperand = result.toString();
    } else {
        currentOperand = '-1';
    }
    shouldResetScreen = true;
    updateDisplay();
}

function appendConstant(constant) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    if (currentOperand === '0') {
        currentOperand = constant;
    } else {
        currentOperand += constant;
    }
    updateDisplay();
}

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) return;
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }
    if (currentOperand === '0' && number !== '.' && number !== 'i') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operation = operator;
    previousOperand = currentOperand;
    shouldResetScreen = true;
    updateDisplay();
}

function calculateFunction(func) {
    try {
        let result;
        
        if (func === 'pow') {
            // x^y 功能
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                calculate();
            }
            operation = '^';
            previousOperand = currentOperand;
            shouldResetScreen = true;
            updateDisplay();
            return;
        }
        
        const num = currentMode === 'complex' ? Complex.fromString(currentOperand) : parseFloat(currentOperand);
        
        if (currentMode === 'complex') {
            switch (func) {
                case 'sin': result = num.sin(); break;
                case 'cos': result = num.cos(); break;
                case 'tan': result = num.tan(); break;
                case 'log': result = num.log(); break;
                case 'ln': result = num.ln(); break;
                case 'sqrt': result = num.sqrt(); break;
                case 'square': result = num.power(2); break;
                case 'cube': result = num.power(3); break;
                case 'exp': result = num.exp(); break;
                case 'factorial': result = num.factorial(); break;
                case 'abs': result = new Complex(num.abs(), 0); break;
                case 'floor': result = num.floor(); break;
                case 'ceil': result = num.ceil(); break;
                case 'round': result = num.round(); break;
                default: return;
            }
            currentOperand = result.toString();
        } else {
            switch (func) {
                case 'sin': result = Math.sin(num * Math.PI / 180); break;
                case 'cos': result = Math.cos(num * Math.PI / 180); break;
                case 'tan': result = Math.tan(num * Math.PI / 180); break;
                case 'asin': result = Math.asin(num) * 180 / Math.PI; break;
                case 'acos': result = Math.acos(num) * 180 / Math.PI; break;
                case 'atan': result = Math.atan(num) * 180 / Math.PI; break;
                case 'log': result = Math.log10(num); break;
                case 'ln': result = Math.log(num); break;
                case 'sqrt': result = Math.sqrt(num); break;
                case 'square': result = num * num; break;
                case 'cube': result = num * num * num; break;
                case 'exp': result = Math.exp(num); break;
                case 'factorial': 
                    if (num < 0 || !Number.isInteger(num)) {
                        alert('階乘只適用於非負整數');
                        return;
                    }
                    result = 1;
                    for (let i = 2; i <= num; i++) {
                        result *= i;
                    }
                    break;
                case 'abs': result = Math.abs(num); break;
                case 'floor': result = Math.floor(num); break;
                case 'ceil': result = Math.ceil(num); break;
                case 'round': result = Math.round(num); break;
                default: return;
            }
            currentOperand = result.toString();
        }
        updateDisplay();
    } catch (error) {
        alert('計算錯誤：' + error.message);
    }
}

function calculate() {
    try {
        let computation;
        
        if (currentMode === 'complex') {
            const prev = Complex.fromString(previousOperand);
            const current = Complex.fromString(currentOperand);
            
            switch (operation) {
                case '+': computation = prev.add(current); break;
                case '-': computation = prev.subtract(current); break;
                case '×': computation = prev.multiply(current); break;
                case '÷': computation = prev.divide(current); break;
                case '%': computation = new Complex(prev.real % current.real, prev.imaginary % current.imaginary); break;
                case '^': 
                    if (current.imaginary === 0 && Number.isInteger(current.real)) {
                        computation = prev.power(current.real);
                    } else {
                        computation = prev.powerComplex(current);
                    }
                    break;
                default: return;
            }
            currentOperand = computation.toString();
        } else {
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+': computation = prev + current; break;
                case '-': computation = prev - current; break;
                case '×': computation = prev * current; break;
                case '÷':
                    if (current === 0) {
                        alert('不能除以零！');
                        return;
                    }
                    computation = prev / current;
                    break;
                case '%': computation = prev % current; break;
                case '^': computation = Math.pow(prev, current); break;
                default: return;
            }
            currentOperand = computation.toString();
        }
        
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
        updateDisplay();
    } catch (error) {
        alert('計算錯誤：' + error.message);
    }
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    shouldResetScreen = false;
    updateDisplay();
}

function deleteLast() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// 鍵盤支持
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-') {
        appendOperator(key);
    } else if (key === '*') {
        appendOperator('×');
    } else if (key === '/') {
        appendOperator('÷');
    } else if (key === '%') {
        appendOperator('%');
    } else if (key === '^') {
        calculateFunction('pow');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'i' || key === 'I') {
        appendNumber('i');
    } else if (key === 'e' || key === 'E') {
        appendConstant('e');
    } else if (key === 'p' || key === 'P') {
        appendConstant('π');
    }
});

// 初始化顯示
updateDisplay(); 