import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import UnitConverter from '../tools/UnitConverter';
import NumberSystems from '../tools/NumberSystems';
import { WordCounter, CaseConverter, JsonFormatter, Base64Tool, UrlEncodeTool, LoremIpsumGenerator } from '../tools/TextTools';
import { ColorPicker, ContrastChecker } from '../tools/ColorTools';
import { getAllTools, findTool, categories } from '../tools/registry';

function wrap(ui) {
  return render(<HelmetProvider><BrowserRouter>{ui}</BrowserRouter></HelmetProvider>);
}

describe('Registry', () => {
  it('should have 30 tools total', () => {
    expect(getAllTools().length).toBe(30);
  });

  it('should find tool by slug', () => {
    const tool = findTool('length');
    expect(tool).toBeTruthy();
    expect(tool.name).toBe('Length Converter');
  });

  it('should return null for unknown slug', () => {
    expect(findTool('nonexistent')).toBeNull();
  });

  it('should have 5 categories', () => {
    expect(categories.length).toBe(5);
  });
});

describe('UnitConverter', () => {
  it('renders length converter', () => {
    wrap(<UnitConverter type="length" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('converts length values', () => {
    wrap(<UnitConverter type="length" />);
    const input = screen.getByPlaceholderText('Enter value');
    fireEvent.change(input, { target: { value: '1' } });
    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('renders temperature converter', () => {
    wrap(<UnitConverter type="temperature" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('converts temperature', () => {
    wrap(<UnitConverter type="temperature" />);
    const input = screen.getByPlaceholderText('Enter value');
    fireEvent.change(input, { target: { value: '100' } });
    expect(screen.getByText('Result')).toBeInTheDocument();
  });

  it('renders weight converter', () => {
    wrap(<UnitConverter type="weight" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });
});

describe('NumberSystems', () => {
  it('renders input field', () => {
    wrap(<NumberSystems />);
    expect(screen.getByPlaceholderText('Enter a number')).toBeInTheDocument();
  });

  it('converts decimal to other bases', () => {
    wrap(<NumberSystems />);
    const input = screen.getByPlaceholderText('Enter a number');
    fireEvent.change(input, { target: { value: '255' } });
    expect(screen.getByText('FF')).toBeInTheDocument();
    expect(screen.getByText('11111111')).toBeInTheDocument();
    expect(screen.getByText('377')).toBeInTheDocument();
  });
});

describe('WordCounter', () => {
  it('counts words and characters', () => {
    wrap(<WordCounter />);
    const textarea = screen.getByPlaceholderText('Type or paste your text here...');
    fireEvent.change(textarea, { target: { value: 'Hello world test' } });
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('16')).toBeInTheDocument();
  });
});

describe('CaseConverter', () => {
  it('renders buttons', () => {
    wrap(<CaseConverter />);
    expect(screen.getByText('Upper Case')).toBeInTheDocument();
    expect(screen.getByText('Lower Case')).toBeInTheDocument();
    expect(screen.getByText('Title Case')).toBeInTheDocument();
  });
});

describe('JsonFormatter', () => {
  it('formats valid JSON', () => {
    wrap(<JsonFormatter />);
    const textarea = screen.getByPlaceholderText('Paste your JSON here...');
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });
    fireEvent.click(screen.getByText('Format'));
    const outputs = screen.getAllByRole('textbox');
    expect(outputs.length).toBe(2);
  });

  it('shows error for invalid JSON', () => {
    wrap(<JsonFormatter />);
    const textarea = screen.getByPlaceholderText('Paste your JSON here...');
    fireEvent.change(textarea, { target: { value: '{invalid}' } });
    fireEvent.click(screen.getByText('Format'));
    expect(screen.getByText(/Expected property name/i)).toBeInTheDocument();
  });
});

describe('Base64Tool', () => {
  it('encodes text to base64', () => {
    wrap(<Base64Tool />);
    const textarea = screen.getByPlaceholderText('Enter text...');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Encode'));
    const outputs = screen.getAllByRole('textbox');
    expect(outputs[1].value).toBe('SGVsbG8=');
  });
});

describe('UrlEncodeTool', () => {
  it('encodes URL', () => {
    wrap(<UrlEncodeTool />);
    const textarea = screen.getByPlaceholderText('Enter text or URL...');
    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(screen.getByText('Encode'));
    const outputs = screen.getAllByRole('textbox');
    expect(outputs[1].value).toBe('hello%20world');
  });
});

describe('LoremIpsumGenerator', () => {
  it('generates text', () => {
    wrap(<LoremIpsumGenerator />);
    fireEvent.click(screen.getByText('Generate'));
    const outputs = screen.getAllByRole('textbox');
    expect(outputs.length).toBeGreaterThan(0);
  });
});

describe('ColorPicker', () => {
  it('renders color values', () => {
    wrap(<ColorPicker />);
    expect(screen.getByText(/HEX:/)).toBeInTheDocument();
    expect(screen.getByText(/RGB:/)).toBeInTheDocument();
    expect(screen.getByText(/HSL:/)).toBeInTheDocument();
  });
});

describe('ContrastChecker', () => {
  it('shows contrast ratio', () => {
    wrap(<ContrastChecker />);
    expect(screen.getByText(/Contrast Ratio:/)).toBeInTheDocument();
  });
});
