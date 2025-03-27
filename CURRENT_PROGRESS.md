# SOP Calculator - Current Progress

## Project Overview
The SOP (Standard Operating Procedure) Calculator is a web application designed to help calculate production rates for various tasks in construction painting projects. It allows users to manage tasks, apply factors that affect production rates, and calculate estimated time and costs.

## Current Features

### 1. SOP Details Management
- Edit SOP name and description
- Save and load SOP configurations

### 2. Global Factors Management
- Add, edit, and delete global factors that affect production rates
- Each factor has a name and a multiplier range
- Automatic calculation of average multipliers

### 3. Task Management
- Add, edit, and delete tasks
- Each task includes:
  - Name
  - Selection status (included/excluded from calculations)
  - Multiple application methods with individual rates
  - Skill level required
  - Materials required
  - Factors affecting the task
  - Detailed description

### 4. Application Methods Management
- Define multiple application methods for each task
- Each method has its own name and production rate
- Select which method to use for calculations
- Add and delete methods as needed
- At least one method is always maintained per task

### 5. Task-Specific Factor Application
- Apply global factors to specific tasks
- Adjust factor multipliers for each task individually
- Visual editor for factor application

### 6. Calculation Features
- Automatic calculation of final production rate
- Uses the selected application method's rate for each task
- Estimated time to complete based on project area
- Estimated labor cost based on hourly rate

### 7. Import/Export Functionality
- Save configuration as JSON
- Export data as CSV files (multiple files for different aspects)
- Dedicated CSV export for application methods
- Load saved configurations
- Backward compatibility for loading older configurations

### 8. Improved UI Layout
- Sticky sidebar for important controls and results
- Configuration controls, project details, and results always visible while scrolling
- Responsive design with proper spacing and alignment
- Clear visual separation between main content and sidebar

## Recent Updates
- Fixed issue where task-specific factors were not displaying due to missing initial data
- Improved layout with centered content on the methodology page for better readability
- Added a dedicated Methodology & Checklist page for documenting measurement procedures and inspection criteria
- Implemented editable checklist table with add/delete row functionality
- Added save/load functionality specific to the methodology page content
- Created a seamless navigation between main SOP calculator and methodology pages
- Implemented a sticky sidebar layout to keep important controls and results visible
- Moved configuration, project details, and results sections to the sidebar
- Improved overall UI organization with a more intuitive layout
- Enhanced visual styling with proper spacing and shadows
- Implemented multiple application methods per task, replacing the single base rate
- Added UI for managing methods with radio button selection
- Updated calculation logic to use the selected method's rate
- Enhanced CSV export to include a dedicated task_methods.csv file
- Improved save/load functionality to handle the new data structure
- Added backward compatibility for loading older configurations

## Planned Improvements
- Integrate methodology checklist data with main SOP calculations
- Add reporting features that combine task data with methodology information
- Implement data visualization for production rates
- Add user authentication for saving configurations to the cloud
- Implement PDF upload and parsing functionality to extract data from PDF documents
- Add PDF export capability to generate professional, formatted PDF documents
- See FUTURE_UPDATES.md for detailed implementation plans for PDF features

## Technical Implementation
- Pure HTML, CSS, and JavaScript implementation
- No external libraries or frameworks required
- Responsive design for various screen sizes
- Local storage for configurations
