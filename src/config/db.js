import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "finance_dashboard",
  password: "postgres",
  port: 5432,
});

export default pool;