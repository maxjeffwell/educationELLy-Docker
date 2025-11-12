#!/bin/bash

# Production Deployment Script for educationELLy
# This script deploys the application using production configuration

set -e  # Exit on error

echo "🚀 educationELLy Production Deployment"
echo "======================================"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ Error: .env.production file not found!"
    echo "📝 Copy .env.production.example to .env.production and configure it"
    exit 1
fi

# Check if nginx SSL certificates exist (optional)
if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
    echo "⚠️  Warning: SSL certificates not found in nginx/ssl/"
    echo "   The application will run on HTTP only"
    echo "   For HTTPS, add cert.pem and key.pem to nginx/ssl/"
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

echo ""
echo "📦 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

echo ""
echo "🚀 Starting production containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

echo ""
echo "📊 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Production deployment complete!"
echo ""
echo "📝 View logs with:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🔍 Check health with:"
echo "   curl http://localhost/health"
