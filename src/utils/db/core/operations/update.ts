import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Update(
  connection: Connection,
  model: BaseModel,
  data: Record<string, any>,
  conditions: Record<string, any>
) {
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .update(model.tableName, data, conditions)
    .getQuery();
  const [result] = await connection.execute(query);
  return result;
}
