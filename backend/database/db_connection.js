/**
 * Database Connection for Portfolio System
 * MySQL connection with connection pooling
 */

const mysql = require('mysql2/promise');

// Database configuration (manual setup since dotenv is disabled)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'portfolio_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully to portfolio_db');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
}

// Execute query with error handling
async function executeQuery(sql, params = []) {
    try {
        const [rows] = await pool.execute(sql, params);
        return { success: true, data: rows };
    } catch (error) {
        console.error('Database query error:', error);
        return { success: false, error: error.message };
    }
}

// Execute transaction
async function executeTransaction(queries) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const results = [];
        for (const { sql, params } of queries) {
            const [rows] = await connection.execute(sql, params);
            results.push(rows);
        }
        
        await connection.commit();
        return { success: true, data: results };
    } catch (error) {
        await connection.rollback();
        console.error('Transaction error:', error);
        return { success: false, error: error.message };
    } finally {
        connection.release();
    }
}

// Close connection pool
async function closeConnection() {
    try {
        await pool.end();
        console.log('Database connection pool closed');
    } catch (error) {
        console.error('Error closing database connection:', error);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

module.exports = {
    pool,
    testConnection,
    executeQuery,
    executeTransaction,
    closeConnection
};
