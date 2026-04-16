"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BadgePercent, CheckCircle, Mail } from "lucide-react";
import { ControllerCard } from "./_components/ControllerCard";
import { ControllerCardSkeleton } from "./_components/ControllerCardSkeleton";
import { FeaturedBundleSkeleton } from "./_components/FeaturedBundleSkeleton";
import { ProductSummarySkeleton } from "./_components/ProductSummarySkeleton";
import { useControllers } from "../_hooks/useControllers";
import { useProductById } from "../_hooks/useProductById";

function formatControllerPrice(price: number): string {
  if (price <= 0) return "Included";
  return `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`;
}

function ChooseControlsPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const { data: controllers, isLoading: controllersLoading } = useControllers();
  const { data: product, isLoading: productLoading } = useProductById(productId);

  const [selectedControllerId, setSelectedControllerId] = useState<string | null>(null);

  function handleSelectController(id: string) {
    setSelectedControllerId((prev) => (prev === id ? null : id));
  }

  const selectedController = controllers?.find((c) => c._id === selectedControllerId) ?? null;

  function getControllerPriceLabel(price: number): string {
    if (price <= 0) return "Included";
    return `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}`;
  }

  // Build dynamic quote items from API data
  const quoteItems = product
    ? [
        { label: product.boilerAbility || product.title, value: `$${product.price}`, highlight: false },
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
        ...(selectedController
          ? [{ label: selectedController.title, value: getControllerPriceLabel(selectedController.price), highlight: false }]
          : []),
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#EEF2F5] px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-5 text-center">
          <h1 className="text-[24px] sm:text-[30px] lg:text-[32px] font-bold leading-tight text-[#2D3D4D]">
            Choose controls for your{" "}
            {product?.boilerAbility ?? "Worcester Bosch Greenstar 4000 25kw"}
          </h1>
          <p className="mt-3 text-[13px] sm:text-[16px] text-[#2D3D4D]">
            We&apos;ll install your controls during your boiler installation &amp; show you how to use them.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* ── Left Content ── */}
          <div className="space-y-5">
            {/* Featured bundle — controllers[0] */}
            {controllersLoading ? (
              <FeaturedBundleSkeleton />
            ) : controllers?.[0] ? (
              <div className="overflow-hidden rounded-[6px] bg-white shadow-sm">
                <div className="bg-[#00A56F] py-2 text-center text-[11px] sm:text-[12px] font-semibold tracking-wide text-white">
                  OUR BEST SELLER
                </div>

                <div className="grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
                  <div>
                    <h2 className="text-[22px] sm:text-[24px] font-bold text-[#2D3D4D]">
                      {controllers[0].title}
                    </h2>

                    <div
                      className="mt-3 max-w-[720px] text-[14px] sm:text-[15px] leading-7 text-[#2D3D4D] [&_p]:mb-0"
                      dangerouslySetInnerHTML={{ __html: controllers[0].description }}
                    />

                    <p className="mt-4 text-[28px] font-bold text-[#2D3D4D]">
                      {formatControllerPrice(controllers[0].price)}
                    </p>

                    <Button
                      onClick={() => handleSelectController(controllers[0]._id)}
                      className={`mt-6 h-[46px] w-full max-w-[440px] rounded-[6px] text-[15px] sm:text-[16px] font-medium gap-2 ${
                        selectedControllerId === controllers[0]._id
                          ? "bg-[#2D3D4D] text-white hover:bg-[#2D3D4D]"
                          : "bg-[#00A56F] text-white hover:bg-[#009562]"
                      }`}
                    >
                      {selectedControllerId === controllers[0]._id ? (
                        <>Added <CheckCircle className="h-5 w-5" /></>
                      ) : (
                        "Add to basket"
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-5 sm:gap-6">
                    {controllers[0].images.map((src: string, index: number) => (
                      <Image
                        key={index}
                        src={src}
                        alt={`${controllers[0].title} ${index + 1}`}
                        width={130}
                        height={130}
                        className="h-[90px] w-auto object-contain sm:h-[110px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Remaining controller cards — controllers[1+] */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {controllersLoading
                ? Array.from({ length: 2 }).map((_, i) => <ControllerCardSkeleton key={i} />)
                : controllers?.slice(1).map((item) => (
                    <ControllerCard
                      key={item._id}
                      item={item}
                      isSelected={selectedControllerId === item._id}
                      onSelect={handleSelectController}
                    />
                  ))}
            </div>
          </div>

          {/* ── Right Summary Panel ── */}
          {productLoading ? (
            <ProductSummarySkeleton />
          ) : product ? (
            <div className="h-fit rounded-[4px] bg-[#FFFFFF] p-4 xl:sticky xl:top-5">
              <h3 className="mb-4 text-[18px] font-medium text-[#2D3D4D]">
                Your fixed price including installation:
              </h3>

              {/* Pricing cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                  <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Pay today</p>
                  <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                    ${product.payablePrice.toLocaleString()}
                  </p>
                  <p className="mt-2 text-[11px] sm:text-[14px] font-medium text-[#00A56F] line-through">
                    was ${product.price.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                  <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Monthly Cost</p>
                  <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                    ${product.monthlyPrice}/mo
                  </p>
                </div>
              </div>

              {/* Discount row */}
              <div className="mt-4 flex min-h-[48px] items-center justify-center rounded-[8px] bg-[#F0F3F6] px-3 text-center">
                <BadgePercent className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[#64748B]" />
                <span className="text-[14px] sm:text-[15px] font-semibold text-[#2D3D4D] truncate">
                  {product.boilerAbility || product.title}
                </span>
                <span className="ml-2 shrink-0 text-[14px] sm:text-[15px] font-semibold text-[#00A56F]">
                  -${product.discountPrice}
                </span>
              </div>

              {/* Action buttons */}
              <Button className="mt-4 h-[48px] w-full rounded-[6px] bg-[#00A56F] text-[15px] sm:text-[16px] font-medium text-white hover:bg-[#009562]">
                Next Extras
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
                    className="flex items-start justify-between gap-4 border-b border-dotted border-[#A7B1BB] py-3 last:border-b-0"
                  >
                    <div
                      className={
                        item.highlight
                          ? "text-[14px] sm:text-[15px] font-medium text-[#F5C842] underline cursor-pointer"
                          : "text-[14px] sm:text-[15px] text-[#2D3D4D]"
                      }
                    >
                      {item.label}
                    </div>

                    {item.value ? (
                      <div className="shrink-0 text-[14px] sm:text-[15px] font-semibold text-[#2D3D4D]">
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

export default function ChooseControlsPageWrapper() {
  return (
    <Suspense>
      <ChooseControlsPage />
    </Suspense>
  );
}
