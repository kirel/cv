#!/usr/bin/env node

/**
 * Generate PDF from Hugo site using Playwright
 * Usage: node scripts/generate-pdf.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Simple static file server
function createServer(publicDir, port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.pdf': 'application/pdf'
      };

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });

    server.listen(port, () => resolve(server));
  });
}

async function generatePDF() {
  console.log('🚀 Starting PDF generation...');

  // Build the Hugo site first
  console.log('📦 Building Hugo site...');
  require('child_process').execSync('hugo --minify', { stdio: 'inherit' });

  // Start local server to serve the built site (needed for fonts to load)
  const publicDir = path.join(__dirname, '..', 'public');
  const port = 3456;
  const server = await createServer(publicDir, port);
  console.log(`🌐 Started local server on port ${port}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to A4 size
  await page.setViewportSize({ width: 794, height: 1123 }); // A4 at 96 DPI

  try {
    const htmlUrl = `http://localhost:${port}/`;

    console.log(`🌐 Loading: ${htmlUrl}`);
    await page.goto(htmlUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for fonts to load
    console.log('⏳ Waiting for fonts to load...');
    await page.evaluateHandle('document.fonts.ready');

    // Wait a moment for fonts to fully render
    await page.waitForTimeout(1000);

    // Emulate print media to trigger @media print styles
    console.log('🖨️  Emulating print media...');
    await page.emulateMedia({ media: 'print' });

    // Wait for styles to apply
    await page.waitForTimeout(500);

    // Verify the page is fully rendered and calculate scaling
    const pageInfo = await page.evaluate(() => {
      const header = document.querySelector('#header__name');
      const contact = document.querySelector('#contact');
      const experience = document.querySelector('#experience');
      const bodyStyle = getComputedStyle(document.body);

      // Get total content height
      const body = document.body;
      const contentHeight = body.scrollHeight;

      return {
        hasElements: !!(header && contact && experience),
        headerText: header?.textContent?.substring(0, 30) || 'N/A',
        backgroundColor: bodyStyle.backgroundColor,
        color: bodyStyle.color,
        fontFamily: bodyStyle.fontFamily,
        contentHeight: contentHeight
      };
    });

    console.log(`✅ Page loaded:`);
    console.log(`   Header: ${pageInfo.headerText}...`);
    console.log(`   Background: ${pageInfo.backgroundColor}`);
    console.log(`   Font: ${pageInfo.fontFamily}`);
    console.log(`   Content height: ${pageInfo.contentHeight}px`);

    // A4 at 96 DPI with 0.5in margins: usable area is ~698 x 1027 pixels per page
    // For 2 pages, we have ~2054px of usable height
    const targetPages = 2;
    const usableHeightPerPage = 1027;
    const totalUsableHeight = usableHeightPerPage * targetPages;

    // Calculate scale factor
    let scale = 1;
    if (pageInfo.contentHeight > totalUsableHeight) {
      scale = totalUsableHeight / pageInfo.contentHeight;
      console.log(`📐 Content (${pageInfo.contentHeight}px) exceeds ${targetPages} pages (${totalUsableHeight}px)`);
      console.log(`📐 Will use PDF scale: ${scale.toFixed(3)}`);
    } else {
      console.log(`📐 Content fits in ${targetPages} pages`);
    }

    // Generate PDF with print-specific styles
    const pdfPath = path.join(__dirname, '..', 'public', 'daniel-kirsch-cv.pdf');
    console.log(`📄 Generating PDF: ${pdfPath}`);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      scale: scale,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      tagged: true,
      outline: true
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
    server.close();
    console.log('🛑 Server stopped');
  }
}

// Run the generator
generatePDF();