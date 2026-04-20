"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgePercent,
  CalendarDays,
  Circle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import {
  useProductById,
  type ApiProductFull,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
  type ApiQuote,
  type ApiQuoteController,
  type ApiQuoteExtra,
  useQuoteById,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useQuoteById";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";

type UpdateQuotePaymentMethodPayload = {
  payByCard: boolean;
  payMounthly: boolean;
};

type UpdateQuotePaymentMethodResponse = {
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

async function updateQuotePaymentMethod({
  quoteId,
  payload,
}: {
  quoteId: string;
  payload: UpdateQuotePaymentMethodPayload;
}): Promise<UpdateQuotePaymentMethodResponse> {
  const response = await fetch(`${resolveQuoteEndpoint()}/${encodeURIComponent(quoteId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as UpdateQuotePaymentMethodResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to update payment method.");
  }

  return result ?? {};
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

function formatMoney(value: number): string {
  if (value % 1 === 0) return `$${value.toLocaleString("en-US")}`;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

function TopBanner({
  payTodayTotal,
  isLoading,
}: {
  payTodayTotal: number;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-[#2D3D4D]">
            <ShieldCheck className="h-4 w-4" />
            <span>Your total price is {isLoading ? "Loading..." : formatMoney(payTodayTotal)}</span>
          </div>
          <p className="mt-2 text-[12px] text-[#2D3D4D] sm:text-[16px]">
            Installation available from next working day- choose your install date below
          </p>
        </div>
        <button className="shrink-0 pt-1 text-[16px] font-medium text-[#d4a62c] underline underline-offset-2">
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
  isLoading,
}: {
  product: ApiProductFull | null;
  payTodayTotal: number;
  originalTotal: number;
  installDateLabel: string;
  installedAtLabel: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
        <div className="h-6 w-48 rounded bg-[#e8edf1]" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="h-24 rounded-[8px] bg-[#f5f6f7]" />
          <div className="h-24 rounded-[8px] bg-[#f5f6f7]" />
        </div>
        <div className="mt-3 h-10 rounded-[8px] bg-[#f5f6f7]" />
        <div className="mt-3 h-28 rounded-[10px] bg-[#f5f6f7]" />
      </aside>
    );
  }

  if (!product) {
    return (
      <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
        <p className="text-[14px] text-[#2f3b4a]">
          Product details not found. Please go back and select your boiler again.
        </p>
      </aside>
    );
  }

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
        <span className="ml-2 text-[16px] font-semibold text-[#00A56F]">-{formatMoney(product.discountPrice ?? 0)}</span>
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
            <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">{installedAtLabel}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function CollapsedStep({ label }: { label: string }) {
  return (
    <div className="rounded-[10px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed]">
      <div className="flex items-center justify-center gap-3 text-center">
        <CalendarDays className="h-4 w-4 text-[#304153]" />
        <span className="text-[18px] font-medium text-[#2f3b4a]">{label}</span>
      </div>
    </div>
  );
}

function PaymentOption({
  title,
  right,
  onClick,
  disabled = false,
}: {
  title: string;
  right?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-[6px] border border-[#8f99a6] bg-white px-3 py-4 text-left transition hover:bg-[#fbfbfc] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <div className="flex items-center gap-3">
        <Circle className="h-[18px] w-[18px] text-[#344255]" />
        <span className="text-[14px] font-medium text-[#2f3b4a]">{title}</span>
      </div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </button>
  );
}

function CardBadges() {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#2f3b4a]">
      <span className="text-[#1a49d3]">VISA</span>
      <span className="rounded bg-[#2b66dd] px-1 py-[2px] text-[9px] text-white">AMEX</span>
      <span className="inline-flex items-center gap-[2px]">
        <span className="h-4 w-4 rounded-full bg-[#ea4f24]" />
        <span className="-ml-2 h-4 w-4 rounded-full bg-[#f7b500]" />
      </span>
      <span className="inline-flex items-center gap-1 rounded bg-white px-1 py-[2px] text-[18px] text-[#5f6977]">
        <span className="font-bold text-[#4285F4]">G</span>
        <span>Pay</span>
      </span>
    </div>
  );
}

function PaymentSection({
  onSelectCard,
  onSelectMonthly,
  isUpdatingMethod,
}: {
  onSelectCard: () => void;
  onSelectMonthly: () => void;
  isUpdatingMethod: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-center justify-center gap-3 text-center">
        <CreditCard className="h-4 w-4 text-[#304153]" />
        <span className="text-[18px] font-medium text-[#2D3D4D]">How would you like to pay?</span>
      </div>

      <p className="mt-4 text-center text-[12px] leading-5 text-[#2D3D4D] sm:text-[16px]">
        Make one payment by card or pay in monthly installments with our finance options
      </p>

      <div className="mt-4 space-y-3">
        <PaymentOption title="Pay by card" right={<CardBadges />} onClick={onSelectCard} disabled={isUpdatingMethod} />
        <PaymentOption title="Pay monthly" onClick={onSelectMonthly} disabled={isUpdatingMethod} />
      </div>

      <div className="mt-4 rounded-[6px] bg-[#edf0f2] px-4 py-3 text-center text-[18px] font-medium text-[#2D3D4D]">
        {isUpdatingMethod ? "Saving payment method..." : "Secure payments powered by stripe."}
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

function BoilerPaymentCloneContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");
  const { mutateAsync: mutatePaymentMethod, isPending: isUpdatingPaymentMethod } = useMutation({
    mutationKey: ["update-quote-payment-method"],
    mutationFn: updateQuotePaymentMethod,
  });
  const monthlyPaymentUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query
      ? `/boilers/installation-booking/monthly-payment?${query}`
      : "/boilers/installation-booking/monthly-payment";
  }, [searchParams]);
  const paymentPageUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query
      ? `/boilers/installation-booking/payment?${query}`
      : "/boilers/installation-booking/payment";
  }, [searchParams]);
  const handleSelectMonthly = React.useCallback(async () => {
    if (!quoteId) {
      router.push(monthlyPaymentUrl);
      return;
    }

    try {
      await mutatePaymentMethod({
        quoteId,
        payload: {
          payByCard: false,
          payMounthly: true,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
      router.push(monthlyPaymentUrl);
    } catch (error) {
      console.error("Failed to update payment method (monthly).", error);
    }
  }, [monthlyPaymentUrl, mutatePaymentMethod, queryClient, quoteId, router]);
  const handleSelectCard = React.useCallback(async () => {
    if (!quoteId) {
      router.push(paymentPageUrl);
      return;
    }

    try {
      await mutatePaymentMethod({
        quoteId,
        payload: {
          payByCard: true,
          payMounthly: false,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
      router.push(paymentPageUrl);
    } catch (error) {
      console.error("Failed to update payment method (card).", error);
    }
  }, [mutatePaymentMethod, paymentPageUrl, queryClient, quoteId, router]);

  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
  const quoteProductId =
    typeof quote?.productId === "string" ? quote.productId : quote?.productId?._id ?? null;
  const resolvedProductId = productIdFromQuery ?? quoteProductId;
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

  const payTodayTotal = product
    ? (product.payablePrice ?? product.price ?? 0) + selectedControllerPrice + selectedExtraPrice
    : 0;
  const originalTotal = product
    ? (product.price ?? 0) + selectedControllerPrice + selectedExtraPrice
    : 0;

  const installDateRaw = (quote as unknown as Record<string, unknown> | null)?.installDate;
  const installDateLabel = formatInstallDateLabel(
    typeof installDateRaw === "string" ? installDateRaw : null
  );
  const installedAtLabel = extractInstallAddressLabel(quote) || "Not selected";
  const isLoading = (quoteId ? quoteLoading : false) || (resolvedProductId ? productLoading : false);

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="py-12">
        <div className="mx-auto container">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
            <section className="space-y-4">
              <TopBanner payTodayTotal={payTodayTotal} isLoading={isLoading} />
              <CollapsedStep label="When should we Survey?" />
              <CollapsedStep label="When should we install?" />
              <CollapsedStep label="Where are we visiting?" />
              <PaymentSection
                onSelectCard={handleSelectCard}
                onSelectMonthly={handleSelectMonthly}
                isUpdatingMethod={isUpdatingPaymentMethod}
              />
              <FooterDisclaimer />
            </section>

            <div>
              <PriceSummary
                product={product ?? null}
                payTodayTotal={payTodayTotal}
                originalTotal={originalTotal}
                installDateLabel={installDateLabel}
                installedAtLabel={installedAtLabel}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </BoilerFlowShell>
  );
}

export default function BoilerPaymentClone() {
  return (
    <React.Suspense fallback={null}>
      <BoilerPaymentCloneContent />
    </React.Suspense>
  );
}
