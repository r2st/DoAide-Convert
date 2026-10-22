import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { API_BASE } from './registry';

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const baseName = (name) => name.replace(/\.[^.]+$/, '');

// Posts each file to `endpoint` in turn and collects per-file results, so one
// bad file doesn't sink the batch.
async function processBatch(files, endpoint, outName, onProgress) {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress(i + 1, files.length);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(endpoint, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      results.push({ ok: true, url: URL.createObjectURL(blob), name: outName(file), originalSize: file.size, newSize: blob.size });
    } catch (e) {
      results.push({ ok: false, name: file.name, error: e.message });
    }
  }
  return results;
}

function downloadAll(results) {
  results.filter((r) => r.ok).forEach((r, i) => {
    setTimeout(() => {
      const a = document.createElement('a');
      a.href = r.url;
      a.download = r.name;
      a.click();
    }, i * 300);
  });
}

function BatchResults({ results }) {
  if (!results?.length) return null;
  const ok = results.filter((r) => r.ok);
  return (
    <div className="space-y-2">
      {results.map((r, i) => (
        <div key={i} className={`p-3 bg-da-surface border rounded-lg flex flex-col sm:flex-row sm:items-center gap-2 ${r.ok ? 'border-da-teal/30' : 'border-red-500/40'}`}>
          <span className="text-sm text-da-text break-all flex-1">{r.name}</span>
          {r.ok ? (
            <>
              {r.originalSize != null && <span className="text-xs text-da-text-faint font-mono">{kb(r.originalSize)} → {kb(r.newSize)}</span>}
              <a href={r.url} download={r.name} className="px-4 py-2.5 min-h-[44px] inline-flex items-center justify-center bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition text-sm">Download</a>
            </>
          ) : (
            <span className="text-xs text-red-400">Failed: {r.error}</span>
          )}
        </div>
      ))}
      {ok.length > 1 && (
        <button onClick={() => downloadAll(results)}
          className="w-full px-4 py-3 min-h-[48px] bg-da-teal/20 text-da-teal rounded-lg hover:bg-da-teal/30 transition font-medium">
          Download all ({ok.length} files)
        </button>
      )}
    </div>
  );
}

export function ImageCompress() {
  const [quality, setQuality] = useState(75);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);

  const handleFiles = async (files) => {
    setResults(null);
    const batch = await processBatch(
      files,
      `${API_BASE}/api/image/compress?quality=${quality}`,
      (f) => `${baseName(f.name)}_compressed.jpg`,
      (done, total) => setProgress({ done, total }),
    );
    setProgress(null);
    setResults(batch);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-da-text-muted">Quality:</label>
        <input type="range" min={1} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
          className="flex-1" />
        <span className="text-da-teal font-mono">{quality}%</span>
      </div>
      <FileUpload multiple onFiles={handleFiles} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop images to compress — multiple files supported" />
      {progress && <p className="text-da-teal">Compressing {progress.done} of {progress.total}…</p>}
      <BatchResults results={results} />
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
          <label className="block text-sm text-da-text-muted mb-1">Width (px)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1}
            className="w-full px-4 py-3 bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none" />
        </div>
        <div>
          <label className="block text-sm text-da-text-muted mb-1">Height (px)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1}
            className="w-full px-4 py-3 bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none" />
        </div>
      </div>
      <FileUpload onFile={handleFile} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'] }} label="Drop an image to resize" />
      {loading && <p className="text-da-teal">Resizing...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg">
          <a href={result.url} download={result.name} className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download Resized Image</a>
        </div>
      )}
    </div>
  );
}

export function ImageConvert() {
  const [format, setFormat] = useState('jpg');
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState(null);

  const handleFiles = async (files) => {
    setResults(null);
    const batch = await processBatch(
      files,
      `${API_BASE}/api/image/convert?output_format=${format}`,
      (f) => `${baseName(f.name)}.${format}`,
      (done, total) => setProgress({ done, total }),
    );
    setProgress(null);
    setResults(batch);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-da-text-muted mb-1">Output Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}
          className="w-full px-4 py-3 min-h-[48px] text-base bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none">
          <option value="jpg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WebP</option>
          <option value="bmp">BMP</option>
          <option value="gif">GIF</option>
          <option value="tiff">TIFF</option>
          <option value="ico">ICO (favicon)</option>
        </select>
      </div>
      <FileUpload multiple onFiles={handleFiles} accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.tiff'] }} label="Drop images to convert — multiple files supported" />
      {progress && <p className="text-da-teal">Converting {progress.done} of {progress.total}…</p>}
      <BatchResults results={results} />
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
      {loading && <p className="text-da-teal">Converting...</p>}
      {result && (
        <div className="space-y-2">
          <p className="text-sm text-da-text-muted">Size: {(result.size / 1024).toFixed(1)} KB | Type: {result.mime_type}</p>
          <textarea value={`data:${result.mime_type};base64,${result.base64}`} readOnly rows={6}
            className="w-full px-4 py-3 bg-da-surface border border-da-teal/30 rounded-lg text-green-400 font-mono text-xs outline-none resize-y" />
          <button onClick={() => navigator.clipboard.writeText(`data:${result.mime_type};base64,${result.base64}`)}
            className="px-4 py-2 bg-da-teal/20 text-da-teal rounded-lg hover:bg-da-teal/30 transition text-sm">Copy to Clipboard</button>
        </div>
      )}
    </div>
  );
}
