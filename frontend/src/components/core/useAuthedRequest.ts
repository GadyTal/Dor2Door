import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { Config } from "../../shared/Config";

export class UnauthenticatedError extends Error {}

async function makeAuthedGetRequest<Data>(
  maybePrefixedPath: string
): Promise<Data> {
  const path = maybePrefixedPath.replace(/^\//, "");
  const token = localStorage.getItem(Config.tokenPrefix);
  if (!token) {
    throw new UnauthenticatedError();
  }
  const { data } = await axios.get<Data>(`${Config.API_URL}/${path}`, {
    headers: {
      Authorization: atob(token),
    },
  });
  return data;
}

export function useAuthedRequest<Data>(path: string) {
  return useSWR<Data, UnauthenticatedError | AxiosError>(
    path,
    makeAuthedGetRequest
  );
}
