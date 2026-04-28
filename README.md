# Portfolio - Full-Stack Application

A modern full-stack portfolio website with clean separation between frontend and backend.

## 📁 Project Structure

```
portfolio/
├── frontend/           # Frontend files (HTML, CSS, JavaScript)
│   ├── index.html     # Main portfolio page with testimonials
│   ├── styles.css     # Styling and animations
│   └── script.js      # Frontend JavaScript
└── backend/           # Backend files (Node.js, Express, Database)
    ├── server.js      # Express server
    ├── package.json   # Backend dependencies
    ├── .env          # Environment variables
    ├── database/     # Database configuration and models
    └── email_logs.txt # Email logs
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL database (XAMPP recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/angemariegloriairakoze-spec/portifolio.git
   cd portifolio
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up database**
   - Start XAMPP (Apache + MySQL)
   - Create database: `portfolio_db`
   - Tables will be created automatically

4. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

### Running the Application

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

## 🌐 Access Points

- **Application**: `http://localhost:1000`
- **Backend API**: `http://localhost:1000/api/*`

## 📡 API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all messages
- `GET /api/articles` - Get articles
- `POST /api/comments` - Add comment

## 🎨 Features

- **Frontend**: Modern dark theme, book flip navigation, testimonials section
- **Backend**: Express server, MySQL database, email functionality
- **Database**: User management, messages, articles, comments

## 📧 Contact Form

Contact form submissions are:
- Saved to MySQL database
- Logged to `backend/email_logs.txt`
- Can be configured to send emails

## 🗄️ Database

Tables are automatically created on startup:
- `users` - User accounts
- `messages` - Contact form submissions
- `articles` - Blog posts
- `comments` - User comments

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run install:all` - Install all dependencies

## 🚀 Deployment

### Frontend Deployment
- GitHub Pages (static files)
- Netlify
- Vercel

### Backend Deployment
- Railway
- Render
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License
