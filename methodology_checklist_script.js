document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements for this page ---
    const savePageBtn = document.getElementById('save-page-btn');
    const loadPageInput = document.getElementById('load-page-input');

    // Methodology Fields
    const measurementUnitInput = document.getElementById('measurement-unit');
    const procedureTextarea = document.getElementById('measurement-procedure');
    const specialCalcsTextarea = document.getElementById('measurement-special-calcs');
    const prodRateCalcTextarea = document.getElementById('measurement-prod-rate-calc');

    // Checklist Fields
    const checklistTableBody = document.getElementById('checklist-table-body');
    const addChecklistRowBtn = document.getElementById('add-checklist-row-btn');

    // --- Save Page Content ---
    function handleSavePage() {
        const pageData = {
            measurementUnit: measurementUnitInput.value,
            measurementProcedure: procedureTextarea.value,
            specialCalcs: specialCalcsTextarea.value,
            prodRateCalc: prodRateCalcTextarea.value,
            checklist: []
        };

        // Extract data from checklist table
        checklistTableBody.querySelectorAll('tr').forEach(row => {
            const rowData = [];
            row.querySelectorAll('td.editable-cell').forEach(cell => {
                rowData.push(cell.textContent || ''); // Get text content
            });
            // Only save row if it has content beyond the delete button (if added)
            if (rowData.some(text => text.trim() !== '')) {
                 pageData.checklist.push(rowData);
            }
        });

        // Trigger JSON download
        const jsonString = JSON.stringify(pageData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'methodology_checklist_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Page content configuration saved.');
    }

    // --- Load Page Content ---
    function handleLoadPage(event) {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.json')) {
            alert('Please select a valid JSON data file (.json)');
            event.target.value = null; return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);

                // Validate basic structure (optional)
                if (!loadedData.measurementUnit || !loadedData.checklist) {
                    throw new Error("Invalid data file structure.");
                }

                // Apply loaded data to fields
                measurementUnitInput.value = loadedData.measurementUnit || '';
                procedureTextarea.value = loadedData.measurementProcedure || '';
                specialCalcsTextarea.value = loadedData.specialCalcs || '';
                prodRateCalcTextarea.value = loadedData.prodRateCalc || '';

                // Rebuild checklist table body
                checklistTableBody.innerHTML = ''; // Clear existing rows
                if (Array.isArray(loadedData.checklist)) {
                    loadedData.checklist.forEach(rowData => {
                        addChecklistRow(rowData); // Use helper to add row
                    });
                }

                alert('Page content loaded successfully!');

            } catch (error) {
                console.error("Error loading page data:", error);
                alert(`Error loading data file: ${error.message}`);
            } finally {
                event.target.value = null; // Reset file input
            }
        };
        reader.onerror = () => { alert('Error reading file.'); event.target.value = null; };
        reader.readAsText(file);
    }

     // --- Checklist Row Management ---
     function addChecklistRow(rowData = ['', '', '', '', '']) { // Default empty row data
         const row = document.createElement('tr');
         rowData.forEach(cellData => {
             const cell = document.createElement('td');
             cell.contentEditable = true;
             cell.classList.add('editable-cell');
             cell.textContent = cellData;
             row.appendChild(cell);
         });

          // Add Delete Button Cell
          const deleteCell = document.createElement('td');
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'X';
          deleteBtn.classList.add('delete-checklist-row-btn');
          deleteBtn.title = 'Delete this row';
          deleteBtn.addEventListener('click', () => {
               if(confirm('Are you sure you want to delete this checklist row?')) {
                   row.remove();
               }
          });
          deleteCell.appendChild(deleteBtn);
          row.appendChild(deleteCell); // Add delete cell to the row

         checklistTableBody.appendChild(row);
     }

     addChecklistRowBtn.addEventListener('click', () => {
          addChecklistRow(); // Add a new empty row
     });

     // Add delete buttons to initially loaded rows
     checklistTableBody.querySelectorAll('tr').forEach(row => {
          // Check if delete button already exists to prevent duplicates on potential re-runs
         if (!row.querySelector('.delete-checklist-row-btn')) {
             const deleteCell = document.createElement('td');
             const deleteBtn = document.createElement('button');
             deleteBtn.textContent = 'X';
             deleteBtn.classList.add('delete-checklist-row-btn');
             deleteBtn.title = 'Delete this row';
             deleteBtn.addEventListener('click', () => {
                  if(confirm('Are you sure you want to delete this checklist row?')) {
                      row.remove();
                  }
             });
             deleteCell.appendChild(deleteBtn);
             row.appendChild(deleteCell);
         }
     });


    // --- Attach Event Listeners ---
    savePageBtn.addEventListener('click', handleSavePage);
    loadPageInput.addEventListener('change', handleLoadPage);

}); // End DOMContentLoaded
