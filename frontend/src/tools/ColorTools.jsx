import { useState } from 'react';

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substr(0, 2), 16), g: parseInt(h.substr(2, 2), 16), b: parseInt(h.substr(4, 2), 16) };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function ColorPicker() {
  const [hex, setHex] = useState('#F0B429');
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)}
          className="w-20 h-20 rounded-lg cursor-pointer border-0" />
        <div className="space-y-1">
          <p className="text-sm text-gray-400">HEX: <span className="text-white font-mono">{hex.toUpperCase()}</span></p>
          <p className="text-sm text-gray-400">RGB: <span className="text-white font-mono">rgb({rgb.r}, {rgb.g}, {rgb.b})</span></p>
          <p className="text-sm text-gray-400">HSL: <span className="text-white font-mono">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span></p>
        </div>
      </div>
      <div className="h-24 rounded-lg border border-dark-border" style={{ backgroundColor: hex }} />
    </div>
  );
}

export function ColorPalette() {
  const [baseHex, setBaseHex] = useState('#F0B429');
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const palette = [
    { label: 'Complement', h: (hsl.h + 180) % 360 },
    { label: 'Analogous 1', h: (hsl.h + 30) % 360 },
    { label: 'Analogous 2', h: (hsl.h + 330) % 360 },
    { label: 'Triadic 1', h: (hsl.h + 120) % 360 },
    { label: 'Triadic 2', h: (hsl.h + 240) % 360 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input type="color" value={baseHex} onChange={(e) => setBaseHex(e.target.value)}
          className="w-16 h-16 rounded-lg cursor-pointer border-0" />
        <p className="text-gray-400">Pick a base color to generate a palette</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="text-center">
          <div className="h-20 rounded-lg border border-dark-border" style={{ backgroundColor: baseHex }} />
          <p className="text-xs text-gray-400 mt-1">Base</p>
        </div>
        {palette.map((p) => {
          const c = `hsl(${p.h}, ${hsl.s}%, ${hsl.l}%)`;
          return (
            <div key={p.label} className="text-center">
              <div className="h-20 rounded-lg border border-dark-border" style={{ backgroundColor: c }} />
              <p className="text-xs text-gray-400 mt-1">{p.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContrastChecker() {
  const [fg, setFg] = useState('#FFFFFF');
  const [bg, setBg] = useState('#0a0a0a');

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const l1 = luminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = luminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  const aaLarge = ratio >= 3;
  const aa = ratio >= 4.5;
  const aaaLarge = ratio >= 4.5;
  const aaa = ratio >= 7;

  const badge = (pass) => (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${pass ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {pass ? 'PASS' : 'FAIL'}
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Foreground Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)}
              className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-gold outline-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-12 h-10 rounded cursor-pointer border-0" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)}
              className="flex-1 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white font-mono focus:border-gold outline-none" />
          </div>
        </div>
      </div>
      <div className="p-6 rounded-lg border border-dark-border" style={{ backgroundColor: bg, color: fg }}>
        <p className="text-2xl font-bold">Sample Text Preview</p>
        <p className="text-sm mt-1">The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div className="p-4 bg-dark-card border border-dark-border rounded-lg">
        <p className="text-lg font-bold mb-2">Contrast Ratio: <span className="text-gold">{ratio.toFixed(2)}:1</span></p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>AA Large Text {badge(aaLarge)}</div>
          <div>AA Normal Text {badge(aa)}</div>
          <div>AAA Large Text {badge(aaaLarge)}</div>
          <div>AAA Normal Text {badge(aaa)}</div>
        </div>
      </div>
    </div>
  );
}
