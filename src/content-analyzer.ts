import * as fs from 'fs/promises';
import * as path from 'path';

interface ContentAnalysis {
  isEmpty: boolean;
  isTableOfContents: boolean;
  isNonContent: boolean;
  reason: string;
  characterCount: number;
  wordCount: number;
}

export class ContentAnalyzer {
  private tocKeywords = [
    'table of contents',
    'contents',
    'chapter',
    'part 1',
    'part 2',
    'part 3',
    'index',
    'acknowledgements',
    'dedication',
    'preface',
    'introduction',
    'foreword',
    'copyright',
    'title page',
    'about the author'
  ];

  private extractionFailurePatterns = [
    '[text extraction failed for this page]',
    'extraction failed',
    'could not extract text'
  ];

  async analyzeFile(filePath: string): Promise<ContentAnalysis> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const trimmedContent = content.trim();
      const characterCount = trimmedContent.length;
      const wordCount = trimmedContent.split(/\s+/).filter(word => word.length > 0).length;

      // Check if file is empty or nearly empty
      if (characterCount === 0) {
        return {
          isEmpty: true,
          isTableOfContents: false,
          isNonContent: true,
          reason: 'Empty file',
          characterCount,
          wordCount
        };
      }

      if (characterCount < 10) {
        return {
          isEmpty: true,
          isTableOfContents: false,
          isNonContent: true,
          reason: 'Too short (less than 10 characters)',
          characterCount,
          wordCount
        };
      }

      // Check for extraction failure messages
      const lowerContent = trimmedContent.toLowerCase();
      for (const pattern of this.extractionFailurePatterns) {
        if (lowerContent.includes(pattern.toLowerCase())) {
          return {
            isEmpty: false,
            isTableOfContents: false,
            isNonContent: true,
            reason: 'Text extraction failed',
            characterCount,
            wordCount
          };
        }
      }

      // Check if it's a table of contents or similar
      const isTableOfContents = this.isContentTableOfContents(trimmedContent);
      if (isTableOfContents) {
        return {
          isEmpty: false,
          isTableOfContents: true,
          isNonContent: true,
          reason: 'Table of contents or similar metadata page',
          characterCount,
          wordCount
        };
      }

      // Check if content is too repetitive or structured (likely not meaningful text)
      if (this.isRepetitiveContent(trimmedContent)) {
        return {
          isEmpty: false,
          isTableOfContents: false,
          isNonContent: true,
          reason: 'Repetitive or structured content (likely not meaningful text)',
          characterCount,
          wordCount
        };
      }

      // If we reach here, it seems like actual content
      return {
        isEmpty: false,
        isTableOfContents: false,
        isNonContent: false,
        reason: 'Contains meaningful content',
        characterCount,
        wordCount
      };

    } catch (error) {
      throw new Error(`Failed to analyze file ${filePath}: ${error instanceof Error ? error.message : error}`);
    }
  }

  private isContentTableOfContents(content: string): boolean {
    const lowerContent = content.toLowerCase();
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Check for TOC keywords
    const keywordMatches = this.tocKeywords.filter(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    ).length;

    // If more than 2 TOC keywords found, likely a TOC
    if (keywordMatches >= 2) {
      return true;
    }

    // Check for chapter/page number patterns
    const chapterPattern = /chapter\s+\d+/gi;
    const pagePattern = /page\s+\d+/gi;
    const chapterMatches = (content.match(chapterPattern) || []).length;
    const pageMatches = (content.match(pagePattern) || []).length;

    if (chapterMatches >= 2 || pageMatches >= 2) {
      return true;
    }

    // Check if most lines are short (typical for TOC)
    if (lines.length >= 3) {
      const shortLines = lines.filter(line => line.length < 50).length;
      const ratio = shortLines / lines.length;
      if (ratio > 0.7 && keywordMatches >= 1) {
        return true;
      }
    }

    return false;
  }

  private isRepetitiveContent(content: string): boolean {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length < 3) {
      return false;
    }

    // Check for highly repetitive lines
    const uniqueLines = new Set(lines);
    const repetitionRatio = uniqueLines.size / lines.length;
    
    if (repetitionRatio < 0.3) {
      return true;
    }

    // Check for very short average line length (might be structured data)
    const averageLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    if (averageLineLength < 15 && lines.length > 5) {
      return true;
    }

    return false;
  }

  async processDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await fs.readdir(directoryPath);
      const textFiles = files.filter(file => file.endsWith('.txt'));
      
      console.log(`Found ${textFiles.length} text files to analyze...`);
      
      let processedCount = 0;
      let markedCount = 0;

      for (const file of textFiles) {
        const filePath = path.join(directoryPath, file);
        const analysis = await this.analyzeFile(filePath);
        
        processedCount++;
        
        if (analysis.isNonContent) {
          const markerPath = filePath.replace('.txt', '.no-content');
          const markerContent = `Marked as no-content: ${analysis.reason}
Character count: ${analysis.characterCount}
Word count: ${analysis.wordCount}
Analysis date: ${new Date().toISOString()}`;
          
          await fs.writeFile(markerPath, markerContent, 'utf-8');
          markedCount++;
          
          console.log(`Marked: ${file} - ${analysis.reason}`);
        }
        
        // Progress indicator
        if (processedCount % 50 === 0) {
          console.log(`Processed ${processedCount}/${textFiles.length} files...`);
        }
      }
      
      console.log(`\nAnalysis complete:`);
      console.log(`- Total files processed: ${processedCount}`);
      console.log(`- Files marked as no-content: ${markedCount}`);
      console.log(`- Files with content: ${processedCount - markedCount}`);
      
    } catch (error) {
      throw new Error(`Failed to process directory: ${error instanceof Error ? error.message : error}`);
    }
  }
}