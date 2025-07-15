const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require("path");
const port = 3001;

app.use(bodyParser.json());

// Serve static files (like CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Test Route
app.get('/test', (req, res) => {
  res.status(200).send("Server is up");
});


// ==========================
// HTML Template Views
// ==========================

// User Template
app.get('/template-view', (req, res) => {
  const { name = 'Guest', email = 'N/A' } = req.query;
  const templatePath = path.join(__dirname, 'templates', 'template.html');

  let template = fs.readFileSync(templatePath, 'utf8');
  template = template.replace('{{name}}', name).replace('{{email}}', email);

  res.send(template);
});

// Employee Template
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

// School Template
app.get('/school-template-view', (req, res) => {
  const { schoolName = 'Unnamed School', reportDate = 'N/A' } = req.query;
  const templatePath = path.join(__dirname, 'templates', 'school-template.html');

  let template = fs.readFileSync(templatePath, 'utf8');
  template = template
    .replace('{{schoolName}}', schoolName)
    .replace('{{reportDate}}', reportDate);

  res.send(template);
});

// Corporate Template View
app.get('/corporate-template-view', (req, res) => {
  const { companyName = 'Unknown Company', reportDate = 'N/A' } = req.query;
  const templatePath = path.join(__dirname, 'templates', 'corporate-template.html');

  let template = fs.readFileSync(templatePath, 'utf8');
  template = template
    .replace('{{companyName}}', companyName)
    .replace('{{reportDate}}', reportDate)

  res.send(template);
});


// ==========================
// PDF Student
// ==========================

// Student Report PDF
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
      'Content-Disposition': 'inline; filename=user-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('User PDF generation failed:', err);
    res.status(500).send('Failed to generate user report PDF');
  }
});

// Employee Report PDF
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

// School Report PDF
app.get('/generate-school-report', async (req, res) => {
  const { schoolName, reportDate } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const templateUrl = `http://localhost:${port}/school-template-view?schoolName=${encodeURIComponent(schoolName)}&reportDate=${encodeURIComponent(reportDate)}`;
    await page.goto(templateUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=school-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('School PDF generation failed:', err);
    res.status(500).send('Failed to generate school report PDF');
  }
});

// Corporate Report PDF
app.get('/generate-corporate-report', async (req, res) => {
  const { companyName, reportDate } = req.query;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const templateUrl = `http://localhost:${port}/corporate-template-view?companyName=${encodeURIComponent(companyName)}&reportDate=${encodeURIComponent(reportDate)}`;
    await page.goto(templateUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=corporate-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('Corporate PDF generation failed:', err);
    res.status(500).send('Failed to generate corporate report PDF');
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
