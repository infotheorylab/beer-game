# LLM-Powered Beer Distribution Game Website

## About

This website (https://infotheorylab.github.io/beer-game/) showcases research into how Large Language Models (LLMs) behave when controlling roles in the classic Beer Distribution Game - a supply chain simulation exercise. The project explores how AI agents manage inventory, orders, and the infamous "bullwhip effect" across different supply chain positions (retailer, wholesaler, distributor, factory).

The Beer Game is a well-known business simulation that demonstrates how small changes in customer demand can create massive amplification and instability as information travels upstream through a supply chain. This research investigates whether AI agents exhibit similar behaviors or can potentially mitigate these effects.

## Authors

- **Carol Long**
- **David Simchi-Levi** 
- **Andre du Pin Calmon**
- **Flavio du Pin Calmon**

## How to Run Locally

### Prerequisites
- Node.js (v16 or higher) and npm installed on your system
- Email account with SMTP access (Gmail recommended)

### Development Setup

#### Option 1: Static Website Only (No Feedback Form)
```bash
# Clone the repository
git clone <repository-url>
cd beer-game

# Start a simple web server
python -m http.server 8080
# Or use Node.js
npx http-server -p 8080

# Open http://localhost:8080 in your browser
```

#### Option 2: Full Website with Backend (Feedback Form Enabled)
```bash
# Clone the repository
git clone <repository-url>
cd beer-game

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your email configuration (see Email Setup below)

# Start the development server
npm run dev
# Or for production
npm start

# Open http://localhost:3000 in your browser
```

### Email Setup for Feedback Form

#### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Update your `.env` file:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_APP_PASSWORD=your-16-character-app-password
   EMAIL_TO=feedback-recipient@gmail.com
   ```

#### Custom SMTP Setup
For other email providers, update your `.env` file:
```
EMAIL_SERVICE=custom
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
EMAIL_TO=feedback-recipient@yourdomain.com
```

### Deployment

#### Static Hosting (GitHub Pages, Netlify, Vercel)
The website can be deployed as static files. The feedback form will be disabled.

#### Full-Stack Hosting (Heroku, Railway, DigitalOcean)
1. Set environment variables on your hosting platform
2. Ensure your hosting service supports Node.js
3. The server will serve both static files and API endpoints

## Technical Details

- **Pure vanilla HTML/CSS/JavaScript** - No build process required
- **JSON-based content management** - Easy content editing via `/content/content.en.json`
- **Interactive visualizations** - Chart.js for bullwhip effect demonstration
- **Responsive design** - Mobile-friendly with desktop optimizations
- **Snap-scroll navigation** - Full-height sections with smooth scrolling

## Project Status

🔄 **Active Development**: This website is being actively developed as part of ongoing research. Expect:

- Content updates and refinements
- New interactive features
- Design improvements
- Research findings integration

## Contact

For inquiries or collaboration opportunities, please reach out to the authors via email.

---

*This project represents ongoing academic research into AI behavior in supply chain management contexts.*
