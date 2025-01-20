import { hash, verify } from "argon2";

/**
 * Hashes a password with a secret (from environment variables) for added security.
 * @param password The plain-text password to hash.
 * @returns The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const secret = process.env.JWT_TOKEN || "defaultSecret"; // Fallback secret
  const passwordWithSecret = `${password}${secret}`;

  try {
    const hashedPassword = await hash(passwordWithSecret);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Unable to hash the password.");
  }
}

/**
 * Verifies a plain-text password against a hashed password.
 * @param plainPassword The plain-text password to verify.
 * @param hashedPassword The hashed password to compare against.
 * @returns Whether the password is valid.
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const secret = process.env.JWT_TOKEN || "defaultSecret"; // Fallback secret
  const passwordWithSecret = `${plainPassword}${secret}`;

  try {
    const isValid = await verify(hashedPassword, passwordWithSecret);
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Unable to verify the password.");
  }
}
