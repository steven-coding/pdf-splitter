#!/usr/bin/env node

import { Command } from 'commander';
import { splitPdf, PdfSplitter } from './pdf-splitter';

const program = new Command();

program
  .name('pdf-splitter')
  .description('CLI tool to extract text from PDF files page by page')
  .version('1.0.0');

program
  .command('split')
  .description('Extract text from each page of a PDF file into separate text files')
  .argument('<input>', 'Input PDF file path')
  .option('-o, --output <dir>', 'Output directory (defaults to same directory as input file)')
  .action(async (input, options) => {
    try {
      const splitter = new PdfSplitter(input, options.output);
      await splitter.extractPagesToText();
      console.log('Text extraction completed successfully!');
    } catch (error) {
      console.error('Error extracting text from PDF:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('split-pdf')
  .description('Split a PDF file into separate PDF pages')
  .argument('<input>', 'Input PDF file path')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('-p, --prefix <prefix>', 'Output file prefix', 'page')
  .action(async (input, options) => {
    try {
      await splitPdf(input, options.output, options.prefix);
      console.log('PDF splitting completed successfully!');
    } catch (error) {
      console.error('Error splitting PDF:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('info')
  .description('Show information about a PDF file')
  .argument('<input>', 'Input PDF file path')
  .action(async (input) => {
    try {
      const splitter = new PdfSplitter(input);
      const info = await splitter.getInfo();
      console.log(`File: ${info.fileName}`);
      console.log(`Pages: ${info.pageCount}`);
      console.log(`Size: ${(info.fileSize / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.error('Error reading PDF info:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();