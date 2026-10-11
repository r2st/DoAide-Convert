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
          <span className="text-da-teal">100+</span> Free Converters
        </h1>
        <p className="text-xl md:text-2xl text-da-text-muted mb-2">No Login, No Limits</p>
        <p className="text-da-text-faint max-w-xl mx-auto">
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
                  className="block p-5 bg-da-surface border border-da-border rounded-lg hover:border-da-teal/50 transition group"
                >
                  <h3 className="font-semibold text-da-text group-hover:text-da-teal transition">{tool.name}</h3>
                  <p className="text-sm text-da-text-faint mt-1">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
