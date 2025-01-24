import type { NextApiRequest, NextApiResponse } from "next";
import { Tokeniser } from "@/utils/core/auth/token/Generator";
import Database from "@/utils/db/core/Database";
import { UserModel, UserType } from "@/utils/db/core/types/User.model";
import { StringValidator } from "@/utils/core/server/validation";
type Data = {
  code: string;
  message: string;
  data:
    | {
        user: {
          tokens: {
            accessToken: string;
            refreshToken: string;
          };
        };
      }
    | null
    | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const raw_payload = req.body;

  const payload = {
    username: raw_payload.username || "",
    email: raw_payload.email || "",
    password: raw_payload.password,
  };

  // Validate the payload inputs for dangerous or invalid keys
  for (const key in [payload.email, payload.password, payload.username]) {
    if (StringValidator.containsDangerous(key)) {
      return res.status(400).json({
        code: "failure",
        message: "Payload contains dangerous characters",
        data: null,
      });
    }
    switch (key) {
      case payload.email:
        if (!StringValidator.isEmail(payload.email)) {
          return res.status(400).json({
            code: "failure",
            message: "Invalid email",
            data: null,
          });
        }
        break;
      case payload.password:
        if (!StringValidator.isPassword(payload.password)) {
          return res.status(400).json({
            code: "failure",
            message: "Invalid password",
            data: null,
          });
        }
        break;
      case payload.username:
        if (!StringValidator.isUsername(payload.username)) {
          return res.status(400).json({
            code: "failure",
            message: "Invalid username",
            data: null,
          });
        }
        break;
    }
  }

  
  const tokens = await Tokeniser.generateBatch(payload);
  const data = {
    user: {
      tokens: {
        accessToken: tokens.accessToken as string,
        refreshToken: tokens.refreshToken as string,
      },
    },
  };
  res.status(200).json({
    code: "success",
    message: `Authentication successful for ${payload.username}`,
    data,
  });
}
