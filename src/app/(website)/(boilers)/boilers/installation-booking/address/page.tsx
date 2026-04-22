"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { useProductById, type ApiProductFull } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
  type ApiQuoteController,
  type ApiQuoteExtra,
  type ApiQuote,
  useQuoteById,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useQuoteById";
import {
  type QuotePriceAdjustmentItem,
  getPrimaryQuotePriceAdjustmentItem,
  getQuotePriceAdjustmentTotal,
} from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-price-adjustment";
import {
  BadgePercent,
  CalendarDays,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type PostcodeLocation = {
  area: string;
  city: string;
  region: string;
  country: string;
  timezone: string;
  label: string;
};

type UpdateInstallAddressResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

function resolveQuoteEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/quote`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/quote`;
  }
  return "/quote";
}

async function updateQuoteInstallAddress({
  quoteId,
  installAddress,
}: {
  quoteId: string;
  installAddress: string;
}): Promise<UpdateInstallAddressResponse> {
  const response = await fetch(`${resolveQuoteEndpoint()}/${encodeURIComponent(quoteId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ installAddress }),
  });

  const result = (await response.json().catch(() => null)) as UpdateInstallAddressResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to update installation address.");
  }

  return result ?? {};
}

function locationFromLabel(label: string): PostcodeLocation {
  const parts = label
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const country = parts.length > 0 ? parts[parts.length - 1] : "";
  const region = parts.length > 1 ? parts[parts.length - 2] : "";
  const city = parts.length > 2 ? parts[parts.length - 3] : region;
  const area = parts.length > 3 ? parts[0] : city;

  return {
    area,
    city,
    region,
    country,
    timezone: country.toLowerCase().includes("bangladesh") ? "UTC+6" : "",
    label,
  };
}

function normalizeLocationPart(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toUniqueLocationLabel(parts: unknown[]): string {
  const uniqueParts: string[] = [];

  parts.forEach((part) => {
    const normalized = normalizeLocationPart(part);
    if (!normalized) return;
    const alreadyAdded = uniqueParts.some((item) => item.toLowerCase() === normalized.toLowerCase());
    if (!alreadyAdded) {
      uniqueParts.push(normalized);
    }
  });

  return uniqueParts.join(", ");
}

function parsePostcodesIoLocation(payload: unknown): PostcodeLocation | null {
  if (!payload || typeof payload !== "object") return null;
  const response = payload as Record<string, unknown>;
  const status = response.status;
  if (status !== 200) return null;

  const resultRaw = response.result;
  if (!resultRaw || typeof resultRaw !== "object") return null;
  const result = resultRaw as Record<string, unknown>;

  const area = normalizeLocationPart(result.admin_district) || normalizeLocationPart(result.admin_ward);
  const city =
    normalizeLocationPart(result.parish) ||
    normalizeLocationPart(result.admin_district) ||
    normalizeLocationPart(result.admin_ward);
  const region = normalizeLocationPart(result.region) || normalizeLocationPart(result.admin_county);
  const country = normalizeLocationPart(result.country);
  const label = toUniqueLocationLabel([area, city, region, country]);

  if (!label) return null;

  return {
    area,
    city,
    region,
    country,
    timezone: "",
    label,
  };
}

function parseNominatimLocation(payload: unknown): PostcodeLocation | null {
  if (!Array.isArray(payload) || payload.length === 0) return null;
  const first = payload[0];
  if (!first || typeof first !== "object") return null;

  const firstRecord = first as Record<string, unknown>;
  const addressRaw = firstRecord.address;
  if (!addressRaw || typeof addressRaw !== "object") return null;

  const address = addressRaw as Record<string, unknown>;
  const area =
    normalizeLocationPart(address.suburb) ||
    normalizeLocationPart(address.neighbourhood) ||
    normalizeLocationPart(address.quarter) ||
    normalizeLocationPart(address.village) ||
    normalizeLocationPart(address.town) ||
    normalizeLocationPart(address.city_district);
  const city =
    normalizeLocationPart(address.city) ||
    normalizeLocationPart(address.town) ||
    normalizeLocationPart(address.village) ||
    normalizeLocationPart(address.municipality) ||
    normalizeLocationPart(address.county);
  const region = normalizeLocationPart(address.state) || normalizeLocationPart(address.region);
  const country = normalizeLocationPart(address.country);
  const timezone = country.toLowerCase().includes("bangladesh") ? "UTC+6" : "";
  const label = toUniqueLocationLabel([area, city, region, country]);

  if (!label) return null;

  return { area, city, region, country, timezone, label };
}

async function fetchLocationByPostcode(postcode: string): Promise<PostcodeLocation | null> {
  const normalizedPostcode = postcode.trim();
  if (!normalizedPostcode) return null;
  const isNumericPostcode = /^\d{4,6}$/.test(normalizedPostcode);

  const sources: Array<{
    url: string;
    parser: (payload: unknown) => PostcodeLocation | null;
  }> = [
    ...(isNumericPostcode
      ? [
          {
            url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=bd&q=${encodeURIComponent(normalizedPostcode)}`,
            parser: parseNominatimLocation,
          },
          {
            url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(`${normalizedPostcode} Dhaka Bangladesh`)}`,
            parser: parseNominatimLocation,
          },
        ]
      : []),
    {
      url: `https://api.postcodes.io/postcodes/${encodeURIComponent(normalizedPostcode)}`,
      parser: parsePostcodesIoLocation,
    },
    {
      url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&postalcode=${encodeURIComponent(normalizedPostcode)}`,
      parser: parseNominatimLocation,
    },
    {
      url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(normalizedPostcode)}`,
      parser: parseNominatimLocation,
    },
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) continue;
      const payload = await response.json().catch(() => null);
      const location = source.parser(payload);
      if (location) return location;
    } catch {
      continue;
    }
  }

  return null;
}

function getOrdinalDay(day: number): string {
  const remainder10 = day % 10;
  const remainder100 = day % 100;
  if (remainder10 === 1 && remainder100 !== 11) return `${day}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${day}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${day}rd`;
  return `${day}th`;
}

function formatInstallDateLabel(isoDate: string | null | undefined): string {
  if (!isoDate) return "Not selected";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Not selected";

  const day = getOrdinalDay(parsed.getUTCDate());
  const month = parsed.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = parsed.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function extractPostcode(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";
  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfoRaw = quoteRecord.personalInfo;
  const personalInfo =
    personalInfoRaw && typeof personalInfoRaw === "object"
      ? (personalInfoRaw as Record<string, unknown>)
      : null;

  const postcodeCandidates = [
    quoteRecord.postcode,
    personalInfo?.postcode,
    quoteRecord.postCode,
    personalInfo?.postCode,
  ];

  for (const candidate of postcodeCandidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

function extractAddressOptions(quote: ApiQuote | null | undefined): string[] {
  if (!quote) return [];

  const options = new Set<string>();
  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfoRaw = quoteRecord.personalInfo;
  const personalInfo =
    personalInfoRaw && typeof personalInfoRaw === "object"
      ? (personalInfoRaw as Record<string, unknown>)
      : null;

  const addIfString = (value: unknown) => {
    if (typeof value === "string" && value.trim()) {
      options.add(value.trim());
    }
  };

  const addFromArray = (value: unknown) => {
    if (!Array.isArray(value)) return;
    value.forEach((item) => {
      if (typeof item === "string") {
        addIfString(item);
      } else if (item && typeof item === "object") {
        const itemRecord = item as Record<string, unknown>;
        addIfString(itemRecord.label);
        addIfString(itemRecord.address);
        addIfString(itemRecord.fullAddress);
        addIfString(itemRecord.text);
        addIfString(itemRecord.name);
      }
    });
  };

  addIfString(quoteRecord.address);
  addIfString(quoteRecord.installationAddress);
  addIfString(quoteRecord.location);
  addIfString(personalInfo?.address);
  addIfString(personalInfo?.fullAddress);
  addIfString(personalInfo?.location);
  addIfString(personalInfo?.city);
  addIfString(personalInfo?.town);
  addFromArray(quoteRecord.addresses);
  addFromArray(quoteRecord.addressList);
  addFromArray(personalInfo?.addresses);

  return Array.from(options);
}

function extractPostcodeLocationLabel(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";

  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfoRaw = quoteRecord.personalInfo;
  const personalInfo =
    personalInfoRaw && typeof personalInfoRaw === "object"
      ? (personalInfoRaw as Record<string, unknown>)
      : null;

  return toUniqueLocationLabel([
    quoteRecord.location,
    quoteRecord.city,
    quoteRecord.town,
    quoteRecord.county,
    quoteRecord.region,
    quoteRecord.state,
    quoteRecord.country,
    personalInfo?.location,
    personalInfo?.city,
    personalInfo?.town,
    personalInfo?.county,
    personalInfo?.region,
    personalInfo?.state,
    personalInfo?.country,
  ]);
}

function extractInstallAddressLabel(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";

  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfoRaw = quoteRecord.personalInfo;
  const personalInfo =
    personalInfoRaw && typeof personalInfoRaw === "object"
      ? (personalInfoRaw as Record<string, unknown>)
      : null;

  const candidates = [
    quoteRecord.installAddress,
    quoteRecord.installationAddress,
    personalInfo?.installAddress,
    personalInfo?.address,
    personalInfo?.fullAddress,
    quoteRecord.address,
    quoteRecord.location,
    personalInfo?.location,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

function formatMoney(value: number): string {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
  return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getWarrantyText(product: ApiProductFull): string | undefined {
  const warrantyFeature = product.boilerFeatures.find((feature) => /warranty/i.test(feature.title));
  if (!warrantyFeature?.value) return undefined;
  return `with ${warrantyFeature.value} warranty`;
}

function TopBanner({ payTodayTotal }: { payTodayTotal: number }) {
  return (
    <div className="rounded-[8px] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-[#2D3D4D]">
            <ShieldCheck className="h-4 w-4" />
            <span>Your total price is {formatMoney(payTodayTotal)}</span>
          </div>
          <p className="mt-2 text-[14px] text-[#2D3D4D] sm:text-[16px]">
            Installation available from next working day- choose your install date below
          </p>
        </div>
        <button className="shrink-0 pt-1 text-[16px] font-bold text-[#FFDE59] underline underline-offset-2">
          View
        </button>
      </div>
    </div>
  );
}

function PriceSummary({
  product,
  payTodayTotal,
  originalTotal,
  installDateLabel,
  installedAtLabel,
  quotePriceItem,
}: {
  product: ApiProductFull;
  payTodayTotal: number;
  originalTotal: number;
  installDateLabel: string;
  installedAtLabel: string;
  quotePriceItem: QuotePriceAdjustmentItem | null;
}) {
  return (
    <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
      <h3 className="text-[18px] font-semibold text-[#2D3D4D]">Total fixed price including VAT</h3>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
          <p className="text-[18px] text-[#64748B]">Pay today</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(payTodayTotal)}</p>
          {originalTotal > payTodayTotal ? (
            <p className="mt-1 text-[14px] font-medium text-[#00A56F] line-through">was {formatMoney(originalTotal)}</p>
          ) : null}
        </div>

        <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
          <p className="text-[18px] text-[#64748B]">Monthly Cost</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">
            {formatMoney(payTodayTotal / 12)}/mo
          </p>
        </div>
      </div>

      <div className="mt-3 flex min-h-[34px] items-center justify-center rounded-[6px] bg-[#F0F3F6] px-2 text-center">
        <BadgePercent className="mr-2 h-5 w-5 shrink-0 text-[#64748B]" />
        <span className="text-[16px] font-semibold text-[#2D3D4D]">
          {product.boilerAbility || product.title} Discount
        </span>
        <span className="ml-2 text-[16px] font-semibold text-[#00A56F]">-{formatMoney(product.discountPrice)}</span>
      </div>

      <div className="mt-3">
        <h4 className="text-[18px] font-semibold text-[#2D3D4D]">Order Summary</h4>
        <div className="mt-2 space-y-2 rounded-[6px] bg-[#F0F3F6] p-2.5">
          <div className="flex items-center gap-3">
            <div className="h-[48px] w-[48px] overflow-hidden">
              <Image
                src={product.images?.[0] ?? "/product.png"}
                alt={product.boilerAbility || product.title}
                width={48}
                height={48}
                className="h-[48px] w-[48px] object-contain"
              />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-[#2D3D4D]">{product.boilerAbility || product.title}</p>
              {getWarrantyText(product) ? (
                <p className="text-[16px] text-[#2D3D4D]">{getWarrantyText(product)}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[18px] text-[#2D3D4D]">Install date</span>
            <span className="text-[18px] font-semibold text-[#2D3D4D]">{installDateLabel}</span>
          </div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <span className="text-[18px] text-[#2D3D4D]">Installed at</span>
            <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">
              {installedAtLabel}
            </span>
          </div>

      
        </div>
      </div>
    </aside>
  );
}

function CollapsedStep({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex h-[70px] w-full items-center justify-center rounded-[8px] bg-white px-4 text-center shadow-sm transition hover:bg-[#F8FAFC]"
    >
      <div className="flex items-center justify-center gap-3 text-[#2D3D4D]">
        <Icon className="h-4 w-4 text-[#64748B]" />
        <span className="text-[16px] font-medium">{label}</span>
      </div>
    </button>
  );
}



function AddressStep({
  postcode,
  addressOptions,
  initialLocationLabel,
  onManualAddressClick,
  onSubmitInstallAddress,
  isSubmittingInstallAddress,
}: {
  postcode: string;
  addressOptions: string[];
  initialLocationLabel: string;
  onManualAddressClick: () => void;
  onSubmitInstallAddress: (installAddress: string | null) => void;
  isSubmittingInstallAddress: boolean;
}) {
  const [postcodeLocation, setPostcodeLocation] = React.useState<PostcodeLocation | null>(
    initialLocationLabel ? locationFromLabel(initialLocationLabel) : null
  );
  const [isLocationLoading, setIsLocationLoading] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<string>("");

  React.useEffect(() => {
    let active = true;
    const normalizedPostcode = postcode.trim();
    const fallbackLocation = initialLocationLabel ? locationFromLabel(initialLocationLabel) : null;

    if (!normalizedPostcode) {
      setPostcodeLocation(fallbackLocation);
      setIsLocationLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLocationLoading(true);
    fetchLocationByPostcode(normalizedPostcode)
      .then((location) => {
        if (!active) return;
        setPostcodeLocation(location ?? fallbackLocation);
      })
      .finally(() => {
        if (!active) return;
        setIsLocationLoading(false);
      });

    return () => {
      active = false;
    };
  }, [initialLocationLabel, postcode]);

  const visibleOptions = React.useMemo(() => {
    if (addressOptions.length > 0) return addressOptions;
    if (postcodeLocation?.label) return [postcodeLocation.label];
    return [];
  }, [addressOptions, postcodeLocation]);

  React.useEffect(() => {
    if (visibleOptions.length === 0) {
      setSelectedAddress("");
      return;
    }

    setSelectedAddress((previous) => {
      if (previous && visibleOptions.includes(previous)) return previous;
      return visibleOptions[0];
    });
  }, [visibleOptions]);

  return (
    <div className="rounded-[8px] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-center gap-3 text-center">
        <MapPin className="h-4 w-4 text-[#2f3b4a]" />
        <h2 className="text-[16px] font-semibold text-[#2D3D4D] sm:text-[18px]">Where are we visiting?</h2>
      </div>

      <p className="mt-3 text-center text-[13px] text-[#2D3D4D] sm:text-[16px]">
        All fields are required unless marked optional
      </p>

      <div className="mt-5">
        <label className="block text-[16px] font-medium text-[#2D3D4D]">Installation address</label>
        <p className="mt-1 text-[14px] leading-5 text-[#2D3D4D]">
          You already told us your postcode ({postcode || "N/A"}). Choose your address from the list.
        </p>

     
        <div className="mt-4 min-h-[136px] rounded-[6px] border border-[#94A3B8] bg-white px-4 py-4 sm:min-h-[138px]">
          {visibleOptions.length > 0 ? (
            <div className="space-y-2">
              {visibleOptions.map((address) => (
                <button
                  key={address}
                  type="button"
                  onClick={() => setSelectedAddress(address)}
                  className={`block w-full  px-3 py-2 text-left text-[14px] text-[#2D3D4D] transition`}
                >
                  {address}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-[#2D3D4D]">
              {isLocationLoading && postcode
                ? `Finding location for postcode ${postcode}...`
                : "No saved location found for this postcode"}
            </p>
          )}
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onManualAddressClick}
            className="text-[14px] font-medium text-[#FFDE59] underline underline-offset-2"
          >
            Enter address manually
          </button>
        </div>

        <p className="mt-5 text-[14px] text-[#2D3D4D]">
          Your personal data will processed in accordance with our{" "}
          <span className="text-[#FFDE59] underline underline-offset-2">Privacy policy</span>
        </p>

        <button
          type="button"
          onClick={() => onSubmitInstallAddress(selectedAddress || visibleOptions[0] || null)}
          disabled={isSubmittingInstallAddress}
          className="mt-4 h-[48px] w-full rounded-[4px] bg-[#00A56F] text-[18px] font-medium text-white transition hover:bg-[#00A56F]"
        >
          {isSubmittingInstallAddress ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}

function FooterDisclaimer() {
  return (
    <p className="pt-2 text-[11px] leading-6 text-[#2D3D4D] sm:text-[16px]">
      *Representative example for 120 month order: £3,099 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
      Representative APR: 9.9% APR. Total amount of credit £3,099 paid over 120 months as 120 monthly payments of
      £40.07 at 9.48% p.a. Cost of finance £1,709.40. Total amount payable £4,808.40. BOXI Limited is a credit broker
      and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status,
      affordability and credit check. Terms and conditions apply.
    </p>
  );
}

function BoilerAddressPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");
  const { mutateAsync: mutateInstallAddress, isPending: isUpdatingInstallAddress } = useMutation({
    mutationKey: ["update-quote-install-address"],
    mutationFn: updateQuoteInstallAddress,
  });
  const manualAddressUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query
      ? `/boilers/installation-booking/menually-address?${query}`
      : "/boilers/installation-booking/menually-address";
  }, [searchParams]);
  const handleManualAddressClick = React.useCallback(() => {
    router.push(manualAddressUrl);
  }, [manualAddressUrl, router]);

  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
  const quoteProductId =
    typeof quote?.productId === "string" ? quote.productId : quote?.productId?._id ?? null;
  const resolvedProductId = productIdFromQuery ?? quoteProductId;
  const paymentMethodUrl = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (resolvedProductId) {
      params.set("productId", resolvedProductId);
    }
    if (quoteId) {
      params.set("quoteId", quoteId);
    }
    const query = params.toString();
    return query
      ? `/boilers/installation-booking/payment-method?${query}`
      : "/boilers/installation-booking/payment-method";
  }, [quoteId, resolvedProductId, searchParams]);

  const { data: product, isLoading: productLoading } = useProductById(resolvedProductId);

  const selectedController: ApiQuoteController | null =
    quote?.controller && typeof quote.controller !== "string" ? quote.controller : null;
  const selectedExtra: ApiQuoteExtra | null =
    quote?.extra && typeof quote.extra !== "string" ? quote.extra : null;

  const selectedControllerPrice =
    selectedController && typeof selectedController.price === "number" && selectedController.price > 0
      ? selectedController.price
      : 0;
  const selectedExtraPrice =
    selectedExtra && typeof selectedExtra.price === "number" && selectedExtra.price > 0
      ? selectedExtra.price
      : 0;
  const quotePriceAdjustment = getQuotePriceAdjustmentTotal(quote?.quizAnswers);
  const quotePriceItem = getPrimaryQuotePriceAdjustmentItem(quote?.quizAnswers);

  const payTodayTotal = product
    ? (product.payablePrice ?? product.price ?? 0) +
      selectedControllerPrice +
      selectedExtraPrice +
      quotePriceAdjustment
    : 0;
  const originalTotal = product
    ? (product.price ?? 0) + selectedControllerPrice + selectedExtraPrice + quotePriceAdjustment
    : 0;

  const isLoading = (quoteId ? quoteLoading : false) || (resolvedProductId ? productLoading : false);
  const installDateRaw = (quote as unknown as Record<string, unknown> | null)?.installDate;
  const installDateLabel = formatInstallDateLabel(
    typeof installDateRaw === "string" ? installDateRaw : null
  );
  const postcode = extractPostcode(quote);
  const addressOptions = extractAddressOptions(quote);
  const initialLocationLabel = extractPostcodeLocationLabel(quote);
  const installedAtLabel =
    extractInstallAddressLabel(quote) || addressOptions[0] || initialLocationLabel || "Not selected";
  const handleSubmitInstallAddress = React.useCallback(
    async (installAddress: string | null) => {
      if (!installAddress) {
        return;
      }

      if (!quoteId) {
        return;
      }

      try {
        await mutateInstallAddress({
          quoteId,
          installAddress,
        });
        router.push(paymentMethodUrl);
      } catch (error) {
        console.error("Failed to save installation address.", error);
      }
    },
    [mutateInstallAddress, paymentMethodUrl, quoteId, router]
  );

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="py-12">
        <div className="mx-auto container">
          {isLoading ? (
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">Loading address page...</div>
          ) : !product ? (
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">
              Product details not found. Please go back and select your boiler again.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
              <section className="space-y-4">
                <TopBanner payTodayTotal={payTodayTotal} />
                <CollapsedStep icon={CalendarDays} label="When should we Survey?" />
                <CollapsedStep icon={CalendarDays} label="When should we install?" />
                <AddressStep
                  postcode={postcode}
                  addressOptions={addressOptions}
                  initialLocationLabel={initialLocationLabel}
                  onManualAddressClick={handleManualAddressClick}
                  onSubmitInstallAddress={handleSubmitInstallAddress}
                  isSubmittingInstallAddress={isUpdatingInstallAddress}
                />
                <CollapsedStep icon={CreditCard} label="How would you like to pay?" />
                <FooterDisclaimer />
              </section>

              <div>
                <PriceSummary
                  product={product}
                  payTodayTotal={payTodayTotal}
                  originalTotal={originalTotal}
                  installDateLabel={installDateLabel}
                  installedAtLabel={installedAtLabel}
                  quotePriceItem={quotePriceItem}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </BoilerFlowShell>
  );
}

export default function BoilerAddressPage() {
  return (
    <React.Suspense fallback={null}>
      <BoilerAddressPageContent />
    </React.Suspense>
  );
}
