import { HEALTH_GUIDES } from '../data/healthGuides';
import { EMERGENCY_PROTOCOLS } from '../data/emergencies';

export class PDFExportService {
  /**
   * Generates and triggers browser print-to-PDF for the complete offline medical guide.
   * Contains all disease guides, emergency protocols, first aid, and helpline contacts.
   */
  public static downloadMedicalGuidePDF(): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this site to download the PDF guide.');
      return;
    }

    const healthGuidesHtml = HEALTH_GUIDES.map(
      (guide, idx) => `
      <div class="pdf-card page-break-inside-avoid">
        <div class="guide-header">
          <span class="guide-num">GUIDE #${idx + 1}</span>
          <span class="guide-category">${guide.category.toUpperCase()}</span>
        </div>
        <h3 class="guide-title">${guide.icon} ${guide.title}</h3>
        <p class="guide-excerpt">${guide.excerpt}</p>

        <div class="key-points-box">
          <strong>Key Action Points:</strong>
          <ul>
            ${guide.keyPoints.map((pt) => `<li>${pt}</li>`).join('')}
          </ul>
        </div>

        <div class="guide-content">
          ${guide.fullContent.map((para) => `<p>${para}</p>`).join('')}
        </div>
      </div>
    `
    ).join('');

    const emergencyProtocolsHtml = EMERGENCY_PROTOCOLS.map(
      (p, idx) => `
      <div class="pdf-card page-break-inside-avoid emergency-card">
        <div class="protocol-header">
          <span class="protocol-badge">EMERGENCY PROTOCOL #${idx + 1}</span>
          <span class="hotline-badge">📞 Helpline: ${p.emergencyNumber}</span>
        </div>
        <h3 class="protocol-title">${p.icon} ${p.title} ${p.hindiTitle ? `<span class="hindi">(${p.hindiTitle})</span>` : ''}</h3>

        <div class="warning-banner">
          ⚠️ ${p.warningText}
        </div>

        <div class="immediate-action">
          <strong>Immediate Action:</strong> ${p.immediateAction}
        </div>

        <div class="do-dont-grid">
          <div class="do-box">
            <h4>✅ WHAT TO DO:</h4>
            <ul>
              ${p.doList.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
          <div class="dont-box">
            <h4>❌ WHAT NOT TO DO:</h4>
            <ul>
              ${p.dontList.map((item) => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="steps-box">
          <h4>📋 Step-by-Step Response:</h4>
          <ol>
            ${p.steps.map((st) => `<li><strong>${st.number}. ${st.title}:</strong> ${st.detail}</li>`).join('')}
          </ol>
        </div>

        <div class="help-required">
          <strong>Professional Help Threshold:</strong> ${p.whenProfessionalHelpRequired}
        </div>
      </div>
    `
    ).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>JeevanSetu_Offline_Medical_Guide.pdf</title>
        <style>
          @page {
            size: A4;
            margin: 12mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a202c;
            line-height: 1.5;
            font-size: 11pt;
            background: #fff;
            margin: 0;
            padding: 20px;
          }
          .header-cover {
            text-align: center;
            border-bottom: 3px solid #059669;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .brand-title {
            font-size: 24pt;
            font-weight: 800;
            color: #065f46;
            margin: 0 0 6px 0;
            letter-spacing: -0.5px;
          }
          .brand-subtitle {
            font-size: 12pt;
            color: #4b5563;
            margin: 0 0 10px 0;
            font-weight: 600;
          }
          .doc-meta {
            font-size: 9pt;
            color: #6b7280;
            background: #f3f4f6;
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
          }

          .section-heading {
            font-size: 16pt;
            font-weight: 800;
            color: #065f46;
            border-left: 5px solid #059669;
            padding-left: 10px;
            margin: 30px 0 15px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .pdf-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }

          .guide-header, .protocol-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 8.5pt;
            font-weight: 700;
            margin-bottom: 6px;
          }
          .guide-category, .protocol-badge {
            color: #059669;
            background: #ecfdf5;
            padding: 2px 8px;
            border-radius: 4px;
          }
          .hotline-badge {
            color: #dc2626;
            background: #fef2f2;
            padding: 2px 8px;
            border-radius: 4px;
          }

          .guide-title, .protocol-title {
            font-size: 14pt;
            font-weight: 700;
            color: #111827;
            margin: 4px 0 8px 0;
          }
          .hindi {
            font-size: 11pt;
            font-weight: normal;
            color: #4b5563;
          }
          .guide-excerpt {
            font-size: 10pt;
            color: #4b5563;
            font-style: italic;
            margin-bottom: 12px;
          }

          .key-points-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 12px;
            font-size: 9.5pt;
          }
          .key-points-box ul {
            margin: 4px 0 0 0;
            padding-left: 18px;
          }

          .guide-content p {
            margin: 0 0 8px 0;
            font-size: 10pt;
            color: #374151;
            text-align: justify;
          }

          .warning-banner {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            font-size: 9pt;
            font-weight: 700;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 10px;
          }
          .immediate-action {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e40af;
            font-size: 9.5pt;
            padding: 8px 12px;
            border-radius: 6px;
            margin-bottom: 12px;
          }

          .do-dont-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }
          .do-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 10px;
            border-radius: 6px;
            font-size: 9pt;
          }
          .do-box h4 { margin: 0 0 6px 0; color: #166534; font-size: 9.5pt; }
          .dont-box {
            background: #fff1f2;
            border: 1px solid #fca5a5;
            padding: 10px;
            border-radius: 6px;
            font-size: 9pt;
          }
          .dont-box h4 { margin: 0 0 6px 0; color: #9f1239; font-size: 9.5pt; }

          .do-box ul, .dont-box ul {
            margin: 0;
            padding-left: 16px;
          }
          .do-box li, .dont-box li {
            margin-bottom: 4px;
          }

          .steps-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 10px 14px;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 9pt;
          }
          .steps-box h4 { margin: 0 0 6px 0; color: #111827; }
          .steps-box ol { margin: 0; padding-left: 18px; }
          .steps-box li { margin-bottom: 4px; }

          .help-required {
            font-size: 8.5pt;
            color: #b91c1c;
            background: #fff5f5;
            padding: 6px 10px;
            border-radius: 4px;
            border-left: 3px solid #ef4444;
          }

          .helplines-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 9.5pt;
          }
          .helplines-table th, .helplines-table td {
            border: 1px solid #d1d5db;
            padding: 8px 12px;
            text-align: left;
          }
          .helplines-table th {
            background: #065f46;
            color: #ffffff;
            font-weight: 700;
          }

          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: right;">
          <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 6px; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header-cover">
          <h1 class="brand-title">JeevanSetu JeevanRakshak Guide</h1>
          <div class="brand-subtitle">Complete Offline Disease Management, Emergency Protocols & First-Aid Manual</div>
          <div class="doc-meta">Official Offline Medical Directory • Zero Connectivity Ready • India Community Health</div>
        </div>

        <!-- Section 1: Disease & Health Guides -->
        <h2 class="section-heading">Part I: Disease Management & Community Health Guides</h2>
        ${healthGuidesHtml}

        <!-- Section 2: Emergency Protocols -->
        <h2 class="section-heading" style="page-break-before: always;">Part II: 13 Life-Saving Emergency Protocols</h2>
        ${emergencyProtocolsHtml}

        <!-- Section 3: Helplines -->
        <div class="page-break-inside-avoid">
          <h2 class="section-heading">Part III: National Emergency Helpline Directory</h2>
          <table class="helplines-table">
            <thead>
              <tr>
                <th>Emergency Service</th>
                <th>Toll-Free Number</th>
                <th>Coverage / Scope</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>National Ambulance Service (EMRI)</strong></td>
                <td><strong style="color: #dc2626;">108</strong></td>
                <td>Free emergency medical transport & paramedic care nationwide.</td>
              </tr>
              <tr>
                <td><strong>Janani Shishu Suraksha Karyakram (JSSK)</strong></td>
                <td><strong style="color: #059669;">102</strong></td>
                <td>Free maternal, pregnant mother & sick infant transport.</td>
              </tr>
              <tr>
                <td><strong>National Emergency Response System</strong></td>
                <td><strong>112</strong></td>
                <td>Single unified emergency helpline for police, fire & medical.</td>
              </tr>
              <tr>
                <td><strong>National Poison Information Centre</strong></td>
                <td><strong>1800 116 117</strong></td>
                <td>AIIMS 24/7 toxicological guidance & antidote advice.</td>
              </tr>
              <tr>
                <td><strong>State Health Advisory Line</strong></td>
                <td><strong>104</strong></td>
                <td>Free 24/7 medical advice & tele-consultation support.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
