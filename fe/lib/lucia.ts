type ValidateSessionResponse = {
  session: {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
  } | null;
  user: {
    id: string;
    userName: string;
    email: string;
    claims: { type: string; value: string }[];
  } | null;
};

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days

export const createSession = async (sessionToken: string) => {
  const sessionId = sessionToken;

  const session = {
    id: sessionId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  };

  return session;
};

export const validateSession = async (
  sessionToken: string
): Promise<ValidateSessionResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!res.ok) {
      return { session: null, user: null };
    }

    const data = await res.json();
    const { user, ...session } = data;

    // if the session is expired, delete it
    if (Date.now() >= session.expiresIn) {
      return { session: null, user: null };
    }

    return { session, user };
  } catch (err) {
    console.error("Failed to validate session:", err);

    return { session: null, user: null };
  }
};
