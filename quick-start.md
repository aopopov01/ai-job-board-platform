# 🚀 Quick Start Guide - Job Board Platform

## Option 1: Direct Access (Recommended)

### **Native Development Mode:**
```bash
# Install dependencies
npm install

# Start web application
npm run dev:web
```
**Access:** http://localhost:3000

### **Run Scraper Demo:**
```bash
# Navigate to scraper package
cd packages/scraper

# Build and run demo
npm run build
node dist/demo-scraper.js
```

## Option 2: Docker Mode

### **Simple Docker Setup:**
```bash
# Build and start platform
docker-compose -f docker-compose.simple.yml up --build

# Access web app
# http://localhost:3000
```

### **Development Docker:**
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build
```

### **Enterprise Docker:**
```bash
# Full platform with monitoring
docker-compose up --build
```

## 🌟 **What You'll See:**

### **Web Application Features:**
- ✨ **Landing Page**: Glass morphism with Magic UI components
- 🔍 **Job Search**: Advanced filtering and search
- 👤 **User Dashboard**: Candidate and employer profiles
- 🏢 **Company Pages**: Company profiles and job postings
- 📱 **Responsive Design**: Works on all devices

### **Magic UI Components:**
- 🌟 **ShimmerButton**: Animated call-to-action buttons
- ✨ **MagicCard**: Interactive hover effects
- 📋 **AnimatedList**: Smooth list animations
- 📝 **TextReveal**: Scroll-based text animations
- 💧 **Ripple**: Interactive ripple effects

### **Scraper Service:**
- 🕷️ **Web Scraping**: Automated job collection
- 🔄 **Demo Mode**: 5 sample jobs for testing
- 📊 **Analytics**: Job processing statistics
- 🛡️ **Anti-detection**: Stealth browsing capabilities

## 🔧 **Troubleshooting:**

### **Port Conflicts:**
```bash
# Check what's running on ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Stop conflicting processes
sudo fuser -k 3000/tcp
sudo fuser -k 3001/tcp
```

### **Docker Issues:**
```bash
# Clean Docker environment
docker system prune -a
docker-compose down -v

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### **Permission Issues (WSL2):**
```bash
# Clean Next.js cache
rm -rf apps/web/.next

# Or restart WSL2
wsl --shutdown
```

## 🎯 **Current Status:**
- ✅ **Scraper Service**: Fully functional
- ✅ **Mobile App**: Builds successfully (2.55MB)
- ✅ **Magic UI**: All components working
- ✅ **TypeScript**: All packages compile
- ✅ **Docker**: Containerized and ready
- ⚠️ **Web Dev Server**: WSL2 permission issue (use Docker as workaround)

## 🌐 **Access URLs:**
- **Web App**: http://localhost:3000 (both native and Docker)
- **Health Check**: http://localhost:3000/api/health
- **Redis**: localhost:6379 (Docker only)

**Recommendation:** Use native `npm run dev:web` for best development experience!