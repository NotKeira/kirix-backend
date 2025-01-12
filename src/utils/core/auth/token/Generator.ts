import { generateAccessToken, verifyAccessToken } from "./accessToken";
import { generateRefreshToken, verifyRefreshToken } from "./refreshToken";

export class Tokeniser {
  static async generateBatch(payload: Record<string, any>) {
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  static async generateAccess(payload: Record<string, any>) {
    return await generateAccessToken(payload);
  }

  static async generateRefresh(payload: Record<string, any>) {
    return await generateRefreshToken(payload);
  }

  static async verifyAccessToken(token: string) {
    return await verifyAccessToken(token);
  }

  static async verifyRefreshToken(token: string) {
    return await verifyRefreshToken(token);
  }
}
