import { BaseModel } from "./Base.model";

export interface UserType {
  id: BigInt;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  status:
    | "inactive"
    | "online"
    | "offline"
    | "do_not_disturb"
    | "away"
    | null
    | string
    | undefined;
  createdAt: number | BigInt | Date | string;
}

export class UserModel implements BaseModel {
  public tableName = "users";
  public columns = [
    "id",
    "username",
    "email",
    "password",
    "profilePicture",
    "status",
    "createdAt",
  ];
  public columnTypes = {
    id: "BIGINT PRIMARY KEY",
    username: "TEXT NOT NULL",
    email: "TEXT NOT NULL UNIQUE",
    password: "TEXT NOT NULL",
    profilePicture: "TEXT",
    status:
      "ENUM('inactive', 'online', 'offline', 'do_not_disturb', 'away') DEFAULT 'offline'",
    createdAt: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  };
}
