"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { RatingSummary } from "@/app/(website)/_components/rating-summary";

type ReviewItem = {
  _id: string;
  rating: number;
  isActive?: boolean;
};

type ReviewResponse = {
  data: ReviewItem[];
  meta?: { page?: number; limit?: number; total?: number };
};

const OurMission = () => {
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
      return {
        ...firstPage,
        data: flattenedData,
        meta: { ...firstPage.meta, total: flattenedData.length },
      };
    },
  });

  const reviews = (reviewData?.data || []).filter(
    (item) => item?.isActive !== false
  );
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

  return (
    <section className="w-full bg-white py-6 md:py-8 lg:py-10 xl:py-12">
      <div className="container mx-auto flex w-full flex-col items-center px-6 sm:px-10">
        <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-[160px_1fr] md:gap-12">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/assets/images/our-mission.png"
              alt="Yolo heat mascot"
              width={110}
              height={110}
              className="h-[180px] md:h-[205px] w-[200px] object-cover"
              priority
            />
          </div>

          <div className="mx-auto max-w-[650px] text-center">
            <h3 className="text-2xl md:text-[28px] lg:text-[32px] font-medium leading-9 text-[#2C3E4D]">
             We&apos;re on a mission to empower our customers.
            </h3>

            <p className="mx-auto mt-3 md:mt-4 max-w-[620px] text-sm md:text-base font-normal leading-normal text-[#878787]">
              We do this by providing by simple and affordable way for customers to purchase complex home
              upgrades, from developing the UK&apos;s first online questionnaire that offers free personalised boiler
              recommendations to creating an app that delivers ongoing support. Yolo Heat is here to help.
              Seven days a week.
            </p>
          </div>
        </div>

        <RatingSummary
          ratingLabel={ratingLabel}
          averageRating={averageRating}
          formattedAverageRating={formattedAverageRating}
          totalReviews={totalReviews}
        />
      </div>
    </section>
  );
};

export default OurMission;
