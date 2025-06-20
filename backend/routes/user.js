import express from 'express';
import { sql, poolPromise } from '../config/db.js';
import {diskUpload} from '../middleware/uploads.js';

const user = express.Router();

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