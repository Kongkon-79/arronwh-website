export interface NavbarLogo {
  _id: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface NavbarLogoMeta {
  total: number;
  page: number;
  limit: number;
}

interface NavbarLogoApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: NavbarLogoMeta;
  data?: NavbarLogo[];
}

export const NAVBAR_LOGO_QUERY_KEY = ["navbar-logo"];

const resolveNavbarLogoEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/logo`;
  }

  return "/api/v1/logo";
};

export const fetchNavbarLogo = async (): Promise<NavbarLogo | null> => {
  const response = await fetch(resolveNavbarLogoEndpoint(), {
    method: "GET",
    headers: {
      accept: "*/*",
    },
  });

  const result = (await response
    .json()
    .catch(() => null)) as NavbarLogoApiResponse | null;

  if (!response.ok || !result?.success) {
    if (result?.message) {
      throw new Error(result.message);
    }

    throw new Error("Unable to load navbar logo right now. Please try again.");
  }

  const logos = Array.isArray(result.data) ? result.data : [];
  return logos[0] ?? null;
};
