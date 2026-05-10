let billRawDigits = '';
let toastTimeout;

// ── Theme ─────────────────────────────────────────────────────
const THEMES = [null, 'dark', 'light']; // null = follow OS
const THEME_LABELS = { null: 'Auto', dark: 'Dark', light: 'Light' };

function applyTheme(theme) {
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  // Button may not exist yet when called before DOM is ready
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = THEME_LABELS[theme] ?? 'Auto';
}

// Apply data-theme immediately so the page never flashes the wrong colors
applyTheme(localStorage.getItem('theme') || null);

document.addEventListener('DOMContentLoaded', () => {
  // Sync button label now that DOM exists
  applyTheme(localStorage.getItem('theme') || null);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = localStorage.getItem('theme') || null;
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    if (next) {
      localStorage.setItem('theme', next);
    } else {
      localStorage.removeItem('theme');
    }
    applyTheme(next);
  });

  // Restore bill amount for this session
  const savedBill = sessionStorage.getItem('billRawDigits');
  if (savedBill) {
    billRawDigits = savedBill;
    updateBillDisplay();
  }

  // Restore user preferences
  const savedTipPercentage = localStorage.getItem('tipPercentage');
  const savedTipOption = localStorage.getItem('tipOption');

  if (savedTipPercentage) {
    document.getElementById('tipPercentage').value = savedTipPercentage;
    updateTipValueDisplay(savedTipPercentage);
  }

  if (savedTipOption) {
    document.getElementById('tipOption').value = savedTipOption;
    toggleSurveyInputs();
  }

  ['serviceRating', 'foodRating', 'drinksRating', 'atmosphereRating'].forEach(id => {
    const saved = localStorage.getItem(id);
    if (saved) document.getElementById(id).value = saved;
  });

  calculateTip();

  // Tap total row to copy to clipboard
  const totalRow = document.getElementById('totalRow');
  totalRow.addEventListener('click', copyTotal);
  totalRow.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyTotal(); }
  });
});

function copyTotal() {
  const amount = document.getElementById('totalAmount').textContent;
  navigator.clipboard?.writeText(amount).catch(() => {});
  showToast('Copied ' + amount);
}

// Tip slider
document.getElementById('tipPercentage').addEventListener('input', function () {
  updateTipValueDisplay(this.value);
  localStorage.setItem('tipPercentage', this.value);
  calculateTip();
});

// Tip option
document.getElementById('tipOption').addEventListener('change', function () {
  localStorage.setItem('tipOption', this.value);
  toggleSurveyInputs();
});

// Survey ratings
['serviceRating', 'foodRating', 'drinksRating', 'atmosphereRating'].forEach(id => {
  document.getElementById(id).addEventListener('change', function () {
    localStorage.setItem(id, this.value);
    calculateTip();
  });
});

function updateTipValueDisplay(value) {
  document.getElementById('tipValue').textContent = value + '%';
  document.getElementById('tipPercentage').setAttribute('aria-valuetext', value + '%');
}

function appendNumber(number) {
  billRawDigits += number;
  updateBillDisplay();
  calculateTip();
}

function backspace() {
  billRawDigits = billRawDigits.slice(0, -1);
  updateBillDisplay();
  calculateTip();
}

function clearAmount() {
  billRawDigits = '';
  updateBillDisplay();
  calculateTip();
}

function updateBillDisplay() {
  const formatted = formatAmount(billRawDigits);
  document.getElementById('billDisplay').textContent = formatted ? '$' + formatted : '$0.00';
  sessionStorage.setItem('billRawDigits', billRawDigits);
}

function getBillAmount() {
  return parseFloat(formatAmount(billRawDigits)) || 0;
}

function formatAmount(digits) {
  digits = String(digits).replace(/\D/g, '');
  if (!digits) return '';
  // Pad to at least 3 chars so we always have dollars + 2-digit cents
  const padded = digits.padStart(3, '0');
  const dollars = padded.slice(0, -2).replace(/^0+/, '') || '0';
  const cents = padded.slice(-2);
  return dollars + '.' + cents;
}

function toggleSurveyInputs() {
  const tipOption = document.getElementById('tipOption').value;
  document.getElementById('surveyInputs').classList.toggle('visible', tipOption === 'survey');
  calculateTip();
}

function calculateTip() {
  const billAmount = getBillAmount();
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
    case 'survey': {
      const serviceRating = parseFloat(document.getElementById('serviceRating').value) || 0;
      const foodRating = parseFloat(document.getElementById('foodRating').value) || 0;
      const drinksRating = parseFloat(document.getElementById('drinksRating').value) || 0;
      const atmosphereRating = parseFloat(document.getElementById('atmosphereRating').value) || 0;

      const weightedRating = (serviceRating * 0.6) + (foodRating * 0.15) + (drinksRating * 0.15) + (atmosphereRating * 0.1);
      const maxTipPercentage = (tipPercentage / 100) * 1.25;
      const minTipPercentage = (tipPercentage / 100) / 2;
      const calculatedTipPercentage = Math.min(
        Math.max(weightedRating / 3 * (tipPercentage / 100), minTipPercentage),
        maxTipPercentage
      );

      tipAmount = billAmount * calculatedTipPercentage;
      totalAmount = billAmount + tipAmount;

      if (serviceRating >= 4) {
        totalAmount = Math.ceil(totalAmount);
        tipAmount = totalAmount - billAmount;
      } else if (serviceRating <= 2) {
        totalAmount = Math.floor(totalAmount);
        tipAmount = totalAmount - billAmount;
      } else {
        totalAmount = Math.round(totalAmount);
        tipAmount = totalAmount - billAmount;
      }
      break;
    }
  }

  if (tipAmount < 0) tipAmount = 0;
  if (totalAmount < billAmount) totalAmount = billAmount;

  const effectiveTip = billAmount > 0 ? (tipAmount / billAmount) * 100 : 0;

  document.getElementById('effectiveTipPercentage').textContent = `${effectiveTip.toFixed(2)}%`;
  document.getElementById('billResult').textContent = `$${billAmount.toFixed(2)}`;
  document.getElementById('tipAmount').textContent = `$${tipAmount.toFixed(2)}`;
  document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2000);
}
