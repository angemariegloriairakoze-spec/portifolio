# Portfolio Database Setup Instructions

## Prerequisites
- XAMPP (or similar web server with MySQL)
- Node.js (for backend integration)
- MySQL access (phpMyAdmin or command line)

## Step 1: Database Setup

### Option A: Using phpMyAdmin (Recommended)
1. Start XAMPP and start Apache and MySQL services
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Click "New" to create a new database
4. Enter database name: `portfolio_db`
5. Select "utf8mb4_unicode_ci" collation
6. Click "Create"
7. Select the `portfolio_db` database
8. Click "Import" tab
9. Choose the `portfolio_database.sql` file
10. Click "Go" to import

### Option B: Using MySQL Command Line
1. Open Command Prompt/Terminal
2. Navigate to your XAMPP MySQL bin directory (usually: `C:\xampp\mysql\bin`)
3. Run: `mysql -u root -p`
4. Enter your MySQL password (if set)
5. Run: `CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
6. Run: `USE portfolio_db;`
7. Run: `SOURCE path/to/portfolio_database.sql;`

## Step 2: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your actual database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio_db
   ```

## Step 3: Install Dependencies

In your project root directory:
```bash
npm install mysql2 dotenv bcryptjs jsonwebtoken express cors body-parser
```

## Step 4: Test Database Connection

Create a test file `test_db.js`:
```javascript
const { testConnection } = require('./database/db_connection');

testConnection().then(connected => {
    if (connected) {
        console.log('✅ Database connection successful!');
        process.exit(0);
    } else {
        console.log('❌ Database connection failed!');
        process.exit(1);
    }
});
```

Run the test:
```bash
node test_db.js
```

## Step 5: Database Structure Overview

### Tables Created:
1. **users** - Admin authentication
2. **articles** - Blog content management
3. **messages** - Contact form submissions
4. **comments** - Article feedback

### Default Admin User:
- Username: `admin`
- Email: `angemariegloriairakoze@gmail.com`
- Password: `ange123` (hashed in database)

### Sample Data Included:
- 2 sample articles
- 2 sample messages
- 3 sample comments

## Step 6: Integration with Existing Server

Update your `server.js` to include database models:

```javascript
// Add to top of server.js
const { testConnection } = require('./database/db_connection');
const UserModel = require('./database/models/UserModel');
const ArticleModel = require('./database/models/ArticleModel');
const MessageModel = require('./database/models/MessageModel');
const CommentModel = require('./database/models/CommentModel');

// Test database connection on server start
testConnection();

// Example usage in your routes
app.post('/api/contact', async (req, res) => {
    try {
        const messageId = await MessageModel.create({
            name: req.body.from_name,
            email: req.body.from_email,
            message: req.body.message,
            subject: 'Portfolio Contact Form',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        
        res.json({ success: true, messageId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

## Step 7: Security Considerations

1. **Change Default Password**: Update the default admin password
2. **Environment Variables**: Never commit `.env` file to version control
3. **Database Privileges**: Create a dedicated database user with limited privileges
4. **Input Validation**: Always validate and sanitize user inputs
5. **SQL Injection Prevention**: Use parameterized queries (already implemented in models)

## Step 8: Backup Strategy

Regularly backup your database:
```bash
mysqldump -u root -p portfolio_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### Common Issues:
1. **Connection Failed**: Check XAMPP services are running
2. **Access Denied**: Verify MySQL credentials in `.env`
3. **Database Not Found**: Ensure database was created correctly
4. **Import Errors**: Check SQL file syntax and permissions

### Debug Mode:
Add this to your `.env` for debugging:
```env
NODE_ENV=development
DEBUG=mysql2
```

## Next Steps

1. Implement authentication middleware
2. Create admin dashboard endpoints
3. Add file upload functionality for article images
4. Implement comment moderation system
5. Add email notifications for new messages
6. Create backup automation

## Support

If you encounter any issues:
1. Check XAMPP error logs
2. Verify database permissions
3. Test connection with simple MySQL client
4. Review SQL import logs for errors
