document.addEventListener('DOMContentLoaded', (event) => {
  // Load saved values from localStorage
  const savedTipPercentage = localStorage.getItem('tipPercentage');
  const savedTipOption = localStorage.getItem('tipOption');
  const savedServiceRating = localStorage.getItem('serviceRating');
  const savedFoodRating = localStorage.getItem('foodRating');
  const savedDrinksRating = localStorage.getItem('drinksRating');
  const savedAtmosphereRating = localStorage.getItem('atmosphereRating');

  if (savedTipPercentage) {
    document.getElementById('tipPercentage').value = savedTipPercentage;
    document.getElementById('tipValue').innerText = savedTipPercentage + '%';
  }

  if (savedTipOption) {
    document.getElementById('tipOption').value = savedTipOption;
    toggleSurveyInputs();
  }

  if (savedServiceRating) {
    document.getElementById('serviceRating').value = savedServiceRating;
  }

  if (savedFoodRating) {
    document.getElementById('foodRating').value = savedFoodRating;
  }

  if (savedDrinksRating) {
    document.getElementById('drinksRating').value = savedDrinksRating;
  }

  if (savedAtmosphereRating) {
    document.getElementById('atmosphereRating').value = savedAtmosphereRating;
  }

  calculateTip();
});

document.getElementById('tipPercentage').addEventListener('input', function () {
  document.getElementById('tipValue').innerText = this.value + '%';
  localStorage.setItem('tipPercentage', this.value);
  calculateTip();
});

document.getElementById('billAmount').addEventListener('input', calculateTip);
document.getElementById('tipOption').addEventListener('change', function () {
  localStorage.setItem('tipOption', this.value);
  calculateTip();
});

document.getElementById('serviceRating').addEventListener('change', function () {
  localStorage.setItem('serviceRating', this.value);
  calculateTip();
});

document.getElementById('foodRating').addEventListener('change', function () {
  localStorage.setItem('foodRating', this.value);
  calculateTip();
});

document.getElementById('drinksRating').addEventListener('change', function () {
  localStorage.setItem('drinksRating', this.value);
  calculateTip();
});

document.getElementById('atmosphereRating').addEventListener('change', function () {
  localStorage.setItem('atmosphereRating', this.value);
  calculateTip();
});

function appendNumber(number) {
  const billAmountInput = document.getElementById('billAmount');
  billAmountInput.value = formatAmount(billAmountInput.value + number);
  calculateTip();
}

function backspace() {
  const billAmountInput = document.getElementById('billAmount');
  billAmountInput.value = formatAmount(billAmountInput.value.slice(0, -1));
  calculateTip();
}

function clearAmount() {
  document.getElementById('billAmount').value = '';
  calculateTip();
}

function formatAmount(amount) {
  amount = amount.replace(/\D/g, '');
  if (amount.length === 0) {
    return '';
  } else if (amount.length === 1) {
    return '0.0' + amount;
  } else if (amount.length === 2) {
    return '0.' + amount;
  } else {
    // Remove leading zeroes
    amount = amount.replace(/^0+/, '');
    return amount.slice(0, -2) + '.' + amount.slice(-2);
  }
}

function toggleSurveyInputs() {
  const tipOption = document.getElementById('tipOption').value;
  const surveyInputs = document.getElementById('surveyInputs');
  if (tipOption === 'survey') {
    surveyInputs.style.display = 'block';
  } else {
    surveyInputs.style.display = 'none';
  }
  calculateTip();
}

function calculateTip() {
  const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
  const tipPercentage = parseFloat(document.getElementById('tipPercentage').value) || 0;
  const tipOption = document.getElementById('tipOption').value;

  let tipAmount = billAmount * (tipPercentage / 100);
  let totalAmount = billAmount + tipAmount;

  switch (tipOption) {
    case 'roundTipUp':
      tipAmount = Math.ceil(tipAmount);
      break;
    case 'roundTipDown':
      tipAmount = Math.floor(tipAmount);
      break;
    case 'roundTotalUp':
      totalAmount = Math.ceil(totalAmount);
      tipAmount = totalAmount - billAmount;
      break;
    case 'roundTotalDown':
      totalAmount = Math.floor(totalAmount);
      tipAmount = totalAmount - billAmount;
      break;
    case 'survey':
      const serviceRating = parseFloat(document.getElementById('serviceRating').value) || 0;
      const foodRating = parseFloat(document.getElementById('foodRating').value) || 0;
      const drinksRating = parseFloat(document.getElementById('drinksRating').value) || 0;
      const atmosphereRating = parseFloat(document.getElementById('atmosphereRating').value) || 0;

      const weightedRating = (serviceRating * 0.6) + (foodRating * 0.15) + (drinksRating * 0.15) + (atmosphereRating * 0.1);
      const maxTipPercentage = (tipPercentage / 100) * 1.25;
      const minTipPercentage = (tipPercentage / 100) / 2;
      // const calculatedTipPercentage = Math.min(Math.max(weightedRating / 3 * 0.2, minTipPercentage), maxTipPercentage);
      const calculatedTipPercentage = Math.min(Math.max(weightedRating / 3 * (tipPercentage / 100), minTipPercentage), maxTipPercentage);

      tipAmount = billAmount * calculatedTipPercentage;
      totalAmount = billAmount + tipAmount;

      // Adjust total amount based on service rating
      if (serviceRating >= 4) {
        // Round total up
        // A
        totalAmount = Math.ceil(totalAmount);
        tipAmount = totalAmount - billAmount;
      } else if (serviceRating <= 2) {
        // Round total down
        // F, D, or C
        totalAmount = Math.floor(totalAmount);
        tipAmount = totalAmount - billAmount;
      } else {
        // Round to nearest dollar
        // B
        totalAmount = Math.round(totalAmount);
        tipAmount = totalAmount - billAmount;
      }
      break;
  }

  // Ensure tip amount is never below zero
  if (tipAmount < 0) {
    tipAmount = 0;
  }

  // Ensure total amount is never below bill amount
  if (totalAmount < billAmount) {
    totalAmount = billAmount;
  }

  const effectiveTipPercentage = (tipAmount / billAmount) * 100;

  document.getElementById('effectiveTipPercentage').innerText = `${isNaN(effectiveTipPercentage) ? '0' : effectiveTipPercentage.toFixed(2)}%`;
  document.getElementById('billResult').innerText = `$${isNaN(billAmount) ? '0.00' : billAmount.toFixed(2)}`;
  document.getElementById('tipAmount').innerText = `$${isNaN(tipAmount) ? '0.00' : tipAmount.toFixed(2)}`;
  document.getElementById('totalAmount').innerText = `$${isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)}`;

}