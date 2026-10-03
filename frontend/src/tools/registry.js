export const API_BASE = import.meta.env.VITE_API_URL || 'https://tools.doaide.com';

export const categories = [
  {
    name: 'Unit Converters',
    icon: '📐',
    tools: [
      { slug: 'length', name: 'Length Converter', desc: 'Convert between km, miles, meters, feet, inches, and cm', seoTitle: 'Length Converter — km, miles, meters, feet, inches, cm', seoDesc: 'Free online length converter. Convert between kilometers, miles, meters, feet, inches, centimeters instantly.' },
      { slug: 'weight', name: 'Weight Converter', desc: 'Convert between kg, lbs, grams, ounces, and tons', seoTitle: 'Weight Converter — kg, lbs, grams, ounces, tons', seoDesc: 'Free online weight converter. Convert between kilograms, pounds, grams, ounces, and tons.' },
      { slug: 'temperature', name: 'Temperature Converter', desc: 'Convert between Celsius, Fahrenheit, and Kelvin', seoTitle: 'Temperature Converter — °C, °F, K', seoDesc: 'Free temperature converter. Convert Celsius to Fahrenheit, Kelvin and more.' },
      { slug: 'area', name: 'Area Converter', desc: 'Convert between sq ft, sq m, acres, hectares', seoTitle: 'Area Converter — sq ft, sq m, acres, hectares', seoDesc: 'Free area converter. Convert square feet, square meters, acres, hectares.' },
      { slug: 'volume', name: 'Volume Converter', desc: 'Convert between liters, gallons, cups, and ml', seoTitle: 'Volume Converter — liters, gallons, cups, ml', seoDesc: 'Free volume converter. Convert liters, gallons, cups, milliliters.' },
      { slug: 'speed', name: 'Speed Converter', desc: 'Convert between km/h, mph, m/s, and knots', seoTitle: 'Speed Converter — km/h, mph, m/s, knots', seoDesc: 'Free speed converter. Convert kilometers per hour, miles per hour, meters per second, knots.' },
      { slug: 'time', name: 'Time Converter', desc: 'Convert between seconds, minutes, hours, and days', seoTitle: 'Time Converter — seconds, minutes, hours, days', seoDesc: 'Free time converter. Convert seconds, minutes, hours, days instantly.' },
      { slug: 'data-storage', name: 'Data Storage Converter', desc: 'Convert between bytes, KB, MB, GB, and TB', seoTitle: 'Data Storage Converter — bytes, KB, MB, GB, TB', seoDesc: 'Free data storage converter. Convert bytes, kilobytes, megabytes, gigabytes, terabytes.' },
      { slug: 'currency', name: 'Currency Converter', desc: 'Convert INR, USD, EUR, GBP with live rates', seoTitle: 'Currency Converter — INR, USD, EUR, GBP', seoDesc: 'Free currency converter with live exchange rates. Convert INR, USD, EUR, GBP.' },
      { slug: 'number-systems', name: 'Number System Converter', desc: 'Convert decimal, binary, octal, and hex', seoTitle: 'Number System Converter — Decimal, Binary, Octal, Hex', seoDesc: 'Free number system converter. Convert between decimal, binary, octal, hexadecimal.' },
    ],
  },
  {
    name: 'Text Tools',
    icon: '📝',
    tools: [
      { slug: 'word-counter', name: 'Word & Character Counter', desc: 'Count words, characters, sentences, and paragraphs', seoTitle: 'Word Counter & Character Counter', seoDesc: 'Free word counter and character counter. Count words, characters, sentences, paragraphs in real time.' },
      { slug: 'case-converter', name: 'Case Converter', desc: 'Convert text to upper, lower, title, or sentence case', seoTitle: 'Case Converter — Upper, Lower, Title, Sentence', seoDesc: 'Free text case converter. Convert to uppercase, lowercase, title case, sentence case.' },
      { slug: 'json-formatter', name: 'JSON Formatter & Validator', desc: 'Format, minify, and validate JSON data', seoTitle: 'JSON Formatter & Validator', seoDesc: 'Free JSON formatter and validator. Pretty print, minify, and validate JSON online.' },
      { slug: 'base64', name: 'Base64 Encode/Decode', desc: 'Encode or decode Base64 strings', seoTitle: 'Base64 Encoder & Decoder', seoDesc: 'Free Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text.' },
      { slug: 'url-encode', name: 'URL Encode/Decode', desc: 'Encode or decode URL components', seoTitle: 'URL Encoder & Decoder', seoDesc: 'Free URL encoder and decoder. Encode special characters for URLs or decode URL-encoded strings.' },
      { slug: 'markdown-to-html', name: 'Markdown to HTML', desc: 'Convert Markdown text to HTML', seoTitle: 'Markdown to HTML Converter', seoDesc: 'Free Markdown to HTML converter. Convert Markdown syntax to HTML code instantly.' },
      { slug: 'lorem-ipsum', name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text for designs', seoTitle: 'Lorem Ipsum Generator', seoDesc: 'Free Lorem Ipsum generator. Generate placeholder text paragraphs for your designs.' },
      { slug: 'text-diff', name: 'Text Diff Checker', desc: 'Compare two texts and see differences', seoTitle: 'Text Diff Checker — Compare Text Online', seoDesc: 'Free text diff checker. Compare two texts side by side and see the differences highlighted.' },
    ],
  },
  {
    name: 'Color Tools',
    icon: '🎨',
    tools: [
      { slug: 'color-picker', name: 'Color Picker', desc: 'Pick colors in HEX, RGB, and HSL formats', seoTitle: 'Color Picker — HEX, RGB, HSL', seoDesc: 'Free color picker tool. Pick and convert colors between HEX, RGB, and HSL formats.' },
      { slug: 'color-palette', name: 'Color Palette Generator', desc: 'Generate beautiful color palettes', seoTitle: 'Color Palette Generator', seoDesc: 'Free color palette generator. Create beautiful and harmonious color palettes.' },
      { slug: 'contrast-checker', name: 'Contrast Checker', desc: 'Check WCAG color contrast accessibility', seoTitle: 'Color Contrast Checker — WCAG Accessibility', seoDesc: 'Free WCAG color contrast checker. Verify text and background color accessibility compliance.' },
    ],
  },
  {
    name: 'Image Tools',
    icon: '🖼️',
    tools: [
      { slug: 'image-compress', name: 'Image Compressor', desc: 'Compress images to reduce file size', seoTitle: 'Image Compressor — Reduce File Size', seoDesc: 'Free image compressor. Reduce image file size while maintaining quality.' },
      { slug: 'image-resize', name: 'Image Resizer', desc: 'Resize images to any dimension', seoTitle: 'Image Resizer — Resize Images Online', seoDesc: 'Free image resizer. Resize images to any width and height dimension.' },
      { slug: 'image-convert', name: 'Image Format Converter', desc: 'Convert between PNG, JPG, and WebP', seoTitle: 'Image Format Converter — PNG, JPG, WebP', seoDesc: 'Free image format converter. Convert between PNG, JPG, WebP, and BMP formats.' },
      { slug: 'image-to-base64', name: 'Image to Base64', desc: 'Convert images to Base64 encoded strings', seoTitle: 'Image to Base64 Converter', seoDesc: 'Free image to Base64 converter. Convert any image file to a Base64 encoded string.' },
    ],
  },
  {
    name: 'File Tools',
    icon: '📁',
    tools: [
      { slug: 'pdf-merge', name: 'PDF Merger', desc: 'Merge multiple PDF files into one', seoTitle: 'PDF Merger — Merge PDF Files Online', seoDesc: 'Free PDF merger. Combine multiple PDF files into a single document.' },
      { slug: 'pdf-compress', name: 'PDF Compressor', desc: 'Compress PDF files to reduce size', seoTitle: 'PDF Compressor — Reduce PDF Size', seoDesc: 'Free PDF compressor. Reduce PDF file size while maintaining quality.' },
      { slug: 'json-to-csv', name: 'JSON to CSV', desc: 'Convert JSON data to CSV format', seoTitle: 'JSON to CSV Converter', seoDesc: 'Free JSON to CSV converter. Convert JSON arrays to CSV files instantly.' },
      { slug: 'csv-to-json', name: 'CSV to JSON', desc: 'Convert CSV files to JSON format', seoTitle: 'CSV to JSON Converter', seoDesc: 'Free CSV to JSON converter. Convert CSV files to JSON data instantly.' },
      { slug: 'excel-to-csv', name: 'Excel to CSV', desc: 'Convert Excel spreadsheets to CSV', seoTitle: 'Excel to CSV Converter', seoDesc: 'Free Excel to CSV converter. Convert XLSX spreadsheets to CSV files.' },
    ],
  },
];

export function getAllTools() {
  return categories.flatMap((c) => c.tools.map((t) => ({ ...t, category: c.name })));
}

export function findTool(slug) {
  for (const cat of categories) {
    const tool = cat.tools.find((t) => t.slug === slug);
    if (tool) return { ...tool, category: cat.name };
  }
  return null;
}
