# Smartboard Screen Application

A web application for displaying a background image, clock, and class schedule countdown on a smartboard or display screen.

## Project Structure

```text
smartboard-screen/
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── shared/           # Shared types and utilities
├── docs/             # Documentation and context
└── deployment/       # Google Cloud deployment configurations
```

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: Google Cloud Firestore
- **Deployment**: Google Cloud Run
- **Styling**: CSS Modules / Styled Components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud CLI (for deployment)

### Development Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Start development servers:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) for frontend
4. Backend API runs on [http://localhost:8080](http://localhost:8080)

## Current Status

🎯 **Foundation Complete** - All boilerplate and context engineering is set up!

### ✅ What's Done

- 📁 Complete project structure (frontend/backend/shared/docs)
- 📋 Comprehensive AI context documentation
- 🔧 TypeScript configuration and shared types
- 🎨 CSS foundation with responsive design
- 📦 Package configuration for monorepo
- 🚀 Google Cloud deployment scripts
- 📖 Complete API documentation
- 🏗️ Architecture planning

### 🎯 Updated Requirements Captured

- **Multi-resolution fullscreen display** with adjustable contrast skrims
- **Analog + Digital clock options** (12h format, browser timezone)
- **Background image system** with upload, groups, and rotation
- **Multi-user schedules** with Google SSO authentication
- **Weekly schedule builder** for different users/schools
- **Web-based admin interface** for all management

### 🔄 Next Development Phase

Ready for component implementation! The AI assistant now has complete context to efficiently build:

1. **Clock Components** (analog/digital with timezone handling)
2. **Schedule Display** (real-time countdowns, current/next classes)
3. **Background Manager** (upload, grouping, rotation logic)
4. **Admin Interface** (schedule builder, settings, user management)
5. **Google Authentication** (SSO integration)
6. **Real-time Data Sync** (Firestore integration)

## Features

- 🖼️ Customizable background images
- 🕐 Real-time clock display
- 📅 Class schedule with countdown timers
- 📱 Responsive design for various screen sizes
- ⚙️ Admin interface for schedule management
- ☁️ Google Cloud integration

## Environment Variables

See `.env.example` files in frontend and backend directories.

## Deployment

Deploy to Google Cloud Run:

```bash
npm run deploy
```

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Copilot Instructions](./.github/copilot-instructions.md)
- [Deployment Guide](./docs/deployment.md)
