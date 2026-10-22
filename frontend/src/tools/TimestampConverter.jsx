import { useEffect, useState } from 'react';

// Accepts unix seconds or milliseconds (13+ digits = ms).
export function parseTimestamp(raw) {
  const trimmed = String(raw).trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const num = Number(trimmed);
  const ms = Math.abs(num) >= 1e12 ? num : num * 1000;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

function fmt(date, timeZone) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone,
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true, timeZoneName: 'short',
  }).format(date);
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-da-border/50 last:border-0">
      <span className="text-sm text-da-text-muted sm:w-40 flex-shrink-0">{label}</span>
      <span className="font-mono text-da-teal break-all">{value}</span>
    </div>
  );
}

export default function TimestampConverter() {
  const [ts, setTs] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const parsed = ts ? parseTimestamp(ts) : null;
  const fromDate = dateStr ? new Date(dateStr) : null;
  const fromDateValid = fromDate && !Number.isNaN(fromDate.getTime());

  return (
    <div className="space-y-6">
      <div className="p-4 bg-da-surface border border-da-border rounded-lg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-sm text-da-text-muted">Current Unix time</span>
        <span className="font-mono text-da-teal text-lg">{now}</span>
        <button onClick={() => setTs(String(now))}
          className="sm:ml-auto px-4 py-2.5 min-h-[44px] bg-da-teal/20 text-da-teal rounded-lg hover:bg-da-teal/30 transition text-sm">Use current time</button>
      </div>

      <div>
        <label className="block text-sm text-da-text-muted mb-1">Unix timestamp (seconds or milliseconds)</label>
        <input type="text" inputMode="numeric" value={ts} onChange={(e) => setTs(e.target.value)} placeholder="e.g. 1760000000"
          className="w-full px-4 py-3 min-h-[48px] text-base bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none font-mono" />
        {ts && !parsed && <p className="text-sm text-red-400 mt-1">Enter a numeric Unix timestamp.</p>}
        {parsed && (
          <div className="mt-3 p-4 bg-da-surface border border-da-teal/30 rounded-lg">
            <Row label="India (IST)" value={fmt(parsed, 'Asia/Kolkata')} />
            <Row label="UTC / GMT" value={fmt(parsed, 'UTC')} />
            <Row label="Your local time" value={fmt(parsed, undefined)} />
            <Row label="ISO 8601" value={parsed.toISOString()} />
            <Row label="Relative" value={relative(parsed)} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-da-text-muted mb-1">Date &amp; time → Unix timestamp</label>
        <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
          className="w-full px-4 py-3 min-h-[48px] text-base bg-da-surface border border-da-border rounded-lg text-da-text focus:border-da-teal outline-none" />
        {fromDateValid && (
          <div className="mt-3 p-4 bg-da-surface border border-da-teal/30 rounded-lg">
            <Row label="Unix seconds" value={Math.floor(fromDate.getTime() / 1000)} />
            <Row label="Unix milliseconds" value={fromDate.getTime()} />
          </div>
        )}
      </div>
    </div>
  );
}

export function relative(date, nowMs = Date.now()) {
  const diff = (date.getTime() - nowMs) / 1000;
  const abs = Math.abs(diff);
  const units = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60], ["second", 1]];
  for (const [unit, secs] of units) {
    if (abs >= secs || unit === "second") {
      const n = Math.round(abs / secs);
      return diff < 0 ? `${n} ${unit}${n === 1 ? "" : "s"} ago` : `in ${n} ${unit}${n === 1 ? "" : "s"}`;
    }
  }
}
