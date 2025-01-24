import { hashPassword } from "@/utils/db/core/utils/password";
import { BaseService } from "./Base.model";
import { UserModel } from "@/utils/db/core/types/User.model";
import Database from "@/utils/db/core/Database";

export class UserModelService extends BaseService {
  public async execute(
    data: Record<string, any>
  ): Promise<any | Record<string, any>> {
    const hashableData: Record<string, any> = {};
    hashableData.id = data.id;
    hashableData.username = data.username;

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
      hashableData.password = await hashPassword(data.password);
      hashableData.email = await hashPassword(data.email);
    } catch (error) {
      console.error("Error during encryption:", error);
      return "Error: Unable to create user. Try again later.";
    }

    console.log(hashableData);
    return hashableData;
  }
}
