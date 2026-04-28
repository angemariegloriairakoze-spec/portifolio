# XAMPP Database Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache** service
3. Start **MySQL** service
4. Both should show green "Running" status

### Step 2: Create Database
1. Click "Admin" button next to MySQL (or go to http://localhost/phpmyadmin)
2. Click "New" in the left sidebar
3. Enter database name: `portfolio_db`
4. Click "Create"

### Step 3: Import Tables
1. Select the `portfolio_db` database
2. Click "Import" tab
3. Choose file: `database/portfolio_database.sql`
4. Click "Go" (bottom right)

### Step 4: Verify Setup
You should see these tables:
- users
- articles  
- messages
- comments

## 🎯 That's It! Your database is ready.

## 📧 Test the Server
Now run: `npm run dev`
Server should start at: http://localhost:1000

## 🔧 If You Don't Want Database (Optional)

The server works **without database** too! It will:
- Still serve your frontend perfectly
- Send emails via contact form
- Just won't store messages in database

## 🛠️ Troubleshooting

### "Access Denied" in phpMyAdmin
- Default username: `root`
- Default password: (leave blank)
- Or password you set during XAMPP installation

### Can't Start MySQL
- Check if another service is using port 3306
- Restart XAMPP control panel
- Run as Administrator

### Import Fails
- Make sure you selected `portfolio_db` first
- Check file path: `database/portfolio_database.sql`
- Try smaller chunks if file is too large

## 📊 What the Database Does

**With Database:**
- ✅ Stores all contact messages
- ✅ Ready for blog system
- ✅ Admin dashboard ready
- ✅ Comment system ready

**Without Database:**
- ✅ Frontend works perfectly
- ✅ Contact form sends emails
- ❌ No message storage
- ❌ No blog features yet

## 🎮 Next Steps

1. Test server: `npm run dev`
2. Visit: http://localhost:1000
3. Try contact form - it should work either way!

The server is smart - it detects if database is available and adjusts accordingly.
