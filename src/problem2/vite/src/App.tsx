import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface CurrencyPrice {
  price: number;
  date: string;
}

interface CurrencyPrices {
  [key: string]: CurrencyPrice;
}

interface FormData {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
}

interface CurrencyData {
  currency: string;
  price: number;
  date: string;
}

function App() {
  const [currencyPrices, setCurrencyPrices] = useState<CurrencyPrices>({});
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [convertedAmount, setConvertedAmount] = useState<string>('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    fetchCurrencyData();
  }, []);

  const fetchCurrencyData = async () => {
    try {
      const response = await fetch('https://interview.switcheo.com/prices.json');
      const data: CurrencyData[] = await response.json();
      
      const prices: CurrencyPrices = {};
      data.forEach((item: CurrencyData) => {
        if (!prices[item.currency] || new Date(item.date) > new Date(prices[item.currency].date)) {
          prices[item.currency] = {
            price: item.price,
            date: item.date
          };
        }
      });
      
      setCurrencyPrices(prices);
      setCurrencies(Object.keys(prices));
    } catch (error) {
      console.error('Error fetching currency data:', error);
    }
  };

  const onSubmit = (data: FormData) => {
    const { amount, fromCurrency, toCurrency } = data;
    if (fromCurrency && toCurrency && amount > 0) {
      const fromPrice = currencyPrices[fromCurrency].price;
      const toPrice = currencyPrices[toCurrency].price;
      
      const amountInUSD = amount * fromPrice;
      const converted = amountInUSD / toPrice;
      
      setConvertedAmount(converted.toFixed(6));
    }
  };

  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Swap</h1>
        
        <div className="form-group">
          <label htmlFor="amount">Amount to send</label>
          <input
            id="amount"
            type="number"
            step="any"
            min="0"
            {...register('amount', { 
              required: 'Please enter a valid amount',
              min: { value: 0, message: 'Amount must be greater than 0' }
            })}
          />
          {errors.amount && <span className="error">{errors.amount.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fromCurrency">Currency</label>
          <div className="currency-container">
            <select
              id="fromCurrency"
              {...register('fromCurrency', { required: 'Please select a currency' })}
            >
              <option value="">Select a currency</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            {fromCurrency && (
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${fromCurrency}.svg`}
                alt={fromCurrency}
                className="currency-icon"
                onError={(e) => {
                  e.currentTarget.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                }}
              />
            )}
          </div>
          {errors.fromCurrency && <span className="error">{errors.fromCurrency.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="toCurrency">Currency</label>
          <div className="currency-container">
            <select
              id="toCurrency"
              {...register('toCurrency', { required: 'Please select a currency' })}
            >
              <option value="">Select a currency</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            {toCurrency && (
              <img
                src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${toCurrency}.svg`}
                alt={toCurrency}
                className="currency-icon"
                onError={(e) => {
                  e.currentTarget.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                }}
              />
            )}
          </div>
          {errors.toCurrency && <span className="error">{errors.toCurrency.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="output-amount">Amount to receive</label>
          <input
            id="output-amount"
            type="number"
            value={convertedAmount}
            readOnly
          />
        </div>

        <button type="submit">CONFIRM SWAP</button>
      </form>
    </div>
  )
}

export default App
