import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;


// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "finance_dashboard",
//   password: "postgres",
//   port: 5432,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("Unexpected database error", err);
  process.exit(-1);
});


// Temporary connection test — we'll remove this later
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to PostgreSQL database at:", res.rows[0].now);
  }
});

export default pool;