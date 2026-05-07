"use client";

import { BannerApiResponse } from "@/components/types/hero-data-type";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const heroPoints = [
  "Instant quotes in 60 seconds",
  "UK-wide new boiler installs",
];

const HeroSection = () => {
  const { data, isLoading, isError } = useQuery<BannerApiResponse>({
    queryKey: ["heroData"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banner`);

      if (!res.ok) {
        throw new Error("Failed to fetch hero data");
      }

      return res.json();
    },
  });

  // =========================
  // Skeleton Loading State
  // =========================
  if (isLoading) {
    return (
      <section className="overflow-hidden bg-[#FBFF26]">
        <div className="container px-1 py-2 md:py-16 lg:py-20">
          <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 animate-pulse">
            {/* Left Side Skeleton */}
            <div className="order-2 md:order-1 mx-auto w-full p-6 md:p-8">
              {/* Title */}
              <div className="space-y-4">
                <div className="h-12 md:h-16 w-[90%] rounded-xl bg-[#d9dc52]" />
                <div className="h-12 md:h-16 w-[70%] rounded-xl bg-[#d9dc52]" />
              </div>

              {/* Subtitle */}
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-full bg-[#d9dc52]" />
                <div className="h-4 w-[85%] rounded-full bg-[#d9dc52]" />
              </div>

              {/* Input Skeleton */}
              <div className="h-[52px] mt-8 flex items-center gap-4 bg-white p-1 rounded-full w-full md:w-[55%] shadow-md">
                <div className="h-10 w-1/2 rounded-full bg-gray-200" />
                <div className="h-10 w-36 rounded-full bg-[#2D3D4D]" />
              </div>

              {/* Points */}
              <div className="mt-8 space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#2D3D4D]" />
                    <div className="h-4 w-56 rounded-full bg-[#d9dc52]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Skeleton */}
            <div className="hidden md:flex order-1 md:order-2 mx-auto flex-col w-full max-w-[560px] items-center justify-center lg:justify-end">
              {/* Image Skeleton */}
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[20px] bg-[#d9dc52]">
                <div className="h-[290px] md:h-[390px] lg:h-[400px] w-full relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>

              {/* Text Skeleton */}
              <div className="mt-6 space-y-4 flex flex-col items-center">
                <div className="h-8 w-[320px] rounded-full bg-[#d9dc52]" />
                <div className="h-8 w-[260px] rounded-full bg-[#d9dc52]" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Shimmer Animation */}
        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </section>
    );
  }

  // =========================
  // Error State
  // =========================
  if (isError) {
    return (
      <section className="overflow-hidden bg-primary">
        <div className="container px-1 py-2 md:py-16 lg:py-20 text-center">
          <p className="text-red-500 text-lg">
            Something went wrong! Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // Empty Data State
  // =========================
  if (!data?.data || data.data.length === 0) {
    return (
      <section className="overflow-hidden bg-primary">
        <div className="container px-1 py-2 md:py-16 lg:py-20 text-center">
          <p className="text-gray-500 text-lg">
            No data found for hero content. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // Main Content
  // =========================
  return (
    <section
      style={{
        backgroundColor: data?.data[0]?.backgroundColor || "#FBFF26",
      }}
      className="overflow-hidden"
    >
      <div className="container px-1 py-2 md:py-16 lg:py-20">
        <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8">
          {/* Left side */}
          <div className="order-2 md:order-1 mx-auto w-full p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold leading-normal text-[#2D3D4D]">
              <span className="font-normal">
                {data?.data[0]?.firstTitle || "New boiler?"}
              </span>{" "}
              <br /> {data?.data[0]?.secondTitle || "No Worries."}
            </h1>

            <p className="mt-4 max-w-[410px] text-sm md:text-base text-[#2D3D4D] font-normal leading-normal">
              {data?.data[0]?.subTitle ||
                "Get a fixed online quote for your new boiler today. Have it installed next working day."}
            </p>

            <div className="h-[52px] mt-6 flex justify-between items-center gap-4 bg-white p-1 rounded-full w-full md:w-[80%] shadow-md">
              <input
                type="text"
                placeholder="Enter postcode"
                className="px-4 py-2 w-1/2 rounded-full focus:outline-none"
              />

              <Link href="boilers/property-overview">
                <button className="px-6 py-[10px] bg-black text-white rounded-full hover:scale-105 transition-all duration-300">
                  Fix my price
                </button>
              </Link>
            </div>

            <ul className="mt-6 space-y-2 text-lg">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#292D32] text-[#FBFF26]">
                    <Check className="h-4 w-4" />
                  </span>

                  <span className="mt-[3px] text-sm md:text-base text-[#2D3D4D] font-normal leading-normal">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="hidden md:block order-1 md:order-2 mx-auto flex-col w-full max-w-[560px] items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <Image
                src={data?.data[0]?.image || "/assets/images/hero.png"}
                alt="Hero Image"
                width={1000}
                height={600}
                className="h-[290px] w-full object-contain md:h-[390px] lg:h-[400px] rounded-[12px]"
              />
            </div>

            <h4 className="w-[400px] mx-auto text-[#292D32] text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-center font-semibold md:font-medium leading-normal">
              {data?.data[0]?.imageText || "Save cash, switch boilers."}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;