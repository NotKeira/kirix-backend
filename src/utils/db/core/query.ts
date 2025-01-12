class QueryBuilder {
  private query: string;

  constructor() {
    this.query = "";
  }

  select(fields: string[], table: string) {
    this.query = `SELECT ${fields.join(", ")} FROM ${table}`;
    return this;
  }

  where(conditions: Record<string, any>) {
    const whereClauses = Object.entries(conditions).map(
      ([key, value]) => `${key} = '${value}'`
    );
    this.query += ` WHERE ${whereClauses.join(" AND ")}`;
    return this;
  }

  insertInto(table: string, data: Record<string, any>) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((value) => `'${value}'`)
      .join(", ");
    this.query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
    return this;
  }

  update(
    table: string,
    data: Record<string, any>,
    conditions: Record<string, any>
  ) {
    const setClauses = Object.entries(data)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(", ");
    this.query = `UPDATE ${table} SET ${setClauses}`;
    this.where(conditions);
    return this;
  }

  deleteFrom(table: string, conditions: Record<string, any>) {
    this.query = `DELETE FROM ${table}`;
    this.where(conditions);
    return this;
  }

  getQuery() {
    return this.query;
  }
}

export default QueryBuilder;
