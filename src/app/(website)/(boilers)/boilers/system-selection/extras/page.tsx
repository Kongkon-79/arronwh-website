"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BadgePercent, Mail } from "lucide-react";
import { ExtraCard, ExtraCardSkeleton } from "./_components/ExtraCard";
import { useProducts } from "../_hooks/useProducts";
import { useProductById } from "../_hooks/useProductById";

function formatMoney(value: number): string {
  if (value % 1 === 0) return `$${value.toLocaleString("en-US")}`;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ExtrasPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: product, isLoading: productLoading } = useProductById(productId);

  const quoteItems = product
    ? [
        { label: product.boilerAbility || product.title, value: formatMoney(product.price), highlight: false },
        { label: "View details", value: "", highlight: true },
        ...product.boilerFeatures.map((f) => ({
          label: f.title,
          value: f.value,
          highlight: false,
        })),
        ...product.boilerIncludedData
          .split("\n")
          .filter(Boolean)
          .map((line) => ({ label: line.trim(), value: "Included", highlight: false })),
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#EEF2F5] px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-[24px] sm:text-[30px] lg:text-[34px] font-bold leading-tight text-[#2D3D4D]">
            Add extras to your order
          </h1>
          <p className="mt-2 text-[12px] sm:text-[16px] text-[#2D3D4D]">
            All extras are installed at the same time as your boiler
            <br className="hidden sm:block" />
            for no extra cost.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left content */}
          <div className="space-y-6">
            {/* Extras Section */}
            <section>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#2D3D4D]">
                Extras
              </h2>
              <p className="mt-1 text-[13px] sm:text-[16px] text-[#2D3D4D]">
                Enhance and protect your system for improved efficiency and longevity.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {productsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <ExtraCardSkeleton key={i} />
                    ))
                  : products.map((item) => (
                      <ExtraCard key={item._id} item={item} />
                    ))}
              </div>
            </section>

            {/* Footer note */}
            <p className="text-[11px] sm:text-[16px] leading-5 text-[#2D3D4D]">
              *Representative example for 120 month order: £4,282 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
              Representative APR: 9.9% APR. Total amount of credit £4,282 paid over 120 months as 120 monthly payments of
              £55.36 at 9.48% p.a. Cost of finance £2,361.20. Total amount payable £6,643.20. BOXT Limited is a credit broker
              and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status, affordability
              and a credit check. Terms and conditions apply.
            </p>
          </div>

          {/* Right summary */}
          {productLoading ? (
            <div className="h-fit rounded-[4px] bg-[#FFFFFF] p-4 sm:p-5 xl:sticky xl:top-5 animate-pulse">
              <div className="mb-4 h-5 w-[75%] rounded bg-[#F0F3F6]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4 space-y-2">
                  <div className="h-4 w-[60%] rounded bg-[#E5EAF0]" />
                  <div className="h-7 w-[55%] rounded bg-[#E5EAF0]" />
                  <div className="h-3 w-[50%] rounded bg-[#E5EAF0]" />
                </div>
                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4 space-y-2">
                  <div className="h-4 w-[60%] rounded bg-[#E5EAF0]" />
                  <div className="h-7 w-[55%] rounded bg-[#E5EAF0]" />
                  <div className="h-3 w-[50%] rounded bg-[#E5EAF0]" />
                </div>
              </div>
              <div className="mt-4 h-[48px] w-full rounded-[8px] bg-[#F0F3F6]" />
              <div className="mt-4 h-[48px] w-full rounded-[6px] bg-[#F0F3F6]" />
              <div className="mt-3 h-[48px] w-full rounded-[6px] bg-[#F0F3F6]" />
              <div className="mt-5 space-y-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-start justify-between gap-4 border-b border-dotted border-[#A7B1BB] py-3 last:border-b-0">
                    <div className="h-4 w-[58%] rounded bg-[#F0F3F6]" />
                    <div className="h-4 w-[22%] rounded bg-[#F0F3F6]" />
                  </div>
                ))}
              </div>
            </div>
          ) : product ? (
            <div className="h-fit rounded-[4px] bg-[#FFFFFF] p-4 sm:p-5 xl:sticky xl:top-5">
              <h3 className="mb-4 text-[18px] font-medium text-[#2D3D4D]">
                Your fixed price including installation:
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                  <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Pay today</p>
                  <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                    {formatMoney(product.payablePrice)}
                  </p>
                  {product.price > product.payablePrice && (
                    <p className="mt-2 text-[11px] sm:text-[14px] font-medium text-[#00A56F] line-through">
                      was {formatMoney(product.price)}
                    </p>
                  )}
                </div>

                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                  <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Monthly Cost</p>
                  <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                    {formatMoney(product.monthlyPrice)}/mo
                  </p>
                </div>
              </div>

              <div className="mt-4 flex min-h-[48px] items-center justify-center rounded-[8px] bg-[#F0F3F6] px-3 text-center">
                <BadgePercent className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#64748B]" />
                <span className="text-[14px] sm:text-[15px] font-semibold text-[#2D3D4D] truncate">
                  {product.boilerAbility || product.title}
                </span>
                <span className="ml-2 shrink-0 text-[14px] sm:text-[15px] font-semibold text-[#00A56F]">
                  -${product.discountPrice}
                </span>
              </div>

              <Button className="mt-4 h-[48px] w-full rounded-[6px] bg-[#00A56F] text-[15px] sm:text-[16px] font-medium text-white hover:bg-[#009562]">
                Next Checkout
              </Button>

              <Button
                variant="outline"
                className="mt-3 h-[48px] w-full rounded-[6px] border border-[#F5D64E] bg-transparent text-[15px] sm:text-[16px] font-medium text-[#F5C842] hover:bg-transparent"
              >
                Email My quote
                <Mail className="ml-2 h-4 w-4" />
              </Button>

              {/* Quote items list */}
              <div className="mt-5">
                {quoteItems.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="flex min-w-0 items-start justify-between gap-3 border-b border-dotted border-[#A7B1BB] py-3 last:border-b-0"
                  >
                    <div
                      className={
                        item.highlight
                          ? "min-w-0 flex-1 break-words text-[14px] sm:text-[15px] font-medium text-[#F5C842] underline cursor-pointer"
                          : "min-w-0 flex-1 break-words text-[14px] sm:text-[15px] text-[#2D3D4D]"
                      }
                    >
                      {item.label}
                    </div>

                    {item.value ? (
                      <div className="max-w-[46%] text-right break-words text-[14px] sm:text-[15px] font-semibold text-[#2D3D4D]">
                        {item.value}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ExtrasPage() {
  return (
    <Suspense>
      <ExtrasPageContent />
    </Suspense>
  );
}
