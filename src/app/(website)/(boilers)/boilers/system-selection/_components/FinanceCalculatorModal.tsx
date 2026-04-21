"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgePoundSterling, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type PaymentMode = "monthly" | "one-off";

type FinancePlan = {
  id: string;
  months: number;
  apr: number;
};

type FinanceCalculatorModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  totalPrice: number;
  discountAmount?: number;
  monthlyBasePrice?: number;
  variant?: "product-card" | "controller";
  onAddToBasket?: () => void;
  onViewProductDetails?: () => void;
};

const FINANCE_PLANS: FinancePlan[] = [
  { id: "120", months: 120, apr: 9.9 },
  { id: "60", months: 60, apr: 9.9 },
  { id: "36", months: 36, apr: 9.9 },
  { id: "12", months: 12, apr: 0 },
];

function calculateMonthlyPayment(principal: number, months: number, apr: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (apr <= 0) return principal / months;

  const monthlyRate = apr / 100 / 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function formatMoney(value: number, alwaysTwoDecimals = false): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const hasDecimals = Math.abs(safeValue % 1) > Number.EPSILON;
  return `£${safeValue.toLocaleString("en-GB", {
    minimumFractionDigits: alwaysTwoDecimals || hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

function getClosestPlanId(totalPrice: number, targetMonthlyPrice?: number): string {
  if (!targetMonthlyPrice || targetMonthlyPrice <= 0) {
    return FINANCE_PLANS[0].id;
  }

  let closestPlanId = FINANCE_PLANS[0].id;
  let smallestDifference = Number.POSITIVE_INFINITY;

  for (const plan of FINANCE_PLANS) {
    const planMonthlyPayment = calculateMonthlyPayment(totalPrice, plan.months, plan.apr);
    const difference = Math.abs(planMonthlyPayment - targetMonthlyPrice);

    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestPlanId = plan.id;
    }
  }

  return closestPlanId;
}

function formatBoilerAbilityShort(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";

  const parts = cleaned.split(" ");
  if (parts.length <= 2) return cleaned;

  const kwPartIndex = parts.findIndex((part) => /kw$/i.test(part));
  if (kwPartIndex > 0 && /\d/.test(parts[kwPartIndex - 1])) {
    return `${parts[kwPartIndex - 1]} ${parts[kwPartIndex]}`;
  }

  return parts.slice(-2).join(" ");
}

function PaymentPageCardBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex h-8 items-center rounded-[4px] bg-[#EAF0FF] px-2 text-[14px] font-semibold text-[#1A49D3]">
        VISA
      </span>
      <span className="inline-flex h-8 items-center rounded-[4px] bg-[#2B66DD] px-2 text-[12px] font-semibold text-white">
        AMEX
      </span>
      <span className="inline-flex h-8 items-center rounded-[4px] bg-white px-2">
        <span className="h-5 w-5 rounded-full bg-[#EA4F24]" />
        <span className="-ml-2 h-5 w-5 rounded-full bg-[#F7B500]" />
      </span>
      <span className="inline-flex h-8 items-center gap-1 rounded-[4px] bg-white px-2 text-[13px] text-[#5F6977]">
        <span className="font-bold text-[#4285F4]">G</span>
        <span>Pay</span>
      </span>
    </div>
  );
}

export default function FinanceCalculatorModal({
  open,
  onOpenChange,
  productName,
  totalPrice,
  discountAmount = 0,
  monthlyBasePrice,
  variant = "product-card",
  onAddToBasket,
  onViewProductDetails,
}: FinanceCalculatorModalProps) {
  const normalizedTotalPrice = Math.max(Number.isFinite(totalPrice) ? totalPrice : 0, 0);
  const normalizedDiscountAmount = Math.max(
    Number.isFinite(discountAmount) ? discountAmount : 0,
    0
  );

  const defaultPlanId = useMemo(
    () => getClosestPlanId(normalizedTotalPrice, monthlyBasePrice),
    [monthlyBasePrice, normalizedTotalPrice]
  );

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [depositPercent, setDepositPercent] = useState(0);

  useEffect(() => {
    if (!open) return;
    setPaymentMode("monthly");
    setSelectedPlanId(defaultPlanId);
    setDepositPercent(0);
  }, [defaultPlanId, open]);

  const depositAmount = (normalizedTotalPrice * depositPercent) / 100;
  const financeAmount = Math.max(normalizedTotalPrice - depositAmount, 0);
  const sliderFillPercent = (depositPercent / 50) * 100;

  const plansWithPayments = useMemo(
    () =>
      FINANCE_PLANS.map((plan) => ({
        ...plan,
        monthlyPayment: calculateMonthlyPayment(financeAmount, plan.months, plan.apr),
      })),
    [financeAmount]
  );

  const selectedPlan =
    plansWithPayments.find((plan) => plan.id === selectedPlanId) ?? plansWithPayments[0];
  const monthlyPayment = selectedPlan?.monthlyPayment ?? 0;
  const totalRepayable = depositAmount + monthlyPayment * selectedPlan.months;
  const costOfFinance = Math.max(totalRepayable - normalizedTotalPrice, 0);
  const interestRateLabel =
    selectedPlan.apr <= 0 ? "0% p.a Fixed" : `${selectedPlan.apr.toFixed(2)}% p.a Fixed`;
  const discountLabel = `${formatBoilerAbilityShort(productName) || productName} Discount`;
  const showActionButtons = variant === "product-card";
  const handleAddToBasket = () => {
    if (onAddToBasket) {
      onAddToBasket();
      return;
    }
    onOpenChange(false);
  };
  const handleViewProductDetails = () => {
    if (onViewProductDetails) {
      onViewProductDetails();
      return;
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        onWheelCapture={(event) => event.stopPropagation()}
        onTouchMoveCapture={(event) => event.stopPropagation()}
        className="max-h-[90vh] overflow-y-auto overscroll-y-contain touch-pan-y border-none bg-[#EEF2F5] px-0 pb-8 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-2 md:px-4 [&::-webkit-scrollbar]:hidden [&>button.absolute]:hidden"
      >
        <SheetTitle className="sr-only">Finance Calculator</SheetTitle>

        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end">
            <SheetClose asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#00A56F] text-white transition hover:bg-[#009562]"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close finance calculator</span>
              </button>
            </SheetClose>
          </div>

          <div className="mt-2 flex justify-center">
            <div className="inline-flex w-full max-w-[340px] rounded-full border border-[#8EA6BD] bg-[#F3F5F7] p-1 sm:max-w-[410px]">
              <button
                type="button"
                className={cn(
                  "h-[44px] flex-1 rounded-full px-3 text-[15px] font-semibold transition sm:text-[17px]",
                  paymentMode === "monthly"
                    ? "bg-[#27415A] text-white"
                    : "text-[#2D3D4D] hover:bg-white/70"
                )}
                onClick={() => setPaymentMode("monthly")}
              >
                Pay monthly
              </button>
              <button
                type="button"
                className={cn(
                  "h-[44px] flex-1 rounded-full px-3 text-[15px] font-semibold transition sm:text-[17px]",
                  paymentMode === "one-off"
                    ? "bg-[#27415A] text-white"
                    : "text-[#2D3D4D] hover:bg-white/70"
                )}
                onClick={() => setPaymentMode("one-off")}
              >
                One off payment
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[20px] font-semibold text-[#2D3D4D] sm:text-[28px]">{productName}</h3>
                <p className="text-[18px] font-medium text-[#2D3D4D] sm:text-[24px]">
                  {formatMoney(normalizedTotalPrice)}
                </p>
              </div>

              {paymentMode === "monthly" ? (
                <div className="mt-8 space-y-8">
                  <div>
                    <h4 className="text-[20px] font-semibold text-[#2D3D4D] sm:text-[22px]">
                      1. Number of monthly payments
                    </h4>

                    <div className="mt-3 grid max-w-[520px] grid-cols-4 gap-2">
                      {plansWithPayments.map((plan) => {
                        const isSelected = plan.id === selectedPlan.id;

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={cn(
                              "h-[64px] rounded-[2px] border text-[24px] font-semibold transition sm:h-[84px] sm:text-[28px]",
                              isSelected
                                ? "border-[#00A56F] bg-[#00A56F] text-white"
                                : "border-[#8EA6BD] bg-[#F3F5F7] text-[#2D3D4D] hover:bg-white"
                            )}
                          >
                            {plan.months}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-2 grid max-w-[520px] grid-cols-4 gap-2 text-center text-[12px] text-[#64748B] sm:text-[13px]">
                      {plansWithPayments.map((plan) => (
                        <span key={`apr-${plan.id}`}>
                          {plan.apr <= 0 ? "0% APR" : `${plan.apr}% APR`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="max-w-[640px]">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-[20px] font-semibold text-[#2D3D4D] sm:text-[22px]">
                        2. Deposit amount
                      </h4>
                      <div className="min-w-[90px] border-b border-[#687789] bg-[#E5EAEE] px-3 py-1 text-center text-[18px] font-medium text-[#2D3D4D] sm:text-[20px]">
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
                        onChange={(event) => setDepositPercent(Number(event.target.value))}
                        style={{
                          background: `linear-gradient(to right, #00A56F 0%, #00A56F ${sliderFillPercent}%, #98A5B6 ${sliderFillPercent}%, #98A5B6 100%)`,
                        }}
                        className="h-[4px] w-full cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-[24px] [&::-webkit-slider-thumb]:w-[24px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#00A56F] [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_#00A56F]"
                        aria-label="Deposit amount percentage"
                      />

                      <div className="mt-3 flex items-center justify-between text-[15px] text-[#59697B]">
                        <span className="rounded-[4px] bg-[#00A56F] px-2 py-[2px] font-medium text-white">
                          {depositPercent}%
                        </span>
                        <span>50%</span>
                      </div>
                    </div>

                    <p className="mt-3 text-[12px] text-[#59697B]">
                      Slide to adjust your deposit or input your preferred amount.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 max-w-[700px]">
                  <h4 className="text-[20px] font-semibold text-[#2D3D4D] sm:text-[24px]">
                    All major credit and debit cards accepted.
                  </h4>

                  <div className="mt-4">
                    <PaymentPageCardBadges />
                  </div>

                  <div className="mt-6 space-y-4">
                    <p className="flex items-start gap-3 text-[15px] text-[#4E5D6D] sm:text-[16px]">
                      <CheckCircle2 className="mt-[2px] h-5 w-5 shrink-0 text-[#6A7A8D]" />
                      <span>Order by 3pm for next day installation where available.</span>
                    </p>
                    <p className="flex items-start gap-3 text-[15px] text-[#4E5D6D] sm:text-[16px]">
                      <CheckCircle2 className="mt-[2px] h-5 w-5 shrink-0 text-[#6A7A8D]" />
                      <span>
                        We&apos;re rated &quot;Excellent&quot; on{" "}
                        <span className="text-[#F96962] underline">Trustpilot</span>.
                      </span>
                    </p>
                    <p className="flex items-start gap-3 text-[15px] text-[#4E5D6D] sm:text-[16px]">
                      <CheckCircle2 className="mt-[2px] h-5 w-5 shrink-0 text-[#6A7A8D]" />
                      <span>Choose a package that is tailored to you.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <aside className="h-fit rounded-[10px] bg-[#E0E6EB] px-5 py-8 sm:px-6 sm:py-10">
              <p className="text-center text-[18px] font-semibold text-[#2D3D4D]">
                {paymentMode === "monthly"
                  ? `${selectedPlan.months} monthly payments of:`
                  : "One off payment:"}
              </p>
              <p className="mt-2 text-center text-[34px] font-bold leading-none text-[#27415A] sm:text-[28px]">
                {paymentMode === "monthly"
                  ? formatMoney(monthlyPayment, true)
                  : formatMoney(normalizedTotalPrice)}
              </p>

              <div className="mt-8 flex items-center justify-between rounded-[8px] bg-[#F7FAFC] px-3 py-3 text-[14px] text-[#2D3D4D] sm:px-4 sm:text-[16px]">
                <div className="flex min-w-0 items-center gap-2">
                  <BadgePoundSterling className="h-4 w-4 shrink-0" />
                  <span className="truncate font-semibold">{discountLabel}</span>
                </div>
                <span className="ml-2 shrink-0 font-semibold text-[#00A56F]">
                  -{formatMoney(normalizedDiscountAmount)}
                </span>
              </div>

              {showActionButtons ? (
                <>
                  <Button
                    onClick={handleAddToBasket}
                    className="mt-8 h-[52px] w-full rounded-[2px] bg-[#00A56F] text-[16px] font-medium text-white hover:bg-[#009562] sm:text-[18px]"
                  >
                    Add to basket
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewProductDetails}
                    className="mt-4 h-[52px] w-full rounded-[2px] border border-[#00A56F] bg-transparent text-[16px] font-medium text-[#00A56F] hover:bg-[#E8F8F1] sm:text-[18px]"
                  >
                    View product details
                  </Button>
                </>
              ) : null}
            </aside>
          </div>

          {paymentMode === "monthly" ? (
            <section className="mt-6 rounded-[10px] bg-[#E0E6EB] px-4 py-4 sm:px-6 sm:py-5">
              <h4 className="text-center text-[18px] font-semibold text-[#2D3D4D]">
                Representative example
              </h4>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Price of goods (product and install):</span>
                    <span className="font-semibold text-[#2D3D4D]">
                      {formatMoney(normalizedTotalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Deposit:</span>
                    <span className="font-semibold text-[#2D3D4D]">{formatMoney(depositAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Amount of credit:</span>
                    <span className="font-semibold text-[#2D3D4D]">{formatMoney(financeAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Interest rate:</span>
                    <span className="font-semibold text-[#2D3D4D]">{interestRateLabel}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Total repayable:</span>
                    <span className="font-semibold text-[#2D3D4D]">{formatMoney(totalRepayable)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Representative APR:</span>
                    <span className="font-semibold text-[#2D3D4D]">{selectedPlan.apr.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Cost of finance:</span>
                    <span className="font-semibold text-[#2D3D4D]">{formatMoney(costOfFinance)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Payment term:</span>
                    <span className="font-semibold text-[#2D3D4D]">{selectedPlan.months} months</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Monthly payment:</span>
                    <span className="font-semibold text-[#2D3D4D]">
                      {formatMoney(monthlyPayment, true)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed border-[#9FB0C2] py-3 text-[13px] sm:text-[16px]">
                    <span className="text-[#5A697A]">Lender:</span>
                    <span className="font-semibold text-[#2D3D4D]">HomeServe Finance</span>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
