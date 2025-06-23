const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require("path");
const port = 3001;

app.use(bodyParser.json());

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Test Route
app.get('/test', (req, res) => {
  res.status(200).send("Server is up");
});

// Template for user report
app.get('/template-view', (req, res) => {
  const { name = 'Guest', email = 'N/A' } = req.query;

  const templatePath = path.join(__dirname, 'templates', 'template.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  template = template.replace('{{name}}', name).replace('{{email}}', email);

  res.send(template);
});

// Template for employee report
app.get('/employee-template-view', (req, res) => {
  const { name = 'Unknown', email = 'N/A', designation = 'Employee' } = req.query;

  const templatePath = path.join(__dirname, 'templates', 'employee-template.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  template = template
    .replace('{{name}}', name)
    .replace('{{email}}', email)
    .replace('{{designation}}', designation);

  res.send(template);
});

// Generate PDF for user
app.get('/generate-pdf', async (req, res) => {
  const { name, email } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const templateUrl = `http://localhost:${port}/template-view?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

    await page.goto(templateUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=generated.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).send('Failed to generate PDF');
  }
});

// Generate PDF for employee report
app.get('/generate-employee-report', async (req, res) => {
  const { name, email, designation } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const templateUrl = `http://localhost:${port}/employee-template-view?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&designation=${encodeURIComponent(designation)}`;

    await page.goto(templateUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=employee-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Employee PDF generation failed:', err);
    res.status(500).send('Failed to generate employee report PDF');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
