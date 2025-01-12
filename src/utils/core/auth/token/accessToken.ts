import { sign, verify } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN || "your-access-token-secret";
const ACCESS_TOKEN_LIFE = "1h";

// Helper to convert BigInt to string
const serializeBigInt = (obj: Record<string, any>): Record<string, any> => {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = typeof value === "bigint" ? value.toString() : value;
  }
  return newObj;
};

async function generateAccessToken(
  payload: Record<string, any>
): Promise<string> {
  const serializedPayload = serializeBigInt(payload);
  const token = await sign(serializedPayload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFE,
  });
  return token;
}

async function verifyAccessToken(
  token: string
): Promise<Record<string, any> | null> {
  try {
    const decoded = (await verify(token, ACCESS_TOKEN_SECRET)) as Record<string, any>;
    for (const [key, value] of Object.entries(decoded)) {
      if (typeof value === "string" && !isNaN(Number(value))) {
        decoded[key] = BigInt(value); 
      }
    }

    return decoded;
  } catch (err) {
    return null;
  }
}

export { generateAccessToken, verifyAccessToken };
