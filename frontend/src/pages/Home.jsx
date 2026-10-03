import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { categories } from '../tools/registry';

export default function Home() {
  return (
    <>
      <SEO
        title="DoAide Convert — 100+ Free Online Converters"
        description="Free file, unit, text, color, and image converters. No login, no limits. Convert anything instantly."
        path="/"
      />
      <section className="py-20 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gold">100+</span> Free Converters
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-2">No Login, No Limits</p>
        <p className="text-gray-500 max-w-xl mx-auto">
          Convert files, units, text, colors, and images — all free, all private, all instant.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {categories.map((cat) => (
          <section key={cat.name} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>{cat.icon}</span> {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  to={`/tool/${tool.slug}`}
                  className="block p-5 bg-dark-card border border-dark-border rounded-lg hover:border-gold/50 transition group"
                >
                  <h3 className="font-semibold text-white group-hover:text-gold transition">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
