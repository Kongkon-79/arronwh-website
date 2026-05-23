"use client";

import React from 'react';
import { Mail, AlertTriangle, RefreshCw } from 'lucide-react';
import { FaHandsHelping } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const PartnershipsSkeleton = () => (
  <section className="relative h-full rounded-[22px] bg-[#d0d3d6] p-5 sm:p-6 flex flex-col justify-between">
    <div>
      <Skeleton className="h-10 w-48 bg-gray-300 mb-3" />
      <Skeleton className="h-5 w-32 bg-gray-300" />
      <Skeleton className="mt-5 h-6 w-40 bg-gray-300" />
    </div>
    <div className="mt-6 md:mt-8 lg:mt-10 flex justify-end">
      <Skeleton className="h-14 md:h-20 w-14 md:w-20 rounded-full bg-gray-300" />
    </div>
  </section>
);

const PartnershipsError = ({ onRetry }: { onRetry: () => void }) => (
  <section className="relative h-full rounded-[22px] bg-[#d0d3d6] p-5 sm:p-6 flex flex-col items-center justify-center text-center">
    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" strokeWidth={1.5} />
    <h2 className="text-lg font-medium text-[#1f2329]">Failed to load Partnerships</h2>
    <button
      onClick={onRetry}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-400 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-gray-500"
    >
      <RefreshCw className="h-4 w-4" />
      Retry
    </button>
  </section>
);

const Partnerships = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["socialpartnership"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/socialpartership`);
      if (!res.ok) throw new Error("Failed to fetch socialpartnership data");
      return res.json();
    },
  });

  if (isLoading) return <PartnershipsSkeleton />;
  if (isError) return <PartnershipsError onRetry={refetch} />;

  const partnershipsData = data?.data?.[1];

  return (
    <section 
      className="relative h-full rounded-[22px] p-5 text-[#1f2329] sm:p-6"
      style={{ backgroundColor: partnershipsData?.backgroundColor || "#d0d3d6", color: partnershipsData?.textColor || "#1f2329" }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em]">
        {partnershipsData?.title || "Partnerships"}
      </h2>
      <p className="mt-3 text-sm md:text-base font-medium leading-none tracking-[-0.01em] text-[#323741]">
        {partnershipsData?.subTitle || "Want to team up?"}
      </p>

      <a
        href={`mailto:${partnershipsData?.email || "hello@yoloheat.co.uk"}`}
        className="mt-5 inline-flex items-center gap-2 text-base font-medium cursor-pointer decoration-1 underline-offset-2 transition hover:opacity-90"
      >
        <Mail className="h-5 w-5" strokeWidth={2.2} />
        {partnershipsData?.email || "hello@yoloheat.co.uk"}
      </a>

      <div className="mt-6 md:mt-8 lg:mt-10 flex justify-end text-black">
        <FaHandsHelping className="h-14 md:h-20 w-14 md:w-20" />
      </div>
    </section>
  )
}

export default Partnerships
