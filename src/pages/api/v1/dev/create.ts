import type { NextApiRequest, NextApiResponse } from "next";
import Database from "@/utils/db/core/Database";
import { UserModel } from "@/utils/db/core/types/User.model";
type Data = {
  status: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    Database.createTable(UserModel);
    res.status(200).json({ status: "success", message: `Generated table.` });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Failed to create table." });
    return;
  }
}
