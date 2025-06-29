import { Endpoints } from "@/lib/app.config";

export const createUser = async (formData: FormData) => {
  const res = await fetch(`${Endpoints.REGISTER}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error("Failed to register user");
  }
  return res.json();
};
