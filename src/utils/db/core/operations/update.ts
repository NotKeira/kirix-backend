import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";

export async function Update<T>(
  connection: Connection,
  model: { new (): T },
  data: Record<string, any>,
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .update(model.prototype.tableName, data, conditions)
    .getQuery();
  const [result] = await connection.execute(query);
  return result;
}
