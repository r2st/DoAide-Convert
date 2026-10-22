import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-da-bg text-da-text">
      <header className="border-b border-da-border bg-da-surface">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-xl font-bold">
            <span className="text-da-teal">DoAide</span>
            <span className="text-da-text-faint font-light">|</span>
            <span className="text-da-text">Convert</span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-6 text-sm text-da-text-muted">
            <Link to="/" className="hover:text-da-teal transition py-2 px-1 min-h-[44px] inline-flex items-center">Home</Link>
            <Link to="/blog" className="hover:text-da-teal transition py-2 px-1 min-h-[44px] inline-flex items-center">Blog</Link>
            <Link to="/embed" className="hover:text-da-teal transition py-2 px-1 min-h-[44px] hidden sm:inline-flex items-center">Embed</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-da-border bg-da-surface py-8 text-center text-sm text-da-text-muted">
        <div className="max-w-7xl mx-auto px-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-da-text-faint mb-3">
            A <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="text-da-teal hover:underline">DoAide</a> Product
          </p>
          <p>© {new Date().getFullYear()} DoAide Convert — Free Online Converters. No login required.</p>
          <div className="mt-3 flex items-center justify-center gap-6 text-sm">
            <a href="https://doaide.com" target="_blank" rel="noopener noreferrer" className="hover:text-da-teal transition">DoAide Home</a>
            <a href="https://track.doaide.com" target="_blank" rel="noopener noreferrer" className="hover:text-da-teal transition">Track</a>
            <a href="https://convert.doaide.com" target="_blank" rel="noopener noreferrer" className="hover:text-da-teal transition">Convert</a>
            <Link to="/blog" className="hover:text-da-teal transition">Blog</Link>
            <Link to="/embed" className="hover:text-da-teal transition">Embed</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
