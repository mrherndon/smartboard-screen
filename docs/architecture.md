# Architecture Overview

## System Architecture

```chart
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Smartboard    │    │   Cloud Run     │    │   Firestore     │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • React App     │    │ • Node.js API   │    │ • Schedule Data │
│ • Clock Display │    │ • Auth Layer    │    │ • Config Data   │
│ • Schedule UI   │    │ • Data Sync     │    │ • User Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Architecture

### Frontend Components

```tree
App
├── BackgroundDisplay
├── ClockDisplay
│   ├── DigitalClock
│   └── TimeZoneSelector
├── ScheduleDisplay
│   ├── CurrentClass
│   ├── NextClass
│   ├── CountdownTimer
│   └── ScheduleList
└── AdminPanel
    ├── ScheduleManager
    ├── ConfigManager
    └── BackgroundManager
```

### Backend Services

```tree
API Layer
├── ScheduleController
├── ConfigController
├── AuthController
└── HealthController

Service Layer
├── ScheduleService
├── ConfigService
├── FirestoreService
└── ValidationService

Data Layer
├── ScheduleRepository
├── ConfigRepository
└── FirestoreClient
```

## Data Flow

1. **Initial Load**:

   - Frontend requests current config and schedule
   - Backend fetches from Firestore
   - Frontend initializes UI with data

2. **Real-time Updates**:

   - Frontend subscribes to Firestore changes
   - Schedule updates trigger UI refresh
   - Clock updates every second

3. **Admin Changes**:
   - Admin interface sends updates to backend
   - Backend validates and stores in Firestore
   - Changes propagate to display via Firestore listeners

## Security Model

- **Public Access**: Display functionality (read-only)
- **Admin Access**: Schedule management (authenticated)
- **API Keys**: Google Cloud services authentication
- **CORS**: Restricted to known origins

## Deployment Architecture

```tree
Internet
    │
    ▼
Google Cloud Load Balancer
    │
    ▼
Cloud Run Instance
    │
    ├── Frontend (Static Files)
    └── Backend API
        │
        ▼
    Firestore Database
```

## Scalability Considerations

- **Frontend**: Static files served via CDN
- **Backend**: Auto-scaling Cloud Run instances
- **Database**: Firestore handles scaling automatically
- **Caching**: Browser cache for static assets, Redis for API responses if needed

## Monitoring & Observability

- **Health Checks**: Backend /health endpoint
- **Logging**: Cloud Logging for errors and requests
- **Metrics**: Response times, error rates, database queries
- **Alerts**: Service downtime, error spikes
