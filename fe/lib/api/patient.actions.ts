import { Endpoints } from "@/lib/app.config";

export const createUser = async (formData: FormData | CreateUserParams) => {
  const registerEndpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}/api/register`;
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
  const loginEndpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}/api/login`;
  const res = await fetch(loginEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("Login failed", error);
    throw new Error("Failed to login user");
  }
  return res.json();
};
