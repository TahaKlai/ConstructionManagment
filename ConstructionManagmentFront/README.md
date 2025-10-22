# Construction Management Web Application

This project is a comprehensive web application for construction project management, built with Angular for the frontend and Spring Boot for the backend.

## Project Overview

This application helps construction companies manage projects with features including:
- Project setup and tracking
- Budget management
- Task and milestone tracking
- Invoice management
- Supplier database
- Worked hours tracking
- Amendment management

## Features

1. **Authentication Module**
   - Login functionality
   - Registration functionality
   - Role-based authorization (Admin/User/Reader)

2. **Project Management**
   - Project listing, creation, editing, and deletion
   - Project details view with dashboard
   - Excel import/export for project data

3. **Budget & Financial Management**
   - Budget lines tracking
   - Invoice management
   - Payment terms tracking
   - Cash flow analysis

4. **Task Management**
   - Task listing and progress tracking
   - Milestones management
   - Gantt chart visualization

5. **Suppliers Management**
   - Supplier database with contact information
   - Supplier association with invoices

6. **Worked Hours Management**
   - Weekly worked hours entry
   - Hours analysis by task/project

7. **Dashboard & Reporting**
   - S-curves (planned vs. realized)
   - Budget analysis
   - Project progress visualization

## Development

### Prerequisites
- Node.js and npm
- Angular CLI (`npm install -g @angular/cli`)
- Running Spring Boot backend on port 8090 (or adjust the proxy.conf.json accordingly)

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server with proxy config for backend
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Building for Production

```bash
# Build for production
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Backend Integration

The application is configured to connect to the Spring Boot backend running at `http://localhost:8090` via a proxy configuration in `proxy.conf.json`. The backend provides RESTful APIs for all functionality.

## Technical Stack

- **Frontend**: Angular (v20.3.0)
- **UI Components**: Bootstrap 5 + custom components
- **Authentication**: JWT-based authentication
- **Data Visualization**: Chart.js via ng2-charts
- **Excel Handling**: SheetJS (xlsx)
- **Backend**: Spring Boot with MySQL database

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
