type ValidateSessionResponse = {
  session: {
    expiresAt: number;
  } | null;
  user: {
    id: string;
    userName: string;
    email: string;
    claims: { type: string; value: string }[];
  } | null;
};

export const validateSession = async (
  sessionToken: string,
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
    return data;
  } catch (err) {
    console.error("Failed to validate session:", err);

    return { session: null, user: null };
  }
};
