"use client";

import { BannerApiResponse } from "@/components/types/hero-data-type";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  const banner = data?.data?.[0];

  const heroPoints: string[] = Array.isArray(banner?.feature)
    ? banner.feature.map((item) => item.replace(/[\[\]"]/g, "").trim())
    : [];

  // =========================
  // Skeleton (UNCHANGED - your design kept)
  // =========================
  if (isLoading) {
    return (
      <section className="overflow-hidden bg-[#FBFF26]">
        <div className="container px-1 py-2 md:py-16 lg:py-20">
          <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 animate-pulse">
            {/* LEFT */}
            <div className="order-2 md:order-1 mx-auto w-full p-6 md:p-8">
              <div className="space-y-4">
                <div className="h-12 md:h-16 w-[90%] rounded-xl bg-[#d9dc52]" />
                <div className="h-12 md:h-16 w-[70%] rounded-xl bg-[#d9dc52]" />
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-full bg-[#d9dc52]" />
                <div className="h-4 w-[85%] rounded-full bg-[#d9dc52]" />
              </div>

              <div className="h-[52px] mt-8 flex items-center gap-4 bg-white p-1 rounded-full w-full md:w-[55%] shadow-md">
                <div className="h-10 w-1/2 rounded-full bg-gray-200" />
                <div className="h-10 w-36 rounded-full bg-[#2D3D4D]" />
              </div>

              <div className="mt-8 space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#2D3D4D]" />
                    <div className="h-4 w-56 rounded-full bg-[#d9dc52]" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex order-1 md:order-2 mx-auto flex-col w-full max-w-[560px] items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[20px] bg-[#d9dc52]">
                <div className="h-[290px] md:h-[390px] lg:h-[400px] w-full relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>

              <div className="mt-6 space-y-4 flex flex-col items-center">
                <div className="h-8 w-[320px] rounded-full bg-[#d9dc52]" />
                <div className="h-8 w-[260px] rounded-full bg-[#d9dc52]" />
              </div>
            </div>
          </div>
        </div>

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
  // ERROR (eye-catching)
  // =========================
  if (isError) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-red-50 via-white to-red-50">
        <div className="text-center p-8 rounded-2xl shadow-lg border border-red-200 bg-white max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            We couldn’t load hero content. Please refresh or try again later.
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // EMPTY STATE (eye-catching)
  // =========================
  if (!banner) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 rounded-2xl shadow-md border bg-white max-w-md">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-700">
            No Hero Data Found
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please check your CMS or backend configuration.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{ backgroundColor: banner.backgroundColor || "#FBFF26" }}
      className="overflow-hidden"
    >
      <div className="container px-1 py-2 md:py-16 lg:py-20">
        <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8">
          {/* LEFT */}
          <div className="order-2 md:order-1 mx-auto w-full p-2 md:p-4">
            <h1
              style={{ color: banner?.textColor || "#2D3D4D" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold leading-normal"
            >
              <span className="font-normal">{banner.firstTitle}</span>
              <br />
              {banner.secondTitle}
            </h1>

            <p
              style={{ color: banner?.textColor || "#2D3D4D" }}
              className="mt-4 max-w-[410px] text-sm md:text-base font-normal"
            >
              {banner.subTitle}
            </p>

            {/* <div className="h-[52px] mt-6 flex justify-between items-center gap-4 bg-white p-1 rounded-full w-full md:w-[80%] shadow-md">
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
            </div> */}

             <div className="mt-6">
              <Link href="boilers/property-overview">
                <button className="px-6 py-[10px] bg-black text-white rounded-full hover:scale-105 transition-all duration-300">
                  {banner?.buttonText || "Get quote"}
                </button>
              </Link>
             </div>

            <ul className="mt-6 space-y-2">
              {heroPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#292D32] text-[#FBFF26]">
                    <Check className="h-4 w-4" />
                  </span>

                  <span
                    style={{ color: banner?.textColor || "#2D3D4D" }}
                    className="mt-[3px] text-sm md:text-base"
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="hidden md:block order-1 md:order-2 mx-auto w-full max-w-[560px]">
            <Image
              src={banner.image || "/assets/images/hero.png"}
              alt="Hero Image"
              width={1000}
              height={600}
              className="h-[290px] w-full object-contain md:h-[390px] lg:h-[400px] rounded-[12px]"
            />

            <h4
              style={{ color: banner?.textColor || "#292D32" }}
              className="mt-6 text-3xl md:text-4xl xl:text-5xl text-center font-semibold"
            >
              {banner.imageText}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
