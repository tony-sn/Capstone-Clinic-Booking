import { Endpoints } from "@/lib/app.config";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const useCookies = process.env.NEXT_PUBLIC_USE_COOKIE;
const useSessionCookies = process.env.NEXT_PUBLIC_USE_SESSION_COOKIE;
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
  const loginEndpoint = `${apiUrl}/login?useCookies=false&useSessionCookies=true`;
  const res = await fetch(loginEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  if (res.status === 204) {
    return true;
  }

  if (!res.ok) {
    const error = await res.text();
    console.error("Login failed", error);
    throw new Error("Failed to login user");
  }

  try {
    return await res.json();
  } catch {
    return true;
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
