# Copilot Instructions for Smartboard Screen Application

This document provides comprehensive context for GitHub Copilot when working on the Smartboard Screen application.

## Project Overview

**Purpose**: A web application designed to run on classroom smartboards/displays showing:

- Background image (customizable)
- Real-time clock
- Class schedule with countdown timers

**Target Environment**:

- Classroom displays/smartboards
- Potentially fullscreen/kiosk mode
- Always-on display application

## User Requirements (Updated)

### Display Specifications

- **Multiple screen resolutions**: Responsive design required
- **Fullscreen/Kiosk mode**: Always-on display application
- **Background dominance**: Background image is primary visual element
- **Contrast handling**: UI components need adjustable background scrims for readability

### Clock Requirements

- **Analog clock preferred** (12-hour format)
- **Digital option available**: Switchable between analog/digital
- **Timezone**: Browser/local timezone display
- **Style**: Needs background scrim for visibility over images

### Background Image System

- **Upload capability**: Settings page for image management
- **Selection options**: Choose individual images or rotation groups
- **Rotation feature**: Periodic cycling through selected images
- **Grouping system**: Organize images by mood/season/theme
- **Multi-user**: Different users can have different image collections

### Schedule Management

- **Multi-user system**: Separate schedules for different users (wife + user)
- **Weekly schedule builder**: Each day can have different schedule
- **Settings page**: Full CRUD interface for schedule management
- **School-specific**: Different schools/locations support
- **Flexible timing**: Custom start/end times per class

### Authentication & Access

- **Google SSO**: Primary authentication method
- **Web-based access**: Browser-accessible admin interface
- **Multi-user support**: Different users, different schedules
- **Permission levels**: Admin vs. view-only access

### Technical Implications

- **User profiles**: User-specific configurations and schedules
- **Image storage**: Google Cloud Storage for uploaded images
- **Authentication**: Google OAuth 2.0 integration
- **Real-time sync**: Multiple users can update schedules
- **Responsive UI**: Works on phones/tablets for schedule management

## Technical Architecture

### Stack Decisions & Rationale

**Frontend: React + TypeScript + Vite**

- React for component-based UI matching the modular design requirement
- TypeScript for better development experience and type safety
- Vite for fast development and modern build tooling

**Backend: Node.js + Express + TypeScript**

- JavaScript ecosystem for consistency with frontend
- Express for simple, familiar API structure
- TypeScript for shared types between frontend/backend

**Database: Google Cloud Firestore**

- NoSQL document database (perfect for schedule data)
- Real-time capabilities for live updates
- Minimal setup and maintenance
- Generous free tier
- Native Google Cloud integration

**Deployment: Google Cloud Run**

- Serverless containers (easy scaling)
- Pay-per-use pricing model
- Simple deployment from containers
- Built-in HTTPS and custom domains

### Key Design Principles

1. **Simplicity**: Minimal configuration, easy to deploy and maintain
2. **Modularity**: Components can be easily modified or replaced
3. **Real-time**: Updates without page refresh
4. **Responsive**: Works on various screen sizes
5. **Reliable**: Designed for always-on operation

## Data Models

### Schedule Entry

```typescript
interface ScheduleEntry {
  id: string;
  title: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  location?: string;
  instructor?: string;
  isActive: boolean;
  color?: string; // Hex color for UI theming
  userId: string; // Owner of this schedule entry
  schoolId?: string; // Optional school/location identifier
  notes?: string; // Additional notes
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}
```

### Configuration

```typescript
interface AppConfig {
  id: string;
  userId: string; // Owner of this configuration
  backgroundImageUrl?: string;
  backgroundRotation: {
    enabled: boolean;
    interval: number; // minutes
    groupId?: string; // ID of image group to rotate through
  };
  clockFormat: "12h" | "24h";
  clockStyle: "analog" | "digital";
  timezone: string;
  theme: "light" | "dark";
  refreshInterval: number; // seconds
  displaySettings: {
    showLocation: boolean;
    showInstructor: boolean;
    countdownFormat: "full" | "compact";
    showNextClass: boolean;
    maxUpcomingClasses: number;
    skrimOpacity: number; // 0-1 for background contrast
    skrimColor: string; // Color for background skrims
  };
  createdAt: string;
  updatedAt: string;
}
```

### User Management

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: "admin" | "user";
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

