import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import * as fs from 'fs/promises';
import * as path from 'path';

export class PdfSplitter {
  private inputPath: string;
  private outputDir: string;

  constructor(inputPath: string, outputDir?: string) {
    this.inputPath = inputPath;
    // If outputDir is provided, use it as-is (relative to current working directory)
    // If not provided, default to same directory as input file
    this.outputDir = outputDir || path.dirname(inputPath);
  }

  /**
   * Extracts text from each page of the PDF and saves it to separate text files
   * Format: original-filename.pdf.page001.txt, original-filename.pdf.page002.txt, etc.
   */
  async extractPagesToText(): Promise<void> {
    // Check if input file exists
    try {
      await fs.access(this.inputPath);
    } catch {
      throw new Error(`Input file not found: ${this.inputPath}`);
    }

    // Create output directory if it doesn't exist
    await fs.mkdir(this.outputDir, { recursive: true });

    // Read the PDF file
    const pdfBytes = await fs.readFile(this.inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pageCount = pdfDoc.getPageCount();
    console.log(`Processing PDF with ${pageCount} pages...`);

    const baseFileName = path.basename(this.inputPath);

    // Extract text from each page
    for (let i = 0; i < pageCount; i++) {
      try {
        // Create a new PDF with just this page
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
        singlePagePdf.addPage(copiedPage);

        // Convert single page PDF to buffer
        const singlePageBytes = await singlePagePdf.save();

        // Extract text from the single page PDF
        const pdfData = await pdfParse(Buffer.from(singlePageBytes));
        // Replace tabs with single spaces and clean up multiple spaces
        const pageText = pdfData.text
          .replace(/\t/g, ' ')           // Replace tabs with spaces
          .replace(/  +/g, ' ')          // Replace multiple spaces with single space
          .trim();                       // Remove leading/trailing whitespace

        // Generate output filename
        const pageNumber = (i + 1).toString().padStart(3, '0');
        const outputFileName = `${baseFileName}.page${pageNumber}.txt`;
        const outputPath = path.join(this.outputDir, outputFileName);
        
        // Write text to file
        await fs.writeFile(outputPath, pageText, 'utf-8');
        console.log(`Created: ${outputFileName} (${pageText.length} characters)`);

      } catch (error) {
        console.warn(`Warning: Could not extract text from page ${i + 1}: ${error instanceof Error ? error.message : error}`);
        
        // Create empty file for pages that can't be processed
        const pageNumber = (i + 1).toString().padStart(3, '0');
        const outputFileName = `${baseFileName}.page${pageNumber}.txt`;
        const outputPath = path.join(this.outputDir, outputFileName);
        await fs.writeFile(outputPath, '[Text extraction failed for this page]', 'utf-8');
        console.log(`Created: ${outputFileName} (extraction failed)`);
      }
    }

    console.log(`Text extraction completed. Files saved to: ${this.outputDir}`);
  }

  /**
   * Split PDF into separate PDF files for each page
   * @param prefix - Prefix for output files (default: 'page')
   */
  async splitToPages(prefix: string = 'page'): Promise<void> {
    // Check if input file exists
    try {
      await fs.access(this.inputPath);
    } catch {
      throw new Error(`Input file not found: ${this.inputPath}`);
    }

    // Create output directory if it doesn't exist
    await fs.mkdir(this.outputDir, { recursive: true });

    // Read the PDF file
    const pdfBytes = await fs.readFile(this.inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pageCount = pdfDoc.getPageCount();
    console.log(`Processing PDF with ${pageCount} pages...`);

    // Split each page into a separate PDF
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const outputFileName = `${prefix}_${(i + 1).toString().padStart(3, '0')}.pdf`;
      const outputPath = path.join(this.outputDir, outputFileName);
      
      await fs.writeFile(outputPath, pdfBytes);
      console.log(`Created: ${outputFileName}`);
    }
  }

  /**
   * Get basic information about the PDF
   */
  async getInfo(): Promise<{ pageCount: number; fileSize: number; fileName: string }> {
    const stats = await fs.stat(this.inputPath);
    const pdfBytes = await fs.readFile(this.inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    return {
      pageCount: pdfDoc.getPageCount(),
      fileSize: stats.size,
      fileName: path.basename(this.inputPath)
    };
  }
}

/**
 * Legacy function for splitting PDFs (for backward compatibility)
 */
export async function splitPdf(inputPath: string, outputDir: string, prefix: string): Promise<void> {
  const splitter = new PdfSplitter(inputPath, outputDir);
  await splitter.splitToPages(prefix);
}