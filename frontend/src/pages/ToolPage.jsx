import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import { findTool } from '../tools/registry';
import UnitConverter from '../tools/UnitConverter';
import CurrencyConverter from '../tools/CurrencyConverter';
import TimestampConverter from '../tools/TimestampConverter';
import VideoGuide from '../tools/VideoGuide';
import NumberSystems from '../tools/NumberSystems';
import { WordCounter, CaseConverter, JsonFormatter, Base64Tool, UrlEncodeTool, MarkdownToHtml, LoremIpsumGenerator, TextDiff } from '../tools/TextTools';
import { ColorPicker, ColorPalette, ContrastChecker } from '../tools/ColorTools';
import { ImageCompress, ImageResize, ImageConvert, ImageToBase64 } from '../tools/ImageTools';
import { PdfMerge, PdfCompress, PdfToText, PdfToImages, JsonToCsv, CsvToJson, ExcelToCsv, BulkFileRenamer, FileSizeCalculator } from '../tools/FileTools';

const TOOL_COMPONENTS = {
  length: () => <UnitConverter type="length" />,
  weight: () => <UnitConverter type="weight" />,
  temperature: () => <UnitConverter type="temperature" />,
  area: () => <UnitConverter type="area" />,
  volume: () => <UnitConverter type="volume" />,
  speed: () => <UnitConverter type="speed" />,
  time: () => <UnitConverter type="time" />,
  'data-storage': () => <UnitConverter type="data-storage" />,
  currency: () => <CurrencyConverter />,
  'number-systems': () => <NumberSystems />,
  pressure: () => <UnitConverter type="pressure" />,
  energy: () => <UnitConverter type="energy" />,
  power: () => <UnitConverter type="power" />,
  'fuel-economy': () => <UnitConverter type="fuel-economy" />,
  angle: () => <UnitConverter type="angle" />,
  timestamp: () => <TimestampConverter />,
  'video-compression': () => <VideoGuide />,
  'word-counter': () => <WordCounter />,
  'case-converter': () => <CaseConverter />,
  'json-formatter': () => <JsonFormatter />,
  base64: () => <Base64Tool />,
  'url-encode': () => <UrlEncodeTool />,
  'markdown-to-html': () => <MarkdownToHtml />,
  'lorem-ipsum': () => <LoremIpsumGenerator />,
  'text-diff': () => <TextDiff />,
  'color-picker': () => <ColorPicker />,
  'color-palette': () => <ColorPalette />,
  'contrast-checker': () => <ContrastChecker />,
  'image-compress': () => <ImageCompress />,
  'image-resize': () => <ImageResize />,
  'image-convert': () => <ImageConvert />,
  'image-to-base64': () => <ImageToBase64 />,
  'pdf-merge': () => <PdfMerge />,
  'pdf-compress': () => <PdfCompress />,
  'pdf-to-text': () => <PdfToText />,
  'pdf-to-image': () => <PdfToImages />,
  'json-to-csv': () => <JsonToCsv />,
  'csv-to-json': () => <CsvToJson />,
  'excel-to-csv': () => <ExcelToCsv />,
  'bulk-rename': () => <BulkFileRenamer />,
  'file-size': () => <FileSizeCalculator />,
};

export default function ToolPage() {
  const { slug } = useParams();
  const tool = findTool(slug);
  const ToolComponent = TOOL_COMPONENTS[slug];

  if (!tool || !ToolComponent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
        <Link to="/" className="text-da-teal hover:underline">&larr; Back to all tools</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SEO title={tool.seoTitle} description={tool.seoDesc} path={`/tool/${slug}`} />
      <div className="mb-2">
        <Link to="/" className="text-sm text-da-text-faint hover:text-da-teal transition">&larr; All Tools</Link>
        <span className="text-da-border mx-2">/</span>
        <span className="text-sm text-da-text-muted">{tool.category}</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
      <p className="text-da-text-muted mb-8">{tool.desc}</p>
      <div className="mb-8">
        <ToolComponent />
      </div>
      <ShareButtons title={tool.name} />
    </div>
  );
}
