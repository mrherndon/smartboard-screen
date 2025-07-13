# AI Context Document

This document provides comprehensive context for AI assistants working on the Smartboard Screen application.

## Project Overview

**Purpose**: A web application designed to run on classroom smartboards/displays showing:

- Background image (customizable)
- Real-time clock
- Class schedule with countdown timers

**Target Environment**:

- Classroom displays/smartboards
- Potentially fullscreen/kiosk mode
- Always-on display application

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
	color?: string; // For UI theming
}
```

### Configuration

```typescript
interface AppConfig {
	id: string;
	backgroundImageUrl?: string;
	clockFormat: "12h" | "24h";
	timezone: string;
	theme: "light" | "dark";
	refreshInterval: number; // seconds
	displaySettings: {
		showLocation: boolean;
		showInstructor: boolean;
		countdownFormat: "full" | "compact";
	};
}
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

## File Structure Context

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Clock/          # Clock display component
│   │   ├── Schedule/       # Schedule and countdown components
│   │   └── Background/     # Background image component
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API communication
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Helper functions
│   └── styles/             # Global styles and themes
├── public/                 # Static assets
└── package.json

backend/
├── src/
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration management
│   └── types/              # TypeScript definitions
├── Dockerfile              # Container configuration
└── package.json

shared/
├── types/                  # Shared TypeScript definitions
└── utils/                  # Shared utility functions
```

## Environment Configuration

### Development

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: Firestore Emulator

### Production

- Frontend: Served from Cloud Run
- Backend: Cloud Run container
- Database: Cloud Firestore

## Security Considerations

- API authentication for admin functions
- CORS configuration for frontend/backend communication
- Input validation and sanitization
- Rate limiting on API endpoints

## Performance Considerations

- Image optimization for backgrounds
- Efficient countdown calculations
- Minimal re-renders with React.memo
- Bundle splitting for faster initial loads

## Deployment Strategy

1. **Development**: Local development with hot reload
2. **Staging**: Cloud Run deployment with test data
3. **Production**: Cloud Run with production Firestore

## Future Enhancement Ideas

- Multiple schedule support (different classes/rooms)
- Weather integration
- Announcement banner
- Touch interface for basic controls
- Mobile companion app for schedule management
- Integration with school management systems

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

## API Endpoints (Planned)

```
GET    /api/schedule          # Get current schedule
POST   /api/schedule          # Create schedule entry
PUT    /api/schedule/:id      # Update schedule entry
DELETE /api/schedule/:id      # Delete schedule entry
GET    /api/config            # Get app configuration
PUT    /api/config            # Update app configuration
GET    /api/health            # Health check
```

## Testing Strategy

- Unit tests for utilities and pure functions
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows

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
