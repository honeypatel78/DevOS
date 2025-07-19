import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import { diskUpload } from './middleware/uploads.js';
import { memoryUpload } from './middleware/uploads.js';

import {sql, poolPromise, dotenv}  from './config/db.js';

import loginRoutes from './routes/auth.js';
import likeRouter from './routes/likes.js';
import commentRouter from './routes/comments.js';
import userRouter from './routes/user.js';
import calendar from './routes/calendar.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://192.168.1.119:4200']
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//Routes
app.use('/', loginRoutes);
app.use('/like', likeRouter);
app.use('/comment', commentRouter);
app.use('/', userRouter);
app.use('/', calendar);

//Default Route
app.get('/', (req, res) => {
  res.send('API is Running');
});

// GET ALL POSTS
app.get('/posts', async(req, res) => {
  try {
     const pool = await poolPromise;
    const result = await pool.request().query
    (`SELECT 
        p.PostID,
        p.PostTitle,
        p.PostPhoto,
        p.PostDescription,
        p.CreatedAt,
        u.UserID,
        u.Username,
        u.ProfilePhoto,
        STRING_AGG(c.CategoryName, ', ') AS Categories
      FROM Posts p
      JOIN Users u ON p.UserID = u.UserID
      JOIN PostCategories pc ON p.PostID = pc.PostID
      JOIN Categories c ON pc.CategoryID = c.CategoryID
      WHERE p.isPosted = 1 AND p.isDeleted = 0
      GROUP BY p.PostID, p.PostTitle, p.PostPhoto, p.PostDescription, p.CreatedAt, u.UserID, u.Username, u.ProfilePhoto
      ORDER BY p.CreatedAt DESC
    `);
    res.json({
            message: "Data fetched successfully",
            status: true,
            data: result.recordset});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//GET DRAFTS BY USERID
app.get('/drafts/:id', async(req, res) => {

  const userId = req.params.id;
  try {
     const pool = await poolPromise;
    const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query
    (`SELECT 
        p.PostID,
        p.PostTitle,
        p.PostPhoto,
        p.PostDescription,
        p.PostName,
        p.CreatedAt,
        u.UserID,
        u.Username,
        u.ProfilePhoto,
        STRING_AGG(c.CategoryName, ', ') AS Categories
      FROM Posts p
      JOIN Users u ON p.UserID = u.UserID
      JOIN PostCategories pc ON p.PostID = pc.PostID
      JOIN Categories c ON pc.CategoryID = c.CategoryID
      WHERE p.isPosted = 0 and u.UserID = @userId and p.isDeleted = 0
      GROUP BY p.PostID, p.PostTitle, p.PostPhoto, p.PostDescription, p.CreatedAt, p.PostName, u.UserID, u.Username, u.ProfilePhoto
      ORDER BY p.CreatedAt DESC
    `);
    res.json({
            message: "Data fetched successfully",
            status: true,
            data: result.recordset});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET POSTS BY USERID 

app.get('/posts/:id', async(req, res) => {

  const userId = req.params.id;
  try {
     const pool = await poolPromise;
    const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query
    (`SELECT 
        p.PostID,
        p.PostTitle,
        p.PostPhoto,
        p.PostDescription,
        p.PostName,
        p.CreatedAt,
        u.UserID,
        u.Username,
        u.ProfilePhoto,
        STRING_AGG(c.CategoryName, ', ') AS Categories
      FROM Posts p
      JOIN Users u ON p.UserID = u.UserID
      JOIN PostCategories pc ON p.PostID = pc.PostID
      JOIN Categories c ON pc.CategoryID = c.CategoryID
      WHERE p.isPosted = 1 and u.UserID = @userId and p.isDeleted = 0
      GROUP BY p.PostID, p.PostTitle, p.PostPhoto, p.PostDescription, p.CreatedAt, p.PostName, u.UserID, u.Username, u.ProfilePhoto
      ORDER BY p.CreatedAt DESC
    `);
    res.json({
            message: "Data fetched successfully",
            status: true,
            data: result.recordset});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET CATEGORIES
app.get('/categories', async(req, res) => {
  
  try { 
    const pool = await poolPromise;
    const result = await pool.request().query
    ('SELECT * FROM Categories');
    res.json({
            message: "Categories fetched successfully",
            status: true,
            data: result.recordset
          });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPLOAD POST

app.post('/upload-post', memoryUpload.single('image'), async (req, res) => { 
  const { title, description, categories, postname, userID } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const pool = await poolPromise;

    // Insert post and get the new PostID
    const result = await pool.request()
      .input('userId', sql.Int, userID)
      .input('imagePath', sql.VarBinary(sql.MAX), imageBuffer)
      .input('postname', sql.NVarChar, postname)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .query(`
        INSERT INTO Posts (UserID, PostTitle, PostPhoto, PostDescription, PostName, isPosted, isDeleted)
        OUTPUT INSERTED.PostID
        VALUES (@userId, @title, @imagePath, @description, @postname, 1, 0)
      `);

    const postId = result.recordset[0].PostID;

    // If categories are provided (as JSON string), insert into PostCategories
    if (categories) {
      const categoryIds = JSON.parse(categories);
      for (const catId of categoryIds) {
        await pool.request()
          .input('postId', sql.Int, postId)
          .input('categoryId', sql.Int, catId)
          .query(`
            INSERT INTO PostCategories (PostID, CategoryID)
            VALUES (@postId, @categoryId)
          `);
      }
    }

    res.status(201).json({ message: 'Post created successfully', postId });
    console.log("Post Done");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// UPDATE POST

app.put("/update-post/:id", memoryUpload.single('image'), async (req, res) => {
  const postId = req.params.id;
  const { title, description, categories, isPosted } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const pool = await poolPromise;

    let query = `
      UPDATE Posts
      SET PostTitle = @title,
          PostDescription = @description,
          isPosted = @isPosted
    `;

    if (imageBuffer) {
      query += `, PostPhoto = @imagePath`;
    }

    query += ` WHERE PostID = @postId`;

    const request = pool.request()
      .input('postId', sql.Int, postId)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('isPosted', sql.Bit, isPosted === '1' || isPosted === 1);

    if (imageBuffer) {
      request.input('imagePath', sql.VarBinary(sql.MAX), imageBuffer);
    }

    await request.query(query);

    // Clear existing categories
    await pool.request()
      .input('postId', sql.Int, postId)
      .query(`
        DELETE FROM PostCategories
        WHERE PostID = @postId
      `);

    // Insert new categories if provided
    if (categories) {
      const categoryIds = JSON.parse(categories);
      for (const catId of categoryIds) {
        await pool.request()
          .input('postId', sql.Int, postId)
          .input('categoryId', sql.Int, catId)
          .query(`
            INSERT INTO PostCategories (PostID, CategoryID)
            VALUES (@postId, @categoryId)
          `);
      }
    }

    res.status(200).json({ message: 'Post updated successfully' });
    console.log("Post Updated");

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});


// GET POST BY POSTID

app.get("/post/:id", async (req, res) => {
    const postId = req.params.id;
  try{

    const pool = await poolPromise;
    const result = await pool.request()
    .input('postId', sql.Int, postId)
    .query(`SELECT 
          p.PostID,
          p.PostTitle,
          p.PostPhoto,
          p.PostDescription,
          p.PostName,
          STRING_AGG(c.CategoryName, ', ') AS Categories
        FROM Posts p
        JOIN PostCategories pc ON p.PostID = pc.PostID
        JOIN Categories c ON pc.CategoryID = c.CategoryID
        WHERE p.PostID = @postId
        GROUP BY 
          p.PostID, p.PostTitle, p.PostPhoto, p.PostDescription, p.PostName`);
       if (result.recordset.length > 0) {
        res.json({
            message: "Post fetched successfully",
            status: true,
            data: result.recordset[0]
          });
       }
       else {
        res.status(404).json({ message: 'Post not found' });
       }

  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }

});

// DELETE POST
app.delete('/delete-post/:id', async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    const pool = await poolPromise;
        await pool.request()
      .input('postId', sql.Int, postId)
      .query(`DELETE FROM PostCategories WHERE PostID = @postId`);

    // Delete from Likes
    await pool.request()
      .input('postId', sql.Int, postId)
      .query(`DELETE FROM Likes WHERE PostID = @postId`);

    // Now delete from Posts
    await pool.request()
      .input('postId', sql.Int, postId)
      .query(`DELETE FROM Posts WHERE PostID = @postId`);


    res.status(200).json({ message: 'Post deleted successfully' });
    console.log("Post Deleted");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.post('/bin', async (req, res)=> {
   const postId = req.body.id;

   try {
     const pool = await poolPromise;
        await pool.request()
      .input('postId', sql.Int, postId)
      .query(`UPDATE Posts 
        SET IsDeleted = 1
        WHERE PostID = @postId`);
         res.status(200).json({ message: 'Post deleted successfully' });
         console.log("Soft Deleted");
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
   }

});

app.get('/deleted-posts/:id' ,async (req, res) =>{
  const userId = parseInt(req.params.id);
  try{
    const pool = await poolPromise;
    const result = await pool.request()
    .input('userId' ,sql.Int, userId)
    .query(` SELECT 
        p.PostID,
        p.PostTitle,
        p.PostPhoto,
        p.PostDescription,
        p.PostName,
        p.CreatedAt,
        u.UserID,
        u.Username,
        u.ProfilePhoto,
        STRING_AGG(c.CategoryName, ', ') AS Categories
      FROM Posts p
      JOIN Users u ON p.UserID = u.UserID
      JOIN PostCategories pc ON p.PostID = pc.PostID
      JOIN Categories c ON pc.CategoryID = c.CategoryID
      WHERE  u.UserID = @userId and p.isDeleted = 1
      GROUP BY p.PostID, p.PostTitle, p.PostPhoto, p.PostDescription, p.CreatedAt, p.PostName, u.UserID, u.Username, u.ProfilePhoto
      ORDER BY p.CreatedAt DESC `);
       res.json({
            message: "Data fetched successfully",
            status: true,
            data: result.recordset});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch deleted posts' });
   }


});

app.post('/restore', async (req, res) => {
  const postId = req.body.id;

  try {
     const pool = await poolPromise;
        await pool.request()
      .input('postId', sql.Int, postId)
      .query(`UPDATE Posts 
        SET IsDeleted = 0,
        isPosted = 1
        WHERE PostID = @postId`);
         res.status(200).json({ message: 'Post deleted successfully' });
         console.log("Soft Deleted");
   } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
   }

});



app.listen(port, '0.0.0.0', (req, res) =>{
    // console.log(`Server is running on: http://localhost:${port}`);
    console.log(`Server is running on: http://192.168.1.119:${port}`);
});

