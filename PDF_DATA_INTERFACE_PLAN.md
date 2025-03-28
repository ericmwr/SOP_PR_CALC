# PDF Data Interface Implementation Plan

This document outlines the necessary interface elements to fully represent all data from the PDF specifications in the SOP Calculator application.

## Current Data Coverage Analysis

Based on the PDF example "New Construction Interior - Wainscot - Bead-Board.pdf" and our current application state, here's what we currently support vs. what needs to be added:

### Currently Supported Data
- SOP name and description
- Tasks with names, descriptions, and selection status
- Application methods with rates
- Skill levels for tasks
- Materials required for tasks
- Factors affecting tasks
- Global factors with multiplier ranges

### Missing Data Elements
1. **SOP Groups and Sequencing**
2. **Complexity Levels**
3. **Extended Method Details**
4. **Surface Handling Instructions**
5. **Assumptions and Limitations**
6. **Measurement Methodology**
7. **Estimating Inspection Checklist**

## Implementation Plan by Section

### 1. SOP Groups and Sequencing

#### Data Structure
```javascript
let sopGroups = [
  {
    id: 'SOP-BW-PREP-01',
    name: 'Bead-Board Wainscote Preparation',
    paintableItemId: 'INT-WAINSCOTE-BP',
    taskSequence: ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'],
    overallSkillLevel: 'Medium',
    version: '1.0'
  },
  {
    id: 'SOP-BW-PAINT-01',
    name: 'Bead-Board Wainscote Painting',
    paintableItemId: 'INT-WAINSCOTE-BP',
    taskSequence: ['T007', 'T008', 'T009', 'T010', 'T011'],
    overallSkillLevel: 'Medium',
    version: '1.0'
  }
];
```

#### UI Implementation
1. Add a new section to the left sidebar:
```html
<div class="section">
  <div class="section-header">
    <h2>SOP Groups</h2>
    <button class="toggle-collapse-btn" data-target="sop-groups-content">▼</button>
  </div>
  <div id="sop-groups-content" class="section-content">
    <div id="sop-groups-list"></div>
    <button id="add-sop-group-btn">+ Add SOP Group</button>
  </div>
</div>
```

2. Create a rendering function for SOP groups:
```javascript
function renderSopGroups() {
  const sopGroupsList = document.getElementById('sop-groups-list');
  sopGroupsList.innerHTML = '';
  
  config.sopGroups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('sop-group-item');
    
    // Group header with ID and name
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('sop-group-header');
    
    const idSpan = document.createElement('span');
    idSpan.classList.add('sop-group-id');
    idSpan.textContent = group.id;
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList.add('sop-group-name-input');
    nameInput.value = group.name;
    nameInput.dataset.groupId = group.id;
    nameInput.addEventListener('change', e => {
      const groupId = e.target.dataset.groupId;
      const group = config.sopGroups.find(g => g.id === groupId);
      if (group) group.name = e.target.value;
    });
    
    headerDiv.appendChild(idSpan);
    headerDiv.appendChild(nameInput);
    groupDiv.appendChild(headerDiv);
    
    // Task sequence section
    const sequenceDiv = document.createElement('div');
    sequenceDiv.classList.add('task-sequence-section');
    
    const sequenceLabel = document.createElement('label');
    sequenceLabel.textContent = 'Task Sequence:';
    sequenceDiv.appendChild(sequenceLabel);
    
    const sequenceList = document.createElement('div');
    sequenceList.classList.add('task-sequence-list');
    
    group.taskSequence.forEach((taskId, index) => {
      const task = config.tasks.find(t => t.id === taskId);
      if (!task) return;
      
      const taskItem = document.createElement('div');
      taskItem.classList.add('sequence-task-item');
      
      const taskName = document.createElement('span');
      taskName.textContent = `${index + 1}. ${task.name}`;
      
      const moveUpBtn = document.createElement('button');
      moveUpBtn.textContent = '↑';
      moveUpBtn.disabled = index === 0;
      moveUpBtn.addEventListener('click', () => moveTaskInSequence(group.id, index, -1));
      
      const moveDownBtn = document.createElement('button');
      moveDownBtn.textContent = '↓';
      moveDownBtn.disabled = index === group.taskSequence.length - 1;
      moveDownBtn.addEventListener('click', () => moveTaskInSequence(group.id, index, 1));
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'x';
      removeBtn.addEventListener('click', () => removeTaskFromSequence(group.id, index));
      
      taskItem.appendChild(taskName);
      taskItem.appendChild(moveUpBtn);
      taskItem.appendChild(moveDownBtn);
      taskItem.appendChild(removeBtn);
      sequenceList.appendChild(taskItem);
    });
    
    sequenceDiv.appendChild(sequenceList);
    
    // Add task dropdown
    const addTaskDiv = document.createElement('div');
    addTaskDiv.classList.add('add-task-to-sequence');
    
    const taskSelect = document.createElement('select');
    taskSelect.id = `add-task-select-${group.id}`;
    
    // Add option for each task not already in the sequence
    const availableTasks = config.tasks.filter(t => !group.taskSequence.includes(t.id));
    availableTasks.forEach(task => {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.name;
      taskSelect.appendChild(option);
    });
    
    const addTaskBtn = document.createElement('button');
    addTaskBtn.textContent = 'Add Task';
    addTaskBtn.addEventListener('click', () => {
      const select = document.getElementById(`add-task-select-${group.id}`);
      if (select.value) {
        addTaskToSequence(group.id, select.value);
      }
    });
    
    addTaskDiv.appendChild(taskSelect);
    addTaskDiv.appendChild(addTaskBtn);
    sequenceDiv.appendChild(addTaskDiv);
    
    groupDiv.appendChild(sequenceDiv);
    
    // Skill level and version
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('sop-group-details');
    
    const skillLevelDiv = document.createElement('div');
    const skillLabel = document.createElement('label');
    skillLabel.textContent = 'Overall Skill Level:';
    
    const skillSelect = document.createElement('select');
    skillSelect.dataset.groupId = group.id;
    
    ['Low', 'Medium', 'High'].forEach(level => {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = level;
      option.selected = level === group.overallSkillLevel;
      skillSelect.appendChild(option);
    });
    
    skillSelect.addEventListener('change', e => {
      const groupId = e.target.dataset.groupId;
      const group = config.sopGroups.find(g => g.id === groupId);
      if (group) group.overallSkillLevel = e.target.value;
    });
    
    skillLevelDiv.appendChild(skillLabel);
    skillLevelDiv.appendChild(skillSelect);
    detailsDiv.appendChild(skillLevelDiv);
    
    const versionDiv = document.createElement('div');
    const versionLabel = document.createElement('label');
    versionLabel.textContent = 'Version:';
    
    const versionInput = document.createElement('input');
    versionInput.type = 'text';
    versionInput.value = group.version;
    versionInput.dataset.groupId = group.id;
    versionInput.addEventListener('change', e => {
      const groupId = e.target.dataset.groupId;
      const group = config.sopGroups.find(g => g.id === groupId);
      if (group) group.version = e.target.value;
    });
    
    versionDiv.appendChild(versionLabel);
    versionDiv.appendChild(versionInput);
    detailsDiv.appendChild(versionDiv);
    
    groupDiv.appendChild(detailsDiv);
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete SOP Group';
    deleteBtn.classList.add('delete-sop-group-btn');
    deleteBtn.dataset.groupId = group.id;
    deleteBtn.addEventListener('click', e => {
      const groupId = e.target.dataset.groupId;
      deleteSopGroup(groupId);
    });
    
    groupDiv.appendChild(deleteBtn);
    
    sopGroupsList.appendChild(groupDiv);
  });
}
```

