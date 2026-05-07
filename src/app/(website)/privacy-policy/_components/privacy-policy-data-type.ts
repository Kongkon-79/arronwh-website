export interface Policy {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PolicyMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PolicyApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: PolicyMeta;
  data?: Policy[];
}

export const PRIVACY_POLICY_QUERY_KEY = ["privacy-policy"];

const resolvePolicyEndpoint = () => {
  const query = "sortBy=updatedAt&sortOrder=desc&limit=10&page=1";

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/policy?${query}`;
  }

  return `/api/v1/policy?${query}`;
};

export const fetchPrivacyPolicy = async (): Promise<Policy | null> => {
  try {
    const response = await fetch(resolvePolicyEndpoint(), {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    const result = (await response.json().catch(() => null)) as PolicyApiResponse | null;

    if (!response.ok || !result?.success) {
      if (result?.message) {
        throw new Error(result.message);
      }

      if (response.status >= 500) {
        throw new Error("Privacy policy service is temporarily unavailable. Please try again shortly.");
      }

      throw new Error("Unable to load privacy policy right now. Please try again.");
    }

    const policies = Array.isArray(result?.data) ? result.data : [];

    if (policies.length === 0) {
      return null;
    }

    const matchedPrivacyPolicy = policies.find(
      (policy) => typeof policy.title === "string" && policy.title.toLowerCase().includes("privacy")
    );

    return matchedPrivacyPolicy ?? policies[0];
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load privacy policy right now. Please try again.");
  }
};
