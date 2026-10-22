import { Link } from 'react-router-dom';

// Video files are too large to round-trip through our server, so this tool is
// an honest, practical guide to compressing locally — with the exact settings.

const BITRATES = [
  { res: '4K (2160p)', watch: '35–45 Mbps', share: '12–20 Mbps' },
  { res: '1440p', watch: '16–24 Mbps', share: '8–12 Mbps' },
  { res: '1080p', watch: '8–12 Mbps', share: '4–6 Mbps' },
  { res: '720p', watch: '5–7 Mbps', share: '2–3 Mbps' },
  { res: '480p', watch: '2–3 Mbps', share: '1–1.5 Mbps' },
];

const RECIPES = [
  {
    title: 'Best overall: H.264 at CRF 23 (plays everywhere)',
    cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4',
    note: 'Typically 40–70% smaller with no visible quality loss. Raise CRF to 26–28 for smaller files.',
  },
  {
    title: 'Smallest file: H.265/HEVC at CRF 28',
    cmd: 'ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k output.mp4',
    note: 'About half the size of H.264 at the same quality, but older devices may not play it.',
  },
  {
    title: 'For WhatsApp (under 16 MB)',
    cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 28 -vf "scale=-2:720" -c:a aac -b:a 96k output.mp4',
    note: 'Downscales to 720p and compresses harder — right for phone screens.',
  },
  {
    title: 'For email attachments (resolution + bitrate cap)',
    cmd: 'ffmpeg -i input.mp4 -c:v libx264 -crf 30 -vf "scale=-2:480" -c:a aac -b:a 96k output.mp4',
    note: '480p at CRF 30 gets most clips under typical 25 MB email limits.',
  },
];

function Card({ children }) {
  return <div className="p-4 sm:p-5 bg-da-surface border border-da-border rounded-lg">{children}</div>;
}

export default function VideoGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-semibold text-da-text mb-2">Why we don't upload your video</h2>
        <p className="text-sm text-da-text-muted">
          Video files are big — uploading a 500 MB clip to a server and downloading the result wastes time and
          data. Compressing on your own machine with free tools is faster and more private. This guide gives you
          the exact settings; for images we do the compression for you in the{' '}
          <Link to="/tool/image-compress" className="text-da-teal hover:underline">Image Compressor</Link>.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-da-text mb-3">1. Pick the right tool (all free)</h2>
        <ul className="text-sm text-da-text-muted space-y-2 list-disc pl-5">
          <li><strong className="text-da-text">HandBrake</strong> (Windows/Mac/Linux) — point-and-click, use the "Fast 1080p30" preset and you're done.</li>
          <li><strong className="text-da-text">ffmpeg</strong> (command line) — most control; recipes below.</li>
          <li><strong className="text-da-text">VLC</strong> — Media → Convert/Save works in a pinch.</li>
          <li><strong className="text-da-text">Phone</strong> — iOS and Android both offer "smaller size" export options in the share sheet or Gallery/Photos editor.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-da-text mb-3">2. Target bitrates by resolution</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-da-border text-da-text-faint">
                <th className="py-2 pr-4">Resolution</th>
                <th className="py-2 pr-4">Good quality</th>
                <th className="py-2">Sharing / messaging</th>
              </tr>
            </thead>
            <tbody>
              {BITRATES.map((r) => (
                <tr key={r.res} className="border-b border-da-border/40">
                  <td className="py-2 pr-4 text-da-text">{r.res}</td>
                  <td className="py-2 pr-4 text-da-text-muted font-mono">{r.watch}</td>
                  <td className="py-2 text-da-text-muted font-mono">{r.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-da-text-faint mt-2">Rule of thumb: halving the resolution roughly quarters the file size.</p>
      </Card>

      <Card>
        <h2 className="font-semibold text-da-text mb-3">3. ffmpeg recipes</h2>
        <div className="space-y-4">
          {RECIPES.map((r) => (
            <div key={r.title}>
              <h3 className="text-sm font-medium text-da-text mb-1">{r.title}</h3>
              <pre className="p-3 bg-da-bg border border-da-border rounded-lg text-xs text-green-400 font-mono overflow-x-auto whitespace-pre-wrap break-all">{r.cmd}</pre>
              <p className="text-xs text-da-text-faint mt-1">{r.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-da-text mb-2">Quick answers</h2>
        <div className="text-sm text-da-text-muted space-y-3">
          <p><strong className="text-da-text">CRF or bitrate?</strong> Use CRF (constant quality) unless a platform demands an exact bitrate. Lower CRF = better quality; 18 is near-lossless, 23 is the H.264 default, 28 is visibly compressed.</p>
          <p><strong className="text-da-text">MP4, MKV or WebM?</strong> MP4 with H.264 + AAC plays everywhere. WebM (VP9/AV1) is great for the web; MKV is a container for archiving.</p>
          <p><strong className="text-da-text">Why is my screen recording huge?</strong> Screen captures are often recorded near-lossless. The H.264 CRF 23 recipe above usually shrinks them 5–10×.</p>
        </div>
      </Card>
    </div>
  );
}
