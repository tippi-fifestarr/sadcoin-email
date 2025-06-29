#!/bin/bash

# SADCOIN Frontend Health Check Script
# Usage: ./health-check.sh [url]

URL=${1:-"http://localhost:3000"}
TIMEOUT=10

echo "🏥 Checking SADCOIN Frontend health..."
echo "URL: $URL"
echo "Timeout: ${TIMEOUT}s"
echo "---"

# Check if the application is responding
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$URL" || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Application is healthy (HTTP $HTTP_CODE)"
    
    # Check if Docker container is running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Docker container is running"
    else
        echo "⚠️  Docker container may not be running properly"
    fi
    
    # Check memory usage
    MEMORY_USAGE=$(docker stats --no-stream --format "{{.MemPerc}}" sadcoin-email-sadcoin-frontend-1 2>/dev/null || echo "N/A")
    echo "📊 Memory usage: $MEMORY_USAGE"
    
    exit 0
else
    echo "❌ Application is not responding (HTTP $HTTP_CODE)"
    
    # Show recent logs if container is running
    if docker-compose ps | grep -q "sadcoin-frontend"; then
        echo "📋 Recent logs:"
        docker-compose logs --tail=10 sadcoin-frontend
    else
        echo "❌ Docker container is not running"
    fi
    
    exit 1
fi 