import { Connection, ResultSetHeader } from "mysql2/promise";
import QueryBuilder from "../query";
import { BaseModel } from "../types";

export async function Delete(
  connection: Connection,
  model: BaseModel,
  conditions: Record<string, any>
): Promise<ResultSetHeader> {
  if (!model.tableName) {
    throw new Error("The model does not have a valid tableName property.");
  }

  const queryBuilder = new QueryBuilder();
  const query = queryBuilder.deleteFrom(model.tableName, conditions).getQuery();

  try {
    const [result] = await connection.execute<ResultSetHeader>(query);
    return result;
  } catch (error) {
    console.error("Error during Delete operation:", error);
    throw error;
  }
}
