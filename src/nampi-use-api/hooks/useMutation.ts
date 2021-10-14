import { expand } from "jsonld";
import { useState } from "react";
import { namespaces } from "../namespaces";
import { normalize } from "../normalize";
import {
    DeleteHook,
    Endpoint,
    MutationFunction,
    MutationHook,
    MutationResultContent,
    MutationState,
    NampiError
} from "../types";
import { buildPath } from "../utils/buildPath";
import { useNampiContext } from "./useNampiContext";

const isError = <ResultType>(
  data: NampiError | ResultType
): data is NampiError =>
  (data as unknown as NampiError)?.types?.includes(namespaces.hydra.Status.iri);

const toFetchFormData = (
  data: Record<string, undefined | string | string[]>
): string => {
  const formData: string[] = [];
  Object.entries(data).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          formData.push(`${key}%5B%5D=${encodeURIComponent(v)}`);
        }
      });
    } else {
      formData.push(`${key}=${encodeURIComponent(value)}`);
    }
  });
  return formData.join("&");
};

const wrapResult = <ResultType>(
  result: NampiError | ResultType
): MutationResultContent<ResultType> => {
  if (isError(result)) {
    delete (result as unknown as { idLocal?: string }).idLocal;
    return { error: result };
  } else {
    return { data: result };
  }
};

export const useMutate = <PayloadType, ResultType>(
  url: string,
  method: "POST" | "PUT" | "DELETE"
): [
  mutate: MutationFunction<PayloadType, ResultType>,
  state: MutationState<ResultType>
] => {
  const { token, propertyMap, updateToken } = useNampiContext();
  const [state, setState] = useState<MutationState<ResultType>>({
    loading: false,
  });
  return [
    async (payload: PayloadType) => {
      if (!token) {
        const result = {
          error: {
            title: { value: "Unauthorized", language: "en" },
            description: { value: "No token available" },
            statusCode: 401,
            types: [namespaces.hydra.Status.iri],
          },
        };
        setState({ ...result, loading: false });
        return result;
      }
      setState((old) => ({ ...old, loading: true }));
      return updateToken(30)
        .then(() =>
          fetch(url, {
            headers: {
              Accept: "application/ld+json",
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
            method,
            body:
              payload &&
              toFetchFormData(
                payload as unknown as Record<
                  string,
                  undefined | string | string[]
                >
              ),
          })
        )
        .then((response) =>
          Number(response.headers.get("Content-Length") ?? "0") === 0
            ? (true as unknown as ResultType)
            : response
                .json()
                .then(expand)
                .then(
                  (expanded) =>
                    normalize(expanded, propertyMap) as unknown as
                      | ResultType
                      | NampiError
                )
        )
        .then((normalized) => {
          const result = wrapResult(normalized);
          setState({ ...result, loading: false });
          return result;
        })
        .catch((e) => {
          console.log("Non-handled error:", e);
          setState({ loading: false });
          return {};
        });
    },
    state,
  ];
};

export const useCreate = <PayloadType, ResultType>(
  endpoint: Endpoint
): MutationHook<PayloadType, ResultType> => {
  const { apiUrl } = useNampiContext();
  return useMutate(buildPath(apiUrl, endpoint), "POST");
};

export const useUpdate = <PayloadType, ResultType>(
  endpoint: Endpoint,
  idLocal: string
): MutationHook<PayloadType, ResultType> => {
  const { apiUrl } = useNampiContext();
  return useMutate(buildPath(apiUrl, endpoint, idLocal), "PUT");
};

export const useDelete = (endpoint: Endpoint, idLocal: string): DeleteHook => {
  const { apiUrl } = useNampiContext();
  const [mutate, state] = useMutate<undefined, true>(
    buildPath(apiUrl, endpoint, idLocal),
    "DELETE"
  );
  return [() => mutate(undefined), state];
};
