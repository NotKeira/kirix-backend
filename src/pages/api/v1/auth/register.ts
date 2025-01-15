import type { NextApiRequest, NextApiResponse } from "next";
import { Snowflake } from "nodejs-snowflake";
import { Tokeniser } from "@/utils/core/auth/token/Generator";
import Database from "@/utils/db/core/Database";
import { UserModel, UserType } from "@/utils/db/core/types/User.model";
type Data = {
  code: string;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
    };
  } | null | undefined;
};
const toMySQLTimestamp = (date: Date): string => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const snowflake = await new Snowflake().getUniqueID();
  const raw_payload = req.body;

  const payload: UserType = {
    id: snowflake,
    username: raw_payload.username,
    email: raw_payload.email,
    password: raw_payload.password,
    profilePicture: raw_payload.profilePicture,
    status: "online",
    createdAt: toMySQLTimestamp(new Date()),
  };
  let userData;
  try {
    userData = await (
      await Database.init()
    ).create(new UserModel(), payload);
    if (typeof userData === "string") {
      return res.status(400).json({
        code: "failure",
        message: userData,
        data: null,
      });
    }
  } catch (error) {
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
