/**
 * Message Model - Contact Form Management
 * Handles all database operations for messages table
 */

const { executeQuery } = require('../db_connection');

class MessageModel {
    // Get all messages with pagination
    static async getAll(page = 1, limit = 10, status = null) {
        const offset = (page - 1) * limit;
        let sql = 'SELECT * FROM messages';
        const params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const result = await executeQuery(sql, params);
        return result.success ? result.data : [];
    }

    // Get message by ID
    static async findById(id) {
        const sql = 'SELECT * FROM messages WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success ? result.data[0] : null;
    }

    // Create new message
    static async create(messageData) {
        const sql = `
            INSERT INTO messages (
                name, email, phone, subject, message, status, priority, 
                ip_address, user_agent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            messageData.name,
            messageData.email,
            messageData.phone || null,
            messageData.subject || null,
            messageData.message,
            messageData.status || 'unread',
            messageData.priority || 'medium',
            messageData.ipAddress || null,
            messageData.userAgent || null
        ];

        const result = await executeQuery(sql, params);
        return result.success ? result.data.insertId : null;
    }

    // Update message status
    static async updateStatus(id, status, repliedBy = null, replyText = null) {
        const fields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
        const params = [status];

        if (status === 'replied') {
            fields.push('replied_at = CURRENT_TIMESTAMP');
            if (repliedBy) {
                fields.push('replied_by = ?');
                params.push(repliedBy);
            }
            if (replyText) {
                fields.push('reply_text = ?');
                params.push(replyText);
            }
        }

        params.push(id);

        const sql = `UPDATE messages SET ${fields.join(', ')} WHERE id = ?`;
        const result = await executeQuery(sql, params);
        return result.success;
    }

    // Mark as read
    static async markAsRead(id, userId) {
        const sql = 'UPDATE messages SET status = "read", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Mark as replied
    static async markAsReplied(id, userId, replyText) {
        const sql = `
            UPDATE messages 
            SET status = "replied", replied_at = CURRENT_TIMESTAMP, 
                replied_by = ?, reply_text = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const result = await executeQuery(sql, [userId, replyText, id]);
        return result.success;
    }

    // Archive message
    static async archive(id) {
        const sql = 'UPDATE messages SET status = "archived", updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Delete message
    static async delete(id) {
        const sql = 'DELETE FROM messages WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Get unread messages
    static async getUnread() {
        const sql = `
            SELECT * FROM messages 
            WHERE status = 'unread' 
            ORDER BY priority DESC, created_at DESC
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Get messages by priority
    static async getByPriority(priority) {
        const sql = `
            SELECT * FROM messages 
            WHERE priority = ? 
            ORDER BY created_at DESC
        `;
        const result = await executeQuery(sql, [priority]);
        return result.success ? result.data : [];
    }

    // Get messages by email
    static async getByEmail(email) {
        const sql = `
            SELECT * FROM messages 
            WHERE email = ? 
            ORDER BY created_at DESC
        `;
        const result = await executeQuery(sql, [email]);
        return result.success ? result.data : [];
    }

    // Search messages
    static async search(query, limit = 10) {
        const sql = `
            SELECT * FROM messages 
            WHERE (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)
            ORDER BY created_at DESC
            LIMIT ?
        `;
        const searchPattern = `%${query}%`;
        const result = await executeQuery(sql, [searchPattern, searchPattern, searchPattern, searchPattern, limit]);
        return result.success ? result.data : [];
    }

    // Get message statistics
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_messages,
                COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_messages,
                COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
                COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
                COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_messages,
                COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority,
                COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium_priority,
                COUNT(CASE WHEN priority = 'low' THEN 1 END) as low_priority,
                DATE(created_at) as message_date
            FROM messages
            GROUP BY DATE(created_at)
            ORDER BY message_date DESC
            LIMIT 30
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Get recent messages (last 7 days)
    static async getRecent(days = 7) {
        const sql = `
            SELECT * FROM messages 
            WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? DAY)
            ORDER BY created_at DESC
        `;
        const result = await executeQuery(sql, [days]);
        return result.success ? result.data : [];
    }

    // Bulk update status
    static async bulkUpdateStatus(messageIds, status) {
        if (!messageIds || messageIds.length === 0) return false;
        
        const placeholders = messageIds.map(() => '?').join(',');
        const sql = `
            UPDATE messages 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id IN (${placeholders})
        `;
        const params = [status, ...messageIds];
        const result = await executeQuery(sql, params);
        return result.success;
    }

    // Bulk delete
    static async bulkDelete(messageIds) {
        if (!messageIds || messageIds.length === 0) return false;
        
        const placeholders = messageIds.map(() => '?').join(',');
        const sql = `DELETE FROM messages WHERE id IN (${placeholders})`;
        const result = await executeQuery(sql, messageIds);
        return result.success;
    }

    // Get messages count by status
    static async getCountByStatus() {
        const sql = `
            SELECT status, COUNT(*) as count
            FROM messages
            GROUP BY status
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }
}

module.exports = MessageModel;
