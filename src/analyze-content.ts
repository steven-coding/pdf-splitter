#!/usr/bin/env node

import { ContentAnalyzer } from './content-analyzer';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run analyze-content <directory-path>');
    console.log('Example: npm run analyze-content ./output');
    process.exit(1);
  }
  
  const directoryPath = args[0];
  if (!directoryPath) {
    console.log('Error: Directory path is required');
    process.exit(1);
  }
  const absolutePath = path.resolve(directoryPath);
  
  console.log(`Analyzing content in: ${absolutePath}`);
  console.log('This will create .no-content marker files for empty, TOC, or non-content files.\n');
  
  try {
    const analyzer = new ContentAnalyzer();
    await analyzer.processDirectory(absolutePath);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();