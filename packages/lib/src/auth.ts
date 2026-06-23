import { SignJWT, jwtVerify } from "jose";

/**
 * Auth admin sederhana: 1 akun, password di env ADMIN_PASSWORD.
 * Session disimpan sebagai JWT bertanda di cookie httpOnly.
 */

const COOKIE_NAME = "desa_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("SESSION_SECRET belum di-set atau terlalu pendek");
  }
  return new TextEncoder().encode(secret);
}

/** Verifikasi password login terhadap ADMIN_PASSWORD. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD belum di-set");
  // bandingkan waktu-konstan sederhana
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Buat token session bertanda. */
export async function createSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());
}

/** Verifikasi token session; true bila valid. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE;
