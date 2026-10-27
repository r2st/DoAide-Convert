/**
 * Static route metadata used by the prerender script to inject per-page
 * <title>, <meta>, <link rel="canonical">, og tags and JSON-LD into the
 * built index.html so that crawlers see unique metadata without JS.
 *
 * Every route that appears in sitemap.xml MUST have an entry here.
 * Tool pages are generated automatically from the registry at build time
 * by the prerender script; only add non-tool routes below.
 */

const SITE = 'https://convert.doaide.com';
const OG_IMAGE = `${SITE}/og-image.png`;

export const staticRoutes = {
  '/': {
    title: 'DoAide Convert — 100+ Free Online Converters',
    description: 'Free file, unit, text, color, and image converters. No login, no limits. Convert anything instantly.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DoAide Convert',
      url: SITE,
      description: 'Free file, unit, text, color, and image converters. No login, no limits. Convert anything instantly.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
    },
  },
  '/blog': {
    title: 'Blog — DoAide Convert',
    description: 'Tips, guides, and tutorials on file conversion, unit conversion, and more.',
  },
  '/embed': {
    title: 'Embed Converters — DoAide Convert',
    description: 'Embed free converters on your website with a simple iframe code.',
  },
};

export { SITE, OG_IMAGE };
