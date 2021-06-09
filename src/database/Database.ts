
import { sqlDbConnection } from '../utils/mysqlConnector';

class DataBase {
    manageConnections(query: string) {
        return new Promise(async (resolve, reject) => {
            const connection = await sqlDbConnection();

        // create a query
            connection.query(query, (error, results, fields) => {
                connection.release();
                if (error) {
                reject(error);
                return;
                }
                // connected!
                const rows = results;
                // const rowCount = results.length ? results.length : results.affectedRows;

                resolve({ rows });
            });
        });
    }

    async execute(query: string) {
        const result = await this.manageConnections(query);
        return result;
    }
}

export default DataBase;