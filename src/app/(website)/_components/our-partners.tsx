"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { PartnerApiResponse } from "@/components/types/our-partners-data-type";
import { RatingSummary } from "./rating-summary";

type ReviewItem = {
  _id: string;
  rating: number;
  isActive?: boolean;
};

type ReviewResponse = {
  data: ReviewItem[];
  meta?: { page?: number; limit?: number; total?: number };
};

const OurPartners = () => {
  const { data, isLoading, isError } = useQuery<PartnerApiResponse>({
    queryKey: ["partnerData"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/partners`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch partner data");
      }

      return res.json();
    },
  });

  const { data: reviewData } = useQuery<ReviewResponse>({
    queryKey: ["reviews-summary"],
    queryFn: async () => {
      const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`;
      const firstRes = await fetch(
        `${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=50&page=1`
      );
      if (!firstRes.ok) throw new Error("Failed to fetch reviews");

      const firstPage: ReviewResponse = await firstRes.json();
      const firstPageData = firstPage?.data || [];
      const total = firstPage?.meta?.total || firstPageData.length;
      const limit = firstPage?.meta?.limit || 50;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      if (totalPages === 1) return { ...firstPage, data: firstPageData };

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }).map((_, i) =>
          fetch(
            `${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=${limit}&page=${i + 2}`
          ).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch all reviews");
            const pageData: ReviewResponse = await res.json();
            return pageData?.data || [];
          })
        )
      );

      const flattenedData = [firstPageData, ...remainingPages].flat();
      return { ...firstPage, data: flattenedData, meta: { ...firstPage.meta, total: flattenedData.length } };
    },
  });

  const reviews = (reviewData?.data || []).filter((item) => item?.isActive !== false);
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / totalReviews
    : 0;
  const formattedAverageRating = averageRating.toFixed(1);
  const ratingLabel =
    averageRating >= 4.5
      ? "Excellent"
      : averageRating >= 3.5
      ? "Great"
      : averageRating >= 2.5
      ? "Good"
      : "Average";

  const partners = data?.data?.[0];

  const partnerImages = partners?.images || [];

  const loopedPartnerImages = [...partnerImages, ...partnerImages];

  // =========================
  // SKELETON LOADER (eye-catchy)
  // =========================
  if (isLoading) {
    return (
      <section className="overflow-hidden bg-[#EAEBEC] py-7 md:py-8">
        <div className="px-4 animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="h-4 w-72 bg-gray-300 rounded-full" />
            <div className="h-6 w-40 bg-gray-300 rounded-full" />
          </div>

          <div className="mt-8 flex gap-8 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                className="h-[80px] w-[163px] bg-gray-300 rounded-md flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR STATE (eye-catchy)
  // =========================
  if (isError) {
    return (
      <section className="py-10 bg-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-md border border-red-200">
          <div className="text-4xl mb-2">⚠️</div>
          <h2 className="text-lg font-semibold text-red-600">
            Failed to load partners
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please try again later
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!partners || partnerImages.length === 0) {
    return (
      <section className="py-10 bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-xl shadow-md border">
          <div className="text-4xl mb-2">📭</div>
          <h2 className="text-lg font-semibold text-gray-700">
            No Partners Found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Data is currently unavailable
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-[#EAEBEC] py-7 md:py-8">
      <div className="px-0">
        <div className="flex flex-col items-center">
          <RatingSummary
            ratingLabel={ratingLabel}
            averageRating={averageRating}
            formattedAverageRating={formattedAverageRating}
            totalReviews={totalReviews}
          />

          <h2 className="pt-5 font-bold text-[#2D3D4D] text-xl md:text-2xl lg:text-3xl">
            {partners?.title || "Our Partners"}
          </h2>
        </div>

        {/* MARQUEE */}
        <div className="relative mt-8 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 md:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 md:w-16" />

          <div className="partners-marquee group flex overflow-hidden">
            <div className="partners-track flex min-w-max items-center gap-12 pr-12 will-change-transform md:gap-16 md:pr-16">
              {loopedPartnerImages?.map((img, index) => (
                <div
                  key={`${img}-${index}`}
                  className="flex h-[34px] w-[88px] flex-shrink-0 items-center justify-center md:h-[80px] md:w-[163px]"
                >
                  <Image
                    src={img}
                    alt={`partner-${index}`}
                    width={160}
                    height={52}
                    className="w-[163px] h-[80px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .partners-track {
          animation: partnerMarquee 30s linear infinite;
        }

        .group:hover .partners-track {
          animation-play-state: paused;
        }

        @keyframes partnerMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default OurPartners;