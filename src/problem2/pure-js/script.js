let currencyPrices = {};

// Function to fetch currency data
async function fetchCurrencyData() {
    try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data = await response.json();
        
        // Get unique currencies and their latest prices
        data.forEach(item => {
            // Keep only the latest price for each currency
            if (!currencyPrices[item.currency] || new Date(item.date) > new Date(currencyPrices[item.currency].date)) {
                currencyPrices[item.currency] = {
                    price: item.price,
                    date: item.date
                };
            }
        });
        
        // Get unique currencies
        const uniqueCurrencies = Object.keys(currencyPrices);
        
        // Select currency from
        const selectElementFrom = document.getElementById('currency-from');
        uniqueCurrencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = currency;
            selectElementFrom.appendChild(option);
        });

        // Select currency to
        const selectElementTo = document.getElementById('currency-to');
        uniqueCurrencies.forEach(currency => {
            if (currency !== selectElementFrom.value) {
                const option = document.createElement('option');
                option.value = currency;
                option.textContent = currency;
                selectElementTo.appendChild(option);
            }
        });

        // Add event listeners for currency selection
        selectElementFrom.addEventListener('change', (e) => {
            const icon = document.getElementById('currency-from-icon');
            if (e.target.value) {
                icon.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${e.target.value}.svg`;
                icon.alt = e.target.value;
                icon.style.display = 'block';
                icon.onerror = () => {
                    icon.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                };
            } else {
                icon.style.display = 'none';
            }
        });

        selectElementTo.addEventListener('change', (e) => {
            const icon = document.getElementById('currency-to-icon');
            if (e.target.value) {
                icon.src = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${e.target.value}.svg`;
                icon.alt = e.target.value;
                icon.style.display = 'block';
                icon.onerror = () => {
                    icon.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                };
            } else {
                icon.style.display = 'none';
            }
        });

        

    } catch (error) {
        console.error('Error fetching currency data:', error);
    }
}

// Function to convert currency
function convertCurrency() {
  const fromCurrency = document.getElementById('currency-from').value;
  const toCurrency = document.getElementById('currency-to').value;
  const amount = parseFloat(document.getElementById('input-amount').value) || 0;
  const outputAmount = document.getElementById('output-amount');

  if (fromCurrency && toCurrency && amount > 0) {
      // Convert through USD as base currency
      const fromPrice = currencyPrices[fromCurrency].price;
      const toPrice = currencyPrices[toCurrency].price;
      
      // Convert to USD first, then to target currency
      const amountInUSD = amount * fromPrice;
      const convertedAmount = amountInUSD / toPrice;
      
      // Round to 6 decimal places
      outputAmount.value = convertedAmount.toFixed(6);
      return true;
  }
  return false;
}

// Function to show error message
function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('invalid');
}

// Function to hide error message
function hideError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);
    errorElement.style.display = 'none';
    input.classList.remove('invalid');
}

// Function to validate form
function validateForm(event) {
    event.preventDefault();
    let isValid = true;
    const form = event.target;
    
    // Validate input amount
    const inputAmount = form.querySelector('#input-amount');
    if (!inputAmount.value || isNaN(inputAmount.value) || parseFloat(inputAmount.value) <= 0) {
        showError(inputAmount, 'Please enter a valid amount greater than 0');
        isValid = false;
    } else {
        hideError(inputAmount);
    }
    
    // Validate currency
    const currencyFrom = form.querySelector('#currency-from');
    const currencyTo = form.querySelector('#currency-to');
    if (!currencyFrom.value || !currencyTo.value) {
        showError(currencyFrom, 'Please select a currency');
        showError(currencyTo, 'Please select a currency');
        isValid = false;
    } else {
        hideError(currencyFrom);
        hideError(currencyTo);
    }
    
    if (isValid) {
      convertCurrency();
    }
}

// Add event listeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencyData();
    
    const form = document.querySelector('form');
    form.addEventListener('submit', validateForm);
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                hideError(input);
            }
        });
    });
});
