'use client';
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { useProductById, type ApiProductFull } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type CalendarDateCell = {
  day: number;
  blocked?: boolean;
  discount?: string;
};

type InstallSurveyDateData = {
  surveyDate?: Array<string | null>;
  installDate?: Array<string | null>;
};

type InstallSurveyDateApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: InstallSurveyDateData;
};

type UpdateSurveyDateResponse = {
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

async function fetchInstallSurveyData(): Promise<InstallSurveyDateData> {
  const response = await fetch(`${resolveQuoteEndpoint()}/install-survey-data`);
  const result = (await response.json().catch(() => null)) as InstallSurveyDateApiResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to fetch install and survey booking data.");
  }

  return {
    surveyDate: result?.data?.surveyDate ?? [],
    installDate: result?.data?.installDate ?? [],
  };
}

async function updateQuoteSurveyDate({
  quoteId,
  surveyDate,
}: {
  quoteId: string;
  surveyDate: string;
}): Promise<UpdateSurveyDateResponse> {
  const response = await fetch(`${resolveQuoteEndpoint()}/${encodeURIComponent(quoteId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ surveyDate }),
  });

  const result = (await response.json().catch(() => null)) as UpdateSurveyDateResponse | null;
  const hasExplicitFailure = result?.success === false || result?.status === false;

  if (!response.ok || hasExplicitFailure) {
    throw new Error(result?.message || "Failed to update survey date.");
  }

  return result ?? {};
}

function getDateKeyFromIso(isoDate: unknown): string | null {
  if (typeof isoDate !== "string") {
    return null;
  }

  const trimmed = isoDate.trim();
  if (!trimmed) return null;

  const datePart = trimmed.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsed.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarRows(
  month: number,
  year: number,
  blockedDateKeys: ReadonlySet<string>
): (CalendarDateCell | null)[][] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const cells: (CalendarDateCell | null)[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isBlocked = blockedDateKeys.has(key);
    const weekDay = (firstWeekday + day - 1) % 7;
    const isSaturday = weekDay === 6;

    cells.push({
      day,
      blocked: isBlocked,
      discount: !isBlocked && isSaturday ? `+£${SATURDAY_SURCHARGE}` : undefined,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const rows: (CalendarDateCell | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
}

const accordions = [
  { icon: CalendarDays, label: "When should we install?" },
  { icon: MapPin, label: "Where are we visiting?" },
  { icon: CreditCard, label: "How would you like to pay?" },
];

const SATURDAY_SURCHARGE = 100;

function formatMoney(value: number): string {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
  return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function isSaturdayDateKey(dateKey: string | null): boolean {
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return false;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    return false;
  }

  return new Date(year, month - 1, day).getDay() === 6;
}

function getWarrantyText(product: ApiProductFull): string | undefined {
  const warrantyFeature = product.boilerFeatures.find((feature) => /warranty/i.test(feature.title));
  if (!warrantyFeature?.value) return undefined;
  return `with ${warrantyFeature.value} warranty`;
}

function TopBanner({
  payTodayTotal,
  onViewDetails,
}: {
  payTodayTotal: number;
  onViewDetails: () => void;
}) {
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
        <button
          type="button"
          onClick={onViewDetails}
          className="shrink-0 pt-1 text-[16px] font-bold text-[#FFDE59] underline underline-offset-2"
        >
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
  quotePriceItem,
}: {
  product: ApiProductFull;
  payTodayTotal: number;
  originalTotal: number;
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

          {quotePriceItem ? (
            <div className="flex items-start justify-between gap-3 border-b border-dotted border-[#A7B1BB] pb-2">
              <span className="text-[16px] text-[#2D3D4D]">{quotePriceItem.label}</span>
              <span className="text-right text-[16px] font-semibold text-[#2D3D4D]">
                {formatMoney(quotePriceItem.price)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function CalendarCell({
  day,
  blocked,
  discount,
  isSelected,
  onSelect,
}: {
  day?: number;
  blocked?: boolean;
  discount?: string;
  isSelected?: boolean;
  onSelect?: (day: number) => void;
}) {
  if (!day) {
    return <div className="h-[52px] sm:h-[54px]" />;
  }

  const isBlocked = Boolean(blocked);

  return (
    <button
      type="button"
      onClick={() => {
        if (!isBlocked) {
          onSelect?.(day);
        }
      }}
      disabled={isBlocked}
      aria-pressed={isBlocked ? undefined : isSelected}
      className={`group flex h-[52px] w-full flex-col items-center justify-center rounded-[6px] text-center transition sm:h-[54px] ${
        isBlocked
          ? "cursor-not-allowed bg-[#f6a9a8] text-[#364254]"
          : isSelected
            ? "bg-[#27384d] text-white"
            : "bg-white text-[#364254] hover:bg-[#27384d] hover:text-white"
      }`}
    >
      <span className="text-[13px] font-medium leading-none">{day}</span>
      {discount ? (
        <span
          className={`mt-1 text-[11px] font-semibold ${
            isSelected ? "text-white" : "text-[#00b26f] group-hover:text-white"
          }`}
        >
          {discount}
        </span>
      ) : null}
    </button>
  );
}

function SurveySection({
  blockedDateKeys,
  isBookingDatesLoading,
  isSubmittingSurveyDate,
  onSubmitSurveyDate,
  onSelectedDateChange,
}: {
  blockedDateKeys: ReadonlySet<string>;
  isBookingDatesLoading: boolean;
  isSubmittingSurveyDate: boolean;
  onSubmitSurveyDate: (surveyDate: string | null) => void;
  onSelectedDateChange?: (surveyDate: string | null) => void;
}) {
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState(() => new Date().getMonth());
  const [selectedYear, setSelectedYear] = React.useState(() => new Date().getFullYear());
  const [isMonthYearOpen, setIsMonthYearOpen] = React.useState(false);
  const calendarRows = React.useMemo(
    () => buildCalendarRows(selectedMonth, selectedYear, blockedDateKeys),
    [selectedMonth, selectedYear, blockedDateKeys]
  );
  const yearOptions = React.useMemo(
    () => Array.from({ length: 11 }, (_, index) => selectedYear - 5 + index),
    [selectedYear]
  );

  React.useEffect(() => {
    setSelectedDay(null);
  }, [selectedMonth, selectedYear]);

  const goToPreviousMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 0) {
        setSelectedYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prevMonth) => {
      if (prevMonth === 11) {
        setSelectedYear((prevYear) => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const selectedDate = selectedDay
    ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;

  React.useEffect(() => {
    onSelectedDateChange?.(selectedDate);
  }, [selectedDate, onSelectedDateChange]);

  return (
    <div className="rounded-[8px] bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-center gap-3 text-center">
        <CalendarDays className="h-4 w-4 text-[#2f3b4a]" />
        <h2 className="text-[16px] font-semibold text-[#2D3D4D] sm:text-[18px]">When should we Survey?</h2>
      </div>

      <p className="mt-3 text-center text-[13px] text-[#2D3D4D] sm:text-[16px]">
        Your Survey will take 1 day and your engineer will arrive between 7.30am-9.30am.
      </p>

      <div className="mt-4 rounded-[12px] bg-[#f0f2f4] px-3 py-4 sm:px-5 sm:py-5">
        <p className="text-center text-[13px] font-medium text-[#374151]">
          {isBookingDatesLoading
            ? "Loading already booked dates..."
            : "Already booked dates are marked in red. Saturday selections include +£100."}
        </p>

        <div className="mt-2 flex items-center justify-center gap-3 text-[#2f3b4a]">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-md p-1 text-[#697586] transition hover:bg-[#e5e8eb]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsMonthYearOpen((prev) => !prev)}
            className="flex items-center justify-center gap-2 rounded-md px-2 py-1 text-[18px] font-semibold text-[#2D3D4D] transition hover:bg-[#e5e8eb]"
            aria-expanded={isMonthYearOpen}
            aria-label="Choose month and year"
          >
            <span>
              {monthNames[selectedMonth]} {selectedYear}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMonthYearOpen ? "rotate-180" : ""}`} />
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-md p-1 text-[#697586] transition hover:bg-[#e5e8eb]"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {isMonthYearOpen ? (
          <div className="mx-auto mt-2 max-w-[320px] rounded-[8px] bg-white p-3 ring-1 ring-[#d9dfe5]">
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1 text-[12px] font-medium text-[#4b5563]">
                Month
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(Number(event.target.value))}
                  className="h-10 rounded-[6px] border border-[#d9dfe5] bg-white px-2 text-[14px] text-[#2f3b4a] outline-none focus:border-[#94a3b8]"
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-medium text-[#4b5563]">
                Year
                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                  className="h-10 rounded-[6px] border border-[#d9dfe5] bg-white px-2 text-[14px] text-[#2f3b4a] outline-none focus:border-[#94a3b8]"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-5 overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-7 gap-x-7 gap-y-3 px-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-[16px] font-medium text-[#374151]">
                  {day}
                </div>
              ))}

              {calendarRows.flat().map((cell, idx) => (
                <CalendarCell
                  key={idx}
                  day={cell?.day}
                  blocked={cell?.blocked}
                  discount={cell?.discount}
                  isSelected={selectedDay === cell?.day}
                  onSelect={setSelectedDay}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmitSurveyDate(selectedDate)}
        disabled={isSubmittingSurveyDate}
        className="mt-4 h-[48px] w-full rounded-[4px] bg-[#00A56F] text-[18px] font-medium text-white transition hover:bg-[#00A56F]"
      >
        {isSubmittingSurveyDate ? "Saving..." : "Next"}
      </button>

      <p className="mt-3 text-center text-[12px] text-[#384555] sm:text-[16px]">
        Don&apos;t see the date you&apos;re after? call us on{' '}
        <span className="font-medium text-[#d3a323] underline underline-offset-2">112233445566</span>{' '}
        and well see if we can install sooner.
      </p>
    </div>
  );
}

function AccordionRow({
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

export default function InstallationBookingContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");
  const { mutateAsync: mutateSurveyDate, isPending: isUpdatingSurveyDate } = useMutation({
    mutationKey: ["update-quote-survey-date"],
    mutationFn: updateQuoteSurveyDate,
  });
  const {
    data: installSurveyData,
    isLoading: installSurveyDataLoading,
  } = useQuery({
    queryKey: ["install-survey-data"],
    queryFn: fetchInstallSurveyData,
  });

  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
  const quoteProductId =
    typeof quote?.productId === "string" ? quote.productId : quote?.productId?._id ?? null;
  const resolvedProductId = productIdFromQuery ?? quoteProductId;
  const customerDetailsUrl = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (resolvedProductId) {
      params.set("productId", resolvedProductId);
    }
    if (quoteId) {
      params.set("quoteId", quoteId);
    }
    const query = params.toString();
    return query ? `/boilers/customer-details?${query}` : "/boilers/customer-details";
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

  const [selectedSurveyDate, setSelectedSurveyDate] = React.useState<string | null>(null);
  const selectedDateSurcharge = isSaturdayDateKey(selectedSurveyDate) ? SATURDAY_SURCHARGE : 0;

  const payTodayTotalBase = product
    ? (product.payablePrice ?? product.price ?? 0) +
      selectedControllerPrice +
      selectedExtraPrice +
      quotePriceAdjustment
    : 0;
  const originalTotalBase = product
    ? (product.price ?? 0) + selectedControllerPrice + selectedExtraPrice + quotePriceAdjustment
    : 0;
  const payTodayTotal = payTodayTotalBase + selectedDateSurcharge;
  const originalTotal = originalTotalBase + selectedDateSurcharge;

  const blockedDateKeys = React.useMemo(() => {
    const keys = new Set<string>();
    const allBookedDates = [
      ...(installSurveyData?.surveyDate ?? []),
      ...(installSurveyData?.installDate ?? []),
    ];

    allBookedDates.forEach((isoDate) => {
      const key = getDateKeyFromIso(isoDate);
      if (key) {
        keys.add(key);
      }
    });

    return keys;
  }, [installSurveyData]);

  const isLoading =
    (quoteId ? quoteLoading : false) ||
    (resolvedProductId ? productLoading : false) ||
    installSurveyDataLoading;

  const handleSubmitSurveyDate = async (surveyDate: string | null) => {
    if (!surveyDate) {
      toast.error("Please select an available survey date.");
      return;
    }

    if (!quoteId) {
      toast.error("Quote ID not found. Please start again.");
      return;
    }

    try {
      await mutateSurveyDate({
        quoteId,
        surveyDate,
      });

      const params = new URLSearchParams(searchParams.toString());
      if (resolvedProductId) {
        params.set("productId", resolvedProductId);
      }
      params.set("quoteId", quoteId);

      const query = params.toString();
      router.push(
        query
          ? `/boilers/installation-booking/install?${query}`
          : "/boilers/installation-booking/install"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save survey date.");
    }
  };

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="py-12">
        <div className="mx-auto container">
          {isLoading ? (
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">Loading installation booking...</div>
          ) : !product ? (
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">
              Product details not found. Please go back and select your boiler again.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
              <section className="space-y-4">
                <TopBanner
                  payTodayTotal={payTodayTotal}
                  onViewDetails={() => router.push(customerDetailsUrl)}
                />
                <SurveySection
                  blockedDateKeys={blockedDateKeys}
                  isBookingDatesLoading={installSurveyDataLoading}
                  isSubmittingSurveyDate={isUpdatingSurveyDate}
                  onSubmitSurveyDate={handleSubmitSurveyDate}
                  onSelectedDateChange={setSelectedSurveyDate}
                />

                <div className="space-y-4">
                  {accordions.map((item) => (
                    <AccordionRow key={item.label} icon={item.icon} label={item.label} />
                  ))}
                </div>

                <p className="pt-2 text-[11px] leading-6 text-[#2D3D4D] sm:text-[16px]">
                  *Representative example for 120 month order: £3,099 purchase. Deposit £0. Annual rate of interest
                  9.48% p.a. Representative APR: 9.9% APR. Total amount of credit £3,099 paid over 120 months as 120
                  monthly payments of £40.07 at 9.48% p.a. Cost of finance £1,709.40. Total amount payable £4,808.40.
                  BOXI Limited is a credit broker and not a lender. Credit provided by HomeServe Finance Limited.
                  Finance available subject to status, affordability and credit check. Terms and conditions apply.
                </p>
              </section>

              <div>
                <PriceSummary
                  product={product}
                  payTodayTotal={payTodayTotal}
                  originalTotal={originalTotal}
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
