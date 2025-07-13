#!/bin/bash

# Development Setup Script for Smartboard Screen
# Sets up the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Smartboard Screen Development Environment${NC}"

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required, found: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your configuration${NC}"
fi

# Install root dependencies
echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
npm install

# Create directories if they don't exist
echo -e "${YELLOW}📁 Creating project structure...${NC}"
mkdir -p frontend/src/{components,hooks,services,types,utils,styles}
mkdir -p frontend/public
mkdir -p backend/src/{routes,services,middleware,config,types}
mkdir -p backend/dist

# Install all dependencies
echo -e "${YELLOW}📦 Installing all project dependencies...${NC}"
npm run install:all

echo -e "${GREEN}✅ Development environment setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Edit .env file with your configuration"
echo "2. Set up Google Cloud project (see docs/deployment.md)"
echo "3. Run 'npm run dev' to start development servers"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo -e "${BLUE}📚 Available commands:${NC}"
echo "  npm run dev          - Start development servers"
echo "  npm run build        - Build for production"
echo "  npm run test         - Run tests"
echo "  npm run lint         - Lint code"
echo "  npm run deploy       - Deploy to Google Cloud"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
