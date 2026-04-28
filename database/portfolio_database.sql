-- ============================================
-- Portfolio Database Schema
-- Created for Ange Gloria's Portfolio System
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ============================================
-- 1. Users Table - Admin Authentication
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- ============================================
-- 2. Articles Table - Blog Content
-- ============================================
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id INT NOT NULL,
    category VARCHAR(100),
    tags JSON,
    meta_description VARCHAR(160),
    meta_keywords VARCHAR(255),
    view_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    FULLTEXT idx_search (title, content, excerpt)
);

-- ============================================
-- 3. Messages Table - Contact Form Submissions
-- ============================================
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    ip_address VARCHAR(45),
    user_agent TEXT,
    reply_text TEXT,
    replied_at TIMESTAMP NULL,
    replied_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_priority (priority)
);

-- ============================================
-- 4. Comments Table - Article Feedback
-- ============================================
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    parent_id INT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    author_website VARCHAR(255),
    comment_text TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
    ip_address VARCHAR(45),
    user_agent TEXT,
    like_count INT DEFAULT 0,
    reply_to INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to) REFERENCES comments(id) ON DELETE SET NULL,
    INDEX idx_article_id (article_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_parent_id (parent_id)
);

-- ============================================
-- Insert Default Admin User
-- ============================================
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'angemariegloriairakoze@gmail.com', '$2b$10$rQ8W8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'Irakoze Ange Marie Gloria', 'admin');

-- ============================================
-- Sample Data for Testing
-- ============================================

-- Sample Articles
INSERT INTO articles (title, slug, content, excerpt, status, author_id, category, tags, meta_description, published_at) VALUES 
('Welcome to My Portfolio', 'welcome-to-my-portfolio', 
'This is the first article on my portfolio website. I''m excited to share my journey as a full-stack developer with you all.', 
'An introduction to my portfolio and development journey.', 'published', 1, 'Portfolio', 
'["portfolio", "introduction", "web development"]', 'Welcome to my portfolio website and learn about my development journey.', 
NOW()),

('My Development Journey', 'my-development-journey', 
'From learning HTML basics to building complex full-stack applications, my journey has been filled with challenges and achievements.', 
'Follow my journey from beginner to full-stack developer.', 'published', 1, 'Journey', 
'["journey", "learning", "full-stack"]', 'The story of my development journey and growth as a developer.', 
NOW());

-- Sample Messages
INSERT INTO messages (name, email, subject, message, status, priority) VALUES 
('John Doe', 'john@example.com', 'Project Collaboration', 'Hi, I would like to discuss a potential project collaboration with you.', 'unread', 'medium'),
('Jane Smith', 'jane@example.com', 'Job Opportunity', 'Hello, we have an exciting opportunity that might be perfect for you.', 'unread', 'high');

-- Sample Comments
INSERT INTO comments (article_id, author_name, author_email, comment_text, status) VALUES 
(1, 'Alice Johnson', 'alice@example.com', 'Great portfolio! Looking forward to seeing more of your work.', 'approved'),
(1, 'Bob Wilson', 'bob@example.com', 'Amazing design and clean code. Very impressive!', 'approved'),
(2, 'Carol Davis', 'carol@example.com', 'Your journey is very inspiring. Keep up the great work!', 'approved');

-- ============================================
-- Create Views for Common Queries
-- ============================================

-- View for published articles with author info
CREATE VIEW published_articles AS
SELECT 
    a.id, a.title, a.slug, a.excerpt, a.featured_image, 
    a.category, a.tags, a.view_count, a.is_featured, 
    a.published_at, a.created_at,
    u.full_name as author_name,
    u.username as author_username
FROM articles a
JOIN users u ON a.author_id = u.id
WHERE a.status = 'published'
ORDER BY a.published_at DESC;

-- View for unread messages
CREATE VIEW unread_messages AS
SELECT 
    id, name, email, subject, message, priority, created_at
FROM messages 
WHERE status = 'unread'
ORDER BY priority DESC, created_at DESC;

-- View for approved comments with article info
CREATE VIEW approved_comments AS
SELECT 
    c.id, c.article_id, c.author_name, c.author_email, 
    c.comment_text, c.like_count, c.created_at,
    a.title as article_title,
    a.slug as article_slug
FROM comments c
JOIN articles a ON c.article_id = a.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC;

-- ============================================
-- Stored Procedures for Common Operations
-- ============================================

DELIMITER //

-- Procedure to get article statistics
CREATE PROCEDURE GetArticleStats()
BEGIN
    SELECT 
        COUNT(*) as total_articles,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_articles,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_articles,
        SUM(view_count) as total_views,
        AVG(view_count) as avg_views
    FROM articles;
END //

-- Procedure to get message statistics
CREATE PROCEDURE GetMessageStats()
BEGIN
    SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_messages,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority
    FROM messages;
END //

-- Procedure to get comment statistics
CREATE PROCEDURE GetCommentStats()
BEGIN
    SELECT 
        COUNT(*) as total_comments,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_comments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_comments,
        COUNT(CASE WHEN status = 'spam' THEN 1 END) as spam_comments
    FROM comments;
END //

DELIMITER ;

-- ============================================
-- Triggers for Data Integrity
-- ============================================

DELIMITER //

-- Trigger to update article updated_at when content changes
CREATE TRIGGER update_article_timestamp 
BEFORE UPDATE ON articles
FOR EACH ROW
BEGIN
    IF OLD.title != NEW.title OR OLD.content != NEW.content OR OLD.excerpt != NEW.excerpt THEN
        SET NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
END //

-- Trigger to increment article view count
CREATE TRIGGER increment_view_count 
AFTER INSERT ON article_views -- Would need to create this table
FOR EACH ROW
BEGIN
    UPDATE articles SET view_count = view_count + 1 WHERE id = NEW.article_id;
END //

DELIMITER ;

-- ============================================
-- Database Setup Complete
-- ============================================

-- Show created tables
SHOW TABLES;

-- Display initial data counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Articles', COUNT(*) FROM articles
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments;
