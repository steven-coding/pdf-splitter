# PDF Splitter

A powerful TypeScript console application for splitting PDF files and extracting text from PDF pages. This tool provides multiple ways to process PDF files: split them into individual pages, extract text content page by page, or get detailed information about PDF files.

## Features

- 📄 **PDF Splitting**: Split PDF files into individual pages
- 📝 **Text Extraction**: Extract text from each PDF page into separate text files
- ℹ️ **PDF Information**: Get detailed information about PDF files (page count, file size)
- 🔧 **CLI Interface**: Easy-to-use command-line interface
- 🎯 **TypeScript**: Written in TypeScript with strict type checking
- 🚀 **Fast Processing**: Efficient PDF processing using modern libraries

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-splitter
```

2. Install dependencies:
```bash
npm install
```

3. Build the project (optional):
```bash
npm run build
```

## Usage

**Important**: Use the `--` separator when passing arguments to npm scripts:

### Text Extraction (Default Command)

Extract text from each page of a PDF file into separate text files:

```bash
# Extract text to the same directory as the input file
npm run dev -- split document.pdf

# Extract text to a specific output directory
npm run dev -- split document.pdf --output ./output
```

**Output Format**: For a file named `document.pdf`, the output files will be:
- `document.pdf.page001.txt`
- `document.pdf.page002.txt`
- `document.pdf.page003.txt`
- ... and so on

### PDF Splitting into Separate PDF Files

Split a PDF file into individual PDF pages:

```bash
# Split PDF into separate PDF files with default settings
npm run dev -- split-pdf document.pdf

# Split PDF with custom output directory and prefix
npm run dev -- split-pdf document.pdf --output ./output --prefix chapter
```

### PDF Information

Get information about a PDF file:

```bash
npm run dev -- info document.pdf
```

This command displays:
- File name
- Number of pages
- File size in MB

## Command Reference

### `split` (Text Extraction)

Extract text from each page of a PDF file into separate text files.

```bash
npm run dev -- split <input> [options]
```

**Arguments:**
- `<input>`: Path to the input PDF file

**Options:**
- `--output <dir>`: Output directory (defaults to the same directory as input file)

### `split-pdf`

Split a PDF file into separate PDF pages.

```bash
npm run dev -- split-pdf <input> [options]
```

**Arguments:**
- `<input>`: Path to the input PDF file

**Options:**
- `--output <dir>`: Output directory (default: `./output`)
- `--prefix <prefix>`: Output file prefix (default: `page`)

### `info`

Show information about a PDF file.

```bash
npm run dev -- info <input>
```

**Arguments:**
- `<input>`: Path to the input PDF file

## Development

### Project Structure

```
src/
├── index.ts          # Main CLI entry point
└── pdf-splitter.ts   # PdfSplitter class with all PDF functionality
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the application in development mode
- `npm start` - Run the compiled application
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run clean` - Remove build directory

### Key Dependencies

- **pdf-lib**: PDF manipulation and processing
- **pdf-parse**: PDF text extraction
- **commander**: Command-line interface framework
- **typescript**: TypeScript compiler

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## Examples

### Extract text from a research paper:
```bash
npm run dev -- split research-paper.pdf --output ./extracted-text
```

### Split a large document into PDF pages:
```bash
npm run dev -- split-pdf large-document.pdf --output ./pages --prefix chapter
```

### Check PDF details:
```bash
npm run dev -- info unknown-document.pdf
```

## Error Handling

The application includes robust error handling:

- **File not found**: Clear error message when input file doesn't exist
- **Text extraction failures**: Creates placeholder files for pages where text extraction fails
- **Permission errors**: Informative messages for file access issues
- **Invalid PDF files**: Graceful handling of corrupted or invalid PDF files