export async function POST(request: Request) {
  try {
    const body = await request.json();
    const loginEndpoint = `${process.env.API_BASE_URL}/login?useCookies=true&useSessionCookies=true`;

    const res = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.text();
      return Response.json(
        { error: `Login failed: ${error}` },
        { status: res.status }
      );
    }

    const tokenData = await res.json();

    // Get the Set-Cookie headers from the backend response
    const setCookieHeaders = res.headers.get("set-cookie");

    // Create the response
    const response = Response.json({
      tokenType: tokenData.tokenType,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
    });

    // Forward the Set-Cookie headers to the client
    if (setCookieHeaders) {
      response.headers.set("Set-Cookie", setCookieHeaders);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
