import { QueryResult } from "mysql2/promise";
import createConnection from "./connection";
import { Create, Read, Update, Delete } from "./operations";
import { BaseModel } from "./types";
import { hash, Options, verify } from "argon2";
import { hashPassword } from "./utils/password";
import { UserModel } from "./types/User.model";
import { StringValidator } from "@/utils/core/server/validation";

class Database {
  private static connection: any;

  public static async init(): Promise<typeof Database> {
    this.connection = await createConnection();
    return Database;
  }

  static async create<T extends BaseModel>(
    model: T,
    data: Record<string, any>
  ): Promise<QueryResult | string | undefined> {
    const result = await Create(this.connection, model, data);
    return result;
  }

  static async read<T extends BaseModel>(
    model: T,
    conditions: Record<string, any>
  ): Promise<QueryResult> {
    const connection = await this.connection;
    try {
      return await Read(connection, model, conditions);
    } catch (error) {
      console.error("Error reading from model:", error);
      throw new Error("Error while reading data.");
    }
  }

  static async update<T extends BaseModel>(
    model: T,
    data: Record<string, any>,
    conditions: Record<string, any>
  ): Promise<QueryResult> {
    const connection = await this.connection;
    try {
      return await Update(connection, model, data, conditions);
    } catch (error) {
      console.error("Error updating data:", error);
      throw new Error("Error while updating data.");
    }
  }

  static async delete<T extends BaseModel>(
    model: T,
    conditions: Record<string, any>
  ): Promise<QueryResult> {
    const connection = await this.connection;
    try {
      return await Delete(connection, model, conditions);
    } catch (error) {
      console.error("Error deleting data:", error);
      throw new Error("Error while deleting data.");
    }
  }

  static async createTable<T extends BaseModel>(model: T): Promise<void> {
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

  public static locate = class {
    public static async User() {
      return {
        byUsernameOrEmail: async (identifier: string) => {
          if (!identifier) {
            throw new Error("Identifier not provided.");
          } else {
            if (StringValidator.isEmail(identifier)) {
              const user = await Database.read(new UserModel(), {
                email: identifier,
              });
              return user;
            } else {
              const user = await Database.read(new UserModel(), {
                username: identifier,
              });
              return user;
            }
          }
        },
      };
    }
  };
}

export default Database;
