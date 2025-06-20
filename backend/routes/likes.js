import express from 'express';
import { sql, poolPromise } from '../config/db.js';

const like = express.Router();

// 1.Like a post
like.post('/like', async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ status: false, message: 'postId and userId required' });
  }

  try {
    const pool = await poolPromise;

    // Check if user already liked the post
    const checkResult = await pool.request()
      .input('postId', sql.Int, postId)
      .input('userId', sql.Int, userId)
      .query('SELECT LikeID FROM likes WHERE PostID = @postId AND UserID = @userId');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ status: false, message: 'Post already liked' });
    }

    // Insert new like
    await pool.request()
      .input('postId', sql.Int, postId)
      .input('userId', sql.Int, userId)
      .input('createdAt', sql.DateTime, new Date())
      .query('INSERT INTO likes (PostID, UserID, CreatedAt) VALUES (@postId, @userId, @createdAt)');

    res.json({ status: true, message: 'Post liked' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// 2.Unlike a post
like.post('/unlike', async (req, res) => {
  const { postId, userId } = req.body;

  if (!postId || !userId) {
    return res.status(400).json({ status: false, message: 'postId and userId required' });
  }

  try {
    const pool = await poolPromise;

    const deleteResult = await pool.request()
      .input('postId', sql.Int, postId)
      .input('userId', sql.Int, userId)
      .query('DELETE FROM likes WHERE PostID = @postId AND UserID = @userId');

    if (deleteResult.rowsAffected[0] === 0) {
      return res.status(404).json({ status: false, message: 'Like not found' });
    }

    res.json({ status: true, message: 'Post unliked' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// 3.Get like count for a post
like.get('/count/:postId', async (req, res) => {
  const postId = parseInt(req.params.postId, 10);

  if (!postId) {
    return res.status(400).json({ status: false, message: 'postId required' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('postId', sql.Int, postId)
      .query('SELECT COUNT(*) AS likeCount FROM likes WHERE PostID = @postId');

    const likeCount = result.recordset[0].likeCount;

    res.json({ status: true, likeCount });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

// 4.Check if user liked a post
like.get('/check', async (req, res) => {
  const postId = parseInt(req.query.postId, 10);
  const userId = parseInt(req.query.userId, 10);

  if (!postId || !userId) {
    return res.status(400).json({ status: false, message: 'postId and userId required' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('postId', sql.Int, postId)
      .input('userId', sql.Int, userId)
      .query('SELECT LikeID FROM likes WHERE PostID = @postId AND UserID = @userId');

    const liked = result.recordset.length > 0;

    res.json({ status: true, liked });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

export default like;