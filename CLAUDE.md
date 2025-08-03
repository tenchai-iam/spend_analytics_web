# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Development with local environment
npm start

# Development with specific environment files
npm run start:dev        # Uses .env.dev
npm run start:staging    # Uses .env.staging
```

### Building the Application
```bash
# Production build
npm run build

# Environment-specific builds
npm run build:dev        # Uses .env.dev
npm run build:staging    # Uses .env.staging
```

### Testing
```bash
npm test
```

## Architecture Overview

This is a React-based spend analytics dashboard application with the following key architectural components:

### Frontend Stack
- **React 18** with React Router v6 for routing
- **React Query (TanStack Query)** for server state management and API data fetching
- **React Bootstrap** and custom CSS for UI components
- **Recharts** for data visualization charts
- **MapLibre GL** and **Deck.gl** for map visualizations
- **D3.js** for advanced data visualizations

### Application Structure

#### Core Application Flow
1. **Entry Point**: `src/index.js` → `src/App.js`
2. **Authentication**: Managed through `AuthContext` with JWT tokens stored in sessionStorage
3. **Protected Routes**: Three user levels (A, B, C) with role-based access control
   - Level A: Basic access
   - Level B: Extended access including Dashboard 3-5 and Upload
   - Level C: Full admin access

#### Key Directories
- **`src/ComponentsPage/`**: All page components and reusable UI components
  - Dashboard pages (Dashboard1-6)
  - Chart components (BarGraph, DonutChart, LineGraph, etc.)
  - Admin and Upload pages
- **`src/services/`**: API integration and authentication logic
  - `api.js`, `api_D1.js` through `api_D6.js`: Dashboard-specific API calls
  - `AuthContext.js`: Authentication state management
  - `ProtectedRoute.js`: Route protection based on user levels
- **`src/ComponentsStyles/`**: Component-specific CSS files
- **`public/`**: Static assets including map tiles and JSON data

### API Integration
- Base API URL configured via `REACT_APP_API_URL` environment variable
- Uses Axios for HTTP requests with timeout configurations
- API endpoints pattern: `${API_URL}/endpoint_name`
- Authentication via Bearer token in Authorization header

### Environment Configuration
The application supports multiple environments through `env-cmd`:
- `.env.dev` for development
- `.env.staging` for staging
- Production uses default environment variables

### Docker Deployment
- Multi-stage Docker build using a custom base image
- Nginx for serving the production build
- Configuration files expected in `.kaniko/web/nginx/`

### Code Quality
- SonarQube integration configured for JavaScript and CSS analysis
- Project key: `simpitec-analytics-spend-web`