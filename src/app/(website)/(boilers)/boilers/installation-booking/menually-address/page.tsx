"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { useProductById, type ApiProductFull } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
  type ApiQuote,
  type ApiQuoteController,
  type ApiQuoteExtra,
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
  CheckCircle2,
  Circle,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";

type UpdateQuoteManualAddressPersonalInfo = {
  title: string;
  fastName: string;
  sureName: string;
  email: string;
  mobleNumber: string;
  address: string;
  isRentalProperty: boolean;
};

type UpdateQuoteManualAddressPayload = {
  personalInfo: UpdateQuoteManualAddressPersonalInfo;
  installAddress: string;
};

type UpdateQuoteManualAddressResponse = {
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

async function updateQuoteManualAddress({
  quoteId,
  payload,
}: {
  quoteId: string;
  payload: UpdateQuoteManualAddressPayload;
}): Promise<UpdateQuoteManualAddressResponse> {
  const response = await fetch(`${resolveQuoteEndpoint()}/${encodeURIComponent(quoteId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as UpdateQuoteManualAddressResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to update your details.");
  }

  return result ?? {};
}

type ManualAddressForm = {
  rentalProperty: "yes" | "no";
  title: string;
  firstName: string;
  sureName: string;
  email: string;
  address: string;
  mobileNumber: string;
};

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

function formatMoney(value: number): string {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
  return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getWarrantyText(product: ApiProductFull): string | undefined {
  const warrantyFeature = product.boilerFeatures.find((feature) => /warranty/i.test(feature.title));
  if (!warrantyFeature?.value) return undefined;
  return `with ${warrantyFeature.value} warranty`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function toUniqueLabel(parts: unknown[]): string {
  const uniqueParts: string[] = [];

  parts.forEach((part) => {
    if (typeof part !== "string") return;
    const trimmed = part.trim();
    if (!trimmed) return;

    const exists = uniqueParts.some((entry) => entry.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      uniqueParts.push(trimmed);
    }
  });

  return uniqueParts.join(", ");
}

function normalizeLocationPart(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parsePostcodesIoLocationLabel(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const response = payload as Record<string, unknown>;
  if (response.status !== 200) return "";

  const resultRaw = response.result;
  if (!resultRaw || typeof resultRaw !== "object") return "";
  const result = resultRaw as Record<string, unknown>;

  const area = normalizeLocationPart(result.admin_district) || normalizeLocationPart(result.admin_ward);
  const city =
    normalizeLocationPart(result.parish) ||
    normalizeLocationPart(result.admin_district) ||
    normalizeLocationPart(result.admin_ward);
  const region = normalizeLocationPart(result.region) || normalizeLocationPart(result.admin_county);
  const country = normalizeLocationPart(result.country);

  return toUniqueLabel([area, city, region, country]);
}

function parseNominatimLocationLabel(payload: unknown): string {
  if (!Array.isArray(payload) || payload.length === 0) return "";
  const first = payload[0];
  if (!first || typeof first !== "object") return "";

  const firstRecord = first as Record<string, unknown>;
  const addressRaw = firstRecord.address;
  if (!addressRaw || typeof addressRaw !== "object") return "";
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

  return toUniqueLabel([area, city, region, country]);
}

async function fetchPostcodeLocationLabel(postcode: string): Promise<string> {
  const normalizedPostcode = postcode.trim();
  if (!normalizedPostcode) return "";
  const isNumericPostcode = /^\d{4,6}$/.test(normalizedPostcode);

  const sources: Array<{
    url: string;
    parser: (payload: unknown) => string;
  }> = [
    ...(isNumericPostcode
      ? [
          {
            url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&countrycodes=bd&q=${encodeURIComponent(normalizedPostcode)}`,
            parser: parseNominatimLocationLabel,
          },
          {
            url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(`${normalizedPostcode} Dhaka Bangladesh`)}`,
            parser: parseNominatimLocationLabel,
          },
        ]
      : []),
    {
      url: `https://api.postcodes.io/postcodes/${encodeURIComponent(normalizedPostcode)}`,
      parser: parsePostcodesIoLocationLabel,
    },
    {
      url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&postalcode=${encodeURIComponent(normalizedPostcode)}`,
      parser: parseNominatimLocationLabel,
    },
    {
      url: `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q=${encodeURIComponent(normalizedPostcode)}`,
      parser: parseNominatimLocationLabel,
    },
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) continue;

      const payload = await response.json().catch(() => null);
      const label = source.parser(payload);
      if (label) return label;
    } catch {
      continue;
    }
  }

  return "";
}

function extractPostcode(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";
  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfo = asRecord(quoteRecord.personalInfo);

  return firstNonEmptyString(
    quoteRecord.postcode,
    personalInfo?.postcode,
    quoteRecord.postCode,
    personalInfo?.postCode
  );
}

function extractAddressOptions(quote: ApiQuote | null | undefined): string[] {
  if (!quote) return [];

  const options = new Set<string>();
  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfo = asRecord(quoteRecord.personalInfo);

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
        return;
      }

      const itemRecord = asRecord(item);
      if (!itemRecord) return;

      addIfString(itemRecord.label);
      addIfString(itemRecord.address);
      addIfString(itemRecord.fullAddress);
      addIfString(itemRecord.text);
      addIfString(itemRecord.name);
    });
  };

  addIfString(quoteRecord.address);
  addIfString(quoteRecord.installationAddress);
  addIfString(personalInfo?.address);
  addIfString(personalInfo?.fullAddress);
  addIfString(personalInfo?.location);
  addIfString(personalInfo?.city);
  addFromArray(quoteRecord.addresses);
  addFromArray(quoteRecord.addressList);
  addFromArray(personalInfo?.addresses);

  return Array.from(options);
}

function extractLocationLabel(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";

  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfo = asRecord(quoteRecord.personalInfo);

  return toUniqueLabel([
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
  const personalInfo = asRecord(quoteRecord.personalInfo);

  return firstNonEmptyString(
    quoteRecord.installAddress,
    quoteRecord.installationAddress,
    personalInfo?.installAddress,
    personalInfo?.address,
    personalInfo?.fullAddress,
    quoteRecord.address,
    quoteRecord.location,
    personalInfo?.location
  );
}

function extractFormDefaults(quote: ApiQuote | null | undefined): ManualAddressForm {
  if (!quote) {
    return {
      rentalProperty: "no",
      title: "Mr",
      firstName: "",
      sureName: "",
      email: "",
      address: "",
      mobileNumber: "",
    };
  }

  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfo = asRecord(quoteRecord.personalInfo);

  const rentalRaw =
    personalInfo?.isRentalProperty ?? personalInfo?.isRental ?? quoteRecord.isRentalProperty ?? quoteRecord.isRental;
  const rentalProperty =
    rentalRaw === true ||
    (typeof rentalRaw === "string" && ["yes", "true", "rental"].includes(rentalRaw.toLowerCase()))
      ? "yes"
      : "no";

  return {
    rentalProperty,
    title: firstNonEmptyString(personalInfo?.title, quoteRecord.title, "Mr") || "Mr",
    firstName: firstNonEmptyString(personalInfo?.fastName, personalInfo?.firstName, quoteRecord.fastName, quoteRecord.firstName),
    sureName: firstNonEmptyString(personalInfo?.sureName, personalInfo?.surname, personalInfo?.lastName, quoteRecord.sureName),
    email: firstNonEmptyString(personalInfo?.email, quoteRecord.email),
    address: firstNonEmptyString(
      personalInfo?.address,
      personalInfo?.fullAddress,
      quoteRecord.installationAddress,
      quoteRecord.address
    ),
    mobileNumber: firstNonEmptyString(
      personalInfo?.mobleNumber,
      personalInfo?.mobileNumber,
      personalInfo?.phone,
      quoteRecord.mobileNumber,
      quoteRecord.phone
    ),
  };
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
        <button className="shrink-0 pt-1 text-[16px] font-bold text-[#FFDE59] underline underline-offset-2">View</button>
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
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(payTodayTotal / 12)}/mo</p>
        </div>
      </div>

      <div className="mt-3 flex min-h-[34px] items-center justify-center rounded-[6px] bg-[#F0F3F6] px-2 text-center">
        <BadgePercent className="mr-2 h-5 w-5 shrink-0 text-[#64748B]" />
        <span className="text-[16px] font-semibold text-[#2D3D4D]">{product.boilerAbility || product.title} Discount</span>
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
              {getWarrantyText(product) ? <p className="text-[16px] text-[#2D3D4D]">{getWarrantyText(product)}</p> : null}
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

          {quotePriceItem ? (
            <div className="flex items-start justify-between gap-3 border-t border-dotted border-[#A7B1BB] pt-2">
              <span className="text-[18px] text-[#2D3D4D]">{quotePriceItem.label}</span>
              <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">
                {formatMoney(quotePriceItem.price)}
              </span>
            </div>
          ) : null}
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-[16px] font-medium text-[#2f3b4a]">{children}</label>;
}

function ManualAddressFormSection({
  postcode,
  selectedAddress,
  form,
  onEditAddress,
  onFieldChange,
  onRentalChange,
  onSubmit,
  isSubmitting,
}: {
  postcode: string;
  selectedAddress: string;
  form: ManualAddressForm;
  onEditAddress: () => void;
  onFieldChange: (key: keyof ManualAddressForm, value: string) => void;
  onRentalChange: (value: "yes" | "no") => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-center justify-center gap-3 text-center">
        <MapPin className="h-4 w-4 text-[#304153]" />
        <h2 className="text-[16px] font-medium text-[#2f3b4a]">Where are we visiting?</h2>
      </div>

      <p className="mt-3 text-center text-[16px] text-[#4f5b67]">All fields are required unless marked optional</p>

      <div className="mt-5">
        <label className="block text-[16px] font-semibold text-[#2f3b4a]">Installation address</label>
        <p className="mt-1 text-[16px] leading-5 text-[#4f5b67]">
          You already told us your postcode ({postcode || "N/A"}). You can edit your address details below.
        </p>

        <div className="mt-3 rounded-[6px] bg-[#F0F3F6] px-4 py-6 text-center text-[16px] text-[#2f3b4a] sm:py-7">
          {selectedAddress || "No address selected"}
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onEditAddress}
            className="text-[16px] font-medium text-[#d7a729] underline underline-offset-2"
          >
            Edit Address
          </button>
        </div>

        <div className="mt-5 rounded-[8px] bg-[#F0F3F6] p-4 sm:p-5">
          <h3 className="text-[16px] font-semibold text-[#2f3b4a]">Is this a rental Property</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onRentalChange("yes")}
              className="flex items-center gap-2 text-[16px] text-[#2f3b4a]"
            >
              {form.rentalProperty === "yes" ? (
                <CheckCircle2 className="h-4 w-4 fill-[#00aa63] text-[#00aa63]" />
              ) : (
                <Circle className="h-4 w-4 text-[#c8ced6]" />
              )}
              Yes this is a rental property
            </button>

            <button
              type="button"
              onClick={() => onRentalChange("no")}
              className="flex items-center gap-2 text-[16px] text-[#2f3b4a]"
            >
              {form.rentalProperty === "no" ? (
                <CheckCircle2 className="h-4 w-4 fill-[#00aa63] text-[#00aa63]" />
              ) : (
                <Circle className="h-4 w-4 text-[#c8ced6]" />
              )}
              No I am the homeowner
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-[16px] font-semibold text-[#2f3b4a]">Your details</h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <FieldLabel>Title</FieldLabel>
              <select
                value={form.title}
                onChange={(event) => onFieldChange("title", event.target.value)}
                className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
              >
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div>
              <FieldLabel>First Name</FieldLabel>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => onFieldChange("firstName", event.target.value)}
                className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
                placeholder="Jhon"
              />
            </div>

            <div>
              <FieldLabel>Sure Name</FieldLabel>
              <input
                type="text"
                value={form.sureName}
                onChange={(event) => onFieldChange("sureName", event.target.value)}
                className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="mt-3">
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
              placeholder="jondeo@example.com"
            />
          </div>

          <div className="mt-3">
            <FieldLabel>Address</FieldLabel>
            <input
              type="text"
              value={form.address}
              onChange={(event) => onFieldChange("address", event.target.value)}
              className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
              placeholder="eg : 1205 Washington dc"
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[72px_minmax(0,1fr)] sm:items-end">
            <div>
              <div className="mb-1 block text-[16px] font-medium text-transparent select-none">Flag</div>
              <div className="flex h-[42px] items-center justify-center rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] text-[28px]">
                🇬🇧
              </div>
            </div>
            <div>
              <FieldLabel>Mobile Number</FieldLabel>
              <input
                type="tel"
                value={form.mobileNumber}
                onChange={(event) => onFieldChange("mobileNumber", event.target.value)}
                className="h-[42px] w-full rounded-[2px] border-b border-[#97a1ad] bg-[#F0F3F6] px-3 text-[16px] text-[#2f3b4a] outline-none"
                placeholder="0790028440842"
              />
            </div>
          </div>

          <p className="mt-4 text-center text-[16px] text-[#3f4a57]">
            Your personal data will processed in accordance with our{" "}
            <span className="text-[#d6a62e] underline underline-offset-2">Privacy policy</span>
          </p>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="mt-4 w-full rounded-[6px] bg-[#edf0f2] px-4 py-3 text-[16px] font-medium text-[#2f3b4a] disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
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

function BoilerAddressDetailsCloneContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");

  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
  const quoteProductId = typeof quote?.productId === "string" ? quote.productId : quote?.productId?._id ?? null;
  const resolvedProductId = productIdFromQuery ?? quoteProductId;
  const { data: product, isLoading: productLoading } = useProductById(resolvedProductId);

  const selectedController: ApiQuoteController | null =
    quote?.controller && typeof quote.controller !== "string" ? quote.controller : null;
  const selectedExtra: ApiQuoteExtra | null = quote?.extra && typeof quote.extra !== "string" ? quote.extra : null;

  const selectedControllerPrice =
    selectedController && typeof selectedController.price === "number" && selectedController.price > 0
      ? selectedController.price
      : 0;
  const selectedExtraPrice =
    selectedExtra && typeof selectedExtra.price === "number" && selectedExtra.price > 0 ? selectedExtra.price : 0;
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

  const installDateRaw = (quote as unknown as Record<string, unknown> | null)?.installDate;
  const installDateLabel = formatInstallDateLabel(typeof installDateRaw === "string" ? installDateRaw : null);

  const postcode = extractPostcode(quote);
  const addressOptions = extractAddressOptions(quote);
  const locationLabel = extractLocationLabel(quote);
  const [postcodeLocationLabel, setPostcodeLocationLabel] = React.useState("");
  const selectedAddress = (addressOptions[0] ?? postcodeLocationLabel) || locationLabel;

  const [form, setForm] = React.useState<ManualAddressForm>({
    rentalProperty: "no",
    title: "Mr",
    firstName: "",
    sureName: "",
    email: "",
    address: "",
    mobileNumber: "",
  });
  const [didPrefill, setDidPrefill] = React.useState(false);

  React.useEffect(() => {
    setDidPrefill(false);
  }, [quoteId]);

  React.useEffect(() => {
    if (!quote || didPrefill) return;

    const defaults = extractFormDefaults(quote);
    setForm({
      ...defaults,
      address: defaults.address || selectedAddress,
    });
    setDidPrefill(true);
  }, [didPrefill, quote, selectedAddress]);

  React.useEffect(() => {
    let active = true;
    const normalizedPostcode = postcode.trim();

    if (!normalizedPostcode) {
      setPostcodeLocationLabel("");
      return () => {
        active = false;
      };
    }

    fetchPostcodeLocationLabel(normalizedPostcode).then((label) => {
      if (!active) return;
      setPostcodeLocationLabel(label);
    });

    return () => {
      active = false;
    };
  }, [postcode]);

  const editAddressUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query ? `/boilers/installation-booking/address?${query}` : "/boilers/installation-booking/address";
  }, [searchParams]);
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

  const handleFieldChange = React.useCallback((key: keyof ManualAddressForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }, []);

  const handleRentalChange = React.useCallback((value: "yes" | "no") => {
    setForm((previous) => ({
      ...previous,
      rentalProperty: value,
    }));
  }, []);

  const handleEditAddress = React.useCallback(() => {
    router.push(editAddressUrl);
  }, [editAddressUrl, router]);

  const { mutateAsync: mutateManualAddress, isPending: isSubmittingManualAddress } = useMutation({
    mutationKey: ["update-quote-manual-address"],
    mutationFn: updateQuoteManualAddress,
  });

  const handleSubmitManualAddress = React.useCallback(async () => {
    if (!quoteId) {
      return;
    }

    const installAddress = (form.address || selectedAddress).trim();
    if (!installAddress) {
      return;
    }

    const personalInfo = {
      title: form.title.trim(),
      fastName: form.firstName.trim(),
      sureName: form.sureName.trim(),
      email: form.email.trim(),
      mobleNumber: form.mobileNumber.trim(),
      address: installAddress,
      isRentalProperty: form.rentalProperty === "yes",
    };

    if (
      !personalInfo.title ||
      !personalInfo.fastName ||
      !personalInfo.sureName ||
      !personalInfo.email ||
      !personalInfo.mobleNumber
    ) {
      return;
    }

    try {
      await mutateManualAddress({
        quoteId,
        payload: {
          personalInfo,
          installAddress,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
      router.push(paymentMethodUrl);
    } catch (error) {
      console.error("Failed to save manual address details.", error);
    }
  }, [form, mutateManualAddress, paymentMethodUrl, queryClient, quoteId, router, selectedAddress]);

  const isLoading = (quoteId ? quoteLoading : false) || (resolvedProductId ? productLoading : false);
  const installedAtLabel =
    extractInstallAddressLabel(quote) || form.address.trim() || selectedAddress || "Not selected";

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="py-12">
        <div className="mx-auto container">
          {isLoading ? (
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">Loading manual address page...</div>
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

                <ManualAddressFormSection
                  postcode={postcode}
                  selectedAddress={form.address || selectedAddress}
                  form={form}
                  onEditAddress={handleEditAddress}
                  onFieldChange={handleFieldChange}
                  onRentalChange={handleRentalChange}
                  onSubmit={handleSubmitManualAddress}
                  isSubmitting={isSubmittingManualAddress}
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

export default function BoilerAddressDetailsClone() {
  return (
    <React.Suspense fallback={null}>
      <BoilerAddressDetailsCloneContent />
    </React.Suspense>
  );
}
