import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const ToolPage = lazy(() => import('./pages/ToolPage'));
const BlogList = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogList })));
const BlogPost = lazy(() => import('./pages/Blog').then(m => ({ default: m.BlogPost })));
const Embed = lazy(() => import('./pages/Embed'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }}>Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:slug" element={<ToolPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/embed" element={<Embed />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
