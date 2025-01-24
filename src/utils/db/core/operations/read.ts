import { Connection, RowDataPacket } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Read<T extends RowDataPacket[]>(
  connection: Connection,
  model: BaseModel,
  conditions: Record<string, any>
): Promise<T> {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .select(Object.keys(conditions), model.tableName)
    .where(conditions)
    .getQuery();

  const [rows] = await connection.execute<T>(query);
  return rows;
}
