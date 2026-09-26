import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ADMIN_PASSPHRASE = process.env.ADMIN_PASSPHRASE || process.env.ADMIN_SECRET || "HWI2026";
const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "insecure-fallback-change-in-production"
);

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    let cleanPassword = (password || "").trim();
    // Allow "admin: PASSPHRASE" as well as bare passphrase
    const prefixMatch = cleanPassword.match(/^admin\s*:\s*(.*)$/i);
    if (prefixMatch) cleanPassword = prefixMatch[1].trim();

    if (cleanPassword !== ADMIN_PASSPHRASE) {
      console.warn("[admin/auth] failed login attempt");
      return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
    }

    // Issue a proper signed JWT instead of the old plaintext "VERIFIED" string.
    // The middleware now verifies this token cryptographically.
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    console.log("[admin/auth] admin login success");

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "cyberhunt_admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[admin/auth] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
