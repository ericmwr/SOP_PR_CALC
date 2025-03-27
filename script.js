document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL DATA STORE ---
    let config = {
        sopName: "New Construction Interior - Wainscot - Bead-Board Painting",
        sopDescription: "This specification covers the painting of factory primed bead-board wainscote...",
        globalFactors: [
             // ... (keep factors as before) ...
            { id: 'F01', name: 'Deep/Complex Bead Pattern', multiplierRange: '0.75-0.85'},
            { id: 'F02', name: 'Shallow/Simple Bead Pattern', multiplierRange: '1.1-1.2'},
            { id: 'F03', name: 'Poor Factory Primer Condition', multiplierRange: '0.7-0.8'},
            { id: 'F04', name: 'Excellent Factory Primer Condition', multiplierRange: '1.1-1.2'},
            { id: 'F05', name: 'High Detail Areas (>1 per 50 SF)', multiplierRange: '0.8-0.9'},
            { id: 'F06', name: 'Seamless Runs (>50 LF)', multiplierRange: '1.1-1.2'},
            { id: 'F07', name: 'Working Height >7 ft', multiplierRange: '0.8-0.9'},
            { id: 'F08', name: 'Restricted Access', multiplierRange: '0.7-0.8'},
            { id: 'F09', name: 'Dark Color (Extra Coat Possible)', multiplierRange: '0.85-0.9'},
            { id: 'F10', name: 'High-Gloss Finish', multiplierRange: '0.8-0.85'},
        ],
        tasks: [
            // *** UPDATED TASK STRUCTURE ***
            { id: 'T001', name: 'Surface Inspection', baseRate: 550, isSelected: true, skillLevel: 'Medium', materialsRequired: 'Bright flashlight, Moisture meter', applicationMethods: 'Visual and tactile inspection', factorsAffecting: 'Surface condition, Lighting conditions', description: 'Thoroughly examine the factory primed wainscote...' },
            { id: 'T002', name: 'Surface Cleaning', baseRate: 275, isSelected: true, skillLevel: 'Low', materialsRequired: 'Tack cloth, Vacuum w/ brush, TSP substitute', applicationMethods: 'Hand wiping, Vacuuming', factorsAffecting: 'Dust level, Site cleanliness', description: 'Remove all dust, dirt, and contaminants...' },
            { id: 'T003', name: 'Nail Hole Filling/Spackling', baseRate: 200, isSelected: true, skillLevel: 'Medium', materialsRequired: 'Lightweight spackling, Putty knife', applicationMethods: 'Knife/Finger application', factorsAffecting: 'Number of holes, Depth', description: 'Fill all nail holes, dents...' },
            { id: 'T004', name: 'Caulking Seams & Transitions', baseRate: 175, isSelected: true, skillLevel: 'Medium', materialsRequired: 'Paintable acrylic caulk, Caulk gun', applicationMethods: 'Gun application, Tool w/ finger', factorsAffecting: 'Number of seams, Gap width', description: 'Apply paintable acrylic caulk...' },
            { id: 'T005', name: 'Sanding Preparation', baseRate: 225, isSelected: true, skillLevel: 'Medium', materialsRequired: '220-grit sandpaper, Sanding sponge', applicationMethods: 'Hand/Sponge sanding', factorsAffecting: 'Primer condition, Detail complexity', description: 'Lightly sand entire surface...' },
            { id: 'T006', name: 'Spot Priming (as needed)', baseRate: 250, isSelected: true, skillLevel: 'Medium', materialsRequired: 'Acrylic primer, Brush, Mini-roller', applicationMethods: 'Brush/Roll application', factorsAffecting: 'Area requiring priming, Primer quality', description: 'Apply primer to all spackled areas...' },
            { id: 'T007', name: 'First Coat Application', baseRate: 200, isSelected: true, skillLevel: 'Medium-High', materialsRequired: 'Premium latex paint, Brushes, Rollers', applicationMethods: 'Brush/Roll, Spray+Backbrush', factorsAffecting: 'Groove complexity, Paint viscosity', description: 'Apply first coat of finish paint...' },
            { id: 'T008', name: 'Light Sanding Between Coats', baseRate: 325, isSelected: true, skillLevel: 'Medium', materialsRequired: '320-grit sandpaper, Sanding sponge', applicationMethods: 'Hand/Sponge sanding', factorsAffecting: 'First coat smoothness, Env. conditions', description: 'Once first coat is dry, lightly sand...' },
            { id: 'T009', name: 'Final Coat Application', baseRate: 225, isSelected: true, skillLevel: 'Medium-High', materialsRequired: 'Premium latex paint, Brushes, Rollers', applicationMethods: 'Brush/Roll, Spray+Backbrush', factorsAffecting: 'Groove complexity, Coverage needs', description: 'Apply final coat using same technique...' },
            { id: 'T010', name: 'Post-Finish Inspection', baseRate: 475, isSelected: true, skillLevel: 'High', materialsRequired: 'Bright movable lighting', applicationMethods: 'Visual inspection', factorsAffecting: 'Lighting conditions, Quality standards', description: 'After final coat has dried, inspect...' },
            { id: 'T011', name: 'Final Touch-Up', baseRate: 350, isSelected: true, skillLevel: 'High', materialsRequired: 'Touch-up kit, Artist brushes', applicationMethods: 'Spot application, Feathering', factorsAffecting: 'Number of defects, Visibility', description: 'Address all identified defects...' },
            // Optional Tasks need new fields too
            { id: 'OPT01', name: 'Heavy Duty Cleaning', baseRate: 175, isSelected: false, skillLevel: 'Low', materialsRequired: 'Degreaser, Brushes, Water', applicationMethods: 'Scrubbing, Rinsing', factorsAffecting: 'Level of contamination', description: 'Extensive cleaning for heavily soiled surfaces.' },
            { id: 'OPT02', name: 'Full Surface Priming', baseRate: 175, isSelected: false, skillLevel: 'Medium', materialsRequired: 'Primer, Brushes, Rollers', applicationMethods: 'Brush/Roll application', factorsAffecting: 'Surface porosity, Stains', description: 'Apply primer to the entire surface.' },
            { id: 'OPT03', name: 'Extensive Masking', baseRate: 125, isSelected: false, skillLevel: 'Medium', materialsRequired: 'Tape, Plastic/Paper sheeting', applicationMethods: 'Manual application', factorsAffecting: 'Complexity of areas to protect', description: 'Detailed masking of adjacent surfaces.' },
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
            const taskItemDiv = document.createElement('div');
            taskItemDiv.classList.add('task-item');
            taskItemDiv.id = `task-item-${task.id}`;
            taskItemDiv.dataset.taskId = task.id; // Add task ID to main div

            // --- Main Controls Row ---
            const controlsDiv = document.createElement('div');
            controlsDiv.classList.add('task-main-controls');

            const checkbox = document.createElement('input'); // Selection Checkbox
            checkbox.type = 'checkbox'; checkbox.id = `task-${task.id}`; checkbox.value = task.id;
            checkbox.checked = task.isSelected; checkbox.dataset.taskId = task.id;
            checkbox.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).isSelected = e.target.checked; calculateTotals(); });

            const nameInput = document.createElement('input'); // Editable Task Name
            nameInput.type = 'text'; nameInput.classList.add('task-name-input');
            nameInput.value = task.name; nameInput.dataset.taskId = task.id;
            nameInput.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).name = e.target.value; });

            const editFactorsBtn = document.createElement('button'); // Edit Factors Button
            editFactorsBtn.textContent = 'Edit Factors'; editFactorsBtn.classList.add('edit-factors-btn');
            editFactorsBtn.dataset.taskId = task.id; editFactorsBtn.addEventListener('click', toggleFactorEditPanel);

            const deleteBtn = document.createElement('button'); // Delete Task Button
            deleteBtn.textContent = 'Delete Task'; deleteBtn.classList.add('delete-task-btn');
            deleteBtn.dataset.taskId = task.id; deleteBtn.addEventListener('click', handleDeleteTask);

            controlsDiv.appendChild(checkbox); controlsDiv.appendChild(nameInput);
            controlsDiv.appendChild(editFactorsBtn); controlsDiv.appendChild(deleteBtn);
            taskItemDiv.appendChild(controlsDiv);

            // --- Details Grid ---
            const detailsGridDiv = document.createElement('div');
            detailsGridDiv.classList.add('task-details-grid');

            // Helper function to create grid rows
            const createGridRow = (label, element) => {
                 const div = document.createElement('div'); // Wrapper for grid participation
                 const lbl = document.createElement('label');
                 lbl.textContent = label;
                 div.appendChild(lbl);
                 div.appendChild(element);
                 detailsGridDiv.appendChild(div);
            };

            // Rate
            const rateInput = document.createElement('input');
            rateInput.type = 'number'; rateInput.classList.add('task-rate-input');
            rateInput.id = `rate-${task.id}`; rateInput.value = task.baseRate;
            rateInput.min = "1"; rateInput.step = "1"; rateInput.dataset.taskId = task.id;
            rateInput.addEventListener('input', (e) => { config.tasks.find(t=>t.id===task.id).baseRate = parseFloat(e.target.value) || 1; calculateTotals(); });
            createGridRow('Base Rate (SF/HR):', rateInput);

            // Skill Level
            const skillInput = document.createElement('input');
            skillInput.type = 'text'; skillInput.classList.add('task-skill-input');
            skillInput.value = task.skillLevel || ''; skillInput.dataset.taskId = task.id;
            skillInput.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).skillLevel = e.target.value; });
            createGridRow('Skill Level:', skillInput);

            // Materials
            const materialsTextarea = document.createElement('textarea');
            materialsTextarea.classList.add('task-materials-input'); materialsTextarea.rows = 2;
            materialsTextarea.value = task.materialsRequired || ''; materialsTextarea.dataset.taskId = task.id;
            materialsTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).materialsRequired = e.target.value; });
            createGridRow('Materials Required:', materialsTextarea);

            // Application Methods
            const methodsTextarea = document.createElement('textarea');
            methodsTextarea.classList.add('task-methods-input'); methodsTextarea.rows = 2;
            methodsTextarea.value = task.applicationMethods || ''; methodsTextarea.dataset.taskId = task.id;
            methodsTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).applicationMethods = e.target.value; });
            createGridRow('Application Methods:', methodsTextarea);

            // Factors Affecting
            const affectingTextarea = document.createElement('textarea');
            affectingTextarea.classList.add('task-affecting-input'); affectingTextarea.rows = 2;
            affectingTextarea.value = task.factorsAffecting || ''; affectingTextarea.dataset.taskId = task.id;
            affectingTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).factorsAffecting = e.target.value; });
            createGridRow('Factors Affecting:', affectingTextarea);

             // Description
             const descriptionTextarea = document.createElement('textarea');
             descriptionTextarea.classList.add('task-description-input'); descriptionTextarea.rows = 3;
             descriptionTextarea.value = task.description || ''; descriptionTextarea.dataset.taskId = task.id;
             descriptionTextarea.addEventListener('change', (e) => { config.tasks.find(t=>t.id===task.id).description = e.target.value; });
             createGridRow('Description:', descriptionTextarea);


            taskItemDiv.appendChild(detailsGridDiv);

            // --- Factor Editor Panel Placeholder ---
            const factorEditPanel = document.createElement('div');
            factorEditPanel.classList.add('factor-edit-panel');
            factorEditPanel.id = `factor-edit-panel-${task.id}`;
            factorEditPanel.style.display = 'none';
            taskItemDiv.appendChild(factorEditPanel);

            // Append the complete task item to the list
            taskListDiv.appendChild(taskItemDiv);
        });
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

     // --- Add New Task Logic (UPDATED) ---
     addTaskBtn.addEventListener('click', () => {
          const newTask = {
              id: generateUniqueId('T'),
              name: 'New Task - Edit Name',
              baseRate: 100,
              isSelected: true,
              // Add defaults for new fields
              skillLevel: 'Medium',
              materialsRequired: '',
              applicationMethods: '',
              factorsAffecting: '',
              description: ''
          };
          config.tasks.push(newTask);
          initializeTaskFactorSettings();
          renderTaskList(); // Re-render
          document.getElementById(`task-item-${newTask.id}`)?.scrollIntoView({behavior: "smooth"});
          calculateTotals();
     });

    function toggleFactorEditPanel(event) {
        const taskId = event.target.dataset.taskId;
        const panel = document.getElementById(`factor-edit-panel-${taskId}`);
        if (!panel) return;
        const isVisible = panel.style.display === 'block';
        if (isVisible) {
            panel.style.display = 'none'; event.target.textContent = 'Edit Factors';
        } else {
            renderTaskFactorEditor(taskId, panel); // Populate before showing
            panel.style.display = 'block'; event.target.textContent = 'Hide Factors';
        }
    }


    function renderTaskFactorEditor(taskId, panelElement) {
        panelElement.innerHTML = ''; // Clear previous content
        // Ensure entry exists in global settings
        if (!config.taskFactorSettings[taskId]) config.taskFactorSettings[taskId] = {};

        config.globalFactors.forEach(factor => {
            // Initialize task-specific settings for this factor if they don't exist IN THE GLOBAL STORE
            if (!config.taskFactorSettings[taskId][factor.id]) {
                config.taskFactorSettings[taskId][factor.id] = {
                    applied: false, currentValue: factor.avgMultiplier
                };
            }
            const factorSetting = config.taskFactorSettings[taskId][factor.id];

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

    // --- Core Calculation Logic (No changes needed) ---
    function calculateTotals() {
        const projectArea = parseFloat(projectAreaInput.value) || 0;
        const laborRate = parseFloat(laborRateInput.value) || 0;
        let totalAdjustedTimePerSf = 0;

        config.tasks.forEach(task => {
            if (!task.isSelected) return; // Skip unselected tasks based on config data

            // Get base rate directly from config data
            let currentRate = parseFloat(task.baseRate) || 1;
            if (currentRate <= 0) currentRate = 1;
            const baseTimePerSf = 1 / currentRate;

            let effectiveMultiplier = 1;
            if (config.taskFactorSettings[task.id]) {
                Object.keys(config.taskFactorSettings[task.id]).forEach(factorId => {
                    const setting = config.taskFactorSettings[task.id][factorId];
                     // Ensure factor still exists globally before applying
                    if (setting.applied && config.globalFactors.some(f => f.id === factorId)) {
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
            // 1. SOP Details CSV (Same)
            createAndDownloadCsv(`${baseFileName}_sop_details.csv`, ['SOP_Name', 'SOP_Description'], [[currentConfig.sopName, currentConfig.sopDescription]]);

            // 2. Global Factors CSV (Same)
            const factorHeaders = ['Factor_ID', 'Factor_Name', 'Multiplier_Range', 'Calculated_Avg_Multiplier'];
            const factorData = currentConfig.globalFactors.map(f => [f.id, f.name, f.multiplierRange, f.avgMultiplier]);
            createAndDownloadCsv(`${baseFileName}_global_factors.csv`, factorHeaders, factorData);

            // 3. Tasks CSV (*** UPDATED WITH NEW COLUMNS ***)
            const taskHeaders = [
                'Task_ID', 'Task_Name', 'Is_Selected', 'Base_Rate_SFHR', 'Skill_Level',
                'Materials_Required', 'Application_Methods', 'Factors_Affecting', 'Description'
            ];
            const taskData = currentConfig.tasks.map(t => [
                t.id, t.name, t.isSelected, t.baseRate, t.skillLevel,
                t.materialsRequired, t.applicationMethods, t.factorsAffecting, t.description
            ]);
            createAndDownloadCsv(`${baseFileName}_tasks.csv`, taskHeaders, taskData);

            // 4. Task-Factor Settings CSV (Same logic)
            const taskFactorSettingsHeaders = ['Task_ID', 'Task_Name', 'Factor_ID', 'Factor_Name', 'Is_Applied', 'Task_Specific_Multiplier'];
            const taskFactorSettingsData = [];
            currentConfig.tasks.forEach(task => {
                 if (currentConfig.taskFactorSettings[task.id]) {
                     Object.keys(currentConfig.taskFactorSettings[task.id]).forEach(factorId => {
                         const setting = currentConfig.taskFactorSettings[task.id][factorId];
                         const factor = currentConfig.globalFactors.find(f => f.id === factorId);
                         if (factor) {
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

                // Ensure loaded tasks have ALL expected fields (add defaults if missing)
                config.tasks = config.tasks.map(task => ({
                     skillLevel: '', // Add defaults for all new fields
                     materialsRequired: '',
                     applicationMethods: '',
                     factorsAffecting: '',
                     description: '',
                     ...task // Spread loaded task data over defaults
                 }));

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
        sopNameInput.value = config.sopName;
        sopDescriptionTextarea.value = config.sopDescription;
        initializeTaskFactorSettings(); // Ensure initial structure is correct
        renderGlobalFactorList();
        renderTaskList();
        projectAreaInput.addEventListener('input', calculateTotals);
        laborRateInput.addEventListener('input', calculateTotals);
        calculateTotals(); // Initial calculation
    }

    initializeApp(); // Run setup
});
