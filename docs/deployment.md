# Deployment Guide

## Prerequisites

1. **Google Cloud Account**: Set up billing and enable required APIs
2. **Google Cloud CLI**: Install and authenticate
3. **Docker**: For building containers
4. **Node.js 18+**: For local development

## Google Cloud Setup

### 1. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Create Firestore Database

```bash
gcloud firestore databases create --region=us-central1
```

### 3. Set Environment Variables

```bash
export PROJECT_ID="your-project-id"
export REGION="us-central1"
export SERVICE_NAME="smartboard-screen"
```

## Local Development Setup

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Set Up Environment Files

Create `.env` files in both frontend and backend directories:

**frontend/.env:**

```bash
VITE_API_URL=http://localhost:8080/api
VITE_FIREBASE_CONFIG={"projectId":"your-project-id","..."}
```

**backend/.env:**

```bash
PORT=8080
NODE_ENV=development
GOOGLE_CLOUD_PROJECT=your-project-id
FIREBASE_CONFIG={"projectId":"your-project-id","..."}
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Start Development Servers

```bash
npm run dev
```

## Production Deployment

### 1. Build Application

```bash
npm run build
```

### 2. Deploy to Cloud Run

```bash
# Deploy backend
gcloud run deploy smartboard-api \
  --source ./backend \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

# Deploy frontend
gcloud run deploy smartboard-frontend \
  --source ./frontend \
  --region $REGION \
  --allow-unauthenticated
```

### 3. Configure Custom Domain (Optional)

```bash
gcloud run domain-mappings create \
  --service smartboard-frontend \
  --domain your-domain.com \
  --region $REGION
```

## Environment Configuration

### Production Environment Variables

**Backend:**

- `NODE_ENV=production`
- `GOOGLE_CLOUD_PROJECT=your-project-id`
- `JWT_SECRET=secure-random-string`
- `CORS_ORIGIN=https://your-domain.com`

**Frontend:**

- `VITE_API_URL=https://your-api-domain.com/api`
- `VITE_FIREBASE_CONFIG={"projectId":"...","...}`

## Security Configuration

### 1. IAM Permissions

Create a service account for the application:

```bash
gcloud iam service-accounts create smartboard-service \
  --display-name="Smartboard Service Account"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:smartboard-service@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

### 2. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for schedule and config
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Monitoring Setup

### 1. Health Check Endpoint

The backend includes a health check at `/api/health` for monitoring.

### 2. Uptime Monitoring

Set up Cloud Monitoring uptime checks:

```bash
gcloud alpha monitoring uptime create \
  --display-name="Smartboard Health Check" \
  --http-check-path="/api/health" \
  --hostname="your-api-domain.com"
```

## Backup Strategy

### 1. Firestore Backup

Enable automatic backups:

```bash
gcloud firestore backups schedules create \
  --database='(default)' \
  --recurrence=daily \
  --retention=7d
```

### 2. Code Backup

- Source code in Git repository
- Container images in Google Container Registry
- Configuration in Cloud Secret Manager

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS_ORIGIN environment variable
2. **Firestore Permissions**: Verify service account has datastore.user role
3. **Build Failures**: Check Node.js version compatibility
4. **Memory Issues**: Increase Cloud Run memory allocation

### Logs Access

```bash
# Backend logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=smartboard-api" --limit 50

# Frontend logs
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=smartboard-frontend" --limit 50
```

## Cost Optimization

- Use Cloud Run minimum instances: 0 (cold starts acceptable for this use case)
- Firestore: Optimize queries and document structure
- Cloud Storage: Use appropriate storage classes for static assets
- Monitor usage with Cloud Billing alerts

## Scaling Considerations

- Cloud Run auto-scales based on traffic
- Firestore scales automatically
- Consider CDN for static assets if global deployment needed
- Monitor concurrent connections and adjust Cloud Run settings

## Markdown Standards

To ensure clean documentation and avoid markdown lint warnings:

- Always use a blank line before and after lists.
- Always specify the language for code fences (e.g., `bash,`json, ```javascript).
- Always use a blank line before and after code fences.
- Do not use emphasis as a heading.
- Avoid trailing spaces and ensure proper indentation.
- Use semantic headings and keep heading levels consistent.

This project follows these markdown standards in all documentation and code comments.
