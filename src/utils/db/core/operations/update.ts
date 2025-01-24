import { Connection, ResultSetHeader } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Update(
  connection: Connection,
  model: BaseModel,
  data: Record<string, any>,
  conditions: Record<string, any>
): Promise<ResultSetHeader> {
  if (!model.tableName) {
    throw new Error("The model does not have a valid tableName property.");
  }

  const queryBuilder = new QueryBuilder();
  const query = queryBuilder
    .update(model.tableName, data, conditions)
    .getQuery();

  try {
    const [result] = await connection.execute<ResultSetHeader>(query);
    return result;
  } catch (error) {
    console.error("Error during Update operation:", error);
    throw error;
  }
}
