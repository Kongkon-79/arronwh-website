"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  BadgePercent,
  CheckCircle2,
  CircleDollarSign,
  Flame,
  Ruler,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  type ApiQuoteController,
  type ApiQuoteExtra,
  useQuoteById,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useQuoteById";
import { useProductById } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
  getPrimaryQuotePriceAdjustmentItem,
  getQuotePriceAdjustmentTotal,
} from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-price-adjustment";
import {
  getBrowserPageUrl,
  sendQuoteEmail,
} from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-email";

function stripHtml(value?: string) {
  return (
    value
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}

function formatMoney(value: number) {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
  return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function Tag({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const isFinance = normalized.includes("finance");

  return (
    <div
      className={`inline-flex h-[34px] items-center justify-center rounded-full px-3 text-[12px] font-medium ${
        isFinance ? "bg-[#6EC1F3] text-[#2D3D4D]" : "bg-[#F5D64E] text-[#2D3D4D]"
      }`}
    >
      {normalized.includes("popular") ? (
        <Star className="mr-1 h-3.5 w-3.5 fill-current" />
      ) : null}
      {label}
    </div>
  );
}

function SpecIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l.includes("warranty")) return <ShieldCheck className="h-4 w-4 text-[#64748B]" />;
  if (l.includes("flow")) return <CircleDollarSign className="h-4 w-4 text-[#64748B]" />;
  if (l.includes("heating")) return <Flame className="h-4 w-4 text-[#64748B]" />;
  return <Ruler className="h-5 w-5 text-[#64748B]" />;
}

const STATIC_FEATURE_ICON_IMAGES = [
  "/box.png",
  "/tag.png",
  "/Group.png",
  "/drop.png",
  "/verify.png",
];

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

function DetailsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-[340px] rounded-[8px] bg-white animate-pulse" />
      <div className="h-[220px] rounded-[8px] bg-white animate-pulse" />
      <div className="h-[340px] rounded-[8px] bg-white animate-pulse" />
      <div className="h-[380px] rounded-[8px] bg-white animate-pulse" />
      <div className="h-[240px] rounded-[8px] bg-white animate-pulse" />
    </div>
  );
}

function ProductDetailsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");
  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
  const { mutateAsync: mutateEmailQuote, isPending: isEmailingQuote } = useMutation({
    mutationKey: ["email-quote"],
    mutationFn: sendQuoteEmail,
  });

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
  const monthlyCost = payTodayTotal > 0 ? payTodayTotal / 12 : 0;

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [resolvedProductId]);

  const isLoading = (quoteId ? quoteLoading : false) || (resolvedProductId ? productLoading : false);

  const includeLines = useMemo(
    () =>
      (product?.boilerIncludedData ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [product?.boilerIncludedData]
  );

  if (isLoading) {
    return (
      <BoilerFlowShell activeStep={2}>
        <div className="bg-[#EEF2F5] py-6">
          <div className="mx-auto container">
            <DetailsSkeleton />
          </div>
        </div>
      </BoilerFlowShell>
    );
  }

  if (!product) {
    return (
      <BoilerFlowShell activeStep={2}>
        <div className="bg-[#EEF2F5] py-6">
          <div className="mx-auto container">
            <div className="rounded-[8px] bg-white p-5 text-[15px] text-[#2D3D4D] shadow-sm">
              Product details not found. Please go back and select your boiler again.
            </div>
          </div>
        </div>
      </BoilerFlowShell>
    );
  }

  const imageOptions = product.images?.length ? product.images : ["/product.png"];
  const activeImageSrc = imageOptions[activeImage] || imageOptions[0] || "/product.png";
  const guideItems = (product.boilerInstallationGuide ?? []).filter((item) => item?.title?.trim());
  const fallbackGuideImage = product.images?.[0] || "/product.png";
  const headingTitle = product.boilerAbility || product.title;
  const summaryTitle = stripHtml(product.shortDescription) || headingTitle;
  const summaryPoints = [stripHtml(product.description), ...includeLines]
    .filter((point, index, arr) => point && point !== summaryTitle && arr.indexOf(point) === index)
    .slice(0, 3);
  const discountLabel = formatBoilerAbilityShort(headingTitle) || headingTitle;
  const topFeatures = (product.boilerFeatures ?? []).slice(0, 4);
  const handleChooseProduct = () => {
    const params = new URLSearchParams();

    if (resolvedProductId) {
      params.set("productId", resolvedProductId);
    }
    if (quoteId) {
      params.set("quoteId", quoteId);
    }

    const query = params.toString();
    router.push(query ? `/boilers/system-selection/controller?${query}` : "/boilers/system-selection/controller");
  };

  const handleSaveQuote = async () => {
    if (!quoteId) {
      toast.error("Quote ID not found. Please start again.");
      return;
    }

    try {
      const result = await mutateEmailQuote({
        quoteId,
        pageUrl: getBrowserPageUrl(),
        price: payTodayTotal,
      });
      toast.success(result.message || "Quote email sent successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send quote email.");
    }
  };

  return (
    <BoilerFlowShell activeStep={2}>
      <div className="bg-[#EEF2F5] py-6">
        <div className="mx-auto container">

          <div className="overflow-hidden rounded-[8px] border border-[#00A56F] bg-white shadow-sm">
            <div className="border-b border-[#E5EAF0] px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <h2 className="text-[22px] font-bold leading-tight text-[#2D3D4D]">{headingTitle}</h2>
                {product.badges?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {product.badges.map((tag) => (
                      <Tag key={tag} label={tag} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 p-4 xl:grid-cols-[72px_280px_minmax(0,1fr)_320px] xl:p-5">
              <div className="order-2 flex justify-center gap-2 xl:order-1 xl:flex-col xl:justify-start">
                {imageOptions.slice(0, 4).map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`flex h-[80px] w-[80px] items-center justify-center overflow-hidden rounded-[6px] border ${
                      index === activeImage ? "border-[#00A56F]" : "border-[#D7E0EA]"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`${product.boilerAbility || product.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="h-[80px] w-[80px] object-contain"
                    />
                  </button>
                ))}
              </div>

              <div className="order-1 relative flex items-center justify-center rounded-[8px] bg-white p-4 xl:order-2">
                <div className="absolute left-1/2 top-1/2 h-[156px] w-[136px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-[#FFD9C7]" />
                <Image
                  src={activeImageSrc}
                  alt={headingTitle}
                  width={320}
                  height={320}
                  className="relative z-10 h-[220px] w-auto object-contain"
                />
              </div>

              <div className="order-3 space-y-3">
                <div className="rounded-[8px] border-[3px] border-[#94A3B8] bg-white p-4 sm:p-5">
                  <h3 className="text-[20px] font-bold leading-snug text-[#2D3D4D]">{summaryTitle}</h3>

                  <div className="mt-3 space-y-2">
                    {summaryPoints.map((point) => (
                      <p key={point} className="text-[16px] leading-6 text-[#2D3D4D]">
                        {point}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[8px] border-[3px] border-[#94A3B8] bg-white p-4 sm:p-5">
                  <div className="space-y-3">
                    {topFeatures.map((feature) => (
                      <div
                        key={`${feature.title}-${feature.value}`}
                        className="flex items-start justify-between gap-3 text-[16px] text-[#2D3D4D]"
                      >
                        <span>{feature.title}</span>
                        <div className="flex items-center gap-2 text-right">
                          <span className="font-semibold">{feature.value}</span>
                          <SpecIcon label={feature.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="order-4 rounded-[4px] bg-[#F0F3F6] p-4 sm:p-5">
                <h3 className="mb-4 text-center text-[16px] font-medium text-[#2D3D4D]">
                  Your fixed price including installation:
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-[6px] bg-white p-2.5">
                    <p className="text-[13px] text-[#64748B]">Pay today</p>
                    <p className="mt-1 text-[18px] font-bold text-[#2D3D4D]">{formatMoney(payTodayTotal)}</p>
                    {originalTotal > payTodayTotal ? (
                      <p className="mt-1 text-[12px] font-medium text-[#00A56F] line-through">
                        was {formatMoney(originalTotal)}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-[6px] bg-white p-2.5">
                    <p className="text-[13px] text-[#64748B]">Monthly Cost</p>
                    <p className="mt-1 text-[18px] font-bold text-[#2D3D4D]">
                      {formatMoney(monthlyCost)}/mo
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex min-h-[42px] items-center justify-center rounded-[6px] bg-white px-2 text-center">
                  <BadgePercent className="mr-2 h-4 w-4 text-[#64748B]" />
                  <span className="text-[13px] font-semibold text-[#2D3D4D] truncate">{discountLabel}</span>
                  <span className="ml-2 shrink-0 text-[13px] font-semibold text-[#00A56F]">
                    -{formatMoney(product.discountPrice ?? 0)}
                  </span>
                </div>

                {quotePriceItem ? (
                  <div className="mt-3 rounded-[6px] bg-white px-2.5 py-2">
                    <div className="flex items-center justify-between gap-3 border-b border-dotted border-[#A7B1BB] pb-1.5">
                      <span className="text-[13px] text-[#2D3D4D]">{quotePriceItem.label}</span>
                      <span className="text-[13px] font-semibold text-[#2D3D4D]">
                        {formatMoney(quotePriceItem.price)}
                      </span>
                    </div>
                  </div>
                ) : null}

                <Button
                  className="mt-4 h-[46px] w-full rounded-[6px] bg-[#00A56F] text-[15px] sm:text-[16px] font-medium text-white hover:bg-[#009562]"
                  onClick={handleChooseProduct}
                >
                  Choose
                </Button>

                <Button
                  variant="outline"
                  disabled={isEmailingQuote}
                  onClick={handleSaveQuote}
                  className="mt-3 h-[46px] w-full rounded-[6px] border border-[#F5D64E] bg-transparent text-[15px] sm:text-[16px] font-medium text-[#F5C842] hover:bg-transparent"
                >
                  {isEmailingQuote ? "Sending..." : "Save this quote"}
                </Button>
              </aside>
            </div>
          </div>

          <section className="mt-5 rounded-[8px] bg-[#2D3D4D] p-[60px] text-white">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px_minmax(0,1fr)] lg:items-center">
              <div>
                <h3 className="text-[32px] font-bold w-[340px]">
                  {product.featureInformation?.featureTitle || "Purpose built for modern homes"}
                </h3>
                <p className="mt-3 text-[16px] leading-6 text-[#FFFFFF] w-[340px]">
                  {stripHtml(product.featureInformation?.featureDescription)}
                </p>

                {product.featureInformation?.featureLogo?.length ? (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {product.featureInformation.featureLogo.map((logo, index) => (
                      <div key={`${logo}-${index}`} className="flex h-[32px] w-[58px] items-center justify-center rounded px-2">
                        <Image
                          src={logo}
                          alt={`Feature logo ${index + 1}`}
                          width={54}
                          height={24}
                          className="h-[60px] w-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-center">
                <Image
                  src={product.images?.[0] || "/product.png"}
                  alt={product.boilerAbility || product.title}
                  width={240}
                  height={320}
                  className="h-[4 20px] w-auto object-contain"
                />
              </div>

              <div>
                <ul className="space-y-3">
                  {(product.boilerFeatures ?? []).map((feature, index) => (
                    <li key={`${feature.title}-${feature.value}`} className="flex items-start gap-3">
                      <div className="mt-[2px] h-6 w-6 shrink-0">
                        <Image
                          src={STATIC_FEATURE_ICON_IMAGES[index % STATIC_FEATURE_ICON_IMAGES.length]}
                          alt={`${feature.title} icon`}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-contain opacity-90"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-[20px] font-medium leading-[1.15] text-white">
                          {feature.value}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-4 text-[#D2DCE6]">{feature.title}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[8px] border border-[#D8E0E8] bg-white p-5">
            <h3 className="text-center text-[32px] font-bold text-[#2D3D4D]">What&apos;s included</h3>
            <p className="mt-1 text-center text-[16px] text-[#64748B]">
              The price includes all essential parts and fittings required for installation.
            </p>
              <p className="text-[#2D3D4D] text-[18px]">Included....</p>
            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_430px]">
              <div className="space-y-2">
                {includeLines.map((line) => (
                  <div key={line} className="flex items-center gap-2 text-[18px] text-[#2D3D4D]">
                    <CheckCircle2 className="mt-[2px] h-5 w-5 shrink-0 text-[#00A56F]" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {(product.includedImages ?? []).map((src, index) => (
                  <div key={`${src}-${index}`} className="rounded-[8px] ">
                    <Image
                      src={src}
                      alt={`Included item ${index + 1}`}
                      width={160}
                      height={140}
                      className="h-[100px] w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="text-center text-[32px] font-bold text-[#2D3D4D]">
              A Step by step guide to your installation
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(guideItems.length ? guideItems : [{ title: "Installation overview", image: fallbackGuideImage }]).map(
                (step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="flex h-full flex-col overflow-hidden rounded-[8px] bg-white shadow-sm"
                  >
                    <div className="relative h-[300px] bg-[#F3F6F9] p-3">
                      <Image
                        src={step.image || fallbackGuideImage}
                        alt={step.title}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex min-h-[88px] flex-col justify-between p-3">
                      <p className="min-h-[40px] text-center text-[16px] leading-5 text-[#2D3D4D]">
                        {step.title}
                      </p>
                      <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#F5D64E] text-[12px] font-bold text-[#2D3D4D]">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </BoilerFlowShell>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense>
      <ProductDetailsPageContent />
    </Suspense>
  );
}
