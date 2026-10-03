export default function ShareButtons({ title, url }) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const text = encodeURIComponent(title || 'Check out this free tool!');
  const encodedUrl = encodeURIComponent(fullUrl);

  return (
    <div className="flex items-center gap-3 mt-4">
      <span className="text-sm text-gray-400">Share:</span>
      <a
        href={`https://wa.me/?text=${text}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm text-white transition"
      >
        WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 rounded text-sm text-white transition"
      >
        Twitter
      </a>
    </div>
  );
}
