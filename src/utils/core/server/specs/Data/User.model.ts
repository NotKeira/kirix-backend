import { hashPassword } from "@/utils/db/core/utils/password";
import { BaseService } from "./Base.model";
import { UserModel } from "@/utils/db/core/types/User.model";
import Database from "@/utils/db/core/Database";

export class UserModelService extends BaseService {
  public async execute(data: Record<string, any>): Promise<any> {
    const model = new UserModel();
    const checks = { email: data.email, username: data.username };
    const duplicateFields: string[] = [];
    for (const [field, value] of Object.entries(checks)) {
      const existing = await (
        await Database.init()
      ).read(model, { [field]: value });
      if (Array.isArray(existing) && existing.length > 0) {
        duplicateFields.push(field);
      }
    }

    if (duplicateFields.length) {
      return `Error: Duplicate ${duplicateFields.join(", ")} found.`;
    }

    try {
      data.password = await hashPassword(data.password);
    } catch (error) {
      console.error("Error during password encryption:", error);
      return "Error: Unable to create user. Try again later.";
    }

    return data;
  }
}
