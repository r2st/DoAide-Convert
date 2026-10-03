import { useState } from 'react';

export default function NumberSystems() {
  const [input, setInput] = useState('');
  const [base, setBase] = useState('10');

  const parsed = parseInt(input, Number(base));
  const valid = !isNaN(parsed) && input.trim() !== '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a number"
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Input Base</label>
          <select value={base} onChange={(e) => setBase(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none">
            <option value="10">Decimal (10)</option>
            <option value="2">Binary (2)</option>
            <option value="8">Octal (8)</option>
            <option value="16">Hexadecimal (16)</option>
          </select>
        </div>
      </div>
      {valid && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Decimal', val: parsed.toString(10) },
            { label: 'Binary', val: parsed.toString(2) },
            { label: 'Octal', val: parsed.toString(8) },
            { label: 'Hex', val: parsed.toString(16).toUpperCase() },
          ].map((r) => (
            <div key={r.label} className="p-4 bg-dark-card border border-dark-border rounded-lg">
              <p className="text-sm text-gray-400">{r.label}</p>
              <p className="text-lg font-mono text-gold break-all">{r.val}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
