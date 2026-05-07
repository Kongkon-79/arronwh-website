export interface TermsCondition {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TermsConditionMeta {
  page: number;
  limit: number;
  total: number;
}

export interface TermsConditionApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TermsConditionMeta;
  data?: TermsCondition[];
}

export const TERMS_CONDITIONS_QUERY_KEY = ["terms-conditions"];

const resolveTermsConditionsEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/termsconditions`;
  }

  return "/api/v1/termsconditions";
};

export const fetchTermsConditions = async (): Promise<TermsCondition | null> => {
  try {
    const response = await fetch(resolveTermsConditionsEndpoint(), {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    const result = (await response.json().catch(() => null)) as TermsConditionApiResponse | null;

    if (!response.ok || !result?.success) {
      if (result?.message) {
        throw new Error(result.message);
      }

      if (response.status >= 500) {
        throw new Error("Terms and conditions service is temporarily unavailable. Please try again shortly.");
      }

      throw new Error("Unable to load terms and conditions right now. Please try again.");
    }

    const termsConditions = Array.isArray(result?.data) ? result.data : [];

    if (termsConditions.length === 0) {
      return null;
    }

    const matchedTermsCondition = termsConditions.find(
      (item) => typeof item.title === "string" && item.title.toLowerCase().includes("term")
    );

    return matchedTermsCondition ?? termsConditions[0];
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load terms and conditions right now. Please try again.");
  }
};
