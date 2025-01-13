import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Delete(
  connection: Connection,
  model: BaseModel,
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder.deleteFrom(model.tableName, conditions).getQuery();
  const [result] = await connection.execute(query);
  return result;
}
