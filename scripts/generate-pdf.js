#!/usr/bin/env node

/**
 * Generate PDF from Hugo site using Playwright
 * Usage: node scripts/generate-pdf.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to A4 size
  await page.setViewportSize({ width: 794, height: 1123 }); // A4 at 96 DPI

  try {
    // Build the Hugo site first
    console.log('📦 Building Hugo site...');
    require('child_process').execSync('hugo --minify', { stdio: 'inherit' });

    // Load the built HTML
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // Load the page with the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for fonts and any dynamic content
    await page.waitForTimeout(1000);

    // Generate PDF with print-specific styles
    const pdfPath = path.join(__dirname, '..', 'public', 'daniel-kirsch-cv.pdf');
    console.log(`📄 Generating PDF: ${pdfPath}`);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      tagged: true
    });

    console.log('✅ PDF generated successfully!');
    console.log(`📁 Location: ${pdfPath}`);

    // Log file size
    const stats = fs.statSync(pdfPath);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the generator
generatePDF();