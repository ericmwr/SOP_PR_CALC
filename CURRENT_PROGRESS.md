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
  - Base production rate (SF/HR)
  - Selection status (included/excluded from calculations)
  - Skill level required
  - Materials required
  - Application methods
  - Factors affecting the task
  - Detailed description

### 4. Task-Specific Factor Application
- Apply global factors to specific tasks
- Adjust factor multipliers for each task individually
- Visual editor for factor application

### 5. Calculation Features
- Automatic calculation of final production rate
- Estimated time to complete based on project area
- Estimated labor cost based on hourly rate

### 6. Import/Export Functionality
- Save configuration as JSON
- Export data as CSV files (multiple files for different aspects)
- Load saved configurations

## Recent Updates
- Added detailed task information fields (skill level, materials, application methods, factors affecting, description)
- Improved UI with a grid layout for task details
- Enhanced save/load functionality to handle the new fields
- Added backward compatibility for loading older configurations

## Planned Improvements
- Enhance the application methods section with standardized options
- Add reporting features
- Implement data visualization for production rates
- Add user authentication for saving configurations to the cloud

## Technical Implementation
- Pure HTML, CSS, and JavaScript implementation
- No external libraries or frameworks required
- Responsive design for various screen sizes
- Local storage for configurations
