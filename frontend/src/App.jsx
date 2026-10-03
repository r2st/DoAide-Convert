import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import { BlogList, BlogPost } from './pages/Blog';
import Embed from './pages/Embed';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:slug" element={<ToolPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/embed" element={<Embed />} />
      </Route>
    </Routes>
  );
}
