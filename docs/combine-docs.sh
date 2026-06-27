#!/bin/bash
# Combines all documentation chapters into a single printable file

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT="$SCRIPT_DIR/OFFICE_FLOW_PROJECT_BOOK.md"

echo "Combining Office Flow project documentation..."

cat "$SCRIPT_DIR/PROJECT_DOCUMENTATION.md" \
    "$SCRIPT_DIR/chapters/03-system-analysis.md" \
    "$SCRIPT_DIR/chapters/04-requirements.md" \
    "$SCRIPT_DIR/chapters/05-system-design.md" \
    "$SCRIPT_DIR/chapters/06-database-design.md" \
    "$SCRIPT_DIR/chapters/07-technology-stack.md" \
    "$SCRIPT_DIR/chapters/08-implementation.md" \
    "$SCRIPT_DIR/chapters/09-security.md" \
    "$SCRIPT_DIR/chapters/10-ui-design.md" \
    "$SCRIPT_DIR/chapters/11-testing.md" \
    "$SCRIPT_DIR/chapters/12-deployment.md" \
    "$SCRIPT_DIR/chapters/13-14-conclusion-references.md" \
    > "$OUTPUT"

# Count approximate pages (assuming ~50 lines per printed page)
LINES=$(wc -l < "$OUTPUT")
WORDS=$(wc -w < "$OUTPUT")
PAGES=$((LINES / 45))

echo ""
echo "✓ Combined document created: $OUTPUT"
echo "  Lines:  $LINES"
echo "  Words:  $WORDS"
echo "  Approx pages (when printed): $PAGES"
echo ""
echo "To generate PDF:"
echo "  1. Open OFFICE_FLOW_PROJECT_BOOK.md in VS Code"
echo "  2. Install 'Markdown PDF' extension"
echo "  3. Right-click → Markdown PDF: Export (pdf)"
echo ""
echo "Or use pandoc:"
echo "  pandoc OFFICE_FLOW_PROJECT_BOOK.md -o OFFICE_FLOW_PROJECT_BOOK.pdf --pdf-engine=xelatex -V geometry:margin=1in -V fontsize=11pt"
