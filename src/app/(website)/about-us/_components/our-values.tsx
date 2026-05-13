"use client";

import { ValuesDataResponse, ValuesHeaderResponse } from "@/components/types/values-data-type";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, SearchX } from "lucide-react";
import Image from "next/image";

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function OurValuesSkeleton() {
  return (
    <section className="bg-[#2D3D4D] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="mt-4 h-5 w-full max-w-[600px] bg-white/10" />
          <Skeleton className="mt-2 h-5 w-3/4 max-w-[400px] bg-white/10" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-[14px] border border-dashed border-white/20 bg-transparent px-5 py-6"
            >
              <Skeleton className="mx-auto h-10 w-10 rounded-full bg-white/10" />
              <Skeleton className="mx-auto mt-4 h-6 w-32 bg-white/10" />
              <Skeleton className="mx-auto mt-3 h-4 w-full bg-white/10" />
              <Skeleton className="mx-auto mt-2 h-4 w-5/6 bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Error State ─────────────────────────────────────────────────────────────
function OurValuesError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="bg-[#2D3D4D] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="container flex flex-col items-center gap-5 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">Something Went Wrong</h2>
        <p className="text-white/70">We couldn&lsquo;t load our values. Please try again.</p>
        <button
          onClick={onRetry}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-[#2D3D4D] transition-all hover:brightness-105 active:scale-95"
        >
          <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
          Try Again
        </button>
      </div>
    </section>
  );
}

// ─── Not Found ───────────────────────────────────────────────────────────────
function OurValuesNotFound() {
  return (
    <section className="bg-[#2D3D4D] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="container flex flex-col items-center gap-5 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <SearchX className="h-8 w-8 text-white/50" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">No Content Found</h2>
        <p className="text-white/70">Our values are not available at the moment. Please check back later.</p>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OurValues() {
  // Fetch Header Data
  const {
    data: headerResponse,
    isLoading: isHeaderLoading,
    isError: isHeaderError,
    refetch: refetchHeader
  } = useQuery<ValuesHeaderResponse>({
    queryKey: ["values-header"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/values`);
      if (!res.ok) throw new Error("Failed to fetch values header");
      return res.json();
    },
  });

  // Fetch Values Data
  const {
    data: valuesResponse,
    isLoading: isValuesLoading,
    isError: isValuesError,
    refetch: refetchValues
  } = useQuery<ValuesDataResponse>({
    queryKey: ["values-data"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/values/data`);
      if (!res.ok) throw new Error("Failed to fetch values data");
      return res.json();
    },
  });

  const handleRetry = () => {
    refetchHeader();
    refetchValues();
  };

  if (isHeaderLoading || isValuesLoading) return <OurValuesSkeleton />;
  if (isHeaderError || isValuesError) return <OurValuesError onRetry={handleRetry} />;

  const header = headerResponse?.data?.[0];
  const items = valuesResponse?.data || [];

  if (!header && items.length === 0) return <OurValuesNotFound />;

  return (
    <section className="bg-[#2D3D4D] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-normal text-white ">
            {header?.valueTitle || "Our Values"}
          </h2>

          <p className="mx-auto mt-3 max-w-[800px] text-sm md:text-base font-normal leading-normal text-white/90">
            {header?.valueDetail || "We always put our customers first, delivering high-quality installations with transparent pricing and a fast, reliable service you can trust."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {items?.map((item) => {

            return (
              <div
                key={item._id}
                className="rounded-[14px] border border-dashed border-white bg-transparent px-5 py-6 text-center transition-all hover:bg-white/5"
              >
                <div
                  className={`bg-[#00A56F] mx-auto flex h-10 w-10 items-center justify-center rounded-full`}
                >
                  <Image src={item?.image || ""} alt={item.title} width={50} height={50} className="w-6 h-6 object-contain"/>
                </div>

                <h3 className="mt-4 text-base md:text-lg font-bold leading-normal text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm md:text-base font-normal leading-normal text-white/80">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}