import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { API_BASE } from './registry';

export function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFiles = (newFiles) => setFiles((prev) => [...prev, ...newFiles]);

  const merge = async () => {
    if (files.length < 2) { alert('Select at least 2 PDFs'); return; }
    setLoading(true);
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    try {
      const res = await fetch(`${API_BASE}/api/pdf/merge`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Merge failed');
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFiles={handleFiles} accept={{ 'application/pdf': ['.pdf'] }} multiple label="Drop PDF files here (select multiple)" />
      {files.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm text-da-text-muted">{files.length} file(s) selected:</p>
          {files.map((f, i) => <p key={i} className="text-sm text-da-text">{f.name}</p>)}
          <div className="flex gap-2 mt-2">
            <button onClick={merge} className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Merge PDFs</button>
            <button onClick={() => setFiles([])} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">Clear</button>
          </div>
        </div>
      )}
      {loading && <p className="text-da-teal">Merging...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg">
          <a href={result} download="merged.pdf" className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download Merged PDF</a>
        </div>
      )}
    </div>
  );
}

export function PdfCompress() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/pdf/compress`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Compression failed');
      const blob = await res.blob();
      setResult({ url: URL.createObjectURL(blob), originalSize: file.size, newSize: blob.size });
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'application/pdf': ['.pdf'] }} label="Drop a PDF to compress" />
      {loading && <p className="text-da-teal">Compressing...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg">
          <p className="text-sm text-da-text-muted mb-2">Original: {(result.originalSize / 1024).toFixed(1)} KB → Compressed: {(result.newSize / 1024).toFixed(1)} KB</p>
          <a href={result.url} download="compressed.pdf" className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download</a>
        </div>
      )}
    </div>
  );
}

export function JsonToCsv() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/data/json-to-csv`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'application/json': ['.json'] }} label="Drop a JSON file to convert to CSV" />
      {loading && <p className="text-da-teal">Converting...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg">
          <a href={result} download="converted.csv" className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download CSV</a>
        </div>
      )}
    </div>
  );
}

export function CsvToJson() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/data/csv-to-json`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'text/csv': ['.csv'] }} label="Drop a CSV file to convert to JSON" />
      {loading && <p className="text-da-teal">Converting...</p>}
      {result && (
        <div className="space-y-2">
          <textarea value={result} readOnly rows={10}
            className="w-full px-4 py-3 bg-da-surface border border-da-teal/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-y" />
          <button onClick={() => { const blob = new Blob([result], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'converted.json'; a.click(); }}
            className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download JSON</button>
        </div>
      )}
    </div>
  );
}

export function ExcelToCsv() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/data/excel-to-csv`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] }} label="Drop an Excel file (.xlsx) to convert to CSV" />
      {loading && <p className="text-da-teal">Converting...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg">
          <a href={result} download="converted.csv" className="px-4 py-2 bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">Download CSV</a>
        </div>
      )}
    </div>
  );
}

