import Database from "@/utils/db/core/Database";
import { verifyPassword } from "@/utils/db/core/utils/password";
import { RowDataPacket } from "mysql2";

export class LoginChecker {
    public static async validateCredentials(identifier: string, password: string): Promise<boolean> {
        const user: RowDataPacket = await (await Database.locate.User()).byUsernameOrEmail(identifier);
        if (!user) return false;
        return verifyPassword(password, user.password);
    }
}