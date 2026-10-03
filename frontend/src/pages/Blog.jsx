import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const posts = [
  {
    slug: 'best-image-formats-2024',
    title: 'PNG vs JPG vs WebP: Which Image Format Should You Use?',
    excerpt: 'Understand the differences between popular image formats and when to use each one for web, print, and social media.',
    date: '2024-10-01',
    content: `
## PNG vs JPG vs WebP: The Complete Guide

Choosing the right image format can dramatically affect your website's performance and visual quality.

### JPEG (JPG)
JPEG is best for photographs and complex images with many colors. It uses lossy compression, meaning some quality is lost to reduce file size. Use JPEG when:
- You have photographs or realistic images
- File size matters more than perfect quality
- The image doesn't need transparency

### PNG
PNG is ideal for graphics, logos, and images requiring transparency. It uses lossless compression, preserving all image data. Use PNG when:
- You need transparent backgrounds
- You have graphics with text or sharp edges
- You need pixel-perfect quality

### WebP
WebP is Google's modern format that offers both lossy and lossless compression. It typically produces files 25-35% smaller than JPEG and PNG. Use WebP when:
- You're optimizing for web performance
- Your audience uses modern browsers
- You want the best compression-to-quality ratio

### Quick Comparison

| Feature | JPEG | PNG | WebP |
|---------|------|-----|------|
| Compression | Lossy | Lossless | Both |
| Transparency | No | Yes | Yes |
| File Size | Small | Large | Smallest |
| Browser Support | Universal | Universal | Modern |

### Conclusion
For most web use cases, WebP is the best choice. Use our free [Image Format Converter](/tool/image-convert) to convert between formats instantly.
    `,
  },
  {
    slug: 'unit-conversion-guide',
    title: 'The Ultimate Unit Conversion Guide: Length, Weight, and Temperature',
    excerpt: 'A comprehensive guide to converting between metric and imperial units, with formulas and practical examples.',
    date: '2024-09-15',
    content: `
## The Ultimate Unit Conversion Guide

Whether you're traveling, cooking, or working on a science project, knowing how to convert units is essential.

### Length Conversions
The most common length conversions people need:

- **1 mile = 1.609 kilometers** — Multiply miles by 1.609 to get km
- **1 foot = 0.3048 meters** — Multiply feet by 0.3048 for meters
- **1 inch = 2.54 centimeters** — Multiply inches by 2.54 for cm

### Weight Conversions
Common weight conversions:

- **1 pound = 0.4536 kilograms** — Multiply lbs by 0.4536 for kg
- **1 ounce = 28.35 grams** — Multiply oz by 28.35 for grams
- **1 ton (US) = 907.185 kilograms**

### Temperature Conversions
Temperature is trickier because the scales don't start at the same zero:

- **°C to °F**: Multiply by 9/5, then add 32
- **°F to °C**: Subtract 32, then multiply by 5/9
- **°C to K**: Add 273.15

### Pro Tips
1. For a quick mental °C to °F conversion: double the Celsius value and add 30
2. 1 kg is roughly 2.2 lbs
3. 1 mile is about 1.6 km

Try our free [Length Converter](/tool/length), [Weight Converter](/tool/weight), or [Temperature Converter](/tool/temperature) for instant results.
    `,
  },
  {
    slug: 'pdf-tools-guide',
    title: 'How to Merge, Compress, and Convert PDFs Online for Free',
    excerpt: 'Learn how to work with PDF files without installing any software. Merge, compress, and extract text from PDFs instantly.',
    date: '2024-09-01',
    content: `
## Free PDF Tools: Merge, Compress, and Extract Text

PDF files are everywhere — contracts, reports, invoices, resumes. Here's how to work with them without expensive software.

### Merging PDFs
Need to combine multiple PDFs into one document? Common use cases:
- Combining scanned pages into a single document
- Merging chapters of a report
- Creating a portfolio from separate files

Our [PDF Merger](/tool/pdf-merge) lets you drag and drop multiple PDFs and combine them in seconds.

### Compressing PDFs
Large PDFs are hard to email and slow to download. PDF compression can reduce file sizes by 50-80% while maintaining readable quality.

Tips for smaller PDFs:
- Compress images within the PDF
- Remove unused fonts
- Strip metadata

Use our [PDF Compressor](/tool/pdf-compress) to reduce your PDF file size instantly.

### Extracting Text from PDFs
Sometimes you need the text content from a PDF for editing or analysis. Our tools can extract all readable text while preserving the structure.

### Privacy First
All our PDF tools process files on our secure servers and automatically delete them after processing. Your documents are never stored or shared.

### Conclusion
You don't need expensive software like Adobe Acrobat for basic PDF operations. Our free online tools handle the most common tasks instantly.
    `,
  },
];

export function BlogList() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SEO title="Blog — DoAide Convert" description="Tips, guides, and tutorials on file conversion, unit conversion, and more." path="/blog" />
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`}
            className="block p-6 bg-dark-card border border-dark-border rounded-lg hover:border-gold/50 transition group">
            <p className="text-sm text-gray-500 mb-1">{post.date}</p>
            <h2 className="text-xl font-bold group-hover:text-gold transition">{post.title}</h2>
            <p className="text-gray-400 mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const slug = window.location.pathname.split('/').pop();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-gold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <SEO title={`${post.title} — DoAide Convert`} description={post.excerpt} path={`/blog/${post.slug}`} />
      <Link to="/blog" className="text-sm text-gray-500 hover:text-gold transition">← Back to Blog</Link>
      <p className="text-sm text-gray-500 mt-4">{post.date}</p>
      <h1 className="text-3xl font-bold mt-2 mb-6">{post.title}</h1>
      <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-gold prose-strong:text-white"
        dangerouslySetInnerHTML={{ __html: post.content.replace(/### /g, '<h3>').replace(/## /g, '<h2>').replace(/\n- /g, '\n<li>').replace(/\n\n/g, '<br/><br/>') }} />
    </div>
  );
}
