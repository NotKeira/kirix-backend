import { Connection } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Create(
  connection: Connection,
  model: BaseModel,
  data: Record<string, any>
) {
  if (!model.tableName) {
    throw new Error("The model does not have a valid tableName property.");
  }
  const queryBuilder = new QueryBuilder();
  const query = queryBuilder.insertInto(model.tableName, data).getQuery();
  const [result] = await connection.execute(query);
  return result;
}
