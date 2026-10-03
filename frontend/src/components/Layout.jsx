import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-gold">⚡</span>
            <span>DoAide <span className="text-gold">Convert</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/blog" className="hover:text-white transition">Blog</Link>
            <Link to="/embed" className="hover:text-white transition">Embed</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-dark-border py-8 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} DoAide Convert — Free Online Converters. No login required.</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">DoAide Suite</a>
            <Link to="/blog" className="hover:text-gold transition">Blog</Link>
            <Link to="/embed" className="hover:text-gold transition">Embed</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
