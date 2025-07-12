# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript console application for splitting PDF files into individual pages and extracting text from PDF pages. The application uses the `pdf-lib` library for PDF manipulation, `pdf-parse` for text extraction, and `commander` for CLI interface.

## Development Commands

- `npm install` - Install dependencies
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run the application in development mode with ts-node
- `npm start` - Run the compiled application
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint on source files
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run clean` - Remove the dist directory

## Project Structure

```
src/
├── index.ts          # Main CLI entry point with commander setup
└── pdf-splitter.ts   # PdfSplitter class with all PDF functionality
```

## Architecture

- **CLI Interface**: Uses `commander` package for command-line argument parsing
- **PDF Processing**: Uses `pdf-lib` for reading and splitting PDF files
- **Text Extraction**: Uses `pdf-parse` for extracting text from PDF pages
- **PdfSplitter Class**: Main class for text extraction functionality
- **TypeScript**: Strict TypeScript configuration with comprehensive compiler options
- **Build Output**: Compiled JavaScript goes to `dist/` directory

## Usage

```bash
# Extract text from PDF pages (creates .txt files for each page)
npm run dev extract-text input.pdf
npm run dev extract-text input.pdf -o ./output

# Split a PDF file into separate PDF pages
npm run dev split input.pdf
npm run dev split input.pdf -o ./output -p page

# Get PDF information
npm run dev info input.pdf
```

## Text Extraction Output Format

When using `extract-text` command, the output files follow this naming pattern:
- Input: `document.pdf`
- Output: `document.pdf.page001.txt`, `document.pdf.page002.txt`, etc.

## Key Dependencies

- `pdf-lib`: PDF manipulation library
- `pdf-parse`: PDF text extraction library
- `commander`: CLI framework
- `typescript`: TypeScript compiler
- `ts-node`: TypeScript execution for development