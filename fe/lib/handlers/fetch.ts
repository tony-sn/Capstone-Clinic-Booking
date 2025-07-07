"use server";
import { getAuth } from "@/features/auth/queries/get-auth";

import { RequestError } from "../http-errors";
import logger from "../logger";

import handleError from "./error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 100000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const session = await getAuth();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${session?.session?.accessToken}`,
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    let responseBody = null;
    try {
      responseBody = await response.json();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `HTTP error: ${response.status}`,
        responseBody?.errors ?? responseBody
      );
    }

    return responseBody as ActionResponse<T>;
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