export function PdfToImages() {
  const [format, setFormat] = useState('png');
  const [dpi, setDpi] = useState(150);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/pdf/to-images?output_format=${format}&dpi=${dpi}`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Conversion failed');
      const blob = await res.blob();
      const isZip = blob.type === 'application/zip' || blob.size > 0 && res.headers.get('content-type')?.includes('zip');
      const ext = isZip ? 'zip' : format;
      const name = isZip ? 'pdf_pages.zip' : `page_1.${format}`;
      setResult({ url: URL.createObjectURL(blob), name, originalSize: file.size, newSize: blob.size, isZip });
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-da-text-muted mb-1">Output Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-3 min-h-[48px] text-base bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none">
            <option value="png">PNG</option>
            <option value="jpg">JPEG</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-da-text-muted mb-1">DPI (quality)</label>
          <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))}
            className="w-full px-4 py-3 min-h-[48px] text-base bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none">
            <option value={72}>72 (fast, small)</option>
            <option value={150}>150 (balanced)</option>
            <option value={300}>300 (high quality)</option>
          </select>
        </div>
      </div>
      <FileUpload onFile={handleFile} accept={{ 'application/pdf': ['.pdf'] }} label="Drop a PDF to convert to images" />
      {loading && <p className="text-da-teal">Converting pages to images...</p>}
      {result && (
        <div className="p-4 bg-da-surface border border-da-teal/30 rounded-lg space-y-2">
          <p className="text-sm text-da-text-muted">
            {result.isZip ? 'Multiple pages — download as ZIP' : 'Single page converted'}
            {' '}({(result.newSize / 1024).toFixed(1)} KB)
          </p>
          <a href={result.url} download={result.name}
            className="px-4 py-2.5 min-h-[44px] inline-flex items-center bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">
            Download {result.isZip ? 'ZIP' : format.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
}

export function BulkFileRenamer() {
  const [files, setFiles] = useState([]);
  const [pattern, setPattern] = useState('{name}');
  const [counter, setCounter] = useState(1);
  const [previews, setPreviews] = useState([]);

  const applyPattern = (fileList) => {
    return fileList.map((f, i) => {
      const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')) : '';
      const name = f.name.replace(/\.[^.]+$/, '');
      const num = String(counter + i).padStart(3, '0');
      const date = new Date().toISOString().slice(0, 10);
      let newName = pattern
        .replace(/{name}/g, name)
        .replace(/{ext}/g, ext.replace('.', ''))
        .replace(/{num}/g, num)
        .replace(/{date}/g, date)
        .replace(/{i}/g, String(i + 1));
      if (!newName.includes('.') && ext) newName += ext;
      return { original: f.name, renamed: newName, file: f };
    });
  };

  const handleFiles = (newFiles) => {
    const all = [...files, ...newFiles];
    setFiles(all);
    setPreviews(applyPattern(all));
  };

  const updatePattern = (p) => {
    setPattern(p);
    setPreviews(files.map((f, i) => {
      const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')) : '';
      const name = f.name.replace(/\.[^.]+$/, '');
      const num = String(counter + i).padStart(3, '0');
      const date = new Date().toISOString().slice(0, 10);
      let newName = p
        .replace(/{name}/g, name)
        .replace(/{ext}/g, ext.replace('.', ''))
        .replace(/{num}/g, num)
        .replace(/{date}/g, date)
        .replace(/{i}/g, String(i + 1));
      if (!newName.includes('.') && ext) newName += ext;
      return { original: f.name, renamed: newName, file: f };
    }));
  };

  const downloadAll = () => {
    previews.forEach((p, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(p.file);
        a.download = p.renamed;
        a.click();
      }, i * 300);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-da-text-muted mb-1">Naming Pattern</label>
        <input type="text" value={pattern} onChange={(e) => updatePattern(e.target.value)}
          className="w-full px-4 py-3 bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none font-mono" />
        <p className="text-xs text-da-text-faint mt-1">
          Variables: {'{name}'} (original), {'{num}'} (001, 002…), {'{i}'} (1, 2…), {'{date}'} (YYYY-MM-DD), {'{ext}'} (extension)
        </p>
      </div>
      <div>
        <label className="block text-sm text-da-text-muted mb-1">Start Counter</label>
        <input type="number" value={counter} onChange={(e) => setCounter(Number(e.target.value))} min={0}
          className="w-32 px-4 py-3 bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none" />
      </div>
      <FileUpload multiple onFiles={handleFiles} accept={{}} label="Drop any files to rename" />
      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 text-sm font-medium text-da-text-muted px-3">
            <span>Original</span><span></span><span>Renamed</span>
          </div>
          {previews.map((p, i) => (
            <div key={i} className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center p-2 bg-da-surface border border-da-border rounded-lg text-sm">
              <span className="text-da-text-faint break-all">{p.original}</span>
              <span className="text-da-teal">→</span>
              <span className="text-da-text break-all">{p.renamed}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={downloadAll}
              className="px-4 py-2.5 min-h-[44px] bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition">
              Download All Renamed ({previews.length})
            </button>
            <button onClick={() => { setFiles([]); setPreviews([]); }}
              className="px-4 py-2.5 min-h-[44px] bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FileSizeCalculator() {
  const [files, setFiles] = useState([]);

  const fmt = (bytes) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
  };

  const handleFiles = (newFiles) => setFiles((prev) => [...prev, ...newFiles]);

  const total = files.reduce((s, f) => s + f.size, 0);
  const sorted = [...files].sort((a, b) => b.size - a.size);
  const largest = sorted[0];

  return (
    <div className="space-y-4">
      <FileUpload multiple onFiles={handleFiles} accept={{}} label="Drop files to calculate sizes" />
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-da-surface border border-da-teal/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-da-teal">{files.length}</p>
              <p className="text-xs text-da-text-muted">Files</p>
            </div>
            <div className="p-3 bg-da-surface border border-da-teal/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-da-teal">{fmt(total)}</p>
              <p className="text-xs text-da-text-muted">Total Size</p>
            </div>
            <div className="p-3 bg-da-surface border border-da-teal/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-da-teal">{fmt(total / files.length)}</p>
              <p className="text-xs text-da-text-muted">Average</p>
            </div>
            <div className="p-3 bg-da-surface border border-da-teal/30 rounded-lg text-center">
              <p className="text-2xl font-bold text-da-teal">{largest ? fmt(largest.size) : '—'}</p>
              <p className="text-xs text-da-text-muted">Largest</p>
            </div>
          </div>
          <div className="space-y-1">
            {sorted.map((f, i) => {
              const pct = total > 0 ? (f.size / total) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-3 p-2 bg-da-surface border border-da-border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-da-text truncate">{f.name}</p>
                    <div className="w-full bg-da-border rounded-full h-1.5 mt-1">
                      <div className="bg-da-teal h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-da-text-muted font-mono whitespace-nowrap">{fmt(f.size)}</span>
                  <span className="text-xs text-da-text-faint w-12 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          <button onClick={() => setFiles([])} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition text-sm">Clear All</button>
        </div>
      )}
    </div>
  );
}

export function PdfToText() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = async (file) => {
    setLoading(true);
    setResult(null);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/pdf/to-text`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Text extraction failed');
      setResult(await res.json());
    } catch (e) {
      alert(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <FileUpload onFile={handleFile} accept={{ 'application/pdf': ['.pdf'] }} label="Drop a PDF to extract its text" />
      {loading && <p className="text-da-teal">Extracting text...</p>}
      {result && (
        <div className="space-y-2">
          <p className="text-sm text-da-text-muted">{result.pages} page(s){result.text ? '' : ' — no selectable text found (scanned PDFs need OCR)'}</p>
          <textarea value={result.text} readOnly rows={12}
            className="w-full px-4 py-3 bg-da-surface border border-da-teal/30 rounded-lg text-da-text font-mono text-sm outline-none resize-y" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigator.clipboard.writeText(result.text)}
              className="px-4 py-2.5 min-h-[44px] bg-da-teal/20 text-da-teal rounded-lg hover:bg-da-teal/30 transition text-sm">Copy to Clipboard</button>
            <a href={URL.createObjectURL(new Blob([result.text], { type: 'text/plain' }))} download="extracted.txt"
              className="px-4 py-2.5 min-h-[44px] inline-flex items-center bg-da-teal text-da-text rounded-lg font-medium hover:bg-da-teal-dark transition text-sm">Download .txt</a>
          </div>
        </div>
      )}
    </div>
  );
}
