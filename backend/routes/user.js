import express from 'express';
import { sql, poolPromise } from '../config/db.js';
import {diskUpload} from '../middleware/uploads.js';

const user = express.Router();

// GET USER BY ID
user.get('/user/:id', async (req, res) => { 
  const userId = req.params.id;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Users WHERE UserID = @userId');
    
    if (result.recordset.length > 0) {
      res.json({
        message: "User fetched successfully",
        status: true,
        data: result.recordset[0]
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }

});

// GET ALL USERS
user.get('/users', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      WITH RecentPosts AS (
        SELECT 
          p.PostID,
          p.UserID,
          p.PostTitle,   
          p.PostDescription,  
          p.CreatedAt,
          ROW_NUMBER() OVER (PARTITION BY p.UserID ORDER BY p.CreatedAt DESC) AS rn
        FROM [DevOS].[dbo].[Posts] p
      )
      SELECT 
        u.UserID,
        u.Username,
        u.ProfilePhoto,
        u.CreatedAt AS UserCreatedAt,
        u.Name,
        u.Bio,
        u.About,
        s.Platform,
        s.ProfileLink,
        ts.tech_name,
        rp.PostID,
        rp.PostTitle,
        rp.PostDescription,
        rp.CreatedAt 
      FROM [DevOS].[dbo].[Users] u
      LEFT JOIN [DevOS].[dbo].[UserSocialLinks] s ON u.UserID = s.UserID
      LEFT JOIN [DevOS].[dbo].[UserTechStack] ut ON u.UserID = ut.UserID
      LEFT JOIN [DevOS].[dbo].[TechStack] ts ON ut.techstack_id = ts.id
      LEFT JOIN RecentPosts rp ON u.UserID = rp.UserID AND rp.rn <= 3
      ORDER BY u.UserID, rp.CreatedAt DESC;
    `);

    const users = {};

    result.recordset.forEach(row => {
      if (!users[row.UserID]) {
        users[row.UserID] = {
          UserID: row.UserID,
          Username: row.Username,
          ProfilePhoto: row.ProfilePhoto,
          CreatedAt: row.UserCreatedAt,  // ✅ fixed from row.CreatedAt
          Name: row.Name,
          Bio: row.Bio,
          About: row.About,
          SocialLinks: [],
          TechStack: [],
          RecentPosts: []
        };
      }

      // Social Links
      if (row.Platform && row.ProfileLink) {
        const exists = users[row.UserID].SocialLinks.some(
          s => s.Platform === row.Platform
        );
        if (!exists) {
          users[row.UserID].SocialLinks.push({
            Platform: row.Platform,
            Link: row.ProfileLink
          });
        }
      }

      // Tech Stack
      if (row.tech_name && !users[row.UserID].TechStack.includes(row.tech_name)) {
        users[row.UserID].TechStack.push(row.tech_name);
      }

      // Recent Posts ✅ MOVE HERE
      if (row.PostID && row.PostTitle && row.CreatedAt) {
        const postExists = users[row.UserID].RecentPosts.some(
          p => p.PostID === row.PostID
        );
        if (!postExists) {
          users[row.UserID].RecentPosts.push({
            PostID: row.PostID,
            PostTitle: row.PostTitle,
            PostDescription: row.PostDescription,
            CreatedAt: row.CreatedAt
          });
        }
      }
    });

    res.json({
      message: "Users fetched successfully",
      status: true,
      data: Object.values(users)
    });
  } catch (err) {
    console.error('Error fetching user profiles:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// UPDATE USER DATA
user.put("/update-user/:id", diskUpload.single('image'), async (req, res) => {
  const userId = req.params.id;
  const { name, username, bio} = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const pool = await poolPromise;

    // Update the post
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('name', sql.NVarChar, name)
      .input('imagePath', sql.NVarChar, imagePath)
      .input('username', sql.NVarChar, username)
      .input('bio', sql.NVarChar, bio)
      .query(`
        UPDATE Users
        SET Name = @name,
            Username = @username,
            Bio = @bio,
            ProfilePhoto = @imagePath
        WHERE UserID = @userId
      `);


    res.status(200).json({ message: 'User updated successfully' });
    console.log("User Updated");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update User' });
  }

});

export default user;