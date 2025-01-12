import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";

export async function Delete<T>(
  connection: Connection,
  model: { new (): T },
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .deleteFrom(model.prototype.tableName, conditions)
    .getQuery();
  const [result] = await connection.execute(query);
  return result;
}
