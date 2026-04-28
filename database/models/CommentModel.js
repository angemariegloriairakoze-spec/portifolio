/**
 * Comment Model - Article Feedback Management
 * Handles all database operations for comments table
 */

const { executeQuery } = require('../db_connection');

class CommentModel {
    // Get all comments with pagination
    static async getAll(page = 1, limit = 10, status = null) {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
        `;
        const params = [];

        if (status) {
            sql += ' WHERE c.status = ?';
            params.push(status);
        }

        sql += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const result = await executeQuery(sql, params);
        return result.success ? result.data : [];
    }

    // Get comment by ID
    static async findById(id) {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.id = ?
        `;
        const result = await executeQuery(sql, [id]);
        return result.success ? result.data[0] : null;
    }

    // Create new comment
    static async create(commentData) {
        const sql = `
            INSERT INTO comments (
                article_id, parent_id, author_name, author_email, 
                author_website, comment_text, ip_address, user_agent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            commentData.articleId,
            commentData.parentId || null,
            commentData.authorName,
            commentData.authorEmail,
            commentData.authorWebsite || null,
            commentData.commentText,
            commentData.ipAddress || null,
            commentData.userAgent || null
        ];

        const result = await executeQuery(sql, params);
        return result.success ? result.data.insertId : null;
    }

    // Update comment status
    static async updateStatus(id, status) {
        const sql = `
            UPDATE comments 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        const result = await executeQuery(sql, [status, id]);
        return result.success;
    }

    // Approve comment
    static async approve(id) {
        return this.updateStatus(id, 'approved');
    }

    // Reject comment
    static async reject(id) {
        return this.updateStatus(id, 'rejected');
    }

    // Mark as spam
    static async markAsSpam(id) {
        return this.updateStatus(id, 'spam');
    }

    // Delete comment
    static async delete(id) {
        const sql = 'DELETE FROM comments WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Get comments by article ID
    static async getByArticleId(articleId, status = 'approved') {
        const sql = `
            SELECT * FROM comments 
            WHERE article_id = ? AND status = ?
            ORDER BY created_at ASC
        `;
        const result = await executeQuery(sql, [articleId, status]);
        return result.success ? result.data : [];
    }

    // Get comments by parent ID (replies)
    static async getByParentId(parentId, status = 'approved') {
        const sql = `
            SELECT * FROM comments 
            WHERE parent_id = ? AND status = ?
            ORDER BY created_at ASC
        `;
        const result = await executeQuery(sql, [parentId, status]);
        return result.success ? result.data : [];
    }

    // Get pending comments
    static async getPending() {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.status = 'pending'
            ORDER BY c.created_at DESC
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Get spam comments
    static async getSpam() {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.status = 'spam'
            ORDER BY c.created_at DESC
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Increment like count
    static async incrementLikeCount(id) {
        const sql = 'UPDATE comments SET like_count = like_count + 1 WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Search comments
    static async search(query, limit = 10) {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE (c.author_name LIKE ? OR c.author_email LIKE ? OR c.comment_text LIKE ?)
            ORDER BY c.created_at DESC
            LIMIT ?
        `;
        const searchPattern = `%${query}%`;
        const result = await executeQuery(sql, [searchPattern, searchPattern, searchPattern, limit]);
        return result.success ? result.data : [];
    }

    // Get comment statistics
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total_comments,
                COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_comments,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_comments,
                COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_comments,
                COUNT(CASE WHEN status = 'spam' THEN 1 END) as spam_comments,
                SUM(like_count) as total_likes,
                AVG(like_count) as avg_likes,
                DATE(created_at) as comment_date
            FROM comments
            GROUP BY DATE(created_at)
            ORDER BY comment_date DESC
            LIMIT 30
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Get recent comments (last 7 days)
    static async getRecent(days = 7) {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? DAY)
            ORDER BY c.created_at DESC
        `;
        const result = await executeQuery(sql, [days]);
        return result.success ? result.data : [];
    }

    // Get comments by author email
    static async getByAuthorEmail(email) {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.author_email = ?
            ORDER BY c.created_at DESC
        `;
        const result = await executeQuery(sql, [email]);
        return result.success ? result.data : [];
    }

    // Bulk approve comments
    static async bulkApprove(commentIds) {
        if (!commentIds || commentIds.length === 0) return false;
        
        const placeholders = commentIds.map(() => '?').join(',');
        const sql = `
            UPDATE comments 
            SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
            WHERE id IN (${placeholders})
        `;
        const result = await executeQuery(sql, commentIds);
        return result.success;
    }

    // Bulk reject comments
    static async bulkReject(commentIds) {
        if (!commentIds || commentIds.length === 0) return false;
        
        const placeholders = commentIds.map(() => '?').join(',');
        const sql = `
            UPDATE comments 
            SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
            WHERE id IN (${placeholders})
        `;
        const result = await executeQuery(sql, commentIds);
        return result.success;
    }

    // Bulk mark as spam
    static async bulkMarkAsSpam(commentIds) {
        if (!commentIds || commentIds.length === 0) return false;
        
        const placeholders = commentIds.map(() => '?').join(',');
        const sql = `
            UPDATE comments 
            SET status = 'spam', updated_at = CURRENT_TIMESTAMP 
            WHERE id IN (${placeholders})
        `;
        const result = await executeQuery(sql, commentIds);
        return result.success;
    }

    // Bulk delete comments
    static async bulkDelete(commentIds) {
        if (!commentIds || commentIds.length === 0) return false;
        
        const placeholders = commentIds.map(() => '?').join(',');
        const sql = `DELETE FROM comments WHERE id IN (${placeholders})`;
        const result = await executeQuery(sql, commentIds);
        return result.success;
    }

    // Get comments count by status
    static async getCountByStatus() {
        const sql = `
            SELECT status, COUNT(*) as count
            FROM comments
            GROUP BY status
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data : [];
    }

    // Get comment thread (comment with replies)
    static async getThread(commentId) {
        const sql = `
            SELECT c.*, a.title as article_title, a.slug as article_slug
            FROM comments c
            JOIN articles a ON c.article_id = a.id
            WHERE c.id = ? OR c.parent_id = ?
            ORDER BY c.created_at ASC
        `;
        const result = await executeQuery(sql, [commentId, commentId]);
        return result.success ? result.data : [];
    }
}

module.exports = CommentModel;
