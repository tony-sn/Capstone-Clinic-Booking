import { Endpoints } from "@/lib/app.config";

const apiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.cyber-clinic.cloud/api";
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
  const loginEndpoint = `/api/login`;
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

    return true;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const postLogout = async (): Promise<ServerResponse> => {
  const logoutEndpoint = `/api/logout`;
  const res = await fetch(logoutEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let errMsg = `Lgout failed with status ${res.status}`;
    try {
      const errBody = (await res.json()) as { message?: string };
      if (errBody.message) errMsg = errBody.message;
    } catch {}
    throw new Error(errMsg);
  }

  return (await res.json()) as ServerResponse;
};

export const getUserInfo = async (options?: {
  headers?: Record<string, string> & HeadersInit;
}) => {
  const res = await fetch(`${apiUrl}/manage/info`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  // eslint-disable-next-line
  let data: any | undefined;
  if (res.ok) {
    try {
      data = await res.json();
    } catch {
      data = undefined;
    }
  }

  return {
    response: res,
    data,
  };
};
