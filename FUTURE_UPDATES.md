# Future PDF Features Implementation Plan

## Overview

This document outlines two major feature additions to the SOP Calculator application:

1. **PDF Upload and Parsing**: Ability to upload PDF documents containing SOP specifications and automatically extract structured data to populate the application.

2. **Configuration Export to PDF**: Capability to export the current configuration as a well-formatted, professional PDF document.

These features will complete the application's workflow cycle: import from PDF → configure data → export to database-ready CSVs → generate new formatted PDFs.

## 1. PDF Upload and Parsing Implementation

### What It Is
A feature that allows users to upload PDF documents containing SOP specifications, automatically extracts relevant data, and populates the application's fields with this information.

### Technical Requirements
- **PDF.js**: Mozilla's PDF rendering library for browser-based PDF parsing
- **Regular expressions**: For pattern matching within extracted text
- **Natural Language Processing (optional)**: For more advanced text extraction

### Implementation Steps

#### 1.1 Add PDF Upload Interface
```html
<!-- Add to index.html in the save-load-controls section -->
<div class="pdf-controls">
  <label for="upload-pdf-input" class="button-label">Import from PDF</label>
  <input type="file" id="upload-pdf-input" accept=".pdf" style="display: none;">
</div>
```

#### 1.2 PDF Parsing Implementation
```javascript
// Add to script.js
document.getElementById('upload-pdf-input').addEventListener('change', handlePdfUpload);

async function handlePdfUpload(event) {
  const file = event.target.files[0];
  if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please select a valid PDF file.');
    event.target.value = null;
    return;
  }
  
  try {
    // Show loading indicator
    showLoadingIndicator('Parsing PDF...');
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document using PDF.js
    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
    
    // Extract text from all pages
    let extractedText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      extractedText += pageText + '\n';
    }
    
    // Parse the extracted text
    const parsedData = parsePdfText(extractedText);
    
    // Populate the application with the parsed data
    populateApplicationWithData(parsedData);
    
    // Hide loading indicator
    hideLoadingIndicator();
    alert('PDF successfully imported and parsed!');
  } catch (error) {
    console.error('Error parsing PDF:', error);
    hideLoadingIndicator();
    alert(`Error parsing PDF: ${error.message}`);
  } finally {
    event.target.value = null; // Reset file input
  }
}

function parsePdfText(text) {
  // This function will contain the logic to extract structured data from the PDF text
  // It will use regular expressions and pattern matching to identify relevant information
  
  const parsedData = {
    sopName: extractSopName(text),
    sopDescription: extractSopDescription(text),
    globalFactors: extractGlobalFactors(text),
    tasks: extractTasks(text),
    // Add other data extraction as needed
  };
  
  return parsedData;
}

// Helper functions for extracting specific data types
function extractSopName(text) {
  // Example pattern: "SOP Name: [name]" or "SOP Title: [name]"
  const nameMatch = text.match(/SOP\s+(Name|Title):\s*([^\n]+)/i);
  return nameMatch ? nameMatch[2].trim() : '';
}

// Add similar functions for other data types
```

#### 1.3 Data Mapping and Validation
- Create mapping functions between PDF extracted data and application data model
- Implement validation to ensure extracted data meets application requirements
- Provide UI for reviewing and confirming extracted data before final import

## 2. Configuration Export to PDF Implementation

### What It Is
A feature that generates a professional, well-formatted PDF document from the current configuration, suitable for printing, sharing, or archiving.

### Technical Requirements
- **jsPDF**: Client-side PDF generation library
- **html2canvas (optional)**: For capturing complex HTML elements as images
- **Chart.js (optional)**: For including visualizations in the PDF

### Implementation Steps

#### 2.1 Add PDF Export Interface
```html
<!-- Add to index.html in the save-load-controls section -->
<button id="export-pdf-btn">Export to PDF</button>
```

