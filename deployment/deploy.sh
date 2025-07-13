#!/bin/bash

# Smartboard Screen Deployment Script
# Deploys both frontend and backend to Google Cloud Run

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT:-""}
REGION=${REGION:-"us-central1"}
FRONTEND_SERVICE="smartboard-frontend"
BACKEND_SERVICE="smartboard-api"

echo -e "${GREEN}🚀 Starting Smartboard Screen Deployment${NC}"

# Check prerequisites
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ GOOGLE_CLOUD_PROJECT environment variable not set${NC}"
    echo "Please set it with: export GOOGLE_CLOUD_PROJECT=your-project-id"
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud CLI not found${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Authenticate and set project
echo -e "${YELLOW}🔐 Setting up Google Cloud project...${NC}"
gcloud config set project $PROJECT_ID

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Deploy backend
echo -e "${YELLOW}🚀 Deploying backend API...${NC}"
gcloud run deploy $BACKEND_SERVICE \
    --source ./backend \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --port=8080

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format='value(status.url)')
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

# Deploy frontend with backend URL
echo -e "${YELLOW}🚀 Deploying frontend...${NC}"
gcloud run deploy $FRONTEND_SERVICE \
    --source ./frontend \
    --region $REGION \
    --allow-unauthenticated \
    --set-env-vars="VITE_API_URL=$BACKEND_URL/api" \
    --memory=256Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=5 \
    --timeout=300 \
    --port=3000

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format='value(status.url)')
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"

# Update backend CORS settings
echo -e "${YELLOW}🔧 Updating CORS settings...${NC}"
gcloud run services update $BACKEND_SERVICE \
    --region $REGION \
    --set-env-vars="NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,CORS_ORIGIN=$FRONTEND_URL"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📱 Application URL: $FRONTEND_URL${NC}"
echo -e "${GREEN}🔗 API URL: $BACKEND_URL${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Set up custom domain (optional)"
echo "2. Configure monitoring and alerts"
echo "3. Set up automated backups"
echo "4. Test the application thoroughly"
