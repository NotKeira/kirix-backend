import type { NextApiRequest, NextApiResponse } from "next";
import { Snowflake } from "nodejs-snowflake";
type Data = {
  status: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const snowflake = await new Snowflake().getUniqueID();
  console.log(snowflake);
    res.status(200).json({ status: "success", message: `Generated snowflake: ${snowflake}` });
}
