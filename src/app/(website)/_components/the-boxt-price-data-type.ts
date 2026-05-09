export interface BoxtItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  backgroundcolor?: string;
  textcolor?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BoxtMeta {
  page: number;
  limit: number;
  total: number;
}

interface BoxtApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: BoxtMeta;
  data?: BoxtItem[];
}

export const BOXT_QUERY_KEY = ["boxt-data"];

const resolveBoxtEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/boxt`;
  }

  return "/api/v1/boxt";
};

export const fetchBoxtData = async (): Promise<BoxtItem | null> => {
  try {
    const response = await fetch(resolveBoxtEndpoint(), {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    const result = (await response.json().catch(() => null)) as BoxtApiResponse | null;

    if (!response.ok || !result?.success) {
      if (result?.message) {
        throw new Error(result.message);
      }

      if (response.status >= 500) {
        throw new Error("Boxt service is temporarily unavailable. Please try again shortly.");
      }

      throw new Error("Unable to load boxt section right now. Please try again.");
    }

    const items = Array.isArray(result?.data) ? result.data : [];
    return items[0] ?? null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load boxt section right now. Please try again.");
  }
};
