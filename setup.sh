#!/bin/bash

# ConflictCoach AI - Setup Script
# This script helps you set up the Next.js application

echo "🚀 ConflictCoach AI - Setup Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and add your API keys:"
    echo "   - GOOGLE_GEMINI_API_KEY"
    echo "   - NEXT_PUBLIC_AGENT_ID_1 through NEXT_PUBLIC_AGENT_ID_6"
    echo ""
else
    echo "✅ .env.local exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
echo ""

if command -v bun &> /dev/null; then
    echo "Using Bun..."
    bun install
else
    echo "Using npm..."
    npm install
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Check if Next.js was installed
if [ -d "node_modules/next" ]; then
    echo "✅ Next.js installed successfully"
else
    echo "❌ Next.js installation failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Setup: See SETUP.md"
echo "   - ElevenLabs: See ELEVENLABS_INTEGRATION.md"
echo "   - Quick Reference: See QUICK_REFERENCE.md"
echo ""
echo "Happy coding! 🎯"
