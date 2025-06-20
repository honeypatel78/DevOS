import express from 'express';
import { sql, poolPromise } from '../config/db.js';

const comment = express.Router();

//1. GET COMMENT BY ID
comment.get('/comments/:postId', async (req, res) => {  
    const postId = parseInt(req.params.postId);
    
    try {
        const pool = await poolPromise;
    
        const result = await pool.request()
        .input('postId', sql.Int, postId)
        .query(`SELECT c.CommentID, c.CommentText, c.CreatedAt, c.Username
                FROM Comments c
                WHERE c.PostID = @postId`);
    
        if (result.recordset.length > 0) {
        res.json({
            message: "Comments fetched successfully",
            status: true,
            data: result.recordset
        });
        } else {
        res.status(404).json({ message: 'No comments found for this post' });
        }
    
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }


});

//2.ADD COMMENT
comment.post('/comments', async (req, res) => {
    const { postId, userId, commentText, username } = req.body;
    console.log("comment requested");
  
    if (!postId || !userId || !commentText || !username) {
      return res.status(400).json({ status: false, message: 'postId, userId, username and commentText are required' });
    }
  
    try {
      const pool = await poolPromise;
  
      const result = await pool.request()
        .input('postId', sql.Int, postId)
        .input('userId', sql.Int, userId)
        .input('username', sql.NVarChar(sql.MAX), username)
        .input('commentText', sql.NVarChar(sql.MAX), commentText)
        .query('INSERT INTO Comments (PostID, UserID, CommentText, Username) VALUES (@postId, @userId, @commentText, @username)');
  
      res.json({ status: true, message: 'Comment added successfully' });
      console.log('Comment added successfully');
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: 'Server error' });
    }
});

  export default comment;