import express from 'express';
import { sql, poolPromise } from '../config/db.js';

const calendar = express.Router();

//1. CHECK STREAK
calendar.get('/streak/:id', async (req, res) => {
     const userID = parseInt(req.params.id, 10);

    if (isNaN(userID)) {
    return res.status(400).json({
        message: 'Invalid user ID',
        status: false
    });
}

    try{
        const pool = await poolPromise;
        const result = await pool.request()
        .input('userid', sql.Int, userID)
        .query(` Select CreatedAt From Posts Where UserID = @userid`);

        res.json({
        message: 'Streak Retrieved',
        status: true,
        data: result.recordset        
    });

    } catch(err){
        res.status(500).json({
        message: 'Failed to retrieve streak',
        status: false,
        error: err.message
});
    }
});


export default calendar;