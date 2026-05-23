"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

const HeadOfficeSkeleton = () => (
  <section className="relative bg-[#dfe1e3] px-4 pb-10 pt-3 md:pb-14">
    <div className="container">
      <Skeleton className="h-[300px] md:h-[360px] lg:h-[420px] w-full rounded-[18px] bg-[#d5d7d9]" />
    </div>
  </section>
);

const HeadOfficeError = ({ onRetry }: { onRetry: () => void }) => (
  <section className="relative bg-[#dfe1e3] px-4 pb-10 pt-3 md:pb-14">
    <div className="container">
      <div className="flex h-[300px] md:h-[360px] lg:h-[420px] w-full flex-col items-center justify-center rounded-[18px] bg-[#ececed] text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-3" strokeWidth={1.5} />
        <h2 className="text-xl font-medium text-[#2a2e36]">Failed to load Head Office</h2>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#db860f] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#c1760d]"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  </section>
);

const HeadOffice = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["headoffice"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/headoffice`);
      if (!res.ok) throw new Error("Failed to fetch headoffice data");
      return res.json();
    },
  });

  if (isLoading) return <HeadOfficeSkeleton />;
  if (isError) return <HeadOfficeError onRetry={refetch} />;

  const headofficeData = data?.data?.[0];

  return (
    <section className="relative bg-[#dfe1e3] px-4 pb-10 pt-3 md:pb-14">
      <div className="container">
        <article className="relative h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-[18px]">
          <Image
            src={headofficeData?.bannerImage || "/assets/images/head_office_bg.jpeg"}
            alt="Head office team support"
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 1060px"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/30 to-black/8" />

          <div className="absolute bottom-4 left-4 md:left-6 lg:left-8 xl:left-10 text-white sm:bottom-5 pr-4 md:pr-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em]">
              {headofficeData?.header || "Head office"}
            </h2>
            {headofficeData?.description ? (
              <div className="mt-3 text-base md:text-lg font-medium leading-[1.3] tracking-[-0.01em] text-[#a8a9aa] max-w-2xl whitespace-pre-wrap">
                {headofficeData.description}
              </div>
            ) : (
              <>
                <p className="mt-2 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
                  Main road,
                </p>
                <p className="mt-1 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
                  barnolby le beck
                </p>
                <p className="mt-1 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
                  Grimsby
                </p>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default HeadOffice;
