/**
 * User Model - Admin Authentication
 * Handles all database operations for users table
 */

const { executeQuery } = require('../db_connection');

class UserModel {
    // Find user by email
    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
        const result = await executeQuery(sql, [email]);
        return result.success ? result.data[0] : null;
    }

    // Find user by username
    static async findByUsername(username) {
        const sql = 'SELECT * FROM users WHERE username = ? AND is_active = 1';
        const result = await executeQuery(sql, [username]);
        return result.success ? result.data[0] : null;
    }

    // Find user by ID
    static async findById(id) {
        const sql = 'SELECT id, username, email, full_name, role, last_login, created_at FROM users WHERE id = ? AND is_active = 1';
        const result = await executeQuery(sql, [id]);
        return result.success ? result.data[0] : null;
    }

    // Create new user
    static async create(userData) {
        const sql = `
            INSERT INTO users (username, email, password_hash, full_name, role) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            userData.username,
            userData.email,
            userData.passwordHash,
            userData.fullName,
            userData.role || 'admin'
        ];
        const result = await executeQuery(sql, params);
        return result.success ? result.data.insertId : null;
    }

    // Update user
    static async update(id, userData) {
        const fields = [];
        const params = [];

        if (userData.username) {
            fields.push('username = ?');
            params.push(userData.username);
        }
        if (userData.email) {
            fields.push('email = ?');
            params.push(userData.email);
        }
        if (userData.passwordHash) {
            fields.push('password_hash = ?');
            params.push(userData.passwordHash);
        }
        if (userData.fullName) {
            fields.push('full_name = ?');
            params.push(userData.fullName);
        }
        if (userData.role) {
            fields.push('role = ?');
            params.push(userData.role);
        }

        if (fields.length === 0) return false;

        fields.push('updated_at = CURRENT_TIMESTAMP');
        params.push(id);

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        const result = await executeQuery(sql, params);
        return result.success;
    }

    // Update last login
    static async updateLastLogin(id) {
        const sql = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Deactivate user (soft delete)
    static async deactivate(id) {
        const sql = 'UPDATE users SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Get all active users
    static async getAll() {
        const sql = 'SELECT id, username, email, full_name, role, last_login, created_at FROM users WHERE is_active = 1 ORDER BY created_at DESC';
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Verify password (compare with stored hash)
    static async verifyPassword(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return null;

        const bcrypt = require('bcrypt');
        const isValid = await bcrypt.compare(password, user.password_hash);
        return isValid ? user : null;
    }
}

module.exports = UserModel;