3. Add helper functions for SOP group management:
```javascript
function addTaskToSequence(groupId, taskId) {
  const group = config.sopGroups.find(g => g.id === groupId);
  if (group && !group.taskSequence.includes(taskId)) {
    group.taskSequence.push(taskId);
    renderSopGroups();
  }
}

function removeTaskFromSequence(groupId, index) {
  const group = config.sopGroups.find(g => g.id === groupId);
  if (group && index >= 0 && index < group.taskSequence.length) {
    group.taskSequence.splice(index, 1);
    renderSopGroups();
  }
}

function moveTaskInSequence(groupId, index, direction) {
  const group = config.sopGroups.find(g => g.id === groupId);
  if (!group) return;
  
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= group.taskSequence.length) return;
  
  // Swap tasks
  const temp = group.taskSequence[index];
  group.taskSequence[index] = group.taskSequence[newIndex];
  group.taskSequence[newIndex] = temp;
  
  renderSopGroups();
}

function addSopGroup() {
  const newId = `SOP-${generateUniqueId()}`;
  const newGroup = {
    id: newId,
    name: 'New SOP Group',
    paintableItemId: '',
    taskSequence: [],
    overallSkillLevel: 'Medium',
    version: '1.0'
  };
  
  config.sopGroups.push(newGroup);
  renderSopGroups();
}

function deleteSopGroup(groupId) {
  if (confirm(`Are you sure you want to delete this SOP Group?`)) {
    config.sopGroups = config.sopGroups.filter(g => g.id !== groupId);
    renderSopGroups();
  }
}
```

### 2. Complexity Levels

#### Data Structure
```javascript
let complexityLevels = {
  low: {
    name: 'Low Complexity',
    rateMultiplier: 1.2, // 20% faster than baseline
    description: 'Simple surfaces with minimal detail'
  },
  medium: {
    name: 'Medium Complexity',
    rateMultiplier: 1.0, // Baseline
    description: 'Average complexity with some detail work'
  },
  high: {
    name: 'High Complexity',
    rateMultiplier: 0.8, // 20% slower than baseline
    description: 'Complex surfaces with significant detail work'
  }
};

// Add to config
config.complexityLevels = complexityLevels;
config.selectedComplexity = 'medium'; // Default
```

#### UI Implementation
1. Add a complexity selector to the project details section:
```html
<div class="section">
  <h2>Project Details</h2>
  <div>
    <label for="project-area">Project Area (SF):</label>
    <input type="number" id="project-area" value="100" min="0">
  </div>
  <div>
    <label for="labor-rate">Hourly Labor Rate ($):</label>
    <input type="number" id="labor-rate" value="50" min="0" step="0.01">
  </div>
  <div>
    <label for="complexity-level">Complexity Level:</label>
    <select id="complexity-level">
      <option value="low">Low Complexity</option>
      <option value="medium" selected>Medium Complexity</option>
      <option value="high">High Complexity</option>
    </select>
  </div>
  <div class="complexity-description" id="complexity-description">
    Average complexity with some detail work
  </div>
</div>
```

2. Add event handler for complexity selection:
```javascript
document.getElementById('complexity-level').addEventListener('change', function(e) {
  const complexity = e.target.value;
  config.selectedComplexity = complexity;
  
  // Update description
  const descriptionElement = document.getElementById('complexity-description');
  if (descriptionElement && config.complexityLevels[complexity]) {
    descriptionElement.textContent = config.complexityLevels[complexity].description;
  }
  
  calculateTotals(); // Recalculate with new complexity
});
```

3. Update calculation logic to use complexity:
```javascript
function calculateTotals() {
  const projectArea = parseFloat(projectAreaInput.value) || 0;
  const laborRate = parseFloat(laborRateInput.value) || 0;
  let totalAdjustedTimePerSf = 0;
  
  // Get complexity multiplier
  const complexityMultiplier = config.complexityLevels[config.selectedComplexity]?.rateMultiplier || 1.0;
  
  config.tasks.forEach(task => {
    if (!task.isSelected || !task.methods || task.methods.length === 0) return;
    
    // Find selected method
    let selectedMethod = task.methods.find(m => m.isSelected) || task.methods[0];
    let currentRate = parseFloat(selectedMethod.rate) || 1;
    if (currentRate <= 0) currentRate = 1;
    
    // Apply complexity multiplier to base rate
    currentRate = currentRate * complexityMultiplier;
    
    const baseTimePerSf = 1 / currentRate;
    
    // Apply task-specific factors
    let taskFactorMultiplier = 1;
    if (config.taskFactorSettings[task.id]) {
      Object.keys(config.taskFactorSettings[task.id]).forEach(factorId => {
        const setting = config.taskFactorSettings[task.id][factorId];
        if (setting && setting.applied) {
          taskFactorMultiplier *= setting.currentValue;
        }
      });
    }
    
    const adjustedTime = baseTimePerSf / taskFactorMultiplier;
    totalAdjustedTimePerSf += adjustedTime;
  });
  
  // Update results
  const finalRateSfPerHr = totalAdjustedTimePerSf > 0 ? (1 / totalAdjustedTimePerSf) : 0;
  const estimatedHours = totalAdjustedTimePerSf * projectArea;
  const estimatedCost = estimatedHours * laborRate;
  
  finalRateSpan.textContent = finalRateSfPerHr.toFixed(1);
  totalTimeSpan.textContent = estimatedHours.toFixed(2);
  totalCostSpan.textContent = estimatedCost.toFixed(2);
}
```

### 3. Extended Method Details

#### Data Structure
```javascript
// Extend the methods array in tasks
methods: [
  { 
    name: 'Brush/Roll', 
    rate: 200, 
    isSelected: true,
    advantages: 'Excellent detail in grooves, Good control, Moderate speed',
    disadvantages: 'Labor intensive, Requires skill for consistent finish',
    bestUseScenario: 'Standard approach for most bead-board projects',
    productionRateEffect: 'Baseline'
  },
  { 
    name: 'Spray+Backbrush', 
    rate: 250, 
    isSelected: false,
    advantages: 'Fast application, Consistent coverage',
    disadvantages: 'Requires masking, Equipment setup time, Overspray concerns',
    bestUseScenario: 'Large areas (>500 SF), Production-focused projects',
    productionRateEffect: '+20-30% on large areas, -10% on small areas'
  }
]
```

#### UI Implementation
1. Expand the method item UI to include the additional fields:
```javascript
function renderTaskMethods(taskId, containerElement) {
  containerElement.innerHTML = '';
  const task = config.tasks.find(t => t.id === taskId);
  if (!task || !task.methods) return;
  
  // Ensure at least one method is selected
  if (!task.methods.some(m => m.isSelected) && task.methods.length > 0) {
    task.methods[0].isSelected = true;
  }
  
  task.methods.forEach((method, index) => {
    const methodItemDiv = document.createElement('div');
    methodItemDiv.classList.add('method-item');
    methodItemDiv.dataset.taskId = taskId;
    methodItemDiv.dataset.methodIndex = index;
    
    // Basic method info (existing code)
    const basicInfoDiv = document.createElement('div');
    basicInfoDiv.classList.add('method-basic-info');
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `method-select-${taskId}`;
    radio.id = `method-${taskId}-${index}`;
    radio.value = index;
    radio.checked = method.isSelected;
    radio.dataset.taskId = taskId;
    radio.dataset.methodIndex = index;
    radio.addEventListener('change', handleMethodSelectionChange);
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.classList.add('method-name-input');
    nameInput.value = method.name;
    nameInput.dataset.taskId = taskId;
    nameInput.dataset.methodIndex = index;
    nameInput.addEventListener('change', handleMethodNameChange);
    
    const rateInput = document.createElement('input');
    rateInput.type = 'number';
    rateInput.classList.add('method-rate-input');
    rateInput.value = method.rate;
    rateInput.min = "1";
    rateInput.step = "1";
    rateInput.dataset.taskId = taskId;
    rateInput.dataset.methodIndex = index;
    rateInput.addEventListener('input', handleMethodRateChange);
    
    const rateUnitSpan = document.createElement('span');
    rateUnitSpan.textContent = 'SF/HR';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-method-btn');
    deleteBtn.dataset.taskId = taskId;
    deleteBtn.dataset.methodIndex = index;
    deleteBtn.addEventListener('click', handleDeleteMethod);
    deleteBtn.disabled = task.methods.length <= 1;
    
    basicInfoDiv.appendChild(radio);
    basicInfoDiv.appendChild(nameInput);
    basicInfoDiv.appendChild(rateInput);
    basicInfoDiv.appendChild(rateUnitSpan);
    basicInfoDiv.appendChild(deleteBtn);
    
    methodItemDiv.appendChild(basicInfoDiv);
    
    // Toggle button for details
    const toggleDetailsBtn = document.createElement('button');
    toggleDetailsBtn.textContent = 'Show Details';
    toggleDetailsBtn.classList.add('toggle-method-details-btn');
    toggleDetailsBtn.addEventListener('click', function() {
      const detailsDiv = this.nextElementSibling;
      const isVisible = detailsDiv.style.display !== 'none';
      detailsDiv.style.display = isVisible ? 'none' : 'block';
      this.textContent = isVisible ? 'Show Details' : 'Hide Details';
    });
    
    methodItemDiv.appendChild(toggleDetailsBtn);
    
    // Extended details section
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('method-details');
    detailsDiv.style.display = 'none';
    
    // Advantages
    const advantagesDiv = document.createElement('div');
    const advantagesLabel = document.createElement('label');
    advantagesLabel.textContent = 'Advantages:';
    
    const advantagesInput = document.createElement('textarea');
    advantagesInput.value = method.advantages || '';
    advantagesInput.dataset.taskId = taskId;
    advantagesInput.dataset.methodIndex = index;
    advantagesInput.dataset.field = 'advantages';
    advantagesInput.addEventListener('change', handleMethodDetailChange);
    
    advantagesDiv.appendChild(advantagesLabel);
    advantagesDiv.appendChild(advantagesInput);
    detailsDiv.appendChild(advantagesDiv);
    
    // Disadvantages
    const disadvantagesDiv = document.createElement('div');
    const disadvantagesLabel = document.createElement('label');
    disadvantagesLabel.textContent = 'Disadvantages:';
    
    const disadvantagesInput = document.createElement('textarea');
    disadvantagesInput.value = method.disadvantages || '';
    disadvantagesInput.dataset.taskId = taskId;
    disadvantagesInput.dataset.methodIndex = index;
    disadvantagesInput.dataset.field = 'disadvantages';
    disadvantagesInput.addEventListener('change', handleMethodDetailChange);
    
    disadvantagesDiv.appendChild(disadvantagesLabel);
    disadvantagesDiv.appendChild(disadvantagesInput);
    detailsDiv.appendChild(disadvantagesDiv);
    
    // Best Use Scenario
    const bestUseDiv = document.createElement('div');
    const bestUseLabel = document.createElement('label');
    bestUseLabel.textContent = 'Best Use Scenario:';
    
    const bestUseInput = document.createElement('textarea');
    bestUseInput.value = method.bestUseScenario || '';
    bestUseInput.dataset.taskId = taskId;
    bestUseInput.dataset.methodIndex = index;
    bestUseInput.dataset.field = 'bestUseScenario';
    bestUseInput.addEventListener('change', handleMethodDetailChange);
    
    bestUseDiv.appendChild(bestUseLabel);
    bestUseDiv.appendChild(bestUseInput);
    detailsDiv.appendChild(bestUseDiv);
    
    // Production Rate Effect
    const rateEffectDiv = document.createElement('div');
    const rateEffectLabel = document.createElement('label');
    rateEffectLabel.textContent = 'Production Rate Effect:';
    
    const rateEffectInput = document.createElement('input');
    rateEffectInput.type = 'text';
    rateEffectInput.value = method.productionRateEffect || '';
    rateEffectInput.dataset.taskId = taskId;
    rateEffectInput.dataset.methodIndex = index;
    rateEffectInput.dataset.field = 'productionRateEffect';
    rateEffectInput.addEventListener('change', handleMethodDetailChange);
    
    rateEffectDiv.appendChild(rateEffectLabel);
    rateEffectDiv.appendChild(rateEffectInput);
    detailsDiv.appendChild(rateEffectDiv);
    
    methodItemDiv.appendChild(detailsDiv);
    containerElement.appendChild(methodItemDiv);
  });
}

// Add handler for method detail changes
function handleMethodDetailChange(event) {
  const input = event.target;
  const taskId = input.dataset.taskId;
  const index = parseInt(input.dataset.methodIndex, 10);
  const field = input.dataset.field;
  
  const task = config.tasks.find(t => t.id === taskId);
  if (task && task.methods && task.methods[index] && field) {
    task.methods[index][field] = input.value;
  }
}
```

### 4. Surface Handling Instructions

#### Data Structure
```javascript
// Add to config
config.surfaceHandling = {
  preInstallation: [
    "Allow factory primed bead-board to acclimate in installation environment for 48-72 hours before installation",
    "Store flat to prevent warping",
    "Keep clean and dry during storage and installation",
    "Handle with clean gloves to prevent oils from transferring to surface"
  ],
  postInstallation: [
    "Allow adhesives and installation materials to fully cure before painting (typically 24-48 hours)",
    "Verify moisture content is below 12% before beginning painting process",
    "Confirm all fasteners are properly countersunk",
    "Inspect for shipping or installation damage before beginning preparation"
  ],
  paintSystemCompatibility: [
    "Use only water-based acrylic or acrylic-urethane systems unless specified otherwise",
    "Ensure primer compatibility with factory primer (test in inconspicuous area if uncertain)",
    "For high-moisture areas (bathrooms, etc.), consider moisture-resistant paint system",
    "For high-traffic areas, use scuff-resistant paint with appropriate sheen (satin or semi-gloss)"
  ],
  cureAndHardness: [
    "Allow minimum 24 hours between coats (longer in high humidity or low temperature)",
    "Full cure typically requires 7-14 days depending on environmental conditions",
    "Avoid cleaning or abrasion during cure period",
    "Avoid placing items against painted surface for minimum 72 hours"
  ]
};
```

#### UI Implementation
1. Add a new tab or section for surface handling:
```html
<div class="section">
  <div class="section-header">
    <h2>Surface Handling Instructions</h2>
    <button class="toggle-collapse-btn" data-target="surface-handling-content">▼</button>
  </div>
  <div id="surface-handling-content" class="section-content">
    <div class="surface-handling-section">
      <h3>Pre-Installation Considerations</h3>
      <div id="pre-installation-list" class="editable-list"></div>
      <button class="add-list-item-btn" data-list="preInstallation">+ Add Item</button>
    </div>
    
    <div class="surface-handling-section">
      <h3>Post-Installation/Pre-Painting Considerations</h3>
      <div id="post-installation-list" class="editable-list"></div>
      <button class="add-list-item-btn" data-list="postInstallation">+ Add Item</button>
    </div>
    
    <div class="surface-handling-section">
      <h3>Paint System Compatibility</h3>
      <div id="paint-system-list" class="editable-list"></div>
      <button class="add-list-item-btn" data-list="paintSystemCompatibility">+ Add Item</button>
    </div>
    
    <div class="surface-handling-section">
      <h3>Cure and Hardness Considerations</h3>
      <div id="cure-hardness-list" class="editable-list"></div>
      <button class="add-list-item-btn" data-list="cureAndHardness">+ Add Item</button>
    </div>
  </div>
</div>
```

2. Add rendering function for editable lists:
```javascript
function renderSurfaceHandlingLists() {
  renderEditableList('pre-installation-list', config.surfaceHandling.preInstallation, 'preInstallation');
  renderEditableList('post-installation-list', config.surfaceHandling.postInstallation, 'postInstallation');
  renderEditableList('paint-system-list', config.surfaceHandling.paintSystemCompatibility, 'paintSystemCompatibility');
  renderEditableList('cure-hardness-list', config.surfaceHandling.cureAndHardness, 'cureAndHardness');
}

function renderEditableList(containerId, items, listName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('editable-list-item');
    
    const itemInput = document.createElement('textarea');
    itemInput.value = item;
    itemInput.dataset.listName = listName;
    itemInput.dataset.index = index;
    itemInput.addEventListener('change', handleListItemChange);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('delete-list-item-btn');
    deleteBtn.dataset.listName = listName;
    deleteBtn.dataset.index = index;
    deleteBtn.addEventListener('click', handleDeleteListItem);
    
    itemDiv.appendChild(itemInput);
    itemDiv.appendChild(deleteBtn);
    container.appendChild(itemDiv);
  });
}

// Event handlers for editable lists
function handleListItemChange(event) {
  const input = event.target;
  const listName = input.dataset.listName;
  const index = parseInt(input.dataset.index, 10);
  
  if (config.surfaceHandling[listName] && index >= 0 && index < config.surfaceHandling[listName].length) {
    config.surfaceHandling[listName][index] = input.value;
  }
}

function handleDeleteListItem(event) {
  const button = event.target;
  const listName = button.dataset.listName;
  const index = parseInt(button.dataset.index, 10);
  
  if (config.surfaceHandling[listName] && index >= 0 && index < config.surfaceHandling[listName].length) {
    if (confirm('Are you sure you want to delete this item?')) {
      config.surfaceHandling[listName].splice(index, 1);
      renderSurfaceHandlingLists();
    }
  }
}

function handleAddListItem(event) {
  const button = event.target;
  const listName = button.dataset.list;
  
  if (config.surfaceHandling[listName]) {
    config.surfaceHandling[listName].push('New item - edit this text');
    renderSurfaceHandlingLists();
  }
}
```

3. Add event listeners for add buttons:
```javascript
document.querySelectorAll('.add-list-item-btn').forEach(button => {
  button.addEventListener('click', handleAddListItem);
});
```

### 5. Assumptions and Limitations

#### Data Structure
```javascript
// Add to config
config.assumptions = {
  sitePreparation: [
    "Area is clean, dry, and free of dust-producing activities during painting",
    "Adequate lighting is provided for work area",
    "Temperature maintained between 50-90°F during application and curing",
    "Relative humidity below 85% during application and curing",
    "Adequate ventilation is provided",
    "Floor protection is in place",
    "Adjacent surfaces are adequately protected"
  ],
  materials: [
    "Factory primer is in generally good condition",
    "Materials used meet or exceed manufacturer specifications",
    "Paint products are from same manufacturer unless specifically tested for compatibility",
    "Materials are properly stored and prepared according to manufacturer instructions"
  ],
  scopeLimitations: [
    "Specification does not include repair of structural defects",
    "Major surface repairs or replacement of damaged sections is excluded",
    "Specification assumes normal working hours and access",
    "Excessive furniture moving or protection is excluded",
    "Touch-up beyond standard punch list is excluded",
    "Long-term maintenance is excluded"
  ],
  environmental: [
    "Work should not proceed in temperature or humidity conditions outside manufacturer recommendations",
    "Adequate drying time must be allowed between coats, regardless of schedule pressure",
    "Forced drying methods are not recommended"
  ]
};
```

#### UI Implementation
1. Add a new section for assumptions and limitations:
```html
<div class="section">
  <div class="section-header">
    <h2>Assumptions and Limitations</h2>
    <button class="toggle-collapse-btn" data-target="assumptions-content">▼</button>
  </div>
  <div id="assumptions-content" class="section-content">
    <div class="assumptions-section">
      <h3>Site Preparation Assumptions</h3>
      <div id="site-preparation-list" class="editable-list"></div>
      <button class="add-assumption-btn" data-list="sitePreparation">+ Add Item</button>
    </div>
    
    <div class="assumptions-section">
      <h3>Material Assumptions</h3>
      <div id="material-assumptions-list" class="editable-list"></div>
      <button class="add-assumption-btn" data-list="materials">+ Add Item</button>
    </div>
    
    <div class="assumptions-section">
      <h3>Scope Limitations</h3>
      <div id="scope-limitations-list" class="editable-list"></div>
      <button class="add-assumption-btn" data-list="scopeLimitations">+ Add Item</button>
    </div>
    
    <div class="assumptions-section">
      <h3>Environmental Limitations</h3>
      <div id="environmental-limitations-list" class="editable-list"></div>
      <button class="add-assumption-btn" data-list="environmental">+ Add Item</button>
    </div>
  </div>
</div>
```

2. Add rendering function for assumptions lists:
```javascript
function renderAssumptionsLists() {
  renderEditableList('site-preparation-list', config.assumptions.sitePreparation, 'sitePreparation');
  renderEditableList('material-assumptions-list', config.assumptions.materials, 'materials');
  renderEditableList('scope-limitations-list', config.assumptions.scopeLimitations, 'scopeLimitations');
  renderEditableList('environmental-limitations-list', config.assumptions.environmental, 'environmental');
}

// Add event listeners for add buttons
document.querySelectorAll('.add-assumption-btn').forEach(button => {
  button.addEventListener('click', function(event) {
    const listName = this.dataset.list;
    if (config.assumptions[listName]) {
      config.assumptions[listName].push('New item - edit this text');
      renderAssumptionsLists();
    }
  });
});
```

### 6. Measurement Methodology

#### Data Structure
```javascript
// Add to config
config.measurementMethodology = {
  standardUnit: "Square Foot/Hour",
  procedure: [
    "Measure height of wainscote from bottom edge to top edge",
    "Measure length of each wall section where wainscote is installed",
    "Multiply height by length for each section to calculate square footage",
    "Add all sections for total square footage",
    "Deduct openings larger than 2 square feet (doors, large built-ins)",
    "Do not deduct for electrical outlets, wall switches, or small interruptions"
  ],
  specialConsiderations: [
    "For irregular heights, measure at multiple points and use average height",
    "For curved walls, break into smaller sections approximately 2-3 feet wide and calculate each segment",
    "For inside corners, measure to the corner for each intersecting wall",
    "For outside corners, include return dimension in measurement",
    "For stairways, divide into triangular and rectangular sections for calculation"
  ],
  rateCalculation: [
    "Determine baseline production rate from tables based on complexity",
    "Apply adjustment factors for specific project conditions",
    "Calculate labor hours by dividing total square footage by adjusted production rate",
    "Add setup and cleanup time (typically 30-60 minutes per day)",
    "Add travel time between areas if applicable (typically 10-15 minutes per floor change)"
  ]
};
```

#### UI Implementation
1. Add a new section for measurement methodology:
```html
<div class="section">
  <div class="section-header">
    <h2>Measurement Methodology</h2>
    <button class="toggle-collapse-btn" data-target="measurement-content">▼</button>
  </div>
  <div id="measurement-content" class="section-content">
    <div class="measurement-unit-section">
      <h3>Standard Unit</h3>
      <input type="text" id="standard-unit-input" value="Square Foot/Hour">
    </div>
    
    <div class="measurement-section">
      <h3>Measurement Procedure</h3>
      <div id="measurement-procedure-list" class="editable-list"></div>
      <button class="add-measurement-item-btn" data-list="procedure">+ Add Step</button>
    </div>
    
    <div class="measurement-section">
      <h3>Special Calculation Considerations</h3>
      <div id="special-considerations-list" class="editable-list"></div>
      <button class="add-measurement-item-btn" data-list="specialConsiderations">+ Add Consideration</button>
    </div>
    
    <div class="measurement-section">
      <h3>Production Rate Calculation</h3>
      <div id="rate-calculation-list" class="editable-list"></div>
      <button class="add-measurement-item-btn" data-list="rateCalculation">+ Add Step</button>
    </div>
  </div>
</div>
```

2. Add rendering and event handling functions:
```javascript
function renderMeasurementMethodology() {
  document.getElementById('standard-unit-input').value = config.measurementMethodology.standardUnit;
  
  renderEditableList('measurement-procedure-list', config.measurementMethodology.procedure, 'procedure');
  renderEditableList('special-considerations-list', config.measurementMethodology.specialConsiderations, 'specialConsiderations');
  renderEditableList('rate-calculation-list', config.measurementMethodology.rateCalculation, 'rateCalculation');
}

// Add event listener for standard unit input
document.getElementById('standard-unit-input').addEventListener('change', function(event) {
  config.measurementMethodology.standardUnit = event.target.value;
});

// Add event listeners for add buttons
document.querySelectorAll('.add-measurement-item-btn').forEach(button => {
  button.addEventListener('click', function(event) {
    const listName = this.dataset.list;
    if (config.measurementMethodology[listName]) {
      config.measurementMethodology[listName].push('New step - edit this text');
      renderMeasurementMethodology();
    }
  });
});
```

### 7. Estimating Inspection Checklist

#### Data Structure
```javascript
// Add to config
config.inspectionChecklist = [
  {
    point: "Factory Primer Condition",
    description: "Assess coverage, adhesion, and uniformity of factory primer",
    commonIssues: "Thin spots, poor adhesion, inconsistent coverage",
    rateAdjustment: "Reduce rate by 20-30% if significant repriming needed",
    photoDocumentation: "Close-up of typical surface and any defects"
  },
  {
    point: "Bead Profile",
    description: "Measure depth and width of grooves, assess complexity",
    commonIssues: "Very deep grooves, intricate patterns, non-standard profiles",
    rateAdjustment: "Reduce rate by 15-25% for deep/complex patterns",
    photoDocumentation: "Photo with measuring tool for scale"
  },
  {
    point: "Surface Texture",
    description: "Feel surface for roughness, grain raise, or defects",
    commonIssues: "Rough texture, grain raise, debris in primer",
    rateAdjustment: "Reduce rate by 10-15% if significant sanding required",
    photoDocumentation: "Close-up showing texture"
  },
  {
    point: "Installation Quality",
    description: "Inspect seams, joints, and fastener setting",
    commonIssues: "Gaps at seams, proud fasteners, misaligned sections",
    rateAdjustment: "Reduce rate by 15-20% for poor installation",
    photoDocumentation: "Photos of problematic areas"
  }
];
```

#### UI Implementation
1. Add a new section for inspection checklist:
```html
<div class="section">
  <div class="section-header">
    <h2>Estimating Inspection Checklist</h2>
    <button class="toggle-collapse-btn" data-target="inspection-content">▼</button>
  </div>
  <div id="inspection-content" class="section-content">
    <div id="inspection-checklist-table">
      <table class="inspection-table">
        <thead>
          <tr>
            <th>Inspection Point</th>
            <th>Description</th>
            <th>Common Issues</th>
            <th>Rate Adjustment</th>
            <th>Photo Documentation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="inspection-checklist-body">
          <!-- Rows will be added here -->
        </tbody>
      </table>
    </div>
    <button id="add-inspection-point-btn">+ Add Inspection Point</button>
  </div>
</div>
```

2. Add rendering and event handling functions:
```javascript
function renderInspectionChecklist() {
  const tableBody = document.getElementById('inspection-checklist-body');
  tableBody.innerHTML = '';
  
  config.inspectionChecklist.forEach((item, index) => {
    const row = document.createElement('tr');
    
    // Inspection Point
    const pointCell = document.createElement('td');
    const pointInput = document.createElement('input');
    pointInput.type = 'text';
    pointInput.value = item.point;
    pointInput.dataset.index = index;
    pointInput.dataset.field = 'point';
    pointInput.addEventListener('change', handleInspectionItemChange);
    pointCell.appendChild(pointInput);
    
    // Description
    const descCell = document.createElement('td');
    const descInput = document.createElement('textarea');
    descInput.value = item.description;
    descInput.dataset.index = index;
    descInput.dataset.field = 'description';
    descInput.addEventListener('change', handleInspectionItemChange);
    descCell.appendChild(descInput);
    
    // Common Issues
    const issuesCell = document.createElement('td');
    const issuesInput = document.createElement('textarea');
    issuesInput.value = item.commonIssues;
    issuesInput.dataset.index = index;
    issuesInput.dataset.field = 'commonIssues';
    issuesInput.addEventListener('change', handleInspectionItemChange);
    issuesCell.appendChild(issuesInput);
    
    // Rate Adjustment
    const rateCell = document.createElement('td');
    const rateInput = document.createElement('textarea');
    rateInput.value = item.rateAdjustment;
    rateInput.dataset.index = index;
    rateInput.dataset.field = 'rateAdjustment';
    rateInput.addEventListener('change', handleInspectionItemChange);
    rateCell.appendChild(rateInput);
    
    // Photo Documentation
    const photoCell = document.createElement('td');
    const photoInput = document.createElement('textarea');
    photoInput.value = item.photoDocumentation;
    photoInput.dataset.index = index;
    photoInput.dataset.field = 'photoDocumentation';
    photoInput.addEventListener('change', handleInspectionItemChange);
    photoCell.appendChild(photoInput);
    
    // Actions
    const actionsCell = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.index = index;
    deleteBtn.addEventListener('click', handleDeleteInspectionItem);
    actionsCell.appendChild(deleteBtn);
    
    // Add all cells to row
    row.appendChild(pointCell);
    row.appendChild(descCell);
    row.appendChild(issuesCell);
    row.appendChild(rateCell);
    row.appendChild(photoCell);
    row.appendChild(actionsCell);
    
    tableBody.appendChild(row);
  });
}

function handleInspectionItemChange(event) {
  const input = event.target;
  const index = parseInt(input.dataset.index, 10);
  const field = input.dataset.field;
  
  if (config.inspectionChecklist[index] && field) {
    config.inspectionChecklist[index][field] = input.value;
  }
}

function handleDeleteInspectionItem(event) {
  const button = event.target;
  const index = parseInt(button.dataset.index, 10);
  
  if (index >= 0 && index < config.inspectionChecklist.length) {
    if (confirm('Are you sure you want to delete this inspection point?')) {
      config.inspectionChecklist.splice(index, 1);
      renderInspectionChecklist();
    }
  }
}

// Add event listener for add button
document.getElementById('add-inspection-point-btn').addEventListener('click', function() {
  const newItem = {
    point: "New Inspection Point",
    description: "Describe what to inspect",
    commonIssues: "List common issues found",
    rateAdjustment: "Describe how this affects production rate",
    photoDocumentation: "Describe required photos"
  };
  
  config.inspectionChecklist.push(newItem);
  renderInspectionChecklist();
});
```

## CSS Styling for New Elements

Add these styles to styles.css to support the new interface elements:

```css
/* SOP Groups Styling */
.sop-group-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.sop-group-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.sop-group-id {
  font-weight: bold;
  margin-right: 10px;
  color: #555;
}

.sop-group-name-input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-sequence-section {
  margin-bottom: 15px;
}

.task-sequence-list {
  margin: 10px 0;
}

.sequence-task-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  padding: 5px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.sequence-task-item span {
  flex-grow: 1;
}

.sequence-task-item button {
  margin-left: 5px;
  padding: 2px 5px;
  font-size: 0.8em;
}

.add-task-to-sequence {
  display: flex;
  margin-top: 10px;
}

.add-task-to-sequence select {
  flex-grow: 1;
  margin-right: 10px;
  padding: 5px;
}

.sop-group-details {
  display: flex;
  margin-bottom: 15px;
}

.sop-group-details > div {
  margin-right: 20px;
}

/* Complexity Level Styling */
.complexity-description {
  font-style: italic;
  color: #666;
  margin-top: 5px;
  font-size: 0.9em;
}

/* Method Details Styling */
.method-basic-info {
  display: flex;
  align-items: center;
}

.toggle-method-details-btn {
  margin-top: 5px;
  font-size: 0.9em;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 3px 8px;
  border-radius: 3px;
}

.method-details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
}

.method-details div {
  margin-bottom: 10px;
}

.method-details label {
  display: block;
  margin-bottom: 3px;
  font-weight: bold;
  font-size: 0.9em;
}

.method-details textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  resize: vertical;
  min-height: 40px;
}

.method-details input[type="text"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

/* Editable Lists Styling */
.editable-list {
  margin-bottom: 15px;
}

.editable-list-item {
  display: flex;
  margin-bottom: 8px;
}

.editable-list-item textarea {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 40px;
}

.delete-list-item-btn {
  margin-left: 5px;
  padding: 0 8px;
  background-color: #ffeeee;
  color: #c00;
  border: 1px solid #ffcccc;
  border-radius: 3px;
}

/* Inspection Checklist Styling */
.inspection-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

.inspection-table th {
  background-color: #f0f0f0;
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

.inspection-table td {
  padding: 8px;
  border: 1px solid #ddd;
  vertical-align: top;
}

.inspection-table input[type="text"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.inspection-table textarea {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
  resize: vertical;
  min-height: 40px;
}
```

## Implementation Strategy

To implement these interface elements, follow this phased approach:

### Phase 1: Data Model Extensions
1. Add the new data structures to the config object
2. Update the JSON import/export functions to handle the new data
3. Add backward compatibility for loading older configurations

### Phase 2: UI Implementation
1. Add the new sections to the HTML
2. Implement the rendering functions for each section
3. Add event handlers for user interactions

### Phase 3: Integration with Existing Features
1. Update the calculation logic to use complexity levels
2. Integrate SOP groups with task management
3. Connect the inspection checklist with the methodology page

### Phase 4: Testing and Refinement
1. Test with sample data from PDF specifications
2. Refine the UI based on usability feedback
3. Optimize performance for large datasets

## Conclusion

This implementation plan provides a comprehensive approach to incorporating all the missing data elements from the PDF specifications into the SOP Calculator interface. By following this plan, the application will be able to fully represent and manage the rich data contained in the PDF specifications, enabling more accurate and detailed production rate calculations and project planning.
