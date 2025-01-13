import { QueryResult } from "mysql2/promise";
import createConnection from "./connection";
import { Create, Read, Update, Delete } from "./operations";
import { BaseModel } from "./types";
class Database {
  private static connection: any;

  public static async init(): Promise<typeof Database> {
    this.connection = await createConnection();
    return Database;
  }

  static async create<T extends BaseModel>(
    model: T,
    data: Record<string, any>
  ) {
    if (model.tableName === "users") {
      const checks: {[key: string]: any} = {
        email: data.email,
        username: data.username,
      };
      let checkResult: QueryResult[] = [];
      for (let key in checks) {
        const check = await this.read(model, { [key]: checks[key] });
        checkResult.push(check);
      }

      if (checkResult[0].length > 0) {
        return "Email already in use";
      } else if (checkResult[1].length > 0) {
        return "Username already in use";
      }

      const result = await Create(this.connection, model, data);
      const postExist: QueryResult = await this.read(model, data.email);
      console.log(postExist);
      return result;
    } else {
      const result = await Create(this.connection, model, data);
      return result;
    }
  }

  static async read<T extends BaseModel>(
    model: T,
    conditions: Record<string, any>
  ) {
    const connection = await this.connection;
    const result = await Read(connection, model, conditions);
    return result;
  }

  static async update<T extends BaseModel>(
    model: T,
    data: Record<string, any>,
    conditions: Record<string, any>
  ) {
    const connection = await this.connection;
    const result = await Update(connection, model, data, conditions);
    return result;
  }

  static async delete<T extends BaseModel>(
    model: T,
    conditions: Record<string, any>
  ) {
    const connection = await this.connection;
    const result = await Delete(connection, model, conditions);
    return result;
  }

  static async createTable<T extends BaseModel>(model: T) {
    const connection = await this.connection;
    const { tableName, columnTypes } = model;

    const columnsDefinition = Object.entries(columnTypes)
      .map(([column, definition]) => `\`${column}\` ${definition}`)
      .join(", ");

    const createTableSQL = `CREATE TABLE IF NOT EXISTS \`${tableName}\` (${columnsDefinition})`;

    try {
      await connection.query(createTableSQL);
      console.log(`Table '${tableName}' created successfully.`);
    } catch (error) {
      console.error(`Error creating table '${tableName}':`, error);
      throw error;
    }
  }
}

export default Database;
