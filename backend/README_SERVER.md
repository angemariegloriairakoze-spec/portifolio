# Portfolio Server Setup & Usage

## 🚀 Quick Start

### Option 1: Using the Batch File (Windows)
1. Double-click `start.bat`
2. Wait for dependencies to install (first time only)
3. Server will start automatically at `http://localhost:1000`

### Option 2: Manual Start
1. Open Command Prompt/Terminal in the project directory
2. Install dependencies: `npm install`
3. Start server: `npm start`

## 📋 Prerequisites

1. **Node.js** (v14 or higher)
2. **XAMPP** (for MySQL database - optional but recommended)
3. **Gmail App Password** (for email functionality)

## 🗄️ Database Setup (Optional but Recommended)

1. Start XAMPP and launch Apache & MySQL
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Create database: `portfolio_db`
4. Import the SQL file: `database/portfolio_database.sql`

## 🔧 Configuration

Edit the `.env` file with your settings:

```env
# Server
PORT=1000

# Database (if using)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db

# Email
EMAIL_USER=angemariegloriairakoze@gmail.com
EMAIL_PASS=your_gmail_app_password
```

## 📡 Available Endpoints

### Frontend
- **Home**: `http://localhost:1000/`
- **All other routes**: Served as SPA (Single Page Application)

### API Endpoints

#### Contact Form
- `POST /api/contact` - Send contact form message

#### Articles (Blog)
- `GET /api/articles` - Get all articles
- `GET /api/articles/:slug` - Get specific article
- `GET /api/articles/:slug/comments` - Get article comments
- `POST /api/articles/:slug/comments` - Add comment to article

#### Dashboard (Admin)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/messages` - Get messages for admin

## 🌟 Features

### ✅ Working Out of the Box
- Frontend portfolio serving
- Contact form with email notifications
- Database integration (if configured)
- API endpoints for future features
- SPA routing support

### 🔧 Advanced Features (with database)
- Message storage and management
- Article/blog system
- Comment system
- Dashboard statistics
- Admin panel ready

## 📧 Email Setup

1. Enable 2-factor authentication on your Gmail
2. Generate an App Password:
   - Go to Google Account settings
   - Security → App passwords
   - Generate new password
   - Use it in your `.env` file

## 🛠️ Development

### Development Mode
```bash
npm run dev
```
This uses nodemon for automatic restarts on file changes.

### Project Structure
```
d:\portifolio\
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration
├── start.bat              # Windows startup script
├── portifolio/            # Frontend files
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── dashboard.js
└── database/              # Database files
    ├── portfolio_database.sql
    ├── db_connection.js
    └── models/
```

## 🔍 Troubleshooting

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port: `netstat -ano | findstr :1000`

### Database Connection Failed
- Ensure XAMPP MySQL service is running
- Check database credentials in `.env`
- Run the database setup script first

### Email Not Sending
- Verify Gmail App Password is correct
- Check your Gmail spam folder
- Ensure 2-factor authentication is enabled

### Frontend Not Loading
- Check that `portifolio/` folder exists
- Verify `index.html` is present
- Check console for errors

## 📊 Monitoring

When the server starts, you'll see:
```
🚀 Portfolio server running on http://localhost:1000
📧 Email functionality configured for: angemariegloriairakoze@gmail.com
🗄️ Database: Connected/Disconnected
📁 Serving frontend from: [directory path]
```

## 🔄 Updates

To update dependencies:
```bash
npm update
```

To add new features:
1. Update `server.js` with new routes
2. Add corresponding database models if needed
3. Update frontend to use new APIs

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Ensure configuration in `.env` is correct
4. Check that XAMPP services are running (if using database)
