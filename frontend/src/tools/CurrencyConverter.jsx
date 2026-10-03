import { useState, useEffect } from 'react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

export default function CurrencyConverter() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((r) => r.json())
      .then((data) => {
        setRates(data.rates);
        setLoading(false);
      })
      .catch(() => {
        setRates({ USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5 });
        setLoading(false);
      });
  }, []);

  let result = '';
  if (value && rates && !isNaN(Number(value))) {
    const inUsd = Number(value) / rates[from];
    result = (inUsd * rates[to]).toFixed(2);
  }

  return (
    <div className="space-y-4">
      {loading && <p className="text-gray-400 text-sm">Loading live rates...</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <select value={from} onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none">
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <p className="text-sm text-gray-400">Result</p>
          <p className="text-2xl font-bold text-gold">{result} <span className="text-lg text-white">{to}</span></p>
        </div>
      )}
    </div>
  );
}
