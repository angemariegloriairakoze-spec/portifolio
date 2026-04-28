/**
 * Article Model - Blog Content Management
 * Handles all database operations for articles table
 */

const { executeQuery } = require('../db_connection');

class ArticleModel {
    // Get all articles with pagination
    static async getAll(page = 1, limit = 10, status = 'published') {
        const offset = (page - 1) * limit;
        let sql = `
            SELECT a.*, u.full_name as author_name, u.username as author_username
            FROM articles a
            JOIN users u ON a.author_id = u.id
        `;
        const params = [];

        if (status) {
            sql += ' WHERE a.status = ?';
            params.push(status);
        }

        sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const result = await executeQuery(sql, params);
        return result.success ? result.data : [];
    }

    // Get article by slug
    static async findBySlug(slug) {
        const sql = `
            SELECT a.*, u.full_name as author_name, u.username as author_username
            FROM articles a
            JOIN users u ON a.author_id = u.id
            WHERE a.slug = ? AND a.status = 'published'
        `;
        const result = await executeQuery(sql, [slug]);
        return result.success ? result.data[0] : null;
    }

    // Get article by ID
    static async findById(id) {
        const sql = `
            SELECT a.*, u.full_name as author_name, u.username as author_username
            FROM articles a
            JOIN users u ON a.author_id = u.id
            WHERE a.id = ?
        `;
        const result = await executeQuery(sql, [id]);
        return result.success ? result.data[0] : null;
    }

    // Create new article
    static async create(articleData) {
        const sql = `
            INSERT INTO articles (
                title, slug, content, excerpt, featured_image, status, 
                author_id, category, tags, meta_description, meta_keywords, 
                is_featured, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            articleData.title,
            articleData.slug,
            articleData.content,
            articleData.excerpt || null,
            articleData.featuredImage || null,
            articleData.status || 'draft',
            articleData.authorId,
            articleData.category || null,
            articleData.tags ? JSON.stringify(articleData.tags) : null,
            articleData.metaDescription || null,
            articleData.metaKeywords || null,
            articleData.isFeatured || false,
            articleData.status === 'published' ? new Date() : null
        ];

        const result = await executeQuery(sql, params);
        return result.success ? result.data.insertId : null;
    }

    // Update article
    static async update(id, articleData) {
        const fields = [];
        const params = [];

        const updatableFields = [
            'title', 'slug', 'content', 'excerpt', 'featured_image', 
            'status', 'category', 'tags', 'meta_description', 'meta_keywords', 'is_featured'
        ];

        updatableFields.forEach(field => {
            const camelCase = field.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            if (articleData[camelCase] !== undefined) {
                fields.push(`${field} = ?`);
                if (field === 'tags' && articleData[camelCase]) {
                    params.push(JSON.stringify(articleData[camelCase]));
                } else {
                    params.push(articleData[camelCase]);
                }
            }
        });

        if (articleData.status === 'published' && !articleData.publishedAt) {
            fields.push('published_at = CURRENT_TIMESTAMP');
        }

        if (fields.length === 0) return false;

        params.push(id);

        const sql = `UPDATE articles SET ${fields.join(', ')} WHERE id = ?`;
        const result = await executeQuery(sql, params);
        return result.success;
    }

    // Delete article
    static async delete(id) {
        const sql = 'DELETE FROM articles WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Increment view count
    static async incrementViewCount(id) {
        const sql = 'UPDATE articles SET view_count = view_count + 1 WHERE id = ?';
        const result = await executeQuery(sql, [id]);
        return result.success;
    }

    // Get articles by category
    static async getByCategory(category, limit = 10) {
        const sql = `
            SELECT a.*, u.full_name as author_name
            FROM articles a
            JOIN users u ON a.author_id = u.id
            WHERE a.category = ? AND a.status = 'published'
            ORDER BY a.published_at DESC
            LIMIT ?
        `;
        const result = await executeQuery(sql, [category, limit]);
        return result.success ? result.data : [];
    }

    // Get featured articles
    static async getFeatured(limit = 5) {
        const sql = `
            SELECT a.*, u.full_name as author_name
            FROM articles a
            JOIN users u ON a.author_id = u.id
            WHERE a.is_featured = 1 AND a.status = 'published'
            ORDER BY a.published_at DESC
            LIMIT ?
        `;
        const result = await executeQuery(sql, [limit]);
        return result.success ? result.data : [];
    }

    // Search articles
    static async search(query, limit = 10) {
        const sql = `
            SELECT a.*, u.full_name as author_name,
                MATCH(a.title, a.content, a.excerpt) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
            FROM articles a
            JOIN users u ON a.author_id = u.id
            WHERE a.status = 'published' AND 
                MATCH(a.title, a.content, a.excerpt) AGAINST(? IN NATURAL LANGUAGE MODE)
            ORDER BY relevance DESC, a.published_at DESC
            LIMIT ?
        `;
        const result = await executeQuery(sql, [query, query, limit]);
        return result.success ? result.data : [];
    }

    // Get article statistics
    static async getStats() {
        const sql = `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
                COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
                COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured,
                SUM(view_count) as total_views,
                AVG(view_count) as avg_views
            FROM articles
        `;
        const result = await executeQuery(sql);
        return result.success ? result.data[0] : null;
    }

    // Get articles by author
    static async getByAuthor(authorId, limit = 10) {
        const sql = `
            SELECT * FROM articles 
            WHERE author_id = ? AND status = 'published'
            ORDER BY published_at DESC
            LIMIT ?
        `;
        const result = await executeQuery(sql, [authorId, limit]);
        return result.success ? result.data : [];
    }
}

module.exports = ArticleModel;
