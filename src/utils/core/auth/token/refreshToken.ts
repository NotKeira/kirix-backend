import { sign, verify } from "jsonwebtoken";

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-token-secret";
const REFRESH_TOKEN_EXPIRATION = "7d";

// Helper to convert BigInt to string
const serializeBigInt = (obj: Record<string, any>): Record<string, any> => {
  const newObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[key] = typeof value === "bigint" ? value.toString() : value;
  }
  return newObj;
};

async function generateRefreshToken(
  payload: Record<string, any>
): Promise<string> {
  const serializedPayload = serializeBigInt(payload);
  return sign(serializedPayload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  }) as string;
}

async function verifyRefreshToken(
  token: string
): Promise<Record<string, any> | null> {
  try {
    const decoded = verify(token, REFRESH_TOKEN_SECRET) as Record<string, any>;

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

export { generateRefreshToken, verifyRefreshToken };
