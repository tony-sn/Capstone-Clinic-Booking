import { headers } from "next/headers";

import { getUserInfo } from "@/lib/api/patient.actions";

export const getHeadersObj = async () => {
  const headersList = await headers();
  return Object.fromEntries(headersList.entries());
};

export const getUserInfoWithHeaders = async () => {
  const headersObj = await getHeadersObj();
  return getUserInfo({ headers: headersObj });
};
