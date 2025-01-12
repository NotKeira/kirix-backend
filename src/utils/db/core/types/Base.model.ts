export interface BaseModel {
  tableName: string;
  columns: string[];
  columnTypes: Record<string, string>;
}