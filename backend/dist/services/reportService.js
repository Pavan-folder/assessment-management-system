"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = generateReport;
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const assessmentConfig_1 = require("../../../config/assessmentConfig");
const data_1 = require("../../../data/data");
// Generate HTML report from assessment data
async function generateReport(sessionId) {
    try {
        // Get assessment data for the session
        const data = (0, data_1.getAssessmentBySessionId)(sessionId);
        if (!data) {
            throw new Error(`No assessment data found for session ID: ${sessionId}`);
        }
        // Determine assessment type from data
        const assessmentId = data.assessment_id || 'as_hr_02';
        const config = (0, assessmentConfig_1.getAssessmentConfig)(assessmentId);
        if (!config) {
            throw new Error(`No configuration found for assessment type: ${assessmentId}`);
        }
        // Process the data according to configuration
        const processedReport = processAssessmentData(data, config);
        // Generate HTML content
        const htmlContent = await generateHTMLReport(processedReport, config);
        // Generate PDF using Puppeteer
        const pdfPath = await generatePDF(htmlContent, sessionId);
        return {
            reportPath: pdfPath,
            downloadUrl: `/api/reports/download/${sessionId}`
        };
    }
    catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
}
// Process assessment data according to configuration
function processAssessmentData(data, config) {
    const sections = [];
    for (const sectionConfig of config.sections) {
        const fields = [];
        for (const fieldConfig of sectionConfig.fields) {
            const value = (0, assessmentConfig_1.extractValueFromPath)(data, fieldConfig.dataPath);
            let classification = undefined;
            if (fieldConfig.classification && value !== null && value !== undefined) {
                classification = (0, assessmentConfig_1.getClassificationForValue)(fieldConfig.fieldName, value);
            }
            fields.push({
                fieldName: fieldConfig.fieldName,
                displayName: fieldConfig.displayName,
                value: value,
                unit: fieldConfig.unit,
                classification: classification,
                shouldDisplay: fieldConfig.shouldDisplay
            });
        }
        sections.push({
            sectionName: sectionConfig.sectionName,
            fields: fields
        });
    }
    return {
        assessmentId: config.assessmentId,
        assessmentName: config.assessmentName,
        sections: sections,
        generatedAt: new Date().toISOString()
    };
}
// Generate HTML report content
async function generateHTMLReport(processedReport, config) {
    const templatePath = path_1.default.join(__dirname, '../../templates', config.templateFile);
    try {
        // Try to read custom template
        const template = await promises_1.default.readFile(templatePath, 'utf-8');
        return populateTemplate(template, processedReport);
    }
    catch (error) {
        // Fall back to default template
        console.log(`Custom template not found, using default template for ${config.assessmentId}`);
        return generateDefaultTemplate(processedReport);
    }
}
// Populate HTML template with data
function populateTemplate(template, data) {
    let html = template;
    // Replace basic information
    html = html.replace('{{assessmentName}}', data.assessmentName);
    html = html.replace('{{generatedAt}}', new Date(data.generatedAt).toLocaleString());
    // Replace sections
    const sectionsHtml = data.sections.map(section => {
        const fieldsHtml = section.fields
            .filter(field => field.shouldDisplay)
            .map(field => {
            const value = field.value !== null && field.value !== undefined ? field.value : 'N/A';
            const unit = field.unit ? ` ${field.unit}` : '';
            const classification = field.classification
                ? `<span class="classification" style="color: ${field.classification.color}">${field.classification.label}</span>`
                : '';
            return `
          <div class="field">
            <div class="field-label">${field.displayName}</div>
            <div class="field-value">${value}${unit} ${classification}</div>
          </div>
        `;
        }).join('');
        return `
      <div class="section">
        <h3 class="section-title">${section.sectionName}</h3>
        <div class="fields">
          ${fieldsHtml}
        </div>
      </div>
    `;
    }).join('');
    html = html.replace('{{sections}}', sectionsHtml);
    return html;
}
// Generate default HTML template
function generateDefaultTemplate(data) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.assessmentName} Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        .section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .section-title {
            background: #f8f9fa;
            padding: 15px 20px;
            margin: 0;
            font-size: 1.3em;
            color: #495057;
            border-bottom: 1px solid #dee2e6;
        }
        .fields {
            padding: 20px;
        }
        .field {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f4;
        }
        .field:last-child {
            border-bottom: none;
        }
        .field-label {
            font-weight: 600;
            color: #495057;
        }
        .field-value {
            text-align: right;
            color: #6c757d;
        }
        .classification {
            font-weight: bold;
            margin-left: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #6c757d;
            font-size: 0.9em;
        }
        @media print {
            body {
                background: white;
                max-width: none;
                padding: 0;
            }
            .header {
                background: #333 !important;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{assessmentName}}</h1>
        <p>Generated on {{generatedAt}}</p>
    </div>

    <div id="sections">
        {{sections}}
    </div>

    <div class="footer">
        <p>This report was generated by the Assessment Management System</p>
        <p>Report ID: ${data.assessmentId} | Generated: ${new Date(data.generatedAt).toLocaleString()}</p>
    </div>
</body>
</html>
  `;
}
// Generate PDF from HTML content
async function generatePDF(htmlContent, sessionId) {
    let browser;
    try {
        // Launch Puppeteer browser
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // Set content and wait for it to load
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        // Create reports directory if it doesn't exist
        const reportsDir = path_1.default.join(__dirname, '../../reports');
        await promises_1.default.mkdir(reportsDir, { recursive: true });
        // Generate PDF filename
        const filename = `report_${sessionId}_${Date.now()}.pdf`;
        const pdfPath = path_1.default.join(reportsDir, filename);
        // Generate PDF
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });
        console.log(`PDF generated successfully: ${pdfPath}`);
        return pdfPath;
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
//# sourceMappingURL=reportService.js.map