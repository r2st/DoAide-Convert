import { useState } from 'react';

const UNITS = {
  length: {
    label: 'Length',
    units: { km: 1000, miles: 1609.344, meters: 1, feet: 0.3048, inches: 0.0254, cm: 0.01 },
  },
  weight: {
    label: 'Weight',
    units: { kg: 1, lbs: 0.453592, grams: 0.001, ounces: 0.0283495, tons: 907.185 },
  },
  temperature: { label: 'Temperature', units: { '°C': 'C', '°F': 'F', K: 'K' } },
  area: {
    label: 'Area',
    units: { 'sq ft': 0.092903, 'sq m': 1, acres: 4046.86, hectares: 10000, 'sq km': 1000000 },
  },
  volume: {
    label: 'Volume',
    units: { liters: 1, gallons: 3.78541, cups: 0.236588, ml: 0.001 },
  },
  speed: {
    label: 'Speed',
    units: { 'km/h': 0.277778, mph: 0.44704, 'm/s': 1, knots: 0.514444 },
  },
  time: {
    label: 'Time',
    units: { seconds: 1, minutes: 60, hours: 3600, days: 86400 },
  },
  'data-storage': {
    label: 'Data Storage',
    units: { bytes: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  },
};

function convertTemp(value, from, to) {
  let celsius;
  if (from === 'C') celsius = value;
  else if (from === 'F') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'C') return celsius;
  if (to === 'F') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

export default function UnitConverter({ type }) {
  const config = UNITS[type];
  const unitNames = Object.keys(config.units);
  const [value, setValue] = useState('');
  const [from, setFrom] = useState(unitNames[0]);
  const [to, setTo] = useState(unitNames[1]);

  const isTemp = type === 'temperature';
  let result = '';
  if (value !== '' && !isNaN(Number(value))) {
    const num = Number(value);
    if (isTemp) {
      result = convertTemp(num, config.units[from], config.units[to]).toFixed(4);
    } else {
      const baseValue = num * config.units[from];
      result = (baseValue / config.units[to]).toFixed(6);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none"
          >
            {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none"
          >
            {unitNames.map((u) => <option key={u} value={u}>{u}</option>)}
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
