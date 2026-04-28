const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Database imports
const { testConnection, executeQuery } = require('./database/db_connection');
const { initializeDatabase } = require('./database/init_database');
const MessageModel = require('./database/models/MessageModel');
const ArticleModel = require('./database/models/ArticleModel');
const CommentModel = require('./database/models/CommentModel');
const UserModel = require('./database/models/UserModel');

const app = express();
const PORT = process.env.PORT || 1000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Email configuration - development mode by default
let transporter;

// Simple file-based email system (reliable and working)
if (false) {
  // Simple file-based email logging system
  const fs = require('fs').promises;
  const path = require('path');
  
  transporter = {
    sendMail: async (mailOptions) => {
      const timestamp = new Date().toLocaleString();
      const logEntry = `[${timestamp}] | TO: ${mailOptions.to} | FROM: ${mailOptions.from} | SUBJECT: ${mailOptions.subject}\n`;
      
      // Log to file
      try {
        await fs.appendFile(path.join(__dirname, 'email_logs.txt'), logEntry + '\n');
        console.log('\n' + '='.repeat(60));
        console.log('📧 EMAIL LOGGED TO FILE');
        console.log('='.repeat(60));
        console.log('📨 To:', mailOptions.to);
        console.log('📝 Subject:', mailOptions.subject);
        console.log('👤 From:', mailOptions.from);
        console.log('⏰ Time:', timestamp);
        console.log('� Logged to: email_logs.txt');
        console.log('='.repeat(60) + '\n');
      } catch (error) {
        console.error('Failed to log email:', error);
      }
      
      return { messageId: 'file-log-' + Date.now() };
    }
  };
  console.log('✅ Email logging system active - emails saved to email_logs.txt');
}

// Contact form endpoint with database fallback
app.post('/api/contact', async (req, res) => {
  const { from_name, from_email, message, phone, subject } = req.body;

  try {
    // Try to save to database if available
    let messageId = null;
    let databaseError = null;
    
    try {
      messageId = await MessageModel.create({
        name: from_name,
        email: from_email,
        phone: phone || null,
        subject: subject || 'Portfolio Contact Form',
        message: message,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (dbError) {
      databaseError = dbError;
      console.log('Database not available, using email fallback:', dbError.message);
    }

    // Send email to you
    const mailOptions = {
      from: process.env.EMAIL_USER || 'angemariegloriairakoze@gmail.com',
      to: 'angemariegloriairakoze@gmail.com',
      subject: `New message from ${from_name} via portfolio`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c8aff;">New Portfolio Message</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${from_name}</p>
            <p><strong>Email:</strong> ${from_email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #7c8aff;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">Sent from: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation to the user
    const confirmationOptions = {
      from: process.env.EMAIL_USER || 'angemariegloriairakoze@gmail.com',
      to: from_email,
      subject: 'Thank you for contacting Ange Gloria!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c8aff;">Thank you for reaching out!</h2>
          <p>Hello ${from_name},</p>
          <p>Thank you so much for contacting me through my portfolio! I've received your message and I'm excited to connect with you.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7c8aff;">About Me</h3>
            <p>I'm Irakoze Ange Marie Gloria, a passionate full-stack developer who loves building real projects and learning in the open.</p>
            
            <h4 style="color: #7c8aff;">My Skills:</h4>
            <ul>
              <li>🎯 Frontend: HTML5, CSS3, JavaScript, React</li>
              <li>⚙️ Backend: Node.js, Express, REST APIs</li>
              <li>🗄️ Database: MySQL, MongoDB, PostgreSQL</li>
              <li>🛠️ Tools: Git, GitHub, Docker, VS Code</li>
            </ul>
          </div>
          
          <p>I'll get back to you within 24 hours. In the meantime, feel free to check out my portfolio for more of my work.</p>
          
          <p>Looking forward to our conversation!</p>
          
          <p>Best regards,<br>
          Irakoze Ange Marie Gloria<br>
          Full-Stack Developer</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #7c8aff;">Your original message:</h4>
            <p style="background: white; padding: 10px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(confirmationOptions);

    res.json({ 
      success: true, 
      message: 'Message sent successfully!',
      messageId: messageId,
      databaseStatus: databaseError ? 'Email only - database not available' : 'Email and database'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.',
      error: error.message 
    });
  }
});

// API Routes for Articles
app.get('/api/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    let articles;
    
    if (search) {
      articles = await ArticleModel.search(search, limit);
    } else if (category) {
      articles = await ArticleModel.getByCategory(category, limit);
    } else {
      articles = await ArticleModel.getAll(page, limit, 'published');
    }
    
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/articles/:slug', async (req, res) => {
  try {
    const article = await ArticleModel.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    // Increment view count
    await ArticleModel.incrementViewCount(article.id);
    
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API Routes for Comments
app.get('/api/articles/:slug/comments', async (req, res) => {
  try {
    const article = await ArticleModel.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    const comments = await CommentModel.getByArticleId(article.id, 'approved');
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/articles/:slug/comments', async (req, res) => {
  try {
    const article = await ArticleModel.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    
    const commentData = {
      articleId: article.id,
      authorName: req.body.author_name,
      authorEmail: req.body.author_email,
      authorWebsite: req.body.author_website,
      commentText: req.body.comment_text,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    const commentId = await CommentModel.create(commentData);
    res.json({ success: true, commentId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard API Routes (for future admin panel)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [articleStats, messageStats, commentStats] = await Promise.all([
      ArticleModel.getStats(),
      MessageModel.getStats(),
      CommentModel.getStats()
    ]);
    
    res.json({ 
      success: true, 
      data: {
        articles: articleStats,
        messages: messageStats[0] || {},
        comments: commentStats[0] || {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/dashboard/messages', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const messages = await MessageModel.getAll(page, limit, status);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve the main portfolio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server with database connection
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (dbConnected) {
      console.log('✅ Database connected successfully');
      
      // Initialize database tables
      const dbInitialized = await initializeDatabase();
      if (dbInitialized) {
        console.log('✅ Database tables initialized successfully');
      } else {
        console.log('⚠️ Database table initialization failed - running without database');
      }
    } else {
      console.log('⚠️ Database connection failed - running without database');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
      console.log(`📧 Email functionality configured for: angemariegloriairakoze@gmail.com`);
      console.log(`🗄️ Database: ${dbConnected ? 'Connected and Initialized' : 'Disconnected'}`);
      console.log(`📁 Serving frontend from: ${__dirname}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
