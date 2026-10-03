import { useState } from 'react';
import SEO from '../components/SEO';
import { getAllTools } from '../tools/registry';

export default function Embed() {
  const tools = getAllTools();
  const [selected, setSelected] = useState('length');
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState('500');

  const embedCode = `<iframe src="https://tools.doaide.com/tool/${selected}" width="${width}" height="${height}" frameborder="0" style="border:1px solid #2a2a2a;border-radius:8px;" title="DoAide Convert"></iframe>`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SEO title="Embed Converters — DoAide Convert" description="Embed free converters on your website with a simple iframe code." path="/embed" />
      <h1 className="text-3xl font-bold mb-2">Embed Our Tools</h1>
      <p className="text-gray-400 mb-8">Add any converter to your website with a simple embed code.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Tool</label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none">
            {tools.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Width</label>
          <input type="text" value={width} onChange={(e) => setWidth(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Height (px)</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none" />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-1">Embed Code</label>
        <div className="relative">
          <textarea value={embedCode} readOnly rows={3}
            className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-none" />
          <button onClick={() => navigator.clipboard.writeText(embedCode)}
            className="absolute top-2 right-2 px-3 py-1 bg-gold/20 text-gold rounded text-xs hover:bg-gold/30 transition">Copy</button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Preview</h2>
        <div className="border border-dark-border rounded-lg overflow-hidden">
          <iframe src={`/tool/${selected}`} width={width} height={height} title="Preview" className="bg-dark" />
        </div>
      </div>
    </div>
  );
}
