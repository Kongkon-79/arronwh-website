"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgePercent,
  CalendarDays,
  Check,
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
  payMounthlyData?: {
    deposit: number;
    mounthNumber: number;
    amount: number;
  };
};

type UpdateQuotePaymentMethodResponse = {
  success?: boolean;
  status?: boolean;
  message?: string;
};

type CreateBookingPayload = {
  quote: string;
  price: number;
};

type CreateBookingResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: {
    _id?: string;
  };
};

type FinancePlan = {
  id: string;
  months: number;
  apr: number;
  title: string;
};

const FINANCE_PLANS: FinancePlan[] = [
  { id: "120", months: 120, apr: 9.9, title: "120 months - 9.9% APR" },
  { id: "60", months: 60, apr: 9.9, title: "60 months - 9.9% APR" },
  { id: "36", months: 36, apr: 9.9, title: "36 months - 9.9% APR" },
  { id: "12", months: 12, apr: 0, title: "12 months - 0% APR" },
];

function resolveQuoteEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/quote`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/quote`;
  }
  return "/quote";
}

function resolveBookingEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/booking`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/booking`;
  }
  return "/booking";
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

async function createBooking(payload: CreateBookingPayload): Promise<string> {
  const response = await fetch(resolveBookingEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as CreateBookingResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;
  const bookingId = typeof result?.data?._id === "string" ? result.data._id : "";

  if (!response.ok || hasExplicitFailure || !bookingId) {
    throw new Error(result?.message || "Failed to create booking.");
  }

  return bookingId;
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

function calculateMonthlyPayment(principal: number, months: number, apr: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (apr <= 0) return principal / months;

  const monthlyRate = apr / 100 / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function TopBanner({
  totalPrice,
  isLoading,
}: {
  totalPrice: number;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-[#2D3D4D]">
            <ShieldCheck className="h-4 w-4" />
            <span>Your total price is {isLoading ? "Loading..." : formatMoney(totalPrice)}</span>
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
  payTodayValue,
  monthlyCostValue,
  totalPrice,
  originalTotal,
  installDateLabel,
  installedAtLabel,
  isLoading,
}: {
  product: ApiProductFull | null;
  payTodayValue: number;
  monthlyCostValue: number;
  totalPrice: number;
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
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(payTodayValue)}</p>
          {originalTotal > totalPrice ? (
            <p className="mt-1 text-[14px] font-medium text-[#00A56F] line-through">was {formatMoney(originalTotal)}</p>
          ) : null}
        </div>

        <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
          <p className="text-[18px] text-[#64748B]">Monthly Cost</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(monthlyCostValue)}/mo</p>
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
        <span className="text-[18px] font-medium text-[#2D3D4D]">{label}</span>
      </div>
    </div>
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

function PaymentMethodRow({
  title,
  active,
  onClick,
  right,
  disabled = false,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
  right?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-[6px] border px-3 py-4 text-left transition ${
        active ? "border-[#00aa63] bg-[#f7fffb]" : "border-[#8f99a6] bg-white hover:bg-[#fbfbfc]"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <div className="flex items-center gap-3">
        <Circle
          className={`h-[18px] w-[18px] ${
            active ? "fill-[#00aa63] text-[#00aa63]" : "text-[#344255]"
          }`}
        />
        <span className="text-[14px] font-medium text-[#2f3b4a]">{title}</span>
      </div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </button>
  );
}

function FinancePlanRow({
  title,
  price,
  selected,
  onClick,
}: {
  title: string;
  price: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[6px] border px-3 py-3 text-left transition ${
        selected ? "border-[#e6cf7d] bg-white" : "border-[#9aa4b0] bg-white hover:bg-[#fbfbfc]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-[16px] w-[16px] items-center justify-center rounded-full border ${
            selected ? "border-[#00aa63]" : "border-[#5c6776]"
          }`}
        >
          {selected ? <span className="h-2.5 w-2.5 rounded-full bg-[#00aa63]" /> : null}
        </span>
        <span className="text-[18px] font-medium text-[#2f3b4a]">{title}</span>
      </div>
      <span className="text-[18px] font-semibold text-[#00aa63]">{price}</span>
    </button>
  );
}

function SelectedPlanBreakdownCard({
  title,
  totalPrice,
  depositAmount,
  monthlyPayment,
  months,
  apr,
}: {
  title: string;
  totalPrice: number;
  depositAmount: number;
  monthlyPayment: number;
  months: number;
  apr: number;
}) {
  const totalRepayable = depositAmount + monthlyPayment * months;
  const representative = apr <= 0 ? "0% p.a Fixed" : `${apr.toFixed(2)}% p.a Fixed`;

  return (
    <div className="rounded-[10px] border border-[#e7cd74] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 rounded-full bg-[#00aa63]" />
          <p className="text-[20px] font-medium text-[#2D3D4D]">{title}</p>
        </div>
        <p className="text-[18px] font-semibold text-[#00aa63]">{formatMoney(monthlyPayment)}/mo</p>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-2 md:grid-cols-2">
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Total price</span>
          <span className="font-semibold text-[#2D3D4D]">{formatMoney(totalPrice)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Advanced payments</span>
          <span className="font-semibold text-[#2D3D4D]">{formatMoney(depositAmount)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Payment term</span>
          <span className="font-semibold text-[#2D3D4D]">{months} months</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Monthly payment</span>
          <span className="font-semibold text-[#2D3D4D]">{formatMoney(monthlyPayment)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Total repayable</span>
          <span className="font-semibold text-[#2D3D4D]">{formatMoney(totalRepayable)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[18px]">
          <span className="text-[#2D3D4D]">Representative</span>
          <span className="font-semibold text-[#2D3D4D]">{representative}</span>
        </div>
      </div>
    </div>
  );
}

function SelectedPlanCard({
  title,
  dueToday,
  monthlyPayment,
  months,
  onChangeDepositAmount,
}: {
  title: string;
  dueToday: number;
  monthlyPayment: number;
  months: number;
  onChangeDepositAmount: () => void;
}) {
  return (
    <div className="rounded-[8px] bg-[#e3ece5] p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_370px]">
        <div>
          <h5 className="text-[24px] font-semibold text-[#2D3D4D] md:text-[30px]">Your plan</h5>
          <p className="mt-3 text-[20px] text-[#2D3D4D] md:text-[24px]">{title}</p>
        </div>

        <div className="space-y-2">
          <div className="rounded-[2px] bg-white px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[18px] text-[#2D3D4D] md:text-[18px]">Due today</p>
                <button
                  type="button"
                  onClick={onChangeDepositAmount}
                  className="mt-2 text-[14px] text-[#ff655e] underline underline-offset-2 md:text-[18px]"
                >
                  Change deposit amount
                </button>
              </div>
              <p className="text-[28px] font-semibold leading-none text-[#2D3D4D] md:text-[18px]">
                {formatMoney(dueToday)}
              </p>
            </div>
          </div>

          <div className="rounded-[2px] bg-white px-4 py-3">
            <div className="flex items-end justify-between gap-4">
              <p className="text-[18px] text-[#2D3D4D] md:text-[18px]">Due monthly</p>
              <div className="text-right">
                <p className="text-[28px] font-semibold leading-none text-[#00aa63] md:text-[18px]">
                  {formatMoney(monthlyPayment)}
                </p>
                <p className="mt-1 text-[18px] text-[#2D3D4D] md:text-[18px]">for {months} months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentSection({
  totalPrice,
  paymentType,
  onSelectCard,
  onSelectMonthly,
  isUpdatingMethod,
  onSubmitMonthlyData,
  isSubmittingMonthlyData,
  depositPercent,
  onDepositPercentChange,
  selectedPlanId,
  onSelectPlan,
}: {
  totalPrice: number;
  paymentType: "card" | "monthly";
  onSelectCard: () => void;
  onSelectMonthly: () => void;
  isUpdatingMethod: boolean;
  onSubmitMonthlyData: (payload: {
    deposit: number;
    mounthNumber: number;
    amount: number;
  }) => Promise<void>;
  isSubmittingMonthlyData: boolean;
  depositPercent: number;
  onDepositPercentChange: (value: number) => void;
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const depositAmount = (totalPrice * depositPercent) / 100;
  const financeAmount = Math.max(totalPrice - depositAmount, 0);
  const sliderFillPercent = (depositPercent / 50) * 100;

  const planDetails = useMemo(() => {
    return FINANCE_PLANS.map((plan) => {
      const monthlyPayment = calculateMonthlyPayment(financeAmount, plan.months, plan.apr);

      return {
        ...plan,
        monthlyPayment,
      };
    });
  }, [financeAmount]);
  const selectedPlan = planDetails.find((plan) => plan.id === selectedPlanId) ?? null;

  const handleChangeDepositAmount = () => {
    const depositSection = document.getElementById("deposit-amount-section");
    if (depositSection) {
      depositSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const handlePayViaStripe = React.useCallback(async () => {
    setSubmitError("");

    if (!agreeTerms || !agreePrivacy) {
      setSubmitError("Please accept Terms & Conditions and Privacy Policy before continuing.");
      return;
    }

    if (!selectedPlan) {
      setSubmitError("Please choose your monthly plan before continuing.");
      return;
    }

    try {
      await onSubmitMonthlyData({
        deposit: Number(depositAmount.toFixed(2)),
        mounthNumber: selectedPlan.months,
        amount: Number(selectedPlan.monthlyPayment.toFixed(2)),
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to continue with monthly payment. Please try again.";
      setSubmitError(message);
    }
  }, [agreePrivacy, agreeTerms, depositAmount, onSubmitMonthlyData, selectedPlan]);

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
        <PaymentMethodRow
          title="Pay by card"
          active={paymentType === "card"}
          onClick={onSelectCard}
          right={<CardBadges />}
          disabled={isUpdatingMethod}
        />
        <PaymentMethodRow
          title="Pay monthly"
          active={paymentType === "monthly"}
          onClick={onSelectMonthly}
          disabled={isUpdatingMethod}
        />
      </div>

      <div className="mt-4 rounded-[6px] bg-[#F0F3F6] px-4 py-3 text-center text-[18px] font-medium text-[#2D3D4D]">
        {isUpdatingMethod ? "Saving payment method..." : "Secure payments powered by stripe."}
      </div>

      {paymentType === "monthly" ? (
        <div className="mt-4 space-y-4">
          <div id="deposit-amount-section">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-[18px] font-medium text-[#2D3D4D]">1. Deposit amount</h4>
              <div className="min-w-[98px] rounded-[2px] border-b border-[#687789] bg-[#E9EDF0] px-3 py-[8px] text-center text-[18px] font-medium leading-none text-[#1f2c3a]">
                {formatMoney(depositAmount)}
              </div>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={depositPercent}
                onChange={(event) => onDepositPercentChange(Number(event.target.value))}
                style={{
                  background: `linear-gradient(to right, #00aa63 0%, #00aa63 ${sliderFillPercent}%, #98A5B6 ${sliderFillPercent}%, #98A5B6 100%)`,
                }}
                className="h-[4px] w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-[24px] [&::-webkit-slider-thumb]:w-[24px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#00aa63] [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#00aa63]"
                aria-label="Deposit amount percentage"
              />

              <div className="relative mt-3">
                <span
                  style={{ left: `clamp(24px, ${sliderFillPercent}%, calc(100% - 24px))` }}
                  className="absolute -top-1 -translate-x-1/2 rounded-[4px] bg-[#00aa63] px-2 py-1 text-[14px] font-semibold leading-none text-white"
                >
                  {depositPercent}%
                </span>
              </div>

              <div className="mt-9 flex items-center justify-between text-[18px] text-[#2D3D4D]">
                <span>0%</span>
                <span>50%</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-[#4f5b67] sm:text-[16px]">
              <span>
               Slide to adjust your deposit or input your preferred amount.
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-[18px] font-medium text-[#2D3D4D]">2. Choose your plan</h4>
              <div className="min-w-[68px] rounded-[2px] bg-[#F0F3F6] px-3 py-[6px] text-center text-[18px] font-medium text-[#2D3D4D]">
                {planDetails.find((plan) => plan.id === selectedPlanId)
                  ? `${formatMoney(
                      planDetails.find((plan) => plan.id === selectedPlanId)!.monthlyPayment
                    )}/mo`
                  : "$0.00/mo"}
              </div>
            </div>

            <div className="mt-3 space-y-4">
              {planDetails.map((plan) => {
                const isSelected = plan.id === selectedPlanId;

                return (
                  <div key={plan.id} className="space-y-2">
                    <FinancePlanRow
                      title={plan.title}
                      price={`${formatMoney(plan.monthlyPayment)}/mo`}
                      selected={isSelected}
                      onClick={() => {
                        setSubmitError("");
                        onSelectPlan(plan.id);
                      }}
                    />
                    {isSelected ? (
                      <>
                        <SelectedPlanBreakdownCard
                          title={plan.title}
                          totalPrice={totalPrice}
                          depositAmount={depositAmount}
                          monthlyPayment={plan.monthlyPayment}
                          months={plan.months}
                          apr={plan.apr}
                        />
                        <SelectedPlanCard
                          title={plan.title}
                          dueToday={depositAmount}
                          monthlyPayment={plan.monthlyPayment}
                          months={plan.months}
                          onChangeDepositAmount={handleChangeDepositAmount}
                        />
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-1 text-[18px] leading-7 text-[#2f3b4a]">
            <label className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitError("");
                  setAgreeTerms((value) => !value);
                }}
                aria-pressed={agreeTerms}
                className={`mt-[1px] flex h-[14px] w-[14px] items-center justify-center border ${
                  agreeTerms ? "border-[#00aa63] bg-[#00aa63]" : "border-[#8f99a6] bg-white"
                }`}
              >
                {agreeTerms ? <Check className="h-3 w-3 text-white" /> : null}
              </button>
              <span>
                I agree to{" "}
                <Link
                  href="/terms-and-condition"
                  className="text-[#d6a62e] underline underline-offset-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  terms & condition
                </Link>
              </span>
            </label>

            <label className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitError("");
                  setAgreePrivacy((value) => !value);
                }}
                aria-pressed={agreePrivacy}
                className={`mt-[1px] flex h-[14px] w-[14px]  items-center justify-center border ${
                  agreePrivacy ? "border-[#00aa63] bg-[#00aa63]" : "border-[#8f99a6] bg-white"
                }`}
              >
                {agreePrivacy ? <Check className="h-4 w-4 text-white" /> : null}
              </button>
              <span>
                i am happy to receive useful reminders & ways to improve my home fro m , aas explained in the{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#d6a62e] underline underline-offset-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  Privacy policy.
                </Link>
              </span>
            </label>
          </div>

          {submitError ? (
            <p className="rounded-[6px] border border-[#f4b8b3] bg-[#fff4f3] px-3 py-2 text-[14px] text-[#c43d33]">
              {submitError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handlePayViaStripe}
            disabled={isUpdatingMethod || isSubmittingMonthlyData}
            className="w-full rounded-[6px] bg-[#F0F3F6] px-4 py-3 text-[18px] font-medium text-[#2D3D4D] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmittingMonthlyData ? "Processing..." : "Pay via Stripe"}
          </button>

          <p className="text-center text-[10px] text-[#4f5b67] sm:text-[11px]">
            We do not charge a fee for our retail finance services
          </p>
        </div>
      ) : null}
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

function BoilerFinanceCloneContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");

  const [paymentType, setPaymentType] = useState<"card" | "monthly">("monthly");
  const [depositPercent, setDepositPercent] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const { mutateAsync: mutatePaymentMethod, isPending: isUpdatingPaymentMethod } = useMutation({
    mutationKey: ["update-quote-payment-method"],
    mutationFn: updateQuotePaymentMethod,
  });
  const { mutateAsync: mutatePayMonthlyData, isPending: isSubmittingMonthlyData } = useMutation({
    mutationKey: ["update-quote-pay-monthly-data"],
    mutationFn: updateQuotePaymentMethod,
  });
  const { mutateAsync: mutateCreateBooking, isPending: isCreatingBooking } = useMutation({
    mutationKey: ["create-booking"],
    mutationFn: createBooking,
  });
  const paymentPageUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query
      ? `/boilers/installation-booking/payment?${query}`
      : "/boilers/installation-booking/payment";
  }, [searchParams]);
  const handleSelectMonthly = React.useCallback(async () => {
    setPaymentType("monthly");

    if (!quoteId) {
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
    } catch (error) {
      console.error("Failed to update payment method (monthly).", error);
    }
  }, [mutatePaymentMethod, queryClient, quoteId]);
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
  const handleSubmitMonthlyData = React.useCallback(
    async (payload: { deposit: number; mounthNumber: number; amount: number }) => {
      if (!quoteId) {
        throw new Error("Quote ID missing. Please restart your booking flow.");
      }

      await mutatePayMonthlyData({
        quoteId,
        payload: {
          payByCard: false,
          payMounthly: true,
          payMounthlyData: payload,
        },
      });
      const bookingId = await mutateCreateBooking({
        quote: quoteId,
        price: payload.deposit,
      });
      await queryClient.invalidateQueries({ queryKey: ["quote", quoteId] });
      const params = new URLSearchParams(searchParams.toString());
      params.set("bookingId", bookingId);
      const query = params.toString();
      router.push(query ? `/boilers/installation-booking/payment?${query}` : "/boilers/installation-booking/payment");
    },
    [mutateCreateBooking, mutatePayMonthlyData, queryClient, quoteId, router, searchParams]
  );

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

  const totalPrice = product
    ? (product.payablePrice ?? product.price ?? 0) + selectedControllerPrice + selectedExtraPrice
    : 0;
  const originalTotal = product
    ? (product.price ?? 0) + selectedControllerPrice + selectedExtraPrice
    : 0;

  const payTodaySidebarValue = totalPrice;
  const monthlySidebarValue = totalPrice > 0 ? totalPrice / 12 : 0;

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
              <TopBanner totalPrice={totalPrice} isLoading={isLoading} />
              <CollapsedStep label="When should we Survey?" />
              <CollapsedStep label="When should we install?" />
              <CollapsedStep label="Where are we visiting?" />
              <PaymentSection
                totalPrice={totalPrice}
                paymentType={paymentType}
                onSelectCard={handleSelectCard}
                onSelectMonthly={handleSelectMonthly}
                isUpdatingMethod={isUpdatingPaymentMethod}
                onSubmitMonthlyData={handleSubmitMonthlyData}
                isSubmittingMonthlyData={isSubmittingMonthlyData || isCreatingBooking}
                depositPercent={depositPercent}
                onDepositPercentChange={(value) => setDepositPercent(Math.min(50, Math.max(0, value)))}
                selectedPlanId={selectedPlanId}
                onSelectPlan={setSelectedPlanId}
              />
              <FooterDisclaimer />
            </section>

            <div>
              <PriceSummary
                product={product ?? null}
                payTodayValue={payTodaySidebarValue}
                monthlyCostValue={monthlySidebarValue}
                totalPrice={totalPrice}
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

export default function BoilerFinanceClone() {
  return (
    <React.Suspense fallback={null}>
      <BoilerFinanceCloneContent />
    </React.Suspense>
  );
}