#### 2.2 PDF Generation Implementation
```javascript
// Add to script.js
document.getElementById('export-pdf-btn').addEventListener('click', handleExportToPdf);

function handleExportToPdf() {
  try {
    // Show loading indicator
    showLoadingIndicator('Generating PDF...');
    
    // Get current configuration
    const currentConfig = buildConfigurationObject();
    
    // Create new PDF document
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('SOP Configuration Document', 105, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Add SOP details
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('SOP Details', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.text(`Name: ${currentConfig.sopName}`, 25, yPosition);
    yPosition += 7;
    
    // Handle multi-line description
    const descLines = doc.splitTextToSize(`Description: ${currentConfig.sopDescription}`, 170);
    doc.text(descLines, 25, yPosition);
    yPosition += (descLines.length * 7) + 10;
    
    // Add Global Factors section
    doc.setFontSize(16);
    doc.text('Global Factors', 20, yPosition);
    yPosition += 10;
    
    // Create factors table
    const factorTableData = currentConfig.globalFactors.map(factor => [
      factor.id,
      factor.name,
      factor.multiplierRange,
      factor.avgMultiplier.toFixed(2)
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['ID', 'Factor Name', 'Range', 'Avg. Multiplier']],
      body: factorTableData,
      margin: { left: 25 },
      theme: 'grid'
    });
    
    yPosition = doc.lastAutoTable.finalY + 15;
    
    // Add Tasks section (check if we need a new page)
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.text('Tasks', 20, yPosition);
    yPosition += 10;
    
    // Create tasks table
    const taskTableData = currentConfig.tasks.map(task => [
      task.id,
      task.name,
      task.isSelected ? 'Yes' : 'No',
      // Add other task properties as needed
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [['ID', 'Task Name', 'Selected']],
      body: taskTableData,
      margin: { left: 25 },
      theme: 'grid'
    });
    
    // Add more sections as needed (task methods, factor settings, etc.)
    
    // Add footer with date
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 290, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, 195, 290, { align: 'right' });
    }
    
    // Save the PDF
    const filename = `${currentConfig.sopName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_config.pdf`;
    doc.save(filename);
    
    // Hide loading indicator
    hideLoadingIndicator();
    alert(`PDF successfully exported as "${filename}"`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    hideLoadingIndicator();
    alert(`Error generating PDF: ${error.message}`);
  }
}
```

#### 2.3 Advanced PDF Formatting
- Add company logo and branding
- Include charts or visualizations of production rates
- Create a table of contents for longer documents
- Add hyperlinks between sections for navigation

## 3. Implementation Considerations

### PDF Parsing Challenges
- PDF documents vary in structure and formatting
- Text extraction may not preserve layout information
- Consider implementing a training mode where users can help map PDF sections to application fields

### PDF Generation Best Practices
- Keep file size manageable by optimizing images
- Ensure accessibility by including document structure
- Test with different PDF viewers to ensure compatibility
- Consider adding password protection for sensitive documents

### Integration with Existing Features
- Ensure PDF parsing results can be edited before finalizing
- Make sure PDF export includes all relevant data from both pages
- Consider adding a "Preview PDF" feature before final export

### Enhanced Data Model for PDF Integration

To ensure all PDF content is properly captured in the application, the following enhancements are recommended:

#### Extend the Data Model
- Add a "sopGroups" array to store SOP IDs, task sequences, and overall skill levels
- Add complexity level classification to tasks or as a separate global setting
- Extend the methods array to include advantages, disadvantages, and best use scenarios
- Create new sections for surface handling instructions and assumptions/limitations

#### Update the UI
- Add a new tab or section for SOP grouping and sequencing
- Add UI elements to display and edit complexity levels
- Expand the methods section to show and edit the additional method details
- Add collapsible sections for surface handling and assumptions

#### Prepare for PDF Parsing
- Define clear patterns for extracting each data type from PDF text
- Create mapping functions between PDF sections and app data structures
- Implement validation to ensure extracted data meets app requirements

#### CSV Export Enhancements
- Add additional CSV exports for the new data types (SOP groups, method details, etc.)
- Ensure all PDF data can be round-tripped through the app and back to structured formats

## 4. Required Libraries

```html
<!-- Add to head section of HTML files -->
<!-- For PDF parsing -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>

<!-- For PDF generation -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
```

## 5. Timeline and Priority

1. **Phase 1**: Implement basic PDF export functionality
2. **Phase 2**: Implement PDF upload and basic text extraction
3. **Phase 3**: Enhance PDF parsing with pattern recognition
4. **Phase 4**: Improve PDF export with advanced formatting and branding
5. **Phase 5**: Add integration between both pages for comprehensive PDF export

## 6. Repository Management and Progress Tracking

### Repository Management for Each Phase

Before starting any implementation phase:

1. **Update Repository**
   ```bash
   git pull origin main
   ```

2. **Create Feature Branch**
   ```bash
   # For Phase 1: PDF Export
   git checkout -b feature/pdf-export
   
   # For Phase 2: PDF Upload
   git checkout -b feature/pdf-upload
   
   # For Phase 3: Enhanced PDF Parsing
   git checkout -b feature/enhanced-pdf-parsing
   
   # For Phase 4: Advanced PDF Formatting
   git checkout -b feature/advanced-pdf-formatting
   
   # For Phase 5: PDF Integration
   git checkout -b feature/pdf-integration
   ```

3. **After Implementation**
   ```bash
   # Add changes
   git add .
   
   # Commit with descriptive message
   git commit -m "Implement [Phase Name]: [Brief description of changes]"
   
   # Push to remote repository
   git push origin feature/[branch-name]
   
   # Create pull request through GitHub interface
   # After code review and approval, merge to main branch
   ```

### Updating CURRENT_PROGRESS.md

After completing each phase, update the CURRENT_PROGRESS.md file with the following steps:

1. **Add to Recent Updates Section**
   - Add bullet points describing the new features implemented
   - Be specific about what was added and how it enhances the application
   - Example for Phase 1:
     ```markdown
     ## Recent Updates
     - Implemented PDF export functionality with jsPDF
     - Added "Export to PDF" button in the configuration section
     - Created professional PDF layout with SOP details, factors, and tasks
     - Added page numbering and generation date to exported PDFs
     ```

2. **Update Current Features Section**
   - Add the new feature to the appropriate section or create a new section
   - Example for Phase 1:
     ```markdown
     ### 9. PDF Export Functionality
     - Export configuration as professionally formatted PDF
     - Includes SOP details, global factors, and tasks
     - Professional formatting with tables and sections
     - Page numbering and generation date
     ```

3. **Update Planned Improvements**
   - Remove implemented features from planned improvements
   - Add any new planned improvements identified during implementation
   - Example after Phase 1:
     ```markdown
     ## Planned Improvements
     - Implement PDF upload and parsing functionality
     - Enhance PDF export with company branding and visualizations
     - Integrate methodology checklist data with main SOP calculations
     - Add reporting features that combine task data with methodology information
     ```

4. **Update Technical Implementation**
   - Add any new libraries or technologies used
   - Example after Phase 1:
     ```markdown
     ## Technical Implementation
     - Pure HTML, CSS, and JavaScript implementation
     - jsPDF library for PDF generation
     - jsPDF-AutoTable plugin for table formatting in PDFs
     - Responsive design for various screen sizes
     - Local storage for configurations
     ```

5. **Commit CURRENT_PROGRESS.md Update**
   ```bash
   git add CURRENT_PROGRESS.md
   git commit -m "Update progress documentation for [Phase Name]"
   git push origin feature/[branch-name]
   ```

By following these steps for each phase, you'll maintain a clean repository with well-documented changes and keep the CURRENT_PROGRESS.md file up-to-date with the latest developments.
