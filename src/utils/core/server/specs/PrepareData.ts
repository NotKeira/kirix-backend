import { BaseModel } from "@/utils/db/core/types";
import { BaseService, UserModelService } from "./Data";
import { UserModel } from "@/utils/db/core/types/User.model";

export class PrepareData {
  private getService(model: BaseModel): BaseService {
    switch (model) {
      case new UserModel():
        return new UserModelService();
      default:
        throw new Error("Model not found");
    }
  }

  async run(model: BaseModel, data: Record<string, any>): Promise<void> {
    const service = this.getService(model);
    if (!service) {
      throw new Error("Service not found");
    }
    await service.execute(data);
  }
}
