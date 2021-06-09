import mysql from 'mysql';

const pool = mysql.createPool({
    host: process.env.MYSQLDATABASEHOST,
    user: process.env.MYSQLDATABASEUSER,
    password: process.env.MYSQLDATABASEPASSWORD,
    database: process.env.MYSQLDATABASENAME,
    connectionLimit: 500,
    queueLimit: 0,
    waitForConnections: true,
});

export const sqlDbConnection = function () {
    return new Promise<mysql.PoolConnection>((resolve, reject) => {
        pool.getConnection((err, connection) => {
        if (err) {
            reject(err);
            return;
        }
        console.log("Connection made successfully")
        resolve(connection);
        // connection.release();
        });
    });
};