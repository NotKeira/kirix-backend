import type { NextApiRequest, NextApiResponse } from "next";
import { Snowflake } from "nodejs-snowflake";
import { Tokeniser } from "@/utils/core/auth/token/Generator";
import Database from "@/utils/db/core/Database";
import { UserModel, UserType } from "@/utils/db/core/types/User.model";
import { StringValidator } from "@/utils/core/server/validation";
import { DataBuilder } from "@/utils/core/server/specs/PrepareData";
type Data = {
  code: string;
  message: string;
  data:
    | {
        user: {
          id: string;
          username: string;
          tokens: {
            accessToken: string;
            refreshToken: string;
          };
        };
      }
    | null
    | undefined;
};
const toMySQLTimestamp = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const snowflake = new Snowflake().getUniqueID();
  const raw_payload = req.body;
  const payload: UserType = {
    id: snowflake,
    username: raw_payload.username,
    email: raw_payload.email,
    password: raw_payload.password,
    profilePicture: raw_payload.profilePicture || "default-profile.png",
    status: "online",
    createdAt: toMySQLTimestamp(new Date()),
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

  let userData;
  try {
    const hashableData = await new DataBuilder().run(new UserModel(), payload);
    if (typeof hashableData === "string") {
      return res.status(400).json({
        code: "failure",
        message: hashableData,
        data: null,
      });
    }
    userData = await (
      await Database.init()
    ).create(new UserModel(), hashableData);
    if (typeof userData === "string") {
      return res.status(400).json({
        code: "failure",
        message: userData as string | string,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: "failure",
      message: "Internal Server Error",
      data: null,
    });
  }

  const tokens = await Tokeniser.generateBatch(payload);
  const data = {
    user: {
      id: payload.id.toString(),
      username: payload.username as string,
      tokens: {
        accessToken: tokens.accessToken as string,
        refreshToken: tokens.refreshToken as string,
      },
    },
  };
  res.status(200).json({
    code: "success",
    message: `Successfully created a User and tokens.`,
    data,
  });
}
