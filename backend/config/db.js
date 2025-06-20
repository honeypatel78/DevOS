import sql from 'mssql';
import dotenv from 'dotenv';


dotenv.config({path: './.env'});

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: 'LAPTOP-AV0DATIT',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}


  const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log('MSSQL Connected');
    return pool;
  })
  .catch(err => {
    console.error(' Database Connection Failed!', err);
    throw err;
  });

export { sql, poolPromise, dotenv };



