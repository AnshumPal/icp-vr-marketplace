// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import { MongoClient } from "mongodb";
// import * as schema from "../shared/schema"; // keep this if schema is reused for validation/types

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Load .env with explicit path
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// // Debug log
// console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL);

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to set it in .env?",
//   );
// }

// // ✅ Initialize MongoDB Client
// export const mongoClient = new MongoClient(process.env.DATABASE_URL);
// export const db = mongoClient.db(); // optionally pass your DB name here: db("your-db-name")


import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
import * as schema from "../shared/schema"; // keep this if schema is reused for validation/types
import pg from 'pg';
const { Pool } = pg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env with explicit path
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Debug log
console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to set it in .env?");
}

// ✅ Initialize PostgreSQL Pool + Drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema }); // schema is optional if already inferred
