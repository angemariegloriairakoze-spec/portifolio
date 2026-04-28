# Portfolio - Full-Stack Application

A modern full-stack portfolio website with separate frontend and backend architecture.

## 📁 Project Structure

```
portfolio/
├── frontend/           # Frontend files (HTML, CSS, JavaScript)
│   ├── index.html     # Main portfolio page
│   ├── styles.css     # Styling and animations
│   └── script.js      # Frontend JavaScript
├── backend/           # Backend files (Node.js, Express)
│   ├── server.js      # Express server
│   ├── package.json   # Backend dependencies
│   ├── .env          # Environment variables
│   └── database/     # Database configuration
└── package.json       # Root package configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MySQL database (XAMPP recommended)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/angemariegloriairakoze-spec/portifolio.git
   cd portifolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up database**
   - Start XAMPP (Apache + MySQL)
   - Create database: `portfolio_db`
   - Import database schema

4. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

### Running the Application

#### Option 1: Development (Recommended)
```bash
npm run dev
```
This starts the backend server at `http://localhost:1000` and serves the frontend.

#### Option 2: Production
```bash
npm start
```

## 🌐 Access Points

- **Frontend**: `http://localhost:1000`
- **Backend API**: `http://localhost:1000/api/*`
- **Database**: MySQL on localhost

## 📡 API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/messages` - Get all messages (admin)

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create article

### Comments
- `GET /api/comments` - Get comments
- `POST /api/comments` - Add comment

## 🎨 Features

- **Frontend**
  - Modern dark theme with glass morphism
  - Book flip navigation animations
  - Testimonials section
  - Contact form with validation
  - Responsive design

- **Backend**
  - Express.js server
  - MySQL database integration
  - Email functionality
  - RESTful API
  - Environment configuration

## 📧 Email Configuration

The application includes email functionality for contact form submissions:
- Development mode: Logs to file
- Production mode: Sends via Gmail SMTP

## 🗄️ Database Schema

- `users` - User accounts
- `messages` - Contact form submissions
- `articles` - Blog posts
- `comments` - User comments

## 🔧 Development

### Frontend Development
Frontend files are in the `frontend/` directory:
- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - Frontend JavaScript logic

### Backend Development
Backend files are in the `backend/` directory:
- `server.js` - Express server configuration
- `database/` - Database models and configuration
- `.env` - Environment variables

## 🚀 Deployment

### Frontend Deployment
- GitHub Pages (static files)
- Netlify
- Vercel

### Backend Deployment
- Railway
- Render
- Heroku

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run dev:frontend` - Start frontend only
- `npm run dev:fullstack` - Start both frontend and backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details
