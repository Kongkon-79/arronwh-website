export const POSTCODE_LOCATION_STORAGE_KEY = "property-overview-postcode-location";

export type PostcodeLocationSelection = {
  postcode: string;
  installAddress: string;
  source?: "hero" | "manual";
};

type PostcodeApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  errorSources?: Array<{
    path?: string;
    message?: string;
  }>;
  data?:
    | {
        postcode?: string;
        locations?: string[];
        addresses?: string[];
        total?: number;
      }
    | string[]
    | null;
};

const UK_POSTCODE_REGEX =
  /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}|GIR\s*0AA)$/i;

export const isValidUKPostcode = (postcode: string): boolean => {
  return UK_POSTCODE_REGEX.test(postcode.trim());
};

export const resolvePostcodeEndpoint = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/postcode`;
  }

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/postcode`;
  }

  return "/api/v1/postcode";
};

const normalizeLocationList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const extractLocationsFromPostcodeResponse = (
  result: PostcodeApiResponse | null,
): string[] => {
  const data = result?.data;

  if (Array.isArray(data)) {
    return normalizeLocationList(data);
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const objectData = data as Record<string, unknown>;
  const addresses = normalizeLocationList(objectData.addresses);
  if (addresses.length > 0) {
    return addresses;
  }

  return normalizeLocationList(objectData.locations);
};

export const fetchPostcodeLocations = async (
  postcode: string,
  signal: AbortSignal,
): Promise<string[]> => {
  const response = await fetch(
    `${resolvePostcodeEndpoint()}/${encodeURIComponent(postcode.trim())}/addresses`,
    { signal },
  );

  const result = (await response.json().catch(() => null)) as PostcodeApiResponse | null;
  const hasExplicitFailure =
    result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    const firstErrorMessage = result?.errorSources?.find(
      (source) => typeof source?.message === "string" && source.message.trim(),
    )?.message;

    throw new Error(
      firstErrorMessage || result?.message || "Failed to fetch addresses.",
    );
  }

  return extractLocationsFromPostcodeResponse(result);
};

export const loadPostcodeLocationSelection = ():
  | PostcodeLocationSelection
  | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(POSTCODE_LOCATION_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PostcodeLocationSelection>;
    const postcode = typeof parsedValue.postcode === "string" ? parsedValue.postcode.trim() : "";
    const installAddress =
      typeof parsedValue.installAddress === "string"
        ? parsedValue.installAddress.trim()
        : "";
    const source =
      parsedValue.source === "hero" || parsedValue.source === "manual"
        ? parsedValue.source
        : undefined;

    if (!postcode && !installAddress) {
      return null;
    }

    return {
      postcode,
      installAddress,
      source,
    };
  } catch {
    return null;
  }
};

export const savePostcodeLocationSelection = (
  selection: PostcodeLocationSelection,
  source: "hero" | "manual" = "hero",
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    POSTCODE_LOCATION_STORAGE_KEY,
    JSON.stringify({
      postcode: selection.postcode.trim(),
      installAddress: selection.installAddress.trim(),
      source,
    }),
  );
};

export const clearPostcodeLocationSelection = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(POSTCODE_LOCATION_STORAGE_KEY);
};
