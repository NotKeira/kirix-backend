import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Read(
  connection: Connection,
  model: BaseModel,
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .select(Object.keys(conditions), model.tableName)
    .where(conditions)
    .getQuery();
  const [rows] = await connection.execute(query);
  return rows;
}
