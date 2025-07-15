import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/constants";

const API_URL = (() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log({ apiUrl });
  if (!apiUrl) throw new Error("Missing API URL");
  return apiUrl;
})();

export async function POST() {
  const cookieStore = await cookies();
  try {
    const storageKey = SESSION_COOKIE_NAME;
    const logoutEndpoint = `${API_URL}/logout`;
    console.log("logoutEndpoint", logoutEndpoint);
    const response = await fetch(logoutEndpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 204) {
      cookieStore.delete(storageKey);
    }
    return NextResponse.json({
      success: true,
      message: "Logout successfully.",
    });
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
