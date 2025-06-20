import express from 'express';
import { sql, poolPromise } from '../config/db.js';

const router = express.Router();


//1.LOGIN API
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
   console.log('Login attempt:', username);

  try {
    const pool = await poolPromise;
    const result = await pool.request()
     .input('username', sql.NVarChar, username)
     .query('SELECT * FROM users WHERE Username = @username');

    if (result.recordset.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.recordset[0];

    if (user.Password !== password) {
       console.log('Incorrect password for user:', username);
      return res.status(401).json({ message: 'Incorrect password' });
      
    }

    // Login success
    res.json({
      message: 'Login successful',
      status: true,
      user: {
        id: user.UserID,
        username: user.Username,
        role: user.UserRole
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//2. SIGNUP API
router.post('/signup', async (req, res) => {
  const {username, password, avatar} = req.body;
   console.log('Signup attempt:', username);

  try{

    const pool = await poolPromise;
    const existing = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    if (existing.recordset.length > 0) {
      console.log('user exists');
      return res.status(400).json({ message: 'Username already exists' });
    }

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password) 
      .input('avatar', sql.NVarChar, avatar)
      .query(`
        INSERT INTO Users (Username, Password, ProfilePhoto, Name, Bio)
        VALUES (@username, @password, @avatar, 'XYZ', 'Hey! I am on DevOS');
        SELECT SCOPE_IDENTITY() AS UserID;
      `);
    const userId = result.recordset[0].UserID;
    console.log('User added with ID:', userId);

    res.json({
      message: 'Signup successful',
      status: true,
      user: {
        id: userId,
        username: username
      }
    });
  }
  catch(error){
    console.error(err);
    console.log('sing up fail');
    res.status(500).json({ message: 'Signup Failed' })
  }
});

//CHANGE PW API
router.post('/changePW/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { password, newpass } = req.body;

  try {
    const pool = await poolPromise;

    const existing = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`SELECT Password FROM Users WHERE UserID = @userId`);

    if (!existing.recordset[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (existing.recordset[0].Password !== password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    await pool.request()
      .input('newpass', sql.NVarChar, newpass)
      .input('userId', sql.Int, userId)
      .query(`UPDATE Users SET Password = @newpass WHERE UserID = @userId`);

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Cannot change password' });
  }
});

export default router;
