import { NextResponse, NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/constants";

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!API_URL) throw new Error("Missing API URL");
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const logoutEndpoint = `${API_URL}/logout`;
    const response = await fetch(logoutEndpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    const res = NextResponse.json(
      { success: true, message: "Logout Successfully." },
      { status: response.status === 204 ? 200 : response.status }
    );
    res.cookies.delete(SESSION_COOKIE_NAME);

    return res;
  } catch (error) {
    console.error("Cannot logout", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