interface ImageGroup {
  id: string;
  name: string;
  description?: string;
  userId: string;
  imageIds: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackgroundImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  size: number; // bytes
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}
```

## Project Structure

### Monorepo Layout

```
smartboard-screen/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Clock/    # Clock display component
│   │   │   ├── Schedule/ # Schedule and countdown components
│   │   │   └── Background/ # Background image component
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API communication
│   │   ├── types/        # TypeScript definitions
│   │   ├── utils/        # Helper functions
│   │   └── styles/       # Global styles and themes
│   └── package.json
├── backend/           # Node.js/Express backend API
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration management
│   │   └── types/        # TypeScript definitions
│   ├── Dockerfile        # Container configuration
│   └── package.json
├── shared/            # Shared types and utilities
│   ├── src/
│   │   ├── types.ts      # Shared TypeScript definitions
│   │   └── utils.ts      # Shared utility functions
│   └── package.json
└── docs/              # Documentation
    ├── architecture.md
    ├── api.md
    └── deployment.md
```

## Common Development Patterns

### State Management

- Use React Context for global state (config, current time)
- Local component state for UI-specific state
- React Query for server state management

### Real-time Updates

- Firestore real-time listeners for schedule changes
- setInterval for clock updates
- WebSocket fallback if needed

### Error Handling

- Toast notifications for user-facing errors
- Comprehensive logging for debugging
- Graceful degradation for network issues

### Component Patterns

```typescript
// Component with proper TypeScript and error boundaries
interface ComponentProps {
  // Always define props interface
}

export function Component({ prop }: ComponentProps) {
  // Use proper hooks and error handling
  return <div className="component-class">{/* Use semantic HTML */}</div>;
}
```

### API Patterns

```typescript
// Service functions with proper error handling
export async function fetchSchedule(): Promise<ScheduleEntry[]> {
  try {
    const response = await fetch("/api/schedule");
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

## Styling Guidelines

### CSS Architecture

- Global styles in `styles/globals.css`
- Component-specific styles using CSS classes
- Responsive design with mobile-first approach
- Contrast skrims for text over background images

### Design Tokens

```css
/* Colors */
--color-primary: #3b82f6;
--color-secondary: #6b7280;
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;

/* Skrims for contrast */
--skim-dark: rgba(0, 0, 0, 0.7);
--skim-light: rgba(255, 255, 255, 0.9);
```

## Environment Configuration

### Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: Firestore Emulator (when available)

### Production

- Frontend: Served from Cloud Run
- Backend: Cloud Run container
- Database: Cloud Firestore

## Security Considerations

- API authentication for admin functions
- CORS configuration for frontend/backend communication
- Input validation and sanitization
- Rate limiting on API endpoints
- Google OAuth integration for user authentication

## Performance Considerations

- Image optimization for backgrounds
- Efficient countdown calculations
- Minimal re-renders with React.memo
- Bundle splitting for faster initial loads
- Real-time updates via Firestore listeners

## Common Issues & Solutions

### Clock Accuracy

- Use server time synchronization
- Handle timezone changes
- Account for daylight saving time

### Display Sleep/Wake

- CSS prevent screen sleep
- Keep-alive ping to prevent hibernation
- Wake-on-LAN capability

### Network Reliability

- Offline fallback with cached data
- Retry logic for failed requests
- Connection status indicator

## API Endpoints

```
GET    /api/schedule          # Get current schedule
POST   /api/schedule          # Create schedule entry
PUT    /api/schedule/:id      # Update schedule entry
DELETE /api/schedule/:id      # Delete schedule entry
GET    /api/config            # Get app configuration
PUT    /api/config            # Update app configuration
GET    /api/images            # Get background images
POST   /api/images            # Upload background image
GET    /api/auth/verify       # Verify authentication
POST   /api/auth/login        # Login with Google OAuth
GET    /api/health            # Health check
```

## Development Commands

```bash
# Root commands
npm run dev          # Start both frontend & backend
npm run build        # Build both for production
npm run deploy       # Deploy to Google Cloud
npm run install:all  # Install all dependencies

# Individual services
cd frontend && npm run dev    # Just frontend
cd backend && npm run dev     # Just backend
cd shared && npm run build    # Build shared package
```

## Testing Strategy

- Unit tests for utilities and pure functions
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows

## Git Workflow

- Use semantic commit messages
- Create feature branches for new functionality
- Use pull requests for code review
- Automated deployment via GitHub Actions (when configured)

## Markdown Standards

To ensure clean documentation and avoid markdown lint warnings:

- Always use a blank line before and after lists.
- Always specify the language for code fences (e.g., `bash, `json, ```javascript).
- Always use a blank line before and after code fences.
- Do not use emphasis as a heading.
- Avoid trailing spaces and ensure proper indentation.
- Use semantic headings and keep heading levels consistent.

This project follows these markdown standards in all documentation and code comments.

This context should help GitHub Copilot understand the project structure, make appropriate technical decisions, and maintain consistency with the established patterns.
