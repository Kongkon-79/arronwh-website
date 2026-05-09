export interface HowItWorksHeader {
  _id: string;
  headerTitle: string;
  headerDiscription: string;
  __v: number;
}

export interface HowItWorksStep {
  _id: string;
  image: string;
  title: string;
  discription: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface HowItWorksMeta {
  page: number;
  limit: number;
  total: number;
}

interface HowItWorksApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: HowItWorksMeta;
  data?: T[];
}

export const HOW_IT_WORKS_HEADER_QUERY_KEY = ["how-it-works-header"];
export const HOW_IT_WORKS_STEPS_QUERY_KEY = ["how-it-works-steps"];

const resolveHowItWorksHeaderEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/yoloheat/header`;
  }

  return "/api/v1/yoloheat/header";
};

const resolveHowItWorksStepsEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/yoloheat`;
  }

  return "/api/v1/yoloheat";
};

const parseResponse = async <T>(
  endpoint: string,
  unavailableMessage: string,
  genericMessage: string
): Promise<HowItWorksApiResponse<T>> => {
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });

  const result = (await response
    .json()
    .catch(() => null)) as HowItWorksApiResponse<T> | null;

  if (!response.ok || !result?.success) {
    if (result?.message) {
      throw new Error(result.message);
    }

    if (response.status >= 500) {
      throw new Error(unavailableMessage);
    }

    throw new Error(genericMessage);
  }

  return result;
};

export const fetchHowItWorksHeader = async (): Promise<HowItWorksHeader | null> => {
  try {
    const result = await parseResponse<HowItWorksHeader>(
      resolveHowItWorksHeaderEndpoint(),
      "How it works header service is temporarily unavailable. Please try again shortly.",
      "Unable to load how it works header right now. Please try again."
    );

    const headers = Array.isArray(result?.data) ? result.data : [];
    return headers[0] ?? null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load how it works header right now. Please try again.");
  }
};

export const fetchHowItWorksSteps = async (): Promise<HowItWorksStep[]> => {
  try {
    const result = await parseResponse<HowItWorksStep>(
      resolveHowItWorksStepsEndpoint(),
      "How it works steps service is temporarily unavailable. Please try again shortly.",
      "Unable to load how it works steps right now. Please try again."
    );

    const steps = Array.isArray(result?.data) ? result.data : [];

    return [...steps].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load how it works steps right now. Please try again.");
  }
};
