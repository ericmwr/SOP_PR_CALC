document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL DATA STORE ---
    let config = {
        sopName: "New Construction Interior - Wainscot - Bead-Board Painting",
        sopDescription: "This specification covers the painting...",
        globalFactors: [
             { id: 'F001', name: 'Surface Condition', multiplierRange: '0.8-1.2' },
             { id: 'F002', name: 'Access Difficulty', multiplierRange: '0.7-1.0' },
             { id: 'F003', name: 'Detail Complexity', multiplierRange: '0.75-1.1' },
             { id: 'F004', name: 'Environmental Conditions', multiplierRange: '0.9-1.1' },
             { id: 'F005', name: 'Quality Standard', multiplierRange: '0.85-1.3' }
        ],
        tasks: [
            // *** UPDATED TASK STRUCTURE with 'methods' array ***
            { id: 'T001', name: 'Surface Inspection', isSelected: true,
              methods: [{ name: 'Visual/Tactile', rate: 550, isSelected: true }], // Rate moved here
              skillLevel: 'Medium', materialsRequired: 'Bright flashlight, Moisture meter', factorsAffecting: 'Surface condition, Lighting conditions', description: 'Thoroughly examine...' },
            { id: 'T002', name: 'Surface Cleaning', isSelected: true,
              methods: [{ name: 'Vacuum/Wipe', rate: 275, isSelected: true }],
              skillLevel: 'Low', materialsRequired: 'Tack cloth, Vacuum w/ brush, TSP substitute', factorsAffecting: 'Dust level, Site cleanliness', description: 'Remove all dust...' },
            { id: 'T003', name: 'Nail Hole Filling/Spackling', isSelected: true,
              methods: [{ name: 'Knife/Finger', rate: 200, isSelected: true }],
              skillLevel: 'Medium', materialsRequired: 'Lightweight spackling, Putty knife', factorsAffecting: 'Number of holes, Depth', description: 'Fill all nail holes...' },
            { id: 'T004', name: 'Caulking Seams & Transitions', isSelected: true,
              methods: [{ name: 'Gun/Tool', rate: 175, isSelected: true }],
              skillLevel: 'Medium', materialsRequired: 'Paintable acrylic caulk, Caulk gun', factorsAffecting: 'Number of seams, Gap width', description: 'Apply paintable acrylic caulk...' },
            { id: 'T005', name: 'Sanding Preparation', isSelected: true,
              methods: [{ name: 'Hand/Sponge', rate: 225, isSelected: true }],
              skillLevel: 'Medium', materialsRequired: '220-grit sandpaper, Sanding sponge', factorsAffecting: 'Primer condition, Detail complexity', description: 'Lightly sand entire surface...' },
            { id: 'T006', name: 'Spot Priming (as needed)', isSelected: true,
              methods: [{ name: 'Brush/Mini-Roll', rate: 250, isSelected: true }],
              skillLevel: 'Medium', materialsRequired: 'Acrylic primer, Brush, Mini-roller', factorsAffecting: 'Area requiring priming, Primer quality', description: 'Apply primer to spackled areas...' },
            // Example with multiple methods defined initially
            { id: 'T007', name: 'First Coat Application', isSelected: true,
              methods: [
                  { name: 'Brush/Roll', rate: 200, isSelected: true }, // Default selected
                  { name: 'Spray+Backbrush', rate: 250, isSelected: false }
              ],
              skillLevel: 'Medium-High', materialsRequired: 'Premium latex paint, Brushes, Rollers', factorsAffecting: 'Groove complexity, Paint viscosity', description: 'Apply first coat...' },
            { id: 'T008', name: 'Light Sanding Between Coats', isSelected: true,
              methods: [{ name: 'Hand/Sponge', rate: 325, isSelected: true }],
              skillLevel: 'Medium', materialsRequired: '320-grit sandpaper, Sanding sponge', factorsAffecting: 'First coat smoothness, Env. conditions', description: 'Once first coat is dry...' },
            { id: 'T009', name: 'Final Coat Application', isSelected: true,
              methods: [
                  { name: 'Brush/Roll', rate: 225, isSelected: true },
                  { name: 'Spray+Backbrush', rate: 275, isSelected: false }
              ],
              skillLevel: 'Medium-High', materialsRequired: 'Premium latex paint, Brushes, Rollers', factorsAffecting: 'Groove complexity, Coverage needs', description: 'Apply final coat...' },
            { id: 'T010', name: 'Post-Finish Inspection', isSelected: true,
              methods: [{ name: 'Visual', rate: 475, isSelected: true }],
              skillLevel: 'High', materialsRequired: 'Bright movable lighting', factorsAffecting: 'Lighting conditions, Quality standards', description: 'After final coat dried...' },
            { id: 'T011', name: 'Final Touch-Up', isSelected: true,
              methods: [{ name: 'Artist Brush/Feather', rate: 350, isSelected: true }],
              skillLevel: 'High', materialsRequired: 'Touch-up kit, Artist brushes', factorsAffecting: 'Number of defects, Visibility', description: 'Address identified defects...' },
            // Optional Tasks
             { id: 'OPT01', name: 'Heavy Duty Cleaning', isSelected: false, methods: [{ name: 'Scrub/Rinse', rate: 175, isSelected: true }], skillLevel: 'Low', materialsRequired: 'Degreaser, Brushes, Water', factorsAffecting: 'Level of contamination', description: 'Extensive cleaning...' },
             { id: 'OPT02', name: 'Full Surface Priming', isSelected: false, methods: [{ name: 'Brush/Roll', rate: 175, isSelected: true }], skillLevel: 'Medium', materialsRequired: 'Primer, Brushes, Rollers', factorsAffecting: 'Surface porosity, Stains', description: 'Apply primer to entire surface.' },
             { id: 'OPT03', name: 'Extensive Masking', isSelected: false, methods: [{ name: 'Manual Tape/Sheet', rate: 125, isSelected: true }], skillLevel: 'Medium', materialsRequired: 'Tape, Plastic/Paper sheeting', factorsAffecting: 'Complexity of areas', description: 'Detailed masking...' },
        ],
        taskFactorSettings: {}
    };

    // --- DOM Elements ---
    const saveConfigJsonBtn = document.getElementById('save-config-json-btn');
    const saveConfigCsvBtn = document.getElementById('save-config-csv-btn');
    const loadConfigInput = document.getElementById('load-config-input');
    const sopNameInput = document.getElementById('sop-name');
    const sopDescriptionTextarea = document.getElementById('sop-description');
    const globalFactorListDiv = document.getElementById('global-factor-list');
    const showAddFactorFormBtn = document.getElementById('show-add-factor-form-btn');
    const addFactorFormDiv = document.getElementById('add-factor-form');
    const newFactorNameInput = document.getElementById('new-factor-name');
    const newFactorRangeInput = document.getElementById('new-factor-range');
    const addFactorBtn = document.getElementById('add-factor-btn');
    const cancelAddFactorBtn = document.getElementById('cancel-add-factor-btn');
    const taskListDiv = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const projectAreaInput = document.getElementById('project-area');
    const laborRateInput = document.getElementById('labor-rate');
    const finalRateSpan = document.getElementById('final-rate');
    const totalTimeSpan = document.getElementById('total-time');
    const totalCostSpan = document.getElementById('total-cost');

    // --- Utility Functions ---
    function calculateAverageMultiplier(rangeString) {
        try {
            const parts = rangeString.split('-').map(Number);
            if (parts.length === 2 && !parts.some(isNaN)) {
                return (parts[0] + parts[1]) / 2;
            } else if (parts.length === 1 && !isNaN(parts[0])) {
                return parts[0];
            }
        } catch (e) { /* Ignore */ }
        return 1; // Default
    }

    function generateUniqueId(prefix = 'ID') {
         return prefix + Date.now() + Math.random().toString(16).substring(2, 8);
    }

    // Function to ensure avgMultiplier is present on factors
    function processFactors(factorArray) {
        return factorArray.map(f => ({
            ...f,
            avgMultiplier: calculateAverageMultiplier(f.multiplierRange)
        }));
    }

    // Ensure initial factors have avgMultiplier
    config.globalFactors = processFactors(config.globalFactors);

    // Function to initialize task factor settings if missing
    function initializeTaskFactorSettings() {
        config.tasks.forEach(task => {
            if (!config.taskFactorSettings[task.id]) {
                config.taskFactorSettings[task.id] = {};
            }
            config.globalFactors.forEach(factor => {
                if (!config.taskFactorSettings[task.id][factor.id]) {
                    config.taskFactorSettings[task.id][factor.id] = {
                        applied: false, // Default to not applied unless loading a config
                        currentValue: factor.avgMultiplier
                    };
                }
                 // Ensure existing settings have currentValue if it was missing
                 if(config.taskFactorSettings[task.id][factor.id].currentValue === undefined) {
                    config.taskFactorSettings[task.id][factor.id].currentValue = factor.avgMultiplier;
                 }
            });
        });
         // Clean up settings for factors/tasks that no longer exist (optional but good practice)
         Object.keys(config.taskFactorSettings).forEach(taskId => {
             if (!config.tasks.some(t => t.id === taskId)) {
                 delete config.taskFactorSettings[taskId];
                 return;
             }
             Object.keys(config.taskFactorSettings[taskId]).forEach(factorId => {
                  if (!config.globalFactors.some(f => f.id === factorId)) {
                      delete config.taskFactorSettings[taskId][factorId];
                  }
             });
         });
    }

    // --- Global Factor Management UI & Logic ---
    function renderGlobalFactorList() {
        globalFactorListDiv.innerHTML = '';
        config.globalFactors.forEach(factor => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('global-factor-item');
            itemDiv.dataset.factorId = factor.id;

            const nameInput = document.createElement('input');
            nameInput.type = 'text'; nameInput.value = factor.name; nameInput.placeholder = 'Factor Name';
            nameInput.addEventListener('change', (e) => handleGlobalFactorUpdate(factor.id, 'name', e.target.value));

            const rangeInput = document.createElement('input');
            rangeInput.type = 'text'; rangeInput.value = factor.multiplierRange; rangeInput.placeholder = 'Range (e.g., 0.8-1.2)';
            rangeInput.addEventListener('change', (e) => handleGlobalFactorUpdate(factor.id, 'range', e.target.value));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete'; deleteBtn.classList.add('delete-factor-btn');
            deleteBtn.addEventListener('click', () => handleDeleteFactor(factor.id));

            itemDiv.appendChild(nameInput); itemDiv.appendChild(rangeInput); itemDiv.appendChild(deleteBtn);
            globalFactorListDiv.appendChild(itemDiv);
        });
    }

    function handleGlobalFactorUpdate(factorId, field, value) {
        const factorIndex = config.globalFactors.findIndex(f => f.id === factorId);
        if (factorIndex === -1) return;

        if (field === 'name') {
            config.globalFactors[factorIndex].name = value;
            // Update labels in any open task panels
            document.querySelectorAll(`.factor-edit-panel label[data-factor-id="${factorId}"]`).forEach(label => label.textContent = value);
        } else if (field === 'range') {
            config.globalFactors[factorIndex].multiplierRange = value;
            const newAvg = calculateAverageMultiplier(value);
            config.globalFactors[factorIndex].avgMultiplier = newAvg; // Update the calculated average
             // Update range display in open panels
             document.querySelectorAll(`.factor-edit-panel [data-factor-id="${factorId}"].global-range-display`).forEach(span => span.textContent = `(${value})`);
             // Optionally: Update the *default* currentValue for tasks where this factor isn't actively set? (Tricky decision)
             // For simplicity, we won't reset sliders automatically here.
        }
        // Re-initialize settings in case avgMultiplier changed for default slider values
        initializeTaskFactorSettings();
        calculateTotals();
    }

    function handleDeleteFactor(factorId) {
        const factorName = config.globalFactors.find(f=>f.id === factorId)?.name || factorId;
        if (!confirm(`Are you sure you want to delete the factor "${factorName}"? This will remove its settings from all tasks.`)) return;

        config.globalFactors = config.globalFactors.filter(f => f.id !== factorId);
        Object.keys(config.taskFactorSettings).forEach(taskId => delete config.taskFactorSettings[taskId][factorId]);

        renderGlobalFactorList(); // Update global list UI
        document.querySelectorAll(`.factor-edit-item[data-factor-id="${factorId}"]`).forEach(el => el.remove()); // Remove from open panels
        calculateTotals();
    }

    // --- Add New Factor Logic ---
    showAddFactorFormBtn.addEventListener('click', () => { addFactorFormDiv.style.display = 'block'; showAddFactorFormBtn.style.display = 'none'; });
    cancelAddFactorBtn.addEventListener('click', () => { addFactorFormDiv.style.display = 'none'; showAddFactorFormBtn.style.display = 'inline-block'; newFactorNameInput.value = ''; newFactorRangeInput.value = ''; });
    addFactorBtn.addEventListener('click', () => {
        const name = newFactorNameInput.value.trim();
        const range = newFactorRangeInput.value.trim();
        if (!name || !range) { alert('Please enter both name and range.'); return; }
        const newFactor = { id: generateUniqueId('F'), name: name, multiplierRange: range, avgMultiplier: calculateAverageMultiplier(range) };
        config.globalFactors.push(newFactor);
        initializeTaskFactorSettings(); // Add settings placeholder for this new factor for all tasks
        renderGlobalFactorList();
        // Add to open edit panels
         document.querySelectorAll('.factor-edit-panel').forEach(panel => {
             if(panel.style.display === 'block') {
                  const taskId = panel.id.split('-')[3]; // factor-edit-panel-TASKID
                  renderTaskFactorEditor(taskId, panel); // Re-render panel
             }
        });
        cancelAddFactorBtn.click();
        calculateTotals();
    });

    // --- Task List & Factor Editor UI & Logic (HEAVILY UPDATED) ---
    function renderTaskList() {
        taskListDiv.innerHTML = '';
        config.tasks.forEach(task => {
            // --- Create Task Item Div ---
            const taskItemDiv = document.createElement('div');
            taskItemDiv.classList.add('task-item'); taskItemDiv.id = `task-item-${task.id}`; taskItemDiv.dataset.taskId = task.id;

            // --- Main Controls Row (Checkbox, Name, Buttons) ---
            const controlsDiv = document.createElement('div'); controlsDiv.classList.add('task-main-controls');
             const checkbox = document.createElement('input'); /* ... (same as before) ... */
             checkbox.type = 'checkbox'; checkbox.id = `task-${task.id}`; checkbox.value = task.id;
             checkbox.checked = task.isSelected; checkbox.dataset.taskId = task.id;
             checkbox.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).isSelected = e.target.checked; calculateTotals(); });

             const nameInput = document.createElement('input'); /* ... (same as before) ... */
             nameInput.type = 'text'; nameInput.classList.add('task-name-input');
             nameInput.value = task.name; nameInput.dataset.taskId = task.id;
             nameInput.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).name = e.target.value; });

             const editFactorsBtn = document.createElement('button'); /* ... (same as before) ... */
             editFactorsBtn.textContent = 'Edit Factors'; editFactorsBtn.classList.add('edit-factors-btn');
             editFactorsBtn.dataset.taskId = task.id; editFactorsBtn.addEventListener('click', toggleFactorEditPanel);

             const deleteBtn = document.createElement('button'); /* ... (same as before) ... */
             deleteBtn.textContent = 'Delete Task'; deleteBtn.classList.add('delete-task-btn');
             deleteBtn.dataset.taskId = task.id; deleteBtn.addEventListener('click', handleDeleteTask);

             controlsDiv.appendChild(checkbox); controlsDiv.appendChild(nameInput);
             controlsDiv.appendChild(editFactorsBtn); controlsDiv.appendChild(deleteBtn);
             taskItemDiv.appendChild(controlsDiv);

            // --- Details Grid (Rate Removed) ---
            const detailsGridDiv = document.createElement('div'); detailsGridDiv.classList.add('task-details-grid');
            const createGridRow = (label, element) => { /* ... (same helper function as before) ... */
                const div = document.createElement('div');
                const lbl = document.createElement('label'); lbl.textContent = label;
                div.appendChild(lbl); div.appendChild(element); detailsGridDiv.appendChild(div);
            };
            // Skill Level, Materials, Methods, Affecting, Description inputs (NO RATE INPUT HERE)
            const skillInput = document.createElement('input'); /* ... (same as before) ... */
             skillInput.type = 'text'; skillInput.classList.add('task-skill-input');
             skillInput.value = task.skillLevel || ''; skillInput.dataset.taskId = task.id;
             skillInput.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).skillLevel = e.target.value; });
             createGridRow('Skill Level:', skillInput);

             const materialsTextarea = document.createElement('textarea'); /* ... (same as before) ... */
             materialsTextarea.classList.add('task-materials-input'); materialsTextarea.rows = 2;
             materialsTextarea.value = task.materialsRequired || ''; materialsTextarea.dataset.taskId = task.id;
             materialsTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).materialsRequired = e.target.value; });
             createGridRow('Materials Required:', materialsTextarea);

             // Note: 'Application Methods' grid row is removed as it's handled separately now.

             const affectingTextarea = document.createElement('textarea'); /* ... (same as before) ... */
             affectingTextarea.classList.add('task-affecting-input'); affectingTextarea.rows = 2;
             affectingTextarea.value = task.factorsAffecting || ''; affectingTextarea.dataset.taskId = task.id;
             affectingTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).factorsAffecting = e.target.value; });
             createGridRow('Factors Affecting:', affectingTextarea);

             const descriptionTextarea = document.createElement('textarea'); /* ... (same as before) ... */
             descriptionTextarea.classList.add('task-description-input'); descriptionTextarea.rows = 3;
             descriptionTextarea.value = task.description || ''; descriptionTextarea.dataset.taskId = task.id;
             descriptionTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).description = e.target.value; });
             createGridRow('Description:', descriptionTextarea);

            taskItemDiv.appendChild(detailsGridDiv);

            // --- Application Methods Section ---
            const methodsSectionDiv = document.createElement('div');
            methodsSectionDiv.classList.add('task-methods-section');

            const methodsHeader = document.createElement('h4');
            methodsHeader.textContent = 'Application Methods & Rates';
            methodsSectionDiv.appendChild(methodsHeader);

            const methodsListDiv = document.createElement('div');
            methodsListDiv.classList.add('task-methods-list');
            methodsListDiv.id = `methods-list-${task.id}`;
            renderTaskMethods(task.id, methodsListDiv); // Populate methods
            methodsSectionDiv.appendChild(methodsListDiv);

            const addMethodBtn = document.createElement('button');
            addMethodBtn.textContent = '+ Add Method';
            addMethodBtn.classList.add('add-method-btn');
            addMethodBtn.dataset.taskId = task.id;
            addMethodBtn.addEventListener('click', handleAddMethod);
            methodsSectionDiv.appendChild(addMethodBtn);

            taskItemDiv.appendChild(methodsSectionDiv);

            // --- Factor Editor Panel Placeholder ---
            const factorEditPanel = document.createElement('div'); /* ... (same as before) ... */
             factorEditPanel.classList.add('factor-edit-panel'); factorEditPanel.id = `factor-edit-panel-${task.id}`;
             factorEditPanel.style.display = 'none';
             taskItemDiv.appendChild(factorEditPanel);

            // Append Task Item
            taskListDiv.appendChild(taskItemDiv);
        });
    }

    // NEW: Render the list of methods for a specific task
    function renderTaskMethods(taskId, containerElement) {
        containerElement.innerHTML = ''; // Clear existing methods
        const task = config.tasks.find(t => t.id === taskId);
        if (!task || !task.methods) return;

        // Ensure at least one method is selected if possible
        if (!task.methods.some(m => m.isSelected) && task.methods.length > 0) {
            task.methods[0].isSelected = true; // Default select the first one
        }

        task.methods.forEach((method, index) => {
            const methodItemDiv = document.createElement('div');
            methodItemDiv.classList.add('method-item');
            methodItemDiv.dataset.taskId = taskId;
            methodItemDiv.dataset.methodIndex = index; // Store index

            // Radio Button for selection
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `method-select-${taskId}`; // Group radios per task
            radio.id = `method-${taskId}-${index}`;
            radio.value = index; // Use index as value
            radio.checked = method.isSelected;
            radio.dataset.taskId = taskId;
            radio.dataset.methodIndex = index;
            radio.addEventListener('change', handleMethodSelectionChange);

            // Method Name Input
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.classList.add('method-name-input');
            nameInput.value = method.name;
            nameInput.dataset.taskId = taskId;
            nameInput.dataset.methodIndex = index;
            nameInput.addEventListener('change', handleMethodNameChange);

            // Method Rate Input
            const rateInput = document.createElement('input');
            rateInput.type = 'number';
            rateInput.classList.add('method-rate-input');
            rateInput.value = method.rate;
            rateInput.min = "1"; rateInput.step = "1";
            rateInput.dataset.taskId = taskId;
            rateInput.dataset.methodIndex = index;
            rateInput.addEventListener('input', handleMethodRateChange);

            const rateUnitSpan = document.createElement('span');
            rateUnitSpan.textContent = 'SF/HR';

            // Delete Method Button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.classList.add('delete-method-btn');
            deleteBtn.dataset.taskId = taskId;
            deleteBtn.dataset.methodIndex = index;
            deleteBtn.addEventListener('click', handleDeleteMethod);
            // Disable delete if it's the last method
            deleteBtn.disabled = task.methods.length <= 1;

            methodItemDiv.appendChild(radio);
            methodItemDiv.appendChild(nameInput);
            methodItemDiv.appendChild(rateInput);
            methodItemDiv.appendChild(rateUnitSpan);
            methodItemDiv.appendChild(deleteBtn);
            containerElement.appendChild(methodItemDiv);
        });
    }

    // --- Event Handlers for Methods ---
    function handleMethodSelectionChange(event) {
        const radio = event.target;
        const taskId = radio.dataset.taskId;
        const selectedIndex = parseInt(radio.dataset.methodIndex, 10);
        const task = config.tasks.find(t => t.id === taskId);
        if (!task || !task.methods) return;

        task.methods.forEach((method, index) => {
            method.isSelected = (index === selectedIndex);
        });
        calculateTotals(); // Recalculate as the rate source changed
    }

    function handleMethodNameChange(event) {
        const input = event.target;
        const taskId = input.dataset.taskId;
        const index = parseInt(input.dataset.methodIndex, 10);
        const task = config.tasks.find(t => t.id === taskId);
        if (task && task.methods && task.methods[index]) {
            task.methods[index].name = input.value;
            // No recalculation needed for name change
        }
    }

    function handleMethodRateChange(event) {
        const input = event.target;
        const taskId = input.dataset.taskId;
        const index = parseInt(input.dataset.methodIndex, 10);
        const task = config.tasks.find(t => t.id === taskId);
        if (task && task.methods && task.methods[index]) {
            task.methods[index].rate = parseFloat(input.value) || 1; // Update rate in config
            calculateTotals(); // Rate changed, recalculate
        }
    }

     function handleAddMethod(event) {
          const taskId = event.target.dataset.taskId;
          const task = config.tasks.find(t => t.id === taskId);
          if (!task) return;

          if (!task.methods) task.methods = []; // Ensure array exists

          const newMethod = {
              name: 'New Method',
              rate: 50, // Default rate
              isSelected: task.methods.length === 0 // Select if it's the first one being added
          };
          task.methods.push(newMethod);

          // Re-render only the methods list for this task
          const methodsListDiv = document.getElementById(`methods-list-${taskId}`);
          if (methodsListDiv) {
              renderTaskMethods(taskId, methodsListDiv);
          }
          calculateTotals(); // Recalculate as available methods changed
     }

    function handleDeleteMethod(event) {
        const button = event.target;
        const taskId = button.dataset.taskId;
        const indexToRemove = parseInt(button.dataset.methodIndex, 10);
        const task = config.tasks.find(t => t.id === taskId);

        if (!task || !task.methods || task.methods.length <= 1) {
             alert("Cannot delete the last application method for a task.");
             return; // Don't allow deleting the last method
        }

        const wasSelected = task.methods[indexToRemove].isSelected;

        // Remove the method
        task.methods.splice(indexToRemove, 1);

        // If the deleted method was selected, select the first one now
        if (wasSelected && task.methods.length > 0) {
            task.methods[0].isSelected = true;
        }

        // Re-render the methods list for this task
        const methodsListDiv = document.getElementById(`methods-list-${taskId}`);
        if (methodsListDiv) {
            renderTaskMethods(taskId, methodsListDiv);
        }
        calculateTotals(); // Recalculate
    }

    function handleDeleteTask(event) {
         const taskId = event.target.dataset.taskId;
         const taskName = config.tasks.find(t=>t.id === taskId)?.name || taskId;
         if (!confirm(`Are you sure you want to delete the task "${taskName}"?`)) return;

         // Remove from config
         config.tasks = config.tasks.filter(t => t.id !== taskId);
         delete config.taskFactorSettings[taskId];

         // Remove from UI
         const taskItem = document.getElementById(`task-item-${taskId}`);
         if(taskItem) taskItem.remove();

         calculateTotals();
    }

    // --- Add New Task Logic (UPDATED for methods) ---
     addTaskBtn.addEventListener('click', () => {
          const newTask = {
              id: generateUniqueId('T'),
              name: 'New Task - Edit Name',
              isSelected: true,
              methods: [{ name: 'Default Method', rate: 100, isSelected: true }], // Initialize with one method
              skillLevel: 'Medium', materialsRequired: '',
              factorsAffecting: '', description: ''
          };
          config.tasks.push(newTask);
          initializeTaskFactorSettings();
          renderTaskList();
          document.getElementById(`task-item-${newTask.id}`)?.scrollIntoView({behavior: "smooth"});
          calculateTotals();
     });

    function toggleFactorEditPanel(event) {
        const taskId = event.target.dataset.taskId;
        const panel = document.getElementById(`factor-edit-panel-${taskId}`);
        // console.log(`[toggleFactorEditPanel] Task ${taskId}: panel found =`, panel); // DEBUG LOG REMOVED
        if (!panel) return;
        const isVisible = panel.style.display === 'block';
        if (isVisible) {
            panel.style.display = 'none'; event.target.textContent = 'Edit Factors';
        } else {
            // console.log(`[toggleFactorEditPanel] Task ${taskId}: Calling renderTaskFactorEditor...`); // DEBUG LOG REMOVED
            renderTaskFactorEditor(taskId, panel); // Populate before showing
            panel.style.display = 'block'; event.target.textContent = 'Hide Factors';
        }
    }


    function renderTaskFactorEditor(taskId, panelElement) {
        // console.log(`[renderTaskFactorEditor] Task ${taskId}: Starting render.`); // DEBUG LOG REMOVED
        panelElement.innerHTML = ''; // Clear previous content
        // Ensure entry exists in global settings
        if (!config.taskFactorSettings[taskId]) {
            // console.log(`[renderTaskFactorEditor] Task ${taskId}: config.taskFactorSettings[taskId] is undefined, initializing.`); // DEBUG LOG REMOVED
            config.taskFactorSettings[taskId] = {};
        } else {
            // console.log(`[renderTaskFactorEditor] Task ${taskId}: config.taskFactorSettings[taskId] exists.`); // DEBUG LOG REMOVED
        }

        // console.log(`[renderTaskFactorEditor] Task ${taskId}: config.globalFactors.length = ${config.globalFactors.length}`); // DEBUG LOG REMOVED
        config.globalFactors.forEach(factor => {
            // console.log(`[renderTaskFactorEditor] Task ${taskId}, Factor ${factor.id} (${factor.name}): Processing factor.`); // DEBUG LOG REMOVED
            // Initialize task-specific settings for this factor if they don't exist IN THE GLOBAL STORE
            if (!config.taskFactorSettings[taskId][factor.id]) {
                // console.log(`[renderTaskFactorEditor] Task ${taskId}, Factor ${factor.id}: config.taskFactorSettings[taskId][factor.id] is undefined, initializing.`); // DEBUG LOG REMOVED
                config.taskFactorSettings[taskId][factor.id] = {
                    applied: false, currentValue: factor.avgMultiplier
                };
            }
            const factorSetting = config.taskFactorSettings[taskId][factor.id];
            if (!factorSetting) {
                console.error(`[renderTaskFactorEditor] Task ${taskId}, Factor ${factor.id}: factorSetting is unexpectedly undefined! Skipping.`); // Keep this error log
                return; // Skip this factor
            } else {
                 // console.log(`[renderTaskFactorEditor] Task ${taskId}, Factor ${factor.id}: factorSetting found:`, JSON.stringify(factorSetting)); // DEBUG LOG REMOVED
            }

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('factor-edit-item');
            itemDiv.dataset.factorId = factor.id; itemDiv.dataset.taskId = taskId;

            const applyCheckbox = document.createElement('input');
            applyCheckbox.type = 'checkbox'; applyCheckbox.id = `apply-${taskId}-${factor.id}`;
            applyCheckbox.checked = factorSetting.applied; // Read from settings
            applyCheckbox.dataset.taskId = taskId; applyCheckbox.dataset.factorId = factor.id;
            applyCheckbox.addEventListener('change', handleApplyFactorChange);

            const nameLabel = document.createElement('label');
            nameLabel.classList.add('factor-name-label'); nameLabel.htmlFor = applyCheckbox.id;
            nameLabel.textContent = factor.name; nameLabel.dataset.factorId = factor.id;

            const rangeDisplay = document.createElement('span');
            rangeDisplay.classList.add('global-range-display');
            rangeDisplay.textContent = `(${factor.multiplierRange})`; rangeDisplay.dataset.factorId = factor.id;

            const slider = document.createElement('input');
            slider.type = 'range'; slider.id = `slider-${taskId}-${factor.id}`;
            slider.min = "0.5"; slider.max = "1.5"; slider.step = "0.01";
            slider.value = factorSetting.currentValue; // Read from settings
            slider.dataset.taskId = taskId; slider.dataset.factorId = factor.id;
            slider.disabled = !factorSetting.applied;
            slider.addEventListener('input', handleFactorSliderChange);

            const valueSpan = document.createElement('span');
            valueSpan.classList.add('factor-value'); valueSpan.id = `value-${taskId}-${factor.id}`;
            valueSpan.textContent = parseFloat(slider.value).toFixed(2);

            itemDiv.appendChild(applyCheckbox); itemDiv.appendChild(nameLabel); itemDiv.appendChild(rangeDisplay);
            itemDiv.appendChild(slider); itemDiv.appendChild(valueSpan);
            panelElement.appendChild(itemDiv);
            // console.log(`[renderTaskFactorEditor] Task ${taskId}, Factor ${factor.id}: Appended factor item to panel.`); // DEBUG LOG REMOVED
        });
         const closeBtn = document.createElement('button');
         closeBtn.textContent = 'Done Editing Factors';
         closeBtn.classList.add('close-edit-panel-btn');
         closeBtn.onclick = (e) => {
             panelElement.style.display = 'none';
              const editBtn = document.querySelector(`.edit-factors-btn[data-task-id="${taskId}"]`);
              if(editBtn) editBtn.textContent = 'Edit Factors';
         };
         panelElement.appendChild(closeBtn);
         // console.log(`[renderTaskFactorEditor] Task ${taskId}: Finished render, panel content:`, panelElement.innerHTML.substring(0, 200) + '...'); // DEBUG LOG REMOVED
    }

    function handleApplyFactorChange(event) {
        const checkbox = event.target;
        const taskId = checkbox.dataset.taskId;
        const factorId = checkbox.dataset.factorId;
        const slider = document.getElementById(`slider-${taskId}-${factorId}`);
        if (!config.taskFactorSettings[taskId]?.[factorId]) return;
        config.taskFactorSettings[taskId][factorId].applied = checkbox.checked;
        if (slider) slider.disabled = !checkbox.checked;
        calculateTotals();
    }

    function handleFactorSliderChange(event) {
        const slider = event.target;
        const taskId = slider.dataset.taskId;
        const factorId = slider.dataset.factorId;
        const valueSpan = document.getElementById(`value-${taskId}-${factorId}`);
        if (!config.taskFactorSettings[taskId]?.[factorId]) return;
        const newValue = parseFloat(slider.value);
        config.taskFactorSettings[taskId][factorId].currentValue = newValue;
        if (valueSpan) valueSpan.textContent = newValue.toFixed(2);
        calculateTotals();
    }

    // --- Core Calculation Logic (UPDATED) ---
    function calculateTotals() {
        const projectArea = parseFloat(projectAreaInput.value) || 0;
        const laborRate = parseFloat(laborRateInput.value) || 0;
        let totalAdjustedTimePerSf = 0;

        config.tasks.forEach(task => {
            if (!task.isSelected || !task.methods || task.methods.length === 0) return; // Skip unselected or method-less tasks

            // Find the SELECTED method for this task
            let selectedMethod = task.methods.find(m => m.isSelected);
            // Fallback: if none selected (shouldn't happen with render logic), use the first one
            if (!selectedMethod) {
                 selectedMethod = task.methods[0];
                 // console.warn(`Task ${task.id} had no selected method, using first.`);
            }

            let currentRate = parseFloat(selectedMethod.rate) || 1; // Use selected method's rate
            if (currentRate <= 0) currentRate = 1;
            const baseTimePerSf = 1 / currentRate; // Base time comes from selected method

            let effectiveMultiplier = 1;
            if (config.taskFactorSettings[task.id]) {
                Object.keys(config.taskFactorSettings[task.id]).forEach(factorId => {
                    const setting = config.taskFactorSettings[task.id][factorId];
                    // Ensure setting exists and is applied before using it
                    if (setting && setting.applied && config.globalFactors.some(f => f.id === factorId)) {
                        effectiveMultiplier *= setting.currentValue;
                    }
                });
            }

            const adjustedTime = effectiveMultiplier !== 0 ? baseTimePerSf / effectiveMultiplier : baseTimePerSf;
            totalAdjustedTimePerSf += adjustedTime;
        });

        // Update Results
        const finalRateSfPerHr = totalAdjustedTimePerSf > 0 ? (1 / totalAdjustedTimePerSf) : 0;
        const estimatedHours = totalAdjustedTimePerSf * projectArea;
        const estimatedCost = estimatedHours * laborRate;

        finalRateSpan.textContent = finalRateSfPerHr.toFixed(1);
        totalTimeSpan.textContent = estimatedHours.toFixed(2);
        totalCostSpan.textContent = estimatedCost.toFixed(2);
    }

    // --- Save/Load Logic ---

    // Function to get the current configuration state
    function buildConfigurationObject() {
         config.sopName = sopNameInput.value;
         config.sopDescription = sopDescriptionTextarea.value;
         // Other data in config object is updated directly by event listeners
         return JSON.parse(JSON.stringify(config)); // Return deep copy
    }

    // --- CSV Export Helper ---
    function escapeCsvValue(value) {
        if (value == null) return ''; // Handle null/undefined
        const stringValue = String(value);
        // If value contains comma, double quote, or newline, wrap in double quotes and escape existing double quotes
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    }

    function createAndDownloadCsv(filename, headers, dataRows) {
         const csvHeader = headers.map(escapeCsvValue).join(',') + '\r\n';
         const csvBody = dataRows.map(row =>
             row.map(escapeCsvValue).join(',')
         ).join('\r\n');

         const csvString = csvHeader + csvBody;
         const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = filename;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
    }

    // --- Event Listeners for Save/Load ---

    saveConfigJsonBtn.addEventListener('click', () => {
        const currentConfig = buildConfigurationObject();
        const jsonString = JSON.stringify(currentConfig, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseFileName = (currentConfig.sopName || 'sop_config').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${baseFileName}_config.json`; // Add suffix
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`Configuration saved as ${a.download}`);
    });

    saveConfigCsvBtn.addEventListener('click', () => {
        const currentConfig = buildConfigurationObject();
        const baseFileName = (currentConfig.sopName || 'sop_config').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        try {
            // 1. SOP Details (Same)
            createAndDownloadCsv(`${baseFileName}_sop_details.csv`, ['SOP_Name', 'SOP_Description'], [[currentConfig.sopName, currentConfig.sopDescription]]);
            // 2. Global Factors (Same)
             createAndDownloadCsv(`${baseFileName}_global_factors.csv`, ['Factor_ID', 'Factor_Name', 'Multiplier_Range', 'Calculated_Avg_Multiplier'], currentConfig.globalFactors.map(f => [f.id, f.name, f.multiplierRange, f.avgMultiplier]));

            // 3. Tasks CSV (Rate removed, maybe remove other method details too)
            const taskHeaders = ['Task_ID', 'Task_Name', 'Is_Selected', 'Skill_Level', 'Materials_Required', 'Factors_Affecting', 'Description'];
            const taskData = currentConfig.tasks.map(t => [t.id, t.name, t.isSelected, t.skillLevel, t.materialsRequired, t.factorsAffecting, t.description]);
            createAndDownloadCsv(`${baseFileName}_tasks.csv`, taskHeaders, taskData);

            // *** NEW: 4. Task Methods CSV ***
            const taskMethodsHeaders = ['Task_ID', 'Task_Name', 'Method_Name', 'Method_Rate_SFHR', 'Is_Selected_For_Calc'];
            const taskMethodsData = [];
             currentConfig.tasks.forEach(task => {
                 if(task.methods) {
                      task.methods.forEach(method => {
                           taskMethodsData.push([task.id, task.name, method.name, method.rate, method.isSelected]);
                      });
                 }
             });
             createAndDownloadCsv(`${baseFileName}_task_methods.csv`, taskMethodsHeaders, taskMethodsData);


            // 5. Task-Factor Settings CSV (Same logic as before)
            const taskFactorSettingsHeaders = ['Task_ID', 'Task_Name', 'Factor_ID', 'Factor_Name', 'Is_Applied', 'Task_Specific_Multiplier'];
            const taskFactorSettingsData = [];
            currentConfig.tasks.forEach(task => {
                 if (currentConfig.taskFactorSettings[task.id]) {
                     Object.keys(currentConfig.taskFactorSettings[task.id]).forEach(factorId => {
                         const setting = currentConfig.taskFactorSettings[task.id][factorId];
                         const factor = currentConfig.globalFactors.find(f => f.id === factorId);
                         if (factor && setting) { // Ensure both factor and setting exist
                             taskFactorSettingsData.push([task.id, task.name, factor.id, factor.name, setting.applied, setting.currentValue]);
                         }
                     });
                 }
             });
            createAndDownloadCsv(`${baseFileName}_task_factor_settings.csv`, taskFactorSettingsHeaders, taskFactorSettingsData);

            alert('Configuration details exported as multiple CSV files.');
        } catch (error) { console.error("Error generating CSV files:", error); alert(`Failed to export CSV files: ${error.message}`); }
    });

    // --- Load Logic (UPDATED to handle potentially missing new fields) ---
     loadConfigInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.json')) {
             alert('Please select a valid JSON configuration file (.json)');
             event.target.value = null; // Reset input
             return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loadedData = JSON.parse(e.target.result);
                if (!loadedData.globalFactors || !loadedData.tasks || !loadedData.taskFactorSettings) { throw new Error("Invalid JSON structure."); }

                // --- Apply Loaded Data ---
                config = loadedData; // Replace global config

                // --- Post-Load Processing ---
                config.globalFactors = processFactors(config.globalFactors); // Ensure avgMultiplier

                // Ensure loaded tasks have expected fields, INCLUDING methods array
                config.tasks = config.tasks.map(task => {
                     const defaultMethod = [{ name: 'Default Method', rate: task.baseRate || 100, isSelected: true }]; // Create default method if missing
                     return {
                         skillLevel: '', materialsRequired: '', factorsAffecting: '', description: '', // Defaults for other fields
                         methods: [], // Default empty methods array
                         ...task, // Spread loaded data
                         methods: Array.isArray(task.methods) && task.methods.length > 0 ? task.methods : defaultMethod // Ensure methods exists, use default if empty/missing
                     };
                 });
                 // Ensure exactly one method is selected per task after load
                  config.tasks.forEach(task => {
                       if (task.methods && task.methods.length > 0) {
                            const selectedCount = task.methods.filter(m => m.isSelected).length;
                            if (selectedCount !== 1) {
                                 task.methods.forEach((m, i) => m.isSelected = (i === 0)); // Select first if none/multiple selected
                            }
                       }
                  });

                initializeTaskFactorSettings(); // Ensure consistency

                // --- Update UI ---
                sopNameInput.value = config.sopName || '';
                sopDescriptionTextarea.value = config.sopDescription || '';
                renderGlobalFactorList();
                renderTaskList(); // Rebuild task list entirely

                document.querySelectorAll('.factor-edit-panel').forEach(panel => panel.style.display = 'none');
                document.querySelectorAll('.edit-factors-btn').forEach(btn => btn.textContent = 'Edit Factors');

                calculateTotals();
                alert('Configuration loaded successfully!');
            } catch (error) {
                console.error("Error loading configuration:", error);
                alert(`Error loading configuration file: ${error.message}`);
            }
            finally { event.target.value = null; }
        };
        reader.onerror = () => {
             alert('Error reading file.');
             event.target.value = null; // Reset input
        };
        reader.readAsText(file);
    });


    // --- Initialization ---
    function initializeApp() {
        // Ensure initial config tasks have the methods structure
         config.tasks = config.tasks.map(task => ({
             ...task,
             methods: Array.isArray(task.methods) ? task.methods : [{ name: 'Default', rate: task.baseRate || 100, isSelected: true }]
         }));
         // Ensure exactly one method selected initially
         config.tasks.forEach(task => {
             if (task.methods && task.methods.length > 0) {
                 const selectedCount = task.methods.filter(m => m.isSelected).length;
                 if (selectedCount !== 1) {
                     task.methods.forEach((m, i) => m.isSelected = (i === 0)); // Select first if none/multiple selected
                 }
             }
         });

        sopNameInput.value = config.sopName;
        sopDescriptionTextarea.value = config.sopDescription;

        renderGlobalFactorList();
        initializeTaskFactorSettings();
        renderTaskList();
        projectAreaInput.addEventListener('input', calculateTotals);
        laborRateInput.addEventListener('input', calculateTotals);
        calculateTotals();
    }

    initializeApp(); // Run setup
});
