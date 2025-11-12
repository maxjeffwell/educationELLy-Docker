#!/bin/bash

# Development Deployment Script for educationELLy
# This script starts the application in development mode with hot reloading

set -e  # Exit on error

echo "🛠️  educationELLy Development Mode"
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Copy .env.example to .env and configure it"
    exit 1
fi

echo ""
echo "🛑 Stopping existing containers..."
docker-compose down

echo ""
echo "🚀 Starting development containers..."
docker-compose up

# Note: This runs in foreground to show logs
# Use Ctrl+C to stop
