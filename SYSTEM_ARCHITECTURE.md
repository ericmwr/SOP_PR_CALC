# Painting Estimation System Architecture

## Introduction

This document outlines the architecture for a complete painting estimation system, starting with the SOP Calculator tool and expanding to a full project management solution. It's designed to be beginner-friendly while providing a comprehensive roadmap for development.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Applications                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ SOP Calculator│  │Project Entry │  │Estimation Dashboard  │   │
│  │ (Data Prep)   │  │ Interface    │  │                      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└───────────┬─────────────────┬────────────────────┬──────────────┘
            │                 │                    │
            ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                           API Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────┐ │
│  │ SOP API      │  │ Project API  │  │ Estimate API │  │ Auth │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────┘ │
└───────────┬─────────────────┬────────────────────┬──────────────┘
            │                 │                    │
            ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Storage Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ PostgreSQL   │  │ MongoDB      │  │ File Storage │           │
│  │ (Relational) │  │ (Flexible)   │  │ (Documents)  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## 1. System Overview

The painting estimation system consists of three main layers:

### Client Applications
These are the interfaces users interact with:
- **SOP Calculator**: The current tool for preparing Standard Operating Procedure data
- **Project Entry Interface**: Where estimators enter project details and measurements
- **Estimation Dashboard**: For managing estimates, proposals, and projects

### API Layer
This middle layer handles communication between the user interfaces and the data storage:
- **SOP API**: Manages Standard Operating Procedures and tasks
- **Project API**: Handles project details and measurements
- **Estimate API**: Processes calculations and generates estimates
- **Auth API**: Manages users, permissions, and security

### Data Storage Layer
This is where all the information is stored:
- **PostgreSQL**: For structured data with relationships
- **MongoDB**: For flexible, document-style data
- **File Storage**: For PDFs, images, and document templates

## 2. Data Storage Strategy (The "Where")

### PostgreSQL Database
**What it is**: A traditional relational database that excels at structured data with clear relationships.

**What it stores**:
- Users and their permissions
- Companies and contractor profiles
- Projects and their basic details
- SOP templates and their relationships
- Tasks and their core attributes
- Materials catalog and pricing
- Estimates and their line items
- Document tracking information

**Why use it**: When data has clear relationships and needs strict validation. For example, every task must belong to an SOP, and every project must have an owner.

### MongoDB Database
**What it is**: A flexible "document database" that doesn't require a fixed structure.

**What it stores**:
- Detailed SOP descriptions and methodologies
- Custom fields for tasks and methods
- User preferences and settings
- Contractor-specific modifications
- Historical calculation data
- Change history and audit logs

**Why use it**: When data structure might vary or when you need to store large text blocks efficiently. For example, different contractors might track different custom fields for the same task type.

### File Storage System
**What it is**: A system for storing and retrieving files (like Amazon S3 or a local file server).

**What it stores**:
- Original PDF specifications
- Generated PDF documents (estimates, proposals)
- Company logos and branding assets
- Document templates
- Project photos and attachments

**Why use it**: For actual files that need to be downloaded, viewed, or shared.

## 3. SOP Calculator Tool Role (The "Now")

Your current SOP Calculator fits into this architecture as the data preparation component:

### PDF Upload & Parsing
- Upload PDF specification documents
- Extract text and structure automatically
- Present the extracted data for verification

### Data Cleaning & Adjustment
- Edit the extracted information
- Adjust production rates and factors
- Organize everything into the proper structure

### Multi-format Export
- **JSON export**: For importing into the database
- **XML export**: For generating formatted PDFs
- **CSV export**: For spreadsheet analysis and backup

## 4. Document Generation System (The "Output")

For creating professional PDFs with custom branding:

### Template-Based Approach
- Store document templates as XML/XSLT files
- Allow customization of templates for each company
- Support variable substitution for company information

### PDF Generation Process
1. **Gather Data**: Pull all needed information from databases
2. **Apply Template**: Use the company's custom template
3. **Render PDF**: Generate the final document with proper formatting

### Customizable Branding
- Store company logos, colors, and fonts
- Create company-specific templates
- Allow selection of different templates for different documents

## 5. Project Estimation Workflow (The "How")

The complete workflow from project entry to final documents:

### 1. Project Entry
- Enter basic project information (client, location, etc.)
- Record measurements for each area
- Select which paintable items are included

### 2. SOP Selection
- System suggests appropriate SOPs based on the project
- Estimator selects and customizes SOPs as needed
- Adjusts factors based on specific project conditions

### 3. Calculation Engine
- Processes all measurements against selected SOPs
- Applies all relevant factors and adjustments
- Calculates labor hours and material quantities

### 4. Estimate Generation
- Compiles all calculations into a complete estimate
- Applies pricing rules, markups, and discounts
- Creates a customer-facing proposal

### 5. Document Production
- Generates professional PDF documents
- Applies the company's branding
- Creates internal work orders and contracts

## 6. Implementation Phases (The "When")

A step-by-step approach to building the complete system:

### Phase 1: Foundation (Current SOP Calculator)
- Complete the SOP Calculator for data preparation
- Implement PDF parsing and cleaning
- Add export capabilities (JSON/XML/CSV)

### Phase 2: Database Setup
- Set up PostgreSQL for structured data
- Set up MongoDB for flexible data
- Create tools to import data from SOP Calculator exports

### Phase 3: API Layer
- Build the communication layer for data access
- Implement user authentication and security
- Create endpoints for all major functions

### Phase 4: Project & Estimation Features
- Develop the project entry interface
- Build the calculation engine
- Create the estimate management system

### Phase 5: Document Generation
- Implement the template system
- Build the PDF generation pipeline
- Add branding customization features

## 7. Technical Components (The "With What")

The key technologies for each part of the system:

### Backend Technologies
- **API Framework**: Node.js with Express or Python with FastAPI
- **PostgreSQL**: For relational data
- **MongoDB**: For flexible document storage
- **Redis**: For caching and temporary data
- **Storage**: For documents and assets

### Document Generation
- **XML Processing**: For handling structured data
- **XSLT Processor**: For applying templates
- **PDF Generation**: For creating final documents
- **Template Engine**: For variable substitution

### Frontend Technologies
- **Framework**: React or Vue.js for building interfaces
- **State Management**: For handling complex application state
- **UI Components**: For consistent look and feel
- **PDF Viewer**: For displaying documents in the browser

## 8. Next Steps for SOP Calculator (The "Next")

To prepare your current tool for this architecture:

### 1. Enhance PDF Parsing
- Implement the recommendations from FUTURE_UPDATES.md
- Focus on extracting structured data from PDFs

### 2. Add XML Export
- Create a schema for your SOP data
- Implement XML export alongside JSON/CSV

### 3. Create Simple PDF Generation
- Add basic XML-to-PDF functionality
- Start with simple templates for documentation

### 4. Prepare for Database Integration
- Structure exports to match future database schema
- Add validation to ensure data quality

## 9. Glossary of Terms

- **SOP**: Standard Operating Procedure - A defined process for completing a specific type of work
- **API**: Application Programming Interface - How different parts of the system communicate
- **PostgreSQL**: A powerful relational database system
- **MongoDB**: A flexible document-oriented database
- **XML**: eXtensible Markup Language - A format for structured data
- **XSLT**: XML Stylesheet Language Transformations - Templates for converting XML to other formats
- **JSON**: JavaScript Object Notation - A lightweight data format
- **CSV**: Comma-Separated Values - A simple spreadsheet-like format
