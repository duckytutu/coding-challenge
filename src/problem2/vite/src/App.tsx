import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRightLeft } from 'lucide-react'

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

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();

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

  const handleSwapCurrencies = () => {
    const currentFrom = watch('fromCurrency');
    const currentTo = watch('toCurrency');
    const currentAmount = watch('amount');
    
    // Swap currencies
    setValue('fromCurrency', currentTo);
    setValue('toCurrency', currentFrom);
    
    // Recalculate the converted amount if we have all required values
    if (currentAmount > 0 && currentTo && currentFrom) {
      const fromPrice = currencyPrices[currentTo].price; // Note: using swapped currencies
      const toPrice = currencyPrices[currentFrom].price;
      
      const amountInUSD = currentAmount * fromPrice;
      const converted = amountInUSD / toPrice;
      
      setConvertedAmount(converted.toFixed(6));
    }
  };

  const fromCurrency = watch('fromCurrency');
  const toCurrency = watch('toCurrency');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Swap</h1>
          
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    id="fromCurrency"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-4"
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
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                      }}
                    />
                  )}
                </div>
                {errors.fromCurrency && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromCurrency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount to send
                </label>
                <input
                  id="amount"
                  type="number"
                  step="any"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-4"
                  {...register('amount', { 
                    required: 'Please enter a valid amount',
                    min: { value: 0, message: 'Amount must be greater than 0' }
                  })}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRightLeft className="w-10 h-10 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    id="toCurrency"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-4"
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
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/default.svg';
                      }}
                    />
                  )}
                </div>
                {errors.toCurrency && (
                  <p className="mt-1 text-sm text-red-600">{errors.toCurrency.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="output-amount" className="block text-sm font-medium text-gray-700">
                  Amount to receive
                </label>
                <input
                  id="output-amount"
                  type="number"
                  value={convertedAmount}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-12 px-4"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              CONFIRM SWAP
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
