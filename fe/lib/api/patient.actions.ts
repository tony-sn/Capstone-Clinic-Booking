import { Endpoints } from "@/lib/app.config";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const createUser = async (formData: FormData | CreateUserParams) => {
  const registerEndpoint = `${apiUrl}/register`;
  console.log({
    endpoint: Endpoints.REGISTER,
    registerEndpoint,
  });
  const res = await fetch(registerEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Registration failed", error);
    throw new Error("Failed to register user");
  }
  return res.json();
};

export const login = async (formData: FormData | LoginUserParams) => {
  const loginEndpoint = `${apiUrl}/login?useCookies=true&useSessionCookies=true`;
  try {
    const res = await fetch(loginEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Login failed", error);
      throw new Error("Failed to login user");
    }

    const tokenData = await res.json();

    return tokenData;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUserInfo = async () => {
  const res = await fetch(`${apiUrl}/manage/info`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user info");
  }

  return res.json();
};
