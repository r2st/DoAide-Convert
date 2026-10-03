import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { API_BASE } from './registry';

export function ImageCompress() {
  const [quality, setQuality] = useState(75);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/image/compress?quality=${quality}`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Compression failed');
      const blob = await res.blob();
      setResult({ url: URL.createObjectURL(blob), name: 'compressed.jpg', originalSize: file.size, newSize: blob.size });
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">Quality:</label>
        <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
          className="flex-1" />
        <span className="text-gold font-mono">{quality}%</span>
      </div>
      <FileUpload onFile={handleFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop an image to compress" />
      {loading && <p className="text-gold">Compressing...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <p className="text-sm text-gray-400">Original: {(result.originalSize / 1024).toFixed(1)} KB → Compressed: {(result.newSize / 1024).toFixed(1)} KB</p>
          <a href={result.url} download={result.name} className="inline-block mt-2 px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download</a>
        </div>
      )}
    </div>
  );
}

export function ImageResize() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/image/resize?width=${width}&height=${height}`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Resize failed');
      const blob = await res.blob();
      setResult({ url: URL.createObjectURL(blob), name: `resized_${width}x${height}.png` });
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Width (px)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Height (px)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none" />
        </div>
      </div>
      <FileUpload onFile={handleFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop an image to resize" />
      {loading && <p className="text-gold">Resizing...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <a href={result.url} download={result.name} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download Resized Image</a>
        </div>
      )}
    </div>
  );
}

export function ImageConvert() {
  const [format, setFormat] = useState('jpg');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/image/convert?output_format=${format}`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      setResult({ url: URL.createObjectURL(blob), name: `converted.${format}` });
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Output Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}
          className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none">
          <option value="jpg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
          <option value="bmp">BMP</option>
        </select>
      </div>
      <FileUpload onFile={handleFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop an image to convert" />
      {loading && <p className="text-gold">Converting...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <a href={result.url} download={result.name} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download {format.toUpperCase()}</a>
        </div>
      )}
    </div>
  );
}

export function ImageToBase64() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/image/to-base64`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop an image to convert to Base64" />
      {loading && <p className="text-gold">Converting...</p>}
      {result && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Size: {(result.size / 1024).toFixed(1)} KB | Type: {result.mime_type}</p>
          <textarea value={`data:${result.mime_type};base64,${result.base64}`} readOnly rows={6}
            className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-xs outline-none resize-y" />
          <button onClick={() => navigator.clipboard.writeText(`data:${result.mime_type};base64,${result.base64}`)}
            className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition text-sm">Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
}
