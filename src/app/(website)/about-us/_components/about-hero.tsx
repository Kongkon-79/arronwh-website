"use client"

import { AboutUsApiResponse } from "@/components/types/about-hero-data-type";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, SearchX } from "lucide-react";
import Image from "next/image";

// ─── Loading Skeleton ────────────────────────────────────────────────────────
function AboutHeroSkeleton() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        {/* Header skeleton */}
        <div className="mb-10 flex flex-col items-center gap-3 sm:mb-12 lg:mb-14">
          <Skeleton className="h-8 w-3/4 max-w-[560px] rounded-lg md:h-10 bg-primary/20" />
          <Skeleton className="h-5 w-2/3 max-w-[420px] rounded-md bg-primary/20" />
        </div>

        {/* Grid skeleton */}
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12 xl:gap-16">
          {/* Text block */}
          <div className="max-w-[500px] space-y-4">
            <Skeleton className="h-7 w-40 rounded-lg bg-primary/20" />
            <Skeleton className="h-4 w-full rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-4/5 rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-full rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-4/5 rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-full rounded-md bg-primary/20" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-primary/20" />
          </div>

          {/* Image block */}
          <Skeleton className="aspect-[16/10] w-full rounded-[14px] sm:rounded-[16px] md:aspect-[16/9] lg:aspect-[1.58/1] lg:rounded-[18px] bg-primary/20" />
        </div>
      </div>
    </section>
  );
}

// ─── Not Found ───────────────────────────────────────────────────────────────
function AboutHeroNotFound() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-5 text-center">
        {/* Icon badge */}
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </span>

        <h2 className="heading">No Content Found</h2>

        <p className="desc">
          We couldn&apos;t find any about-us content. Please check back later or
          contact support if this issue persists.
        </p>

        {/* decorative underline in brand color */}
        <span className="block h-1 w-16 rounded-full bg-primary" />
      </div>
    </section>
  );
}

// ─── Error ───────────────────────────────────────────────────────────────────
function AboutHeroError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-5 text-center">
        {/* Icon badge */}
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
        </span>

        <h2 className="heading text-[#2D3D4D]">Something Went Wrong</h2>

        <p className="desc">
          We ran into an issue while loading this section. Please try again.
        </p>

        {/* Retry button — uses project primary yellow */}
        <button
          onClick={onRetry}
          className="group mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-[#2D3D4D] transition-all duration-200 hover:brightness-105 active:scale-95"
        >
          <RefreshCw
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
            strokeWidth={2}
          />
          Try Again
        </button>
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutHero() {
  const { data, isLoading, isError, refetch } = useQuery<AboutUsApiResponse>({
    queryKey: ["about-us"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aboutus`);

      if (!res.ok) {
        throw new Error("Failed to fetch hero data");
      }

      return res.json();
    },
  });

  // ── States ──
  if (isLoading) return <AboutHeroSkeleton />;
  if (isError) return <AboutHeroError onRetry={refetch} />;

  const about = data?.data?.[0];
  if (!about) return <AboutHeroNotFound />;

  // ── Success ──
  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 text-center sm:mb-12 lg:mb-14">
          <h2 className="heading">
            {about.headerTitle || "We’re on a mission to simplify home heating."}
          </h2>

          <p className="desc mt-2">
            {about.headerDescription || "No confusing quotes • No hidden cost • Everything online , fast & transparent"}
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12 xl:gap-16">
          <div className="max-w-[500px]">
            <h3 className="mb-5 heading">
              {about.title || "Our story"}
            </h3>

            <div className="space-y-4 desc">
              <p className="text-sm md:text-base font-normal text-black leading-normal">
                {about.description || "When you decide to upgrade your boiler, it shouldn’t feel complicated or stressful — but for many homeowners, it still does. From unclear pricing to long waiting times, the traditional process often creates more problems than solutions. At YOLO HEAT, we set out to change that. We built a smarter, simpler way to buy and install boilers — one that puts transparency, speed, and customer experience first. By bringing everything online, we’ve made it possible to get a fixed price, choose your system, and book installation in just a few steps. No hidden costs. No confusion. Just a straightforward, reliable service designed around you."}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[14px] sm:rounded-[16px] lg:rounded-[18px]">
            <div className="relative aspect-[16/10] w-full md:aspect-[16/9] lg:aspect-[1.58/1]">
              <Image
                src={about.images?.[0] || "/assets/images/about_hero.png"}
                alt="Engineer working on home heating service"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}