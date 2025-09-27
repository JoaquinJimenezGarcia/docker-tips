#!/bin/bash

# Docker Tips Deployment Script
echo "🐳 Deploying Docker Tips Application..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file from template..."
    echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
    echo "📝 Please edit .env file and add your Gemini API key"
    echo "   Then run this script again."
    exit 1
fi

# Load environment variables
source .env

# Check if GEMINI_API_KEY is set
if [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    echo "❌ Please set your GEMINI_API_KEY in the .env file"
    exit 1
fi

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker-compose down

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3030/api/docker-tip > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://localhost:3030"
    echo "📊 Health check: http://localhost:3030/api/docker-tip"
else
    echo "❌ Application failed to start. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi

# Show container status
echo "📋 Container status:"
docker-compose ps

# Show logs
echo "📝 Recent logs:"
docker-compose logs --tail=20

echo "🎉 Deployment completed!"
echo ""
echo "📚 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop app:  docker-compose down"
echo "   Restart:   docker-compose restart"
echo "   Update:    ./deploy.sh"

