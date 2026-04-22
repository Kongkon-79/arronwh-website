
export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface BoilerFeature {
  title: string;
  value: string;
}

export interface FeatureInformation {
  featureTitle: string;
  featureDescription: string;
  featureLogo: string[];
}

export interface InstallationGuide {
  title: string;
  image: string;
}

export interface Product {
  _id: string;
  user: User;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  badges: string[];
  price: number;
  discountPrice: number;
  payablePrice: number;
  monthlyPrice: number;
  boilerAbility: string;
  boilerFeatures: BoilerFeature[];
  featureInformation: FeatureInformation;
  boilerIncludedData: string;
  includedImages: string[];
  boilerInstallationGuide: InstallationGuide[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
  __v: number;
  bookingCount: number;
  isBestSeller: boolean;
}

export interface ProductMeta {
  total: number;
  page: number;
  limit: number;
}

export interface ProductApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: ProductMeta;
  data?: Product[];
}

export const EXPLORE_HEATING_PRODUCTS_QUERY_KEY = ["explore-heating-products"];

const toFriendlyProductError = (message?: string) => {
  if (!message) {
    return "";
  }

  if (/route\s+.*not found/i.test(message)) {
    return "Heating products are unavailable right now. Please try again shortly.";
  }

  return message;
};

const resolveProductsEndpoint = () => {
  const query = "sortBy=createdAt&limit=10&page=1";

  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${query}`;
  }

  return `/products?${query}`;
};

export const fetchExploreHeatingProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(resolveProductsEndpoint(), {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });

    const result = (await response.json().catch(() => null)) as ProductApiResponse | null;
    if (!response.ok || !result?.success) {
      const friendlyMessage = toFriendlyProductError(result?.message);
      if (friendlyMessage) {
        throw new Error(friendlyMessage);
      }

      if (response.status >= 500) {
        throw new Error("Our product service is temporarily unavailable. Please try again shortly.");
      }

      throw new Error("Unable to load products right now. Please try again.");
    }

    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TypeError") {
        throw new Error("You're offline or the network is unstable. Please check your internet and retry.");
      }

      throw error;
    }

    throw new Error("Unable to load products right now. Please try again.");
  }
};
