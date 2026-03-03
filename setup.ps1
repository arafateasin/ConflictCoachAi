# ConflictCoach AI - Setup Script (Windows)
# This script helps you set up the Next.js application

Write-Host "🚀 ConflictCoach AI - Setup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Created .env.local" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env.local and add your API keys:" -ForegroundColor Yellow
    Write-Host "   - GOOGLE_GEMINI_API_KEY" -ForegroundColor Yellow
    Write-Host "   - NEXT_PUBLIC_AGENT_ID_1 through NEXT_PUBLIC_AGENT_ID_6" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
    Write-Host ""
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

# Check if bun is available
try {
    $bunVersion = bun -v
    Write-Host "Using Bun $bunVersion..." -ForegroundColor Cyan
    bun install
} catch {
    Write-Host "Using npm..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Check if Next.js was installed
if (Test-Path "node_modules\next") {
    Write-Host "✅ Next.js installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Next.js installation failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your API keys"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Setup: See SETUP.md"
Write-Host "   - ElevenLabs: See ELEVENLABS_INTEGRATION.md"
Write-Host "   - Quick Reference: See QUICK_REFERENCE.md"
Write-Host ""
Write-Host "Happy coding! 🎯" -ForegroundColor Green
