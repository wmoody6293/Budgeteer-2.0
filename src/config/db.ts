import { Pool, QueryResult } from 'pg';

const pool: Pool = new Pool({ connectionString: process.env.PG_STRING });
const query = (
  text: string,
  params: any,
  callback: (err: Error, result: QueryResult<any>) => void
) => {
  console.log('executed query: ', text);
  return pool.query(text, params, callback);
};
export { query };
