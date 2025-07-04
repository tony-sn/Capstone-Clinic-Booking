import { redirect } from "next/navigation";

import { getAuth } from "@/features/auth/queries/get-auth";
import { signInPath, emailVerificationPath } from "@/paths";

type GetAuthOrRedirectOptions = {
  checkEmail?: boolean;
};

export const getAuthOrRedirect = async (options?: GetAuthOrRedirectOptions) => {
  const { checkEmail = true } = options ?? {};

  const auth = await getAuth();

  if (!auth?.user) {
    redirect(signInPath());
  }
  if (checkEmail && !auth.user.email) {
    redirect(emailVerificationPath());
  }

  return { ...auth };
};
