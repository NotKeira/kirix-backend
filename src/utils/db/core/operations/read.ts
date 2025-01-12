import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";

export async function Read<T>(
  connection: Connection,
  model: { new (): T },
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .select(Object.keys(conditions), model.prototype.tableName)
    .where(conditions)
    .getQuery();
  const [rows] = await connection.execute(query);
  return rows;
}
