function calculate(op) {
    const num1 = parseFloat(document.getElementById('calcNum1').value);
    const num2 = parseFloat(document.getElementById('calcNum2').value);
    let res = 0;

    if (isNaN(num1) || isNaN(num2)) {
        document.getElementById('calcResult').innerText = "Result: Please enter valid numbers.";
        return;
    }

    switch(op) {
        case '+': res = num1 + num2; break;
        case '-': res = num1 - num2; break;
        case '*': res = num1 * num2; break;
        case '/': res = num2 !== 0 ? num1 / num2 : 'Cannot divide by zero'; break;
    }
    document.getElementById('calcResult').innerText = "Result: " + res;
}

function checkBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const heightCm = parseFloat(document.getElementById('bmiHeight').value);

    if (isNaN(weight) || isNaN(heightCm) || heightCm <= 0) {
        document.getElementById('bmiResult').innerText = "Result: Enter valid height/weight.";
        return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);
    let status = "";

    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 25) status = "Normal weight";
    else if (bmi < 30) status = "Overweight";
    else status = "Obese";

    document.getElementById('bmiResult').innerText = `Result: BMI is ${bmi} (${status})`;
}

function calcZakatTax() {
    const income = parseFloat(document.getElementById('annualIncome').value);
    if (isNaN(income) || income < 0) {
        document.getElementById('zakatTaxResult').innerText = "Result: Enter a valid income.";
        return;
    }

    const zakat = (income * 0.025).toFixed(2);
    document.getElementById('zakatTaxResult').innerText = `Result: Zakat Payable (2.5%) = RM ${zakat}`;
}

function convertUnit(type) {
    const val = parseFloat(document.getElementById('unitInput').value);
    if (isNaN(val)) {
        document.getElementById('unitResult').innerText = "Result: Please enter a number.";
        return;
    }

    let resultText = "";
    switch(type) {
        case 'cmToM':
            resultText = `${val} cm = ${val / 100} m`;
            break;
        case 'mToCm':
            resultText = `${val} m = ${val * 100} cm`;
            break;
        case 'mToKm':
            resultText = `${val} m = ${val / 1000} km`;
            break;
        case 'kmToM':
            resultText = `${val} km = ${val * 1000} m`;
            break;
    }
    document.getElementById('unitResult').innerText = "Result: " + resultText;
}
