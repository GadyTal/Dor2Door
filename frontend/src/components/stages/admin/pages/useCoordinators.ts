import { useAuthedRequest } from "../../../core/useAuthedRequest";

export function useCoordinators() {
  return useAuthedRequest<Components.Schemas.GetCoordinators>(
    "/volunteer/coordinators"
  );
}
