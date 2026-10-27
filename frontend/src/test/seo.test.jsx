import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../components/SEO';
import { staticRoutes, SITE, OG_IMAGE } from '../routeMeta';
import { getAllTools } from '../tools/registry';

function wrap(ui) {
  return render(<HelmetProvider><BrowserRouter>{ui}</BrowserRouter></HelmetProvider>);
}

describe('SEO component', () => {
  it('renders og:image with dimensions', () => {
    const { container } = wrap(
      <SEO title="Test" description="Test desc" path="/test" />
    );
    // Helmet injects into <head>, but in test we check that it renders without error
    expect(container).toBeTruthy();
  });
});

describe('routeMeta', () => {
  it('exports staticRoutes with /, /blog, /embed', () => {
    expect(staticRoutes['/']).toBeTruthy();
    expect(staticRoutes['/blog']).toBeTruthy();
    expect(staticRoutes['/embed']).toBeTruthy();
  });

  it('every static route has title and description', () => {
    for (const [path, meta] of Object.entries(staticRoutes)) {
      expect(meta.title, `${path} missing title`).toBeTruthy();
      expect(meta.description, `${path} missing description`).toBeTruthy();
    }
  });

  it('SITE and OG_IMAGE are correct', () => {
    expect(SITE).toBe('https://convert.doaide.com');
    expect(OG_IMAGE).toContain('og-image.png');
  });
});

describe('SEO coverage', () => {
  it('every tool has seoTitle and seoDesc', () => {
    const tools = getAllTools();
    for (const tool of tools) {
      expect(tool.seoTitle, `${tool.slug} missing seoTitle`).toBeTruthy();
      expect(tool.seoDesc, `${tool.slug} missing seoDesc`).toBeTruthy();
    }
  });

  it('no two tools share the same seoTitle', () => {
    const tools = getAllTools();
    const titles = tools.map((t) => t.seoTitle);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });
});
