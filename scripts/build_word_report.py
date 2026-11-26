import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_report():
    doc = docx.Document()
    
    # Page Setup: Letter, 1-inch margins
    for sec in doc.sections:
        sec.top_margin = Inches(1.0)
        sec.bottom_margin = Inches(1.0)
        sec.left_margin = Inches(1.0)
        sec.right_margin = Inches(1.0)
        sec.page_width = Inches(8.5)
        sec.page_height = Inches(11.0)
        
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)
    
    def set_cell_background(cell, color_hex):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        
    def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = parse_xml(f'<w:{m} {nsdecls("w")} w:w="{val}" w:type="dxa"/>')
            tcMar.append(node)
        tcPr.append(tcMar)
        
    def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:left w:val="none"/>
                <w:right w:val="none"/>
                <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
                <w:insideV w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr.append(borders)
        
    # 1. Header Banner Box
    t_banner = doc.add_table(rows=1, cols=1)
    t_banner.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_banner = t_banner.cell(0, 0)
    c_banner.width = Inches(6.5)
    set_cell_background(c_banner, "1B365D")
    set_cell_margins(c_banner, top=200, bottom=200, left=200, right=200)
    
    p_b1 = c_banner.paragraphs[0]
    p_b1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_b1 = p_b1.add_run("MINOR PROJECT TECHNICAL REPORT\n")
    r_b1.font.name = "Times New Roman"
    r_b1.font.size = Pt(13)
    r_b1.font.bold = True
    r_b1.font.color.rgb = RGBColor(0x93, 0xC5, 0xFD)
    
    r_b2 = p_b1.add_run("JEEVANSETU v2.0\n")
    r_b2.font.name = "Times New Roman"
    r_b2.font.size = Pt(22)
    r_b2.font.bold = True
    r_b2.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    r_b3 = p_b1.add_run("Next-Generation Rural Healthcare, Emergency First-Response & Medical Authority Governance Platform")
    r_b3.font.name = "Times New Roman"
    r_b3.font.size = Pt(11.5)
    r_b3.font.italic = True
    r_b3.font.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)
    
    doc.add_paragraph() # Spacer
    
    # 2. Scope & Verification Callout Box
    t_scope = doc.add_table(rows=1, cols=1)
    t_scope.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_scope = t_scope.cell(0, 0)
    c_scope.width = Inches(6.5)
    set_cell_background(c_scope, "F1F5F9")
    set_cell_margins(c_scope, top=140, bottom=140, left=180, right=180)
    
    # Add border on left
    tcPr = c_scope._tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="24" w:space="0" w:color="1B365D"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        </w:tcBorders>
    ''')
    tcPr.append(tcBorders)
    
    p_sc1 = c_scope.paragraphs[0]
    r_sc1_title = p_sc1.add_run("Report Verification & Scope\n")
    r_sc1_title.font.name = "Times New Roman"
    r_sc1_title.font.size = Pt(12)
    r_sc1_title.font.bold = True
    r_sc1_title.font.color.rgb = RGBColor(0x1B, 0x36, 0x5D)
    
    r_sc1_body = p_sc1.add_run(
        "This consolidated Minor Project Technical Report documents the comprehensive architecture, source-code implementation, "
        "relational database schemas, cryptographic authentication controls, emergency SOS dispatch mechanisms, clinical triage algorithms, "
        "and security audit of JeevanSetu v2.0. All functional claims, scoring thresholds, role-based access control (RBAC) policies, statutory medical "
        "verification workflows, and voluntary blood donor privacy safeguards have been directly verified against the production TypeScript "
        "codebase (src/app.ts, src/services/authService.ts, src/services/doctorVerificationService.ts, src/services/emergencyProtocolService.ts, "
        "src/services/bloodDonorService.ts, src/services/adminAnalyticsService.ts, src/services/sosService.ts, src/pages/AdminDashboard.ts, "
        "src/pages/DoctorPortal.ts, src/pages/AdminLogin.ts, src/pages/EmergencyProtocols.ts, src/pages/BloodDonors.ts) and validated via 68 "
        "automated unit and integration test cases across 10 test suites in Vitest with a 100% pass rate."
    )
    r_sc1_body.font.name = "Times New Roman"
    r_sc1_body.font.size = Pt(10.5)
    r_sc1_body.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    
    doc.add_paragraph() # Spacer
    
    # 3. Report Specification Table
    specs = [
        ("Project Title", "JeevanSetu — Rural Healthcare, Emergency First-Response & Medical Authority Platform (v2.0)"),
        ("System Category", "Healthcare Technology / Tele-Triage & Clinical Governance / Emergency First-Response Gateway"),
        ("Core Technology Stack", "TypeScript 5.2, Vite 5.1, Supabase (PostgreSQL 15), Web Speech API, Service Workers (PWA), Vitest 1.3"),
        ("Verified Source Modules", "app.ts, authService.ts, doctorVerificationService.ts, emergencyProtocolService.ts, bloodDonorService.ts, adminAnalyticsService.ts, adminNotificationService.ts, sosService.ts, healthcareService.ts, aiService.ts, AdminDashboard.ts, DoctorPortal.ts, AdminLogin.ts, Donors.ts, EmergencyProtocol.ts"),
        ("Deployment Environment", "Modern Web Browser / Progressive Web App (PWA) / Local Vite Daemon (PID: 899, Port: 5173)"),
        ("Verified Test Coverage", "68/68 Automated Unit & Integration Tests Passing (10 Test Suites, 100% Pass Rate)"),
        ("Submission Date", "November 26, 2026")
    ]
    
    t_spec = doc.add_table(rows=len(specs)+1, cols=2)
    t_spec.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_spec, color="CBD5E1", sz="4")
    
    # Headers
    h_cell0 = t_spec.cell(0, 0)
    h_cell1 = t_spec.cell(0, 1)
    h_cell0.width = Inches(2.2)
    h_cell1.width = Inches(4.3)
    set_cell_background(h_cell0, "1B365D")
    set_cell_background(h_cell1, "1B365D")
    set_cell_margins(h_cell0, top=100, bottom=100, left=140, right=140)
    set_cell_margins(h_cell1, top=100, bottom=100, left=140, right=140)
    
    rh0 = h_cell0.paragraphs[0].add_run("Report Specification")
    rh0.font.bold = True
    rh0.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    rh0.font.size = Pt(10.5)
    
    rh1 = h_cell1.paragraphs[0].add_run("Details")
    rh1.font.bold = True
    rh1.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    rh1.font.size = Pt(10.5)
    
    for i, (k, v) in enumerate(specs):
        c0 = t_spec.cell(i+1, 0)
        c1 = t_spec.cell(i+1, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        if i % 2 == 1:
            set_cell_background(c0, "F8FAFC")
            set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, top=80, bottom=80, left=140, right=140)
        set_cell_margins(c1, top=80, bottom=80, left=140, right=140)
        
        r0 = c0.paragraphs[0].add_run(k)
        r0.font.bold = True
        r0.font.size = Pt(10)
        
        r1 = c1.paragraphs[0].add_run(v)
        r1.font.size = Pt(10)
        
    doc.add_paragraph() # Spacer
    
    # 4. Table of Contents
    p_toc_title = doc.add_paragraph()
    r_toc = p_toc_title.add_run("Table of Contents")
    r_toc.font.name = "Times New Roman"
    r_toc.font.size = Pt(14)
    r_toc.font.bold = True
    r_toc.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
    
    toc_items = [
        ("Chapter 1 — Executive Summary & Project Overview", "Introduction, Problem Statement, Core Project Objectives, and Code-Verified Capabilities."),
        ("Chapter 2 — System Architecture & Core Codebase Modules", "Decoupled Client-First Architecture, Codebase Responsibility Matrix, Persistent Navigation, and Layout Components."),
        ("Chapter 3 — Authentication, Role-Based Access Control (RBAC) & Database Schema Engine", "Security Configuration, RBAC Role Matrix, PostgreSQL Schema, and Supabase RLS Migration Engine."),
        ("Chapter 4 — Authority Portal UI & Role-Wise Login Walkthrough", "Dual-Role Architecture, Super Administrator Authentication, Verified Doctor Sign-In, and Session Termination."),
        ("Chapter 5 — Smart Emergency Response & Real SOS Dispatch Engine", "2-Second Hold-to-Activate Timer, Real-World Cellular SMS URI Dispatch, Locality Resolution, and Incident Audit Trail."),
        ("Chapter 6 — Clinical AI Symptom Triage & Deterministic Safety Engine", "Dual-Stage Triage Pipeline, Deterministic Red-Flag Safety Overrides, Risk Level Scoring, and Multilingual Speech Integration."),
        ("Chapter 7 — Medical Authority Credentialing & Doctor Verification Engine", "Statutory Council Registration, Verification Lifecycle, Administrative Document Evaluation, and Status Enforcement."),
        ("Chapter 8 — Emergency Medical Protocol Authoring & Governance System", "Clinical Authoring Studio, Editorial & Review Lifecycle, Version History Snapshots, and Public Attribution with Universal 112/108 Guidance."),
        ("Chapter 9 — Voluntary Blood Donor Registry & Privacy Protection Engine", "Privacy-Preserving Architecture, Administrative Registry Controls, User-Facing Voluntary Registration, and Duplicate Prevention."),
        ("Chapter 10 — Security Audit Findings, Future Enhancements & Conclusion", "Code-Level Security Audit, Prioritized P0–P3 Engineering Roadmap, Automated QA Test Results, and Project Conclusion.")
    ]
    
    for ch, desc in toc_items:
        p_t = doc.add_paragraph(style='List Bullet')
        p_t.paragraph_format.space_after = Pt(3)
        r_ch = p_t.add_run(ch + ": ")
        r_ch.font.bold = True
        r_ch.font.size = Pt(10.5)
        r_ch.font.color.rgb = RGBColor(0x1B, 0x36, 0x5D)
        
        r_d = p_t.add_run(desc)
        r_d.font.size = Pt(10.5)
        
    doc.add_page_break()
    
    # Read Markdown lines and process chapters
    with open(r'C:\Users\krish\.gemini\antigravity\brain\b48e624f-a3a4-421d-b252-3f8a9bc45581\JeevanSetu_Technical_Report.md', 'r', encoding='utf-8') as f:
        md_content = f.read()
        
    # Split by Chapter 1
    ch1_idx = md_content.find("## Chapter 1 — Executive Summary & Project Overview")
    body_md = md_content[ch1_idx:]
    
    # Process line by line
    lines = body_md.split('\n')
    i = 0
    in_code_block = False
    code_lines = []
    
    while i < len(lines):
        line = lines[i]
        
        # Code block
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lines = []
            else:
                in_code_block = False
                # Render code box
                t_code = doc.add_table(rows=1, cols=1)
                t_code.alignment = WD_TABLE_ALIGNMENT.CENTER
                c_code = t_code.cell(0, 0)
                c_code.width = Inches(6.5)
                set_cell_background(c_code, "F8FAFC")
                set_cell_margins(c_code, top=100, bottom=100, left=140, right=140)
                set_table_borders(t_code, color="CBD5E1", sz="4")
                p_c = c_code.paragraphs[0]
                p_c.paragraph_format.line_spacing = 1.0
                r_c = p_c.add_run('\n'.join(code_lines))
                r_c.font.name = "Consolas"
                r_c.font.size = Pt(9)
                r_c.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
                doc.add_paragraph()
            i += 1
            continue
            
        if in_code_block:
            code_lines.append(line)
            i += 1
            continue
            
        # Table
        if line.startswith('|') and '|' in line[1:]:
            # Read whole markdown table
            table_lines = []
            while i < len(lines) and lines[i].startswith('|'):
                table_lines.append(lines[i])
                i += 1
                
            # Parse table
            raw_rows = []
            for tl in table_lines:
                # Skip separator lines like | :--- | :--- |
                if re.match(r'^\|(\s*:?-+:?\s*\|)+$', tl.strip()):
                    continue
                cells = [c.strip() for c in tl.split('|')[1:-1]]
                if cells:
                    raw_rows.append(cells)
                    
            if raw_rows:
                num_cols = len(raw_rows[0])
                table = doc.add_table(rows=len(raw_rows), cols=num_cols)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                set_table_borders(table, color="CBD5E1", sz="4")
                
                col_width = Inches(6.5 / num_cols)
                
                for r_idx, row_cells in enumerate(raw_rows):
                    is_header = (r_idx == 0)
                    for c_idx, cell_text in enumerate(row_cells):
                        if c_idx >= num_cols:
                            continue
                        cell = table.cell(r_idx, c_idx)
                        cell.width = col_width
                        set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
                        
                        if is_header:
                            set_cell_background(cell, "1B365D")
                        elif r_idx % 2 == 1:
                            set_cell_background(cell, "F8FAFC")
                            
                        # Clean cell text (remove markdown bold/code)
                        p_cell = cell.paragraphs[0]
                        p_cell.paragraph_format.space_after = Pt(2)
                        
                        # Parse simple bold markdown in cells
                        parts = re.split(r'(\*\*.*?\*\*|`.*?`)', cell_text)
                        for part in parts:
                            if not part:
                                continue
                            if part.startswith('**') and part.endswith('**'):
                                r = p_cell.add_run(part[2:-2])
                                r.font.bold = True
                            elif part.startswith('`') and part.endswith('`'):
                                r = p_cell.add_run(part[1:-1])
                                r.font.name = "Consolas"
                                r.font.size = Pt(9.5)
                            else:
                                r = p_cell.add_run(part)
                                
                            if is_header:
                                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                                r.font.bold = True
                                r.font.size = Pt(10)
                            else:
                                r.font.size = Pt(9.5)
                                r.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
                doc.add_paragraph() # Spacer
            continue
            
        # Headings
        if line.startswith('## Chapter'):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(16)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(line[3:].strip())
            r.font.name = "Times New Roman"
            r.font.size = Pt(16)
            r.font.bold = True
            r.font.color.rgb = RGBColor(0x1B, 0x36, 0x5D)
            i += 1
            continue
            
        if line.startswith('### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(line[4:].strip())
            r.font.name = "Times New Roman"
            r.font.size = Pt(13.5)
            r.font.bold = True
            r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)
            i += 1
            continue
            
        if line.startswith('#### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            r = p.add_run(line[5:].strip())
            r.font.name = "Times New Roman"
            r.font.size = Pt(12)
            r.font.bold = True
            r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
            i += 1
            continue
            
        # Bullet list
        if line.startswith('- ') or line.startswith('* '):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(3)
            parts = re.split(r'(\*\*.*?\*\*|`.*?`)', line[2:].strip())
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    r = p.add_run(part[1:-1])
                    r.font.name = "Consolas"
                    r.font.size = Pt(10)
                else:
                    r = p.add_run(part)
                r.font.size = Pt(11)
            i += 1
            continue
            
        # Numbered list
        num_match = re.match(r'^(\d+)\.\s+(.*)', line)
        if num_match:
            p = doc.add_paragraph(style='List Number')
            p.paragraph_format.space_after = Pt(3)
            parts = re.split(r'(\*\*.*?\*\*|`.*?`)', num_match.group(2).strip())
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    r = p.add_run(part[1:-1])
                    r.font.name = "Consolas"
                    r.font.size = Pt(10)
                else:
                    r = p.add_run(part)
                r.font.size = Pt(11)
            i += 1
            continue
            
        # Blockquote / Alert
        if line.startswith('> '):
            t_bq = doc.add_table(rows=1, cols=1)
            t_bq.alignment = WD_TABLE_ALIGNMENT.CENTER
            c_bq = t_bq.cell(0, 0)
            c_bq.width = Inches(6.5)
            set_cell_background(c_bq, "F1F5F9")
            set_cell_margins(c_bq, top=80, bottom=80, left=140, right=140)
            
            tcPr = c_bq._tc.get_or_add_tcPr()
            tcBorders = parse_xml(f'''
                <w:tcBorders {nsdecls("w")}>
                    <w:left w:val="single" w:sz="18" w:space="0" w:color="1B365D"/>
                    <w:top w:val="none"/>
                    <w:bottom w:val="none"/>
                    <w:right w:val="none"/>
                </w:tcBorders>
            ''')
            tcPr.append(tcBorders)
            
            p_bq = c_bq.paragraphs[0]
            p_bq.paragraph_format.space_after = Pt(0)
            parts = re.split(r'(\*\*.*?\*\*|`.*?`)', line[2:].strip())
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    r = p_bq.add_run(part[2:-2])
                    r.font.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    r = p_bq.add_run(part[1:-1])
                    r.font.name = "Consolas"
                    r.font.size = Pt(9.5)
                else:
                    r = p_bq.add_run(part)
                r.font.size = Pt(10.5)
                r.font.italic = True
            doc.add_paragraph()
            i += 1
            continue
            
        # Normal prose
        if line.strip():
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(5)
            parts = re.split(r'(\*\*.*?\*\*|`.*?`)', line.strip())
            for part in parts:
                if not part:
                    continue
                if part.startswith('**') and part.endswith('**'):
                    r = p.add_run(part[2:-2])
                    r.font.bold = True
                elif part.startswith('`') and part.endswith('`'):
                    r = p.add_run(part[1:-1])
                    r.font.name = "Consolas"
                    r.font.size = Pt(10)
                else:
                    r = p.add_run(part)
                r.font.size = Pt(11)
        i += 1
        
    # Save outputs
    out_paths = [
        r'd:\jeevansetu\docs\JeevanSetu_Full_Minor_Project_Report.docx',
        r'C:\Users\krish\.gemini\antigravity\brain\b48e624f-a3a4-421d-b252-3f8a9bc45581\JeevanSetu_Full_Minor_Project_Report.docx'
    ]
    for p in out_paths:
        doc.save(p)
        print(f"Report DOCX saved successfully to {p} (Size: {os.path.getsize(p)} bytes)")

if __name__ == '__main__':
    create_report()
