import { NextResponse, NextRequest } from "next/server";
import * as z from "zod";

// import { SESSION_COOKIE_NAME } from "@/constants";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const loginEndpoint = `${apiUrl}/login?useCookies=true&useSessionCookies=true`;
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          message: errorData.message || "Authentication failed",
        },
        { status: 401 }
      );
    }

    const raw = response.headers.get("set-cookie");
    if (!raw) {
      return NextResponse.json(
        { error: "No cookie returned" },
        { status: 502 }
      );
    }

    const cookie = raw.replace(/; *Domain=[^;]+/i, "");
    // const [name, ...valueParts] = cookie.split("=");
    // const value = valueParts.join("=");

    const res = NextResponse.json({ success: true });
    res.headers.set("Set-Cookie", cookie);
    // res.cookies.set({
    //   name: name || SESSION_COOKIE_NAME,
    //   value: value,
    //   path: "/",
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax" as const,
    // });
    console.log({ raw, cookie, res });
    return res;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
