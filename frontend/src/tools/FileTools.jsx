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
          <p className="text-sm text-gray-400">{files.length} file(s) selected:</p>
          {files.map((f, i) => <p key={i} className="text-sm text-white">{f.name}</p>)}
          <div className="flex gap-2 mt-2">
            <button onClick={merge} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Merge PDFs</button>
            <button onClick={() => setFiles([])} className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition">Clear</button>
          </div>
        </div>
      )}
      {loading && <p className="text-gold">Merging...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <a href={result} download="merged.pdf" className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download Merged PDF</a>
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
      {loading && <p className="text-gold">Compressing...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Original: {(result.originalSize / 1024).toFixed(1)} KB → Compressed: {(result.newSize / 1024).toFixed(1)} KB</p>
          <a href={result.url} download="compressed.pdf" className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download</a>
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
      {loading && <p className="text-gold">Converting...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <a href={result} download="converted.csv" className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download CSV</a>
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
      {loading && <p className="text-gold">Converting...</p>}
      {result && (
        <div className="space-y-2">
          <textarea value={result} readOnly rows={10}
            className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-y" />
          <button onClick={() => { const blob = new Blob([result], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'converted.json'; a.click(); }}
            className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download JSON</button>
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
      {loading && <p className="text-gold">Converting...</p>}
      {result && (
        <div className="p-4 bg-dark-card border border-gold/30 rounded-lg">
          <a href={result} download="converted.csv" className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Download CSV</a>
        </div>
      )}
    </div>
  );
}
