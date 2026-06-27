# Office Flow — Project Documentation Book

This folder contains the complete college project documentation for **Office Flow** (50–60 pages when printed).

## Files

| File | Description |
|------|-------------|
| `PROJECT_DOCUMENTATION.md` | Front matter + Chapters 1–2 |
| `chapters/` | Individual chapter files (3–14) |
| `OFFICE_FLOW_PROJECT_BOOK.md` | **Full combined document** (generated) |
| `combine-docs.sh` | Script to merge all chapters |

## Quick Start — Generate Full Book

```bash
cd docs
chmod +x combine-docs.sh
./combine-docs.sh
```

This creates `OFFICE_FLOW_PROJECT_BOOK.md` with all chapters combined.

## Before Submitting — Fill In Your Details

Search and replace these placeholders in the document:

| Placeholder | Replace With |
|-------------|--------------|
| `[Student Name]` | Your full name |
| `[Roll Number]` | Your roll number |
| `[Department]` | e.g., Computer Science |
| `[College Name]` | Your college name |
| `[University Name]` | Your university name |
| `[Guide Name]` | Your project guide's name |
| `[HOD Name]` | Head of Department name |
| `[Degree Name]` | e.g., Bachelor of Technology |

## Print to PDF (50–60 Pages)

### Option 1: VS Code / Cursor (Easiest)

1. Install the **Markdown PDF** extension
2. Open `OFFICE_FLOW_PROJECT_BOOK.md`
3. Right-click → **Markdown PDF: Export (pdf)**
4. Print the PDF from your PDF viewer

### Option 2: Pandoc (Best formatting)

```bash
# Install pandoc (macOS)
brew install pandoc basictex

# Generate PDF
cd docs
pandoc OFFICE_FLOW_PROJECT_BOOK.md \
  -o OFFICE_FLOW_PROJECT_BOOK.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=report \
  --toc \
  --toc-depth=2
```

### Option 3: Google Docs / Microsoft Word

1. Open `OFFICE_FLOW_PROJECT_BOOK.md` in VS Code
2. Copy all content
3. Paste into Google Docs or Word
4. Apply heading styles (Heading 1, Heading 2, etc.)
5. Add page numbers in footer
6. Export/Print as PDF

### Option 4: Online Converter

1. Go to https://www.markdowntopdf.com or https://md2pdf.netlify.app
2. Upload `OFFICE_FLOW_PROJECT_BOOK.md`
3. Download PDF

## Recommended Print Settings

| Setting | Value |
|---------|-------|
| Paper | A4 |
| Margins | 1 inch (2.54 cm) all sides |
| Font | Times New Roman or Arial, 11–12pt |
| Line spacing | 1.5 |
| Page numbers | Bottom center |
| Binding | Spiral or soft binding |

## Document Structure (14 Chapters)

1. Introduction
2. Literature Review & Existing Systems
3. System Analysis
4. System Requirements
5. System Design
6. Database Design
7. Technology Stack
8. Implementation
9. Security & Authentication
10. User Interface Design
11. Testing
12. Deployment & Installation
13. Results & Discussion
14. Conclusion & Future Scope

Plus: References, Appendices A–E

## Adding Screenshots (Optional)

To make the document richer, add screenshots of your running app:

1. Run `npm run dev` and open http://localhost:3000
2. Take screenshots of: Landing page, Dashboard, Attendance, Leave, Payroll, Tasks
3. Save images in `docs/images/`
4. Add to relevant chapters:

```markdown
![Dashboard Screenshot](images/dashboard.png)
*Figure 8.1: Office Flow Dashboard*
```

## Page Count Tips

If the PDF is under 50 pages, you can:
- Increase font size to 12pt
- Add screenshots of each module
- Increase line spacing to 1.5 or 2.0
- Add more test case tables
- Include sample code listings in Appendix

The combined document is approximately **55–65 pages** when printed with standard formatting.
