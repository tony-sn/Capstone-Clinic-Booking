import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const message = await apiRes.text();
      return new NextResponse(message, { status: apiRes.status });
    }

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    console.error("/api/register error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
