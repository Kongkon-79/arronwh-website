
export interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FaqMeta {
  page: number;
  limit: number;
  total: number;
}

export interface FaqApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: FaqMeta;
  data?: Faq[];
}

export const FAQ_QUERY_KEY = ["faqs"];

const resolveFaqEndpoint = () => {
  const query = "sortBy=createdAt&limit=10&page=1";

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/faq?${query}`;
  }

  return `/api/v1/faq?${query}`;
};

export const fetchFaqs = async (): Promise<Faq[]> => {
  const response = await fetch(resolveFaqEndpoint(), {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });

  const result = (await response.json().catch(() => null)) as FaqApiResponse | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Unable to load FAQs right now. Please try again.");
  }

  return Array.isArray(result?.data) ? result.data : [];
};
