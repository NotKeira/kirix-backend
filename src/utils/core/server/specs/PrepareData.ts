import { BaseModel } from "@/utils/db/core/types";
import { BaseService, UserModelService } from "./data";
import { UserModel, UserType } from "@/utils/db/core/types/User.model";

export class DataBuilder {
  private getService(model: BaseModel): BaseService {
    if (model instanceof UserModel) {
      return new UserModelService();
    } else {
      throw new Error("Service or Model not found.");
    }
  }

  async run(
    model: BaseModel,
    data: Record<string, any>
  ): Promise<void | any | Record<string, any>> {
    const service = this.getService(model);
    if (!service) {
      throw new Error("Service not found");
    }
    return await service.execute(data);
  }
}
