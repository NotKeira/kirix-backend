import mysql, { ConnectionOptions } from "mysql2/promise";

const configuration: ConnectionOptions = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
};

export default async function createConnection(): Promise<mysql.Connection | null> {
  try {
    return await mysql.createConnection(configuration);
  } catch (err) {
    console.error(err);
    return null;
  }
}
