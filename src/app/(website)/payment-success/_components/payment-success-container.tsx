"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Mail } from "lucide-react";
import { getQuotePriceAdjustmentItems } from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-price-adjustment";
import {
  getBrowserPageUrl,
  sendQuoteEmail,
  type EmailQuoteResponse,
} from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-email";
import { toast } from "sonner";

type BookingProductFeature = {
  title?: string;
  value?: string;
};

type BookingProduct = {
  _id?: string;
  title?: string;
  boilerAbility?: string;
  price?: number;
  payablePrice?: number;
  boilerFeatures?: BookingProductFeature[];
  boilerIncludedData?: string;
};

type BookingController = {
  _id?: string;
  title?: string;
  price?: number;
};

type BookingExtra = {
  _id?: string;
  title?: string;
  price?: number;
};

type BookingQuizAnswer = {
  question?: string;
  answer?: string;
  price?: number | null;
};

type BookingQuote = {
  _id?: string;
  productId?: BookingProduct | string | null;
  controller?: BookingController | string | null;
  extra?: BookingExtra | string | null;
  quizAnswers?: BookingQuizAnswer[];
  personalInfo?: {
    fastName?: string;
    sureName?: string;
    email?: string;
    address?: string;
  } | null;
  installAddress?: string;
  installDate?: string;
};

type BookingDetails = {
  _id: string;
  price?: number;
  status?: string;
  quote?: BookingQuote | string;
};

type BookingApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: BookingDetails;
};

type InstallSurveyDateApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
};

type DetailRow = {
  label: string;
  value: string;
};

function resolveBookingEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking`;
  }
  return "/booking";
}

function resolveQuoteEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/quote`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/quote`;
  }
  return "/quote";
}

async function fetchBookingById(id: string): Promise<BookingDetails> {
  const response = await fetch(`${resolveBookingEndpoint()}/${encodeURIComponent(id)}`);
  const result = (await response.json().catch(() => null)) as BookingApiResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure || !result?.data) {
    throw new Error(result?.message || "Failed to fetch booking details.");
  }

  return result.data;
}

async function sendQuoteEmailFromSuccessPage({
  quoteId,
  pageUrl,
  price,
}: {
  quoteId: string;
  pageUrl: string;
  price: number;
}): Promise<EmailQuoteResponse> {
  const installSurveyResponse = await fetch(`${resolveQuoteEndpoint()}/install-survey-data`);
  const installSurveyResult = (await installSurveyResponse.json().catch(() => null)) as InstallSurveyDateApiResponse | null;
  const installSurveyFailed =
    !installSurveyResponse.ok ||
    installSurveyResult?.success === false ||
    installSurveyResult?.status === false;

  if (installSurveyFailed) {
    throw new Error(installSurveyResult?.message || "Failed to fetch install/survey data.");
  }

  return sendQuoteEmail({
    quoteId,
    pageUrl,
    price,
  });
}

function formatMoney(value: number): string {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
  return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatAddonPrice(price: number): string {
  if (price <= 0) return "Included";
  return `£${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function parseIncludedItems(rawValue: string | undefined): string[] {
  if (!rawValue?.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      rawValue
        .split(/\r?\n|•|\u2022|,/g)
        .map((item) => item.replace(/^[-*\s]+/, "").trim())
        .filter(Boolean)
    )
  );
}

function buildDetailRows(quote: BookingQuote | null, product: BookingProduct | null): DetailRow[] {
  if (!quote) {
    return [];
  }

  const rows: DetailRow[] = [];

  const selectedController =
    quote.controller && typeof quote.controller !== "string" ? quote.controller : null;
  const selectedExtra = quote.extra && typeof quote.extra !== "string" ? quote.extra : null;

  if (selectedController?.title) {
    rows.push({
      label: selectedController.title,
      value: formatAddonPrice(selectedController.price ?? 0),
    });
  }

  if (selectedExtra?.title) {
    rows.push({
      label: selectedExtra.title,
      value: formatAddonPrice(selectedExtra.price ?? 0),
    });
  }

  const adjustments = getQuotePriceAdjustmentItems(quote.quizAnswers);
  for (const adjustment of adjustments) {
    rows.push({
      label: adjustment.label,
      value: formatMoney(adjustment.price),
    });
  }

  const productFeatures = Array.isArray(product?.boilerFeatures) ? product.boilerFeatures : [];
  for (const feature of productFeatures) {
    const title = firstNonEmptyString(feature.title);
    const value = firstNonEmptyString(feature.value);
    if (!title || !value) continue;

    rows.push({
      label: title,
      value,
    });
  }

  const includedItems = parseIncludedItems(product?.boilerIncludedData);
  for (const item of includedItems) {
    rows.push({
      label: item,
      value: "Included",
    });
  }

  return rows;
}



function FooterDisclaimer() {
  return (
    <p className="pt-6 text-[11px] leading-6 text-[#2D3D4D] sm:text-[14px]">
      *Representative example for 120 month order: £3,099 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
      Representative APR: 9.9% APR. Total amount of credit £3,099 paid over 120 months as 120 monthly payments of
      £40.07 at 9.48% p.a. Cost of finance £1,709.40. Total amount payable £4,808.40. BOXI Limited is a credit broker
      and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status,
      affordability and credit check. Terms and conditions apply.
    </p>
  );
}

export default function BookingPaymentSuccessContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const quoteId = searchParams.get("quoteId");
  const productId = searchParams.get("productId");

  const {
    data: booking,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["booking", bookingId],
    enabled: Boolean(bookingId),
    retry: 1,
    refetchOnWindowFocus: false,
    queryFn: () => fetchBookingById(bookingId as string),
  });

  const quote = booking?.quote && typeof booking.quote !== "string" ? booking.quote : null;
  const product = quote?.productId && typeof quote.productId !== "string" ? quote.productId : null;

  const bookingTitle = firstNonEmptyString(product?.boilerAbility, product?.title, "Boiler installation");
  const fullName = firstNonEmptyString(
    `${quote?.personalInfo?.fastName ?? ""} ${quote?.personalInfo?.sureName ?? ""}`.trim(),
    "Customer"
  );
  const email = firstNonEmptyString(quote?.personalInfo?.email);
  const { mutateAsync: mutateSendQuoteEmail, isPending: isSendingQuoteEmail } = useMutation({
    mutationKey: ["send-quote-email-from-payment-success"],
    mutationFn: sendQuoteEmailFromSuccessPage,
  });

  const selectedController =
    quote?.controller && typeof quote.controller !== "string" ? quote.controller : null;
  const selectedExtra = quote?.extra && typeof quote.extra !== "string" ? quote.extra : null;

  const selectedControllerPrice =
    selectedController && typeof selectedController.price === "number" && selectedController.price > 0
      ? selectedController.price
      : 0;
  const selectedExtraPrice =
    selectedExtra && typeof selectedExtra.price === "number" && selectedExtra.price > 0
      ? selectedExtra.price
      : 0;
  const adjustmentTotal = getQuotePriceAdjustmentItems(quote?.quizAnswers).reduce(
    (sum, item) => sum + item.price,
    0
  );

  const productPrice =
    product && typeof product.payablePrice === "number"
      ? product.payablePrice
      : product && typeof product.price === "number"
      ? product.price
      : 0;

  const totalPrice =
    productPrice > 0
      ? productPrice + selectedControllerPrice + selectedExtraPrice + adjustmentTotal
      : typeof booking?.price === "number"
      ? booking.price
      : 0;

  const detailRows = React.useMemo(() => buildDetailRows(quote, product), [quote, product]);

  const customerDetailsUrl = React.useMemo(() => {
    const params = new URLSearchParams();
    if (quoteId) {
      params.set("quoteId", quoteId);
    }
    if (productId) {
      params.set("productId", productId);
    }
    const query = params.toString();
    return query ? `/boilers/customer-details?${query}` : "/boilers/customer-details";
  }, [productId, quoteId]);

  const handleEmailQuote = React.useCallback(async () => {
    if (!quoteId) {
      toast.error("Quote ID not found. Please start again.");
      return;
    }

    try {
      const result = await mutateSendQuoteEmail({
        quoteId,
        pageUrl: getBrowserPageUrl(),
        price: totalPrice,
      });
      toast.success(result.message || "Quote email sent successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send quote email.");
    }
  }, [mutateSendQuoteEmail, quoteId, totalPrice]);

  return (
  <div>
        <div className="py-12">
        <div className="mx-auto w-full max-w-[1160px]">
          <section className="rounded-[8px] bg-white px-4 py-8 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e6eaef] sm:px-8">
            <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#0CA56B] text-white">
              <Check className="h-9 w-9" strokeWidth={3} />
            </div>

            <h1 className="mt-4 text-center text-[28px] font-semibold tracking-[-0.02em] text-[#2D3D4D]">
              Booking Confirmed!
            </h1>

            <p className="mt-2 text-center text-[14px] text-[#526174] sm:text-[16px]">
              Thanks {fullName}. Your payment has been received and your installation booking is confirmed.
            </p>

        

            {!bookingId ? (
              <div className="mt-6 rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-4 py-3 text-center text-[14px] text-[#b42318]">
                Booking ID missing. Please go back to payment and try again.
              </div>
            ) : isLoading ? (
              <div className="mt-6 rounded-[6px] bg-[#edf0f2] px-4 py-6 text-center text-[15px] text-[#2D3D4D]">
                Loading your booking details...
              </div>
            ) : error ? (
              <div className="mt-6 space-y-3 rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-4 py-4 text-center">
                <p className="text-[14px] text-[#b42318]">
                  {error instanceof Error ? error.message : "Failed to load booking details."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void refetch();
                  }}
                  className="rounded-[6px] bg-[#2D3D4D] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#243241]"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <h2 className="text-[20px] font-semibold text-[#2D3D4D]">Booking Details</h2>

                <div className="mt-3 grid grid-cols-[minmax(0,1fr)_120px] gap-3 border-b border-dashed border-[#BAC3CE] pb-4 text-[18px] font-semibold text-[#2D3D4D] sm:grid-cols-[minmax(0,1fr)_160px]">
                  <p>{bookingTitle}</p>
                  <p className="text-right">{formatMoney(totalPrice)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push(customerDetailsUrl)}
                  className="mt-3 text-[16px] font-semibold text-[#FFDE59] underline underline-offset-2"
                >
                  View details
                </button>

                <div className="mt-4 divide-y divide-dashed divide-[#BAC3CE]">
                  {detailRows.length ? (
                    detailRows.map((row, index) => (
                      <div
                        key={`${row.label}-${index}`}
                        className="grid grid-cols-[minmax(0,1fr)_120px] gap-3 py-3 text-[16px] text-[#2D3D4D] sm:grid-cols-[minmax(0,1fr)_160px]"
                      >
                        <p>{row.label}</p>
                        <p className="text-right font-semibold">{row.value}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-3 text-[14px] text-[#5D6B7A]">
                      Your selected services and included items will appear here shortly.
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleEmailQuote}
                    disabled={isSendingQuoteEmail || !email || !quoteId}
                    className={`flex h-[46px] w-full items-center justify-center gap-2 rounded-[6px] border text-[14px] font-medium transition ${
                      email
                        ? "border-[#8ad0b2] text-[#0A7E52] hover:bg-[#F1FBF6]"
                        : "border-[#d3d9e0] text-[#9aa5b1]"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    <Mail className="h-4 w-4" />
                    <span>{isSendingQuoteEmail ? "Sending..." : "Email My Quote"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="h-[46px] w-full rounded-[6px] border border-[#cfd6df] bg-[#F8FAFC] text-[14px] font-medium text-[#2D3D4D] transition hover:bg-[#EFF3F7]"
                  >
                    Back to home
                  </button>
                </div>
              </div>
            )}
          </section>

          <FooterDisclaimer />
        </div>
      </div>
  </div>
  );
}
