"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard, ProductItem } from "./ProductCard";
import BoilerProductsPageSkeleton from "./BoilerProductsPageSkeleton";

type ApiBoilerFeature = {
  title?: string;
  value?: string;
  details?: string;
};

type ApiProduct = {
  _id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  badges?: string[];
  price?: number;
  discountPrice?: number;
  payablePrice?: number;
  monthlyPrice?: number;
  boilerAbility?: string;
  boilerFeatures?: Array<ApiBoilerFeature | string>;
  boilerIncludedData?: string;
  isBestSeller?: boolean;
};

type ProductsApiResponse = {
  statusCode: number;
  success: boolean;
  status?: boolean;
  message: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  data: ApiProduct[];
};

const DEFAULT_FILTER_TEXT = "0-5 radiators, 1bed, 0 showers, 0 bathtubs";
const FALLBACK_IMAGE = "/product.png";

const stripHtml = (value?: string) =>
  value
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "";

const formatMoney = (value?: number) =>
  typeof value === "number" && Number.isFinite(value) ? `$${value.toLocaleString("en-US")}` : "";

const normalizeImage = (image?: string) => {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return FALLBACK_IMAGE;
};

const resolveProductsEndpoint = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`;
  }
  return "/products";
};

const fetchProducts = async (): Promise<ApiProduct[]> => {
  const response = await fetch(resolveProductsEndpoint());
  const result = (await response.json().catch(() => null)) as ProductsApiResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to fetch products");
  }

  return result?.data ?? [];
};

const toProductCardItem = (product: ApiProduct): ProductItem => {
  const title = stripHtml(product.title) || product.title;
  const boilerAbility = stripHtml(product.boilerAbility) || title;
  const tags = (product.badges ?? []).map((tag) => tag.trim()).filter(Boolean);
  const images = (product.images ?? []).map(normalizeImage);
  const description = stripHtml(product.description);
  const summaryTitle = stripHtml(product.shortDescription) || title;

  const summaryPoints = [description, stripHtml(product.boilerAbility), stripHtml(product.boilerIncludedData)]
    .filter(
      (point, index, arr) =>
        point && point !== summaryTitle && arr.indexOf(point) === index
    );

  const specs = (product.boilerFeatures ?? [])
    .map((feature) => {
      if (typeof feature === "string") {
        const value = stripHtml(feature);
        return {
          label: value ? "Feature" : "",
          value,
        };
      }

      return {
        label: feature?.title?.trim() ?? "",
        value: stripHtml(feature?.value ?? feature?.details ?? ""),
      };
    })
    .filter((feature) => feature.label && feature.value);

  const payToday = formatMoney(product.payablePrice) || formatMoney(product.price) || "$0";
  const payTodayOld =
    typeof product.price === "number" &&
    typeof product.payablePrice === "number" &&
    product.price > product.payablePrice
      ? `was ${formatMoney(product.price)}`
      : "";

  const monthlyPriceNumber =
    typeof product.monthlyPrice === "number" && product.monthlyPrice > 0
      ? product.monthlyPrice
      : typeof product.payablePrice === "number" && product.payablePrice > 0
        ? product.payablePrice / 12
        : typeof product.price === "number" && product.price > 0
          ? product.price / 12
          : 0;
  const monthlyCost = monthlyPriceNumber > 0 ? `${formatMoney(monthlyPriceNumber)}/mo` : "$0/mo";

  const discountAmount =
    typeof product.discountPrice === "number" && product.discountPrice > 0
      ? product.discountPrice
      : typeof product.price === "number" && typeof product.payablePrice === "number"
        ? Math.max(product.price - product.payablePrice, 0)
        : 0;

  return {
    id: product._id,
    title,
    boilerAbility,
    topBadge: product.isBestSeller ? "OUR BEST SELLER" : undefined,
    tags,
    images: images.length ? images : [FALLBACK_IMAGE],
    summaryTitle,
    summaryPoints,
    specs,
    payToday,
    payTodayOld,
    monthlyCost,
    monthlyCostOld: "",
    discountTitle: `${title} Discount`,
    discountValue: discountAmount > 0 ? `-$${discountAmount.toLocaleString("en-US")}` : "$0",
    payablePriceValue:
      typeof product.payablePrice === "number"
        ? product.payablePrice
        : typeof product.price === "number"
          ? product.price
          : 0,
    priceValue: typeof product.price === "number" ? product.price : 0,
    discountAmountValue: discountAmount,
    monthlyPriceValue:
      monthlyPriceNumber > 0
        ? Number(monthlyPriceNumber.toFixed(2))
        : undefined,
  };
};

export default function BoilerProductsPage() {
  const selectedFilter = DEFAULT_FILTER_TEXT;

  const {
    data: productsData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const products = productsData.map(toProductCardItem);

  if (isLoading) {
    return <BoilerProductsPageSkeleton />;
  }

  return (
    <BoilerFlowShell activeStep={2}>
   
      <div className="bg-[#EEF2F5] px-3 py-4 sm:px-4 lg:px-0">
        <div className="mx-auto container">
          {/* Top Filter */}
          <div className="mb-4 flex justify-end">
            <div className="flex overflow-hidden rounded-full border border-[#D9E0E7] bg-white shadow-sm">
              <button className="flex items-center gap-2 px-4 py-2 text-[12px] sm:text-[13px] font-medium text-[#2D3D4D]">
                {selectedFilter}
                <ChevronDown className="h-4 w-4" />
              </button>
              <button className="border-l border-[#E5E7EB] px-4 py-2 text-[12px] sm:text-[13px] font-medium text-[#2D3D4D]">
                Start again
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {isError ? (
              <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 text-[15px] text-[#2D3D4D]">
                {error instanceof Error ? error.message : "Failed to load products."}
              </div>
            ) : products.length ? (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="rounded-[8px] border border-[#E5E7EB] bg-white p-5 text-[15px] text-[#2D3D4D]">
                No products available right now.
              </div>
            )}
          </div>
        </div>
      </div>
    </BoilerFlowShell>
  );
}
