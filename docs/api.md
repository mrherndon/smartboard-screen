# API Documentation

## Base URL

- Development: `http://localhost:8080/api`
- Production: `https://your-app.run.app/api`

## Authentication

Admin endpoints require authentication via JWT token in Authorization header:

```text
Authorization: Bearer <token>
```

## Endpoints

### Schedule Management

#### GET /schedule

Get all active schedule entries for current day.

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "schedule_001",
			"title": "Mathematics",
			"startTime": "2025-07-12T09:00:00Z",
			"endTime": "2025-07-12T09:50:00Z",
			"dayOfWeek": 1,
			"location": "Room 101",
			"instructor": "Ms. Johnson",
			"isActive": true,
			"color": "#4F46E5"
		}
	]
}
```

#### POST /schedule

Create new schedule entry. (Admin only)

**Request:**

```json
{
	"title": "Physics",
	"startTime": "2025-07-12T10:00:00Z",
	"endTime": "2025-07-12T10:50:00Z",
	"dayOfWeek": 1,
	"location": "Lab 201",
	"instructor": "Dr. Smith",
	"color": "#059669"
}
```

#### PUT /schedule/:id

Update existing schedule entry. (Admin only)

#### DELETE /schedule/:id

Delete schedule entry. (Admin only)

### Configuration

#### GET /config

Get application configuration.

**Response:**

```json
{
	"success": true,
	"data": {
		"id": "main_config",
		"backgroundImageUrl": "https://example.com/background.jpg",
		"clockFormat": "12h",
		"timezone": "America/New_York",
		"theme": "dark",
		"refreshInterval": 30,
		"displaySettings": {
			"showLocation": true,
			"showInstructor": true,
			"countdownFormat": "full"
		}
	}
}
```

#### PUT /config

Update application configuration. (Admin only)

### Authentication Plan

#### POST /auth/login

Authenticate admin user.

**Request:**

```json
{
	"username": "admin",
	"password": "password"
}
```

**Response:**

```json
{
	"success": true,
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"expiresIn": 3600
	}
}
```

### Health Check

#### GET /health

Service health status.

**Response:**

```json
{
	"success": true,
	"data": {
		"status": "healthy",
		"timestamp": "2025-07-12T15:30:00Z",
		"version": "1.0.0",
		"database": "connected"
	}
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
	"success": false,
	"error": {
		"code": "VALIDATION_ERROR",
		"message": "Invalid input data",
		"details": {
			"field": "startTime",
			"reason": "Invalid date format"
		}
	}
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

- Public endpoints: 100 requests per minute
- Admin endpoints: 500 requests per minute
- Burst limit: 50 requests per 10 seconds
