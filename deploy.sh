#!/bin/bash

# SADCOIN Frontend Deployment Script for Linode VPS
# Make sure to run: chmod +x deploy.sh

set -e

echo "🚀 Starting SADCOIN Frontend Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file based on env.example"
    echo "Required variables:"
    echo "  - NEXT_PUBLIC_PROJECT_ID (WalletConnect Project ID)"
    echo "  - GOOGLE_API_KEY (Google Gemini API Key)"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$NEXT_PUBLIC_PROJECT_ID" ]; then
    echo "❌ NEXT_PUBLIC_PROJECT_ID is not set in .env file"
    exit 1
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "❌ GOOGLE_API_KEY is not set in .env file"
    exit 1
fi

echo "✅ Environment variables validated"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Remove old images to save space
echo "🧹 Cleaning up old Docker images..."
docker image prune -f || true

# Build and start the application
echo "🏗️  Building and starting SADCOIN Frontend..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ SADCOIN Frontend is running successfully!"
    echo "🌐 Application is available at: http://localhost:3000"
    echo "📊 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Failed to start the application"
    echo "📋 Checking logs..."
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!" 