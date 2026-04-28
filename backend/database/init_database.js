const { executeQuery } = require('./db_connection');

async function initializeDatabase() {
  console.log('🔧 Initializing database tables...');
  
  try {
    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        bio TEXT,
        avatar_url VARCHAR(255),
        role ENUM('admin', 'user') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);
    console.log('✅ Users table created');

    // Create articles table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        featured_image VARCHAR(255),
        author_id INT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        tags VARCHAR(255),
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        view_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_category (category),
        INDEX idx_published (published_at)
      )
    `);
    console.log('✅ Articles table created');

    // Create messages table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied', 'archived') DEFAULT 'unread',
        priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
        ip_address VARCHAR(45),
        user_agent TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_created (created_at)
      )
    `);
    console.log('✅ Messages table created');

    // Create comments table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_email VARCHAR(100) NOT NULL,
        author_website VARCHAR(255),
        content TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected', 'spam') DEFAULT 'pending',
        ip_address VARCHAR(45),
        user_agent TEXT,
        parent_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        INDEX idx_article (article_id),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      )
    `);
    console.log('✅ Comments table created');

    // Insert sample admin user if not exists
    await executeQuery(`
      INSERT IGNORE INTO users (username, email, password_hash, full_name, role) 
      VALUES ('admin', 'angemariegloriairakoze@gmail.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8O8O8O8O8O8O8O8O8O8O8O8O8O8O8O8O8O8O', 'Irakoze Ange Marie Gloria', 'admin')
    `);
    console.log('✅ Sample admin user created');

    console.log('🎉 Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
}

module.exports = { initializeDatabase };
