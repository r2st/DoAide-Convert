import { useState } from 'react';
import { marked } from 'marked';

export function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length;

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={8}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none resize-y"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Words', val: words },
          { label: 'Characters', val: chars },
          { label: 'Sentences', val: sentences },
          { label: 'Paragraphs', val: paragraphs },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-dark-card border border-dark-border rounded-lg text-center">
            <p className="text-2xl font-bold text-gold">{s.val}</p>
            <p className="text-sm text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CaseConverter() {
  const [text, setText] = useState('');
  const convert = (type) => {
    switch (type) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
      case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default: return text;
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={6}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none resize-y"
      />
      <div className="flex flex-wrap gap-2">
        {['upper', 'lower', 'title', 'sentence'].map((type) => (
          <button
            key={type}
            onClick={() => setText(convert(type))}
            className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded-lg transition text-sm"
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Case
          </button>
        ))}
      </div>
    </div>
  );
}

export function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Paste your JSON here...'
        rows={8}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y"
      />
      <div className="flex gap-2">
        <button onClick={format} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Format</button>
        <button onClick={minify} className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition">Minify</button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {output && (
        <textarea
          value={output}
          readOnly
          rows={8}
          className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-y"
        />
      )}
    </div>
  );
}

export function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => { try { setOutput(btoa(input)); } catch { setOutput('Error encoding'); } };
  const decode = () => { try { setOutput(atob(input)); } catch { setOutput('Error decoding — invalid Base64'); } };

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..." rows={5}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y" />
      <div className="flex gap-2">
        <button onClick={encode} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Encode</button>
        <button onClick={decode} className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition">Decode</button>
      </div>
      {output && <textarea value={output} readOnly rows={5}
        className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-y" />}
    </div>
  );
}

export function UrlEncodeTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Error decoding'); } };

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or URL..." rows={4}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y" />
      <div className="flex gap-2">
        <button onClick={encode} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Encode</button>
        <button onClick={decode} className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition">Decode</button>
      </div>
      {output && <textarea value={output} readOnly rows={4}
        className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-green-400 font-mono text-sm outline-none resize-y" />}
    </div>
  );
}

export function MarkdownToHtml() {
  const [md, setMd] = useState('');
  const html = md ? marked(md) : '';

  return (
    <div className="space-y-4">
      <textarea value={md} onChange={(e) => setMd(e.target.value)} placeholder="Enter Markdown..." rows={8}
        className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y" />
      {html && (
        <>
          <div className="p-4 bg-dark-card border border-dark-border rounded-lg prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }} />
          <details className="text-sm">
            <summary className="text-gray-400 cursor-pointer">View HTML source</summary>
            <pre className="mt-2 p-4 bg-dark-card border border-dark-border rounded-lg text-green-400 overflow-auto text-xs">{html}</pre>
          </details>
        </>
      )}
    </div>
  );
}

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const paragraphs = [];
    for (let p = 0; p < count; p++) {
      const len = 40 + Math.floor(Math.random() * 40);
      const words = [];
      for (let i = 0; i < len; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      paragraphs.push(words.join(' ') + '.');
    }
    setOutput(paragraphs.join('\n\n'));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-400">Paragraphs:</label>
        <input type="number" value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} min={1} max={20}
          className="w-20 px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:border-gold outline-none" />
        <button onClick={generate} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Generate</button>
      </div>
      {output && <textarea value={output} readOnly rows={10}
        className="w-full px-4 py-3 bg-dark-card border border-gold/30 rounded-lg text-gray-300 text-sm outline-none resize-y" />}
    </div>
  );
}

export function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const maxLen = Math.max(lines1.length, lines2.length);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Original Text</label>
          <textarea value={text1} onChange={(e) => setText1(e.target.value)} rows={8} placeholder="Paste original text..."
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Modified Text</label>
          <textarea value={text2} onChange={(e) => setText2(e.target.value)} rows={8} placeholder="Paste modified text..."
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white font-mono text-sm focus:border-gold outline-none resize-y" />
        </div>
      </div>
      <button onClick={() => setShowDiff(true)} className="px-4 py-2 bg-gold text-dark rounded-lg font-medium hover:bg-gold-dark transition">Compare</button>
      {showDiff && (
        <div className="p-4 bg-dark-card border border-dark-border rounded-lg font-mono text-sm overflow-auto max-h-96">
          {Array.from({ length: maxLen }).map((_, i) => {
            const l1 = lines1[i] ?? '';
            const l2 = lines2[i] ?? '';
            if (l1 === l2) return <div key={i} className="text-gray-400 px-2">{l1 || ' '}</div>;
            return (
              <div key={i}>
                {l1 && <div className="bg-red-900/30 text-red-300 px-2">- {l1}</div>}
                {l2 && <div className="bg-green-900/30 text-green-300 px-2">+ {l2}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
