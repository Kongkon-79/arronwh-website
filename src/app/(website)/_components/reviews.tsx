"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useState } from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingSummary } from "./rating-summary";

type CustomerSayItem = {
  _id: string;
  title?: string;
  subtitle?: string;
  review?: string;
  rating: number;
  name: string;
  location: string;
  video?: string;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
};

type CustomerSayResponse = {
  data: CustomerSayItem[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

const Reviews = () => {
  const [selectedReview, setSelectedReview] = useState<CustomerSayItem | null>(null);
  const { data, isLoading, isError } = useQuery<CustomerSayResponse>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`;

      const firstRes = await fetch(
        `${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=50&page=1`,
      );

      if (!firstRes.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const firstPage: CustomerSayResponse = await firstRes.json();
      const firstPageData = firstPage?.data || [];
      const total = firstPage?.meta?.total || firstPageData.length;
      const limit = firstPage?.meta?.limit || 50;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      if (totalPages === 1) {
        return {
          ...firstPage,
          data: firstPageData,
        };
      }

      const remainingPagePromises = Array.from({ length: totalPages - 1 }).map((_, index) =>
        fetch(`${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=${limit}&page=${index + 2}`).then(
          async (res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch all reviews");
            }
            const pageData: CustomerSayResponse = await res.json();
            return pageData?.data || [];
          },
        ),
      );

      const remainingPages = await Promise.all(remainingPagePromises);
      const flattenedData = [firstPageData, ...remainingPages].flat();

      return {
        ...firstPage,
        data: flattenedData,
        meta: {
          ...firstPage.meta,
          total: flattenedData.length,
        },
      };
    },
  });

  const reviews = (data?.data || []).filter((item) => item?.isActive !== false);
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
    <section
      id="reviews"
      className="overflow-x-hidden overflow-y-visible bg-white py-12 md:py-14"
    >
      <div className="container mx-auto px-0">
        <div className="px-4 text-center">
          <h2 className="heading">What Our Customers Say</h2>

          <RatingSummary
            ratingLabel={ratingLabel}
            averageRating={averageRating}
            formattedAverageRating={formattedAverageRating}
            totalReviews={totalReviews}
          />
        </div>

        {/* Carousel */}
        <div className="mt-8 py-6">
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <article
                  key={`review-skeleton-${idx}`}
                  className="flex min-h-[240px] flex-col rounded-[10px] bg-white p-4 shadow-[0_0px_12px_#EE6766]"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((__, starIdx) => (
                      <Skeleton key={starIdx} className="h-6 w-6 rounded-[2px]" />
                    ))}
                  </div>
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-[95%]" />
                  <Skeleton className="mt-2 h-4 w-[80%]" />
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="mt-3 h-4 w-24" />
                  </div>
                </article>
              ))}
            </div>
          )}

          {isError && (
            <div className="px-4 text-center text-sm md:text-base font-medium text-[#EE6766]">
              Failed to load customer reviews. Please try again later.
            </div>
          )}

          {!isLoading && !isError && reviews.length === 0 && (
            <div className="px-4 text-center text-sm md:text-base font-medium text-[#2D3D4D]">
              No reviews found at the moment.
            </div>
          )}

          {!isLoading && !isError && reviews.length > 0 && (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2800,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full overflow-visible"
            >
              <CarouselContent className="-ml-6 overflow-visible py-6">
                {reviews.map((review) => (
                  <CarouselItem
                    key={review._id}
                    className="basis-[88%] pl-6 sm:basis-[62%] md:basis-[38%] lg:basis-[31%] xl:basis-[28%]"
                  >
                    {/* CARD */}
                    <article className="flex min-h-[240px] flex-col rounded-[10px] bg-white p-4 
                      shadow-[0_0px_12px_#EE6766] 
                      transition-all duration-300
                      hover:shadow-[0_6px_25px_rgba(238,103,102,0.5)]
                      hover:-translate-y-1"
                    >
                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <span
                            key={starIndex}
                            className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-white ${
                              starIndex < review.rating ? "bg-[#00A56F]" : "bg-[#CFD6DD]"
                            }`}
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </span>
                        ))}
                      </div>



                      {/* Review */}
                      <p className="mt-3 desc">{`"${review.review?.trim() || "No written review provided."}"`}</p>

                      {/* Footer */}
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm md:text-base leading-normal font-bold text-[#2D3D4D]">
                            {review.name}
                          </h3>
                          <span className="text-xs font-medium text-black leading-normal">
                            {review.isVerified ? "Verified customer" : "Customer"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <p className="mt-3 text-xs md:text-sm font-normal leading-normal text-[#2D3D4D]">
                          {review.location}
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className="mt-3 text-xs md:text-sm font-semibold leading-normal text-[#EE6766] underline underline-offset-2"
                          >
                            View More
                          </button>
                        </div>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6" onClick={() => setSelectedReview(null)}>
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[12px] bg-white p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedReview(null)}
              className="absolute right-4 top-3 text-xl font-medium leading-none text-[#2D3D4D]"
              aria-label="Close popup"
            >
              ×
            </button>

            <div className="mt-4 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <span
                  key={starIndex}
                  className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-white ${
                    starIndex < selectedReview.rating ? "bg-[#00A56F]" : "bg-[#CFD6DD]"
                  }`}
                >
                  <Star className="h-4 w-4 fill-current" />
                </span>
              ))}
            </div>

            {selectedReview.video?.trim() && (
              <video
                className="mt-4 h-[220px] w-full rounded-[8px] object-cover"
                src={selectedReview.video}
                controls
                preload="metadata"
              />
            )}

            <p className="mt-4 text-sm md:text-base font-normal leading-relaxed text-[#2D3D4D]">
              {selectedReview.review?.trim() || "No written review provided."}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-[#2D3D4D]">
              <p>
                <span className="font-semibold">Name:</span> {selectedReview.name}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {selectedReview.location}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selectedReview.isVerified ? "Verified customer" : "Customer"}
              </p>
              <p>
                <span className="font-semibold">Rating:</span> {selectedReview.rating} / 5
              </p>
              {selectedReview.createdAt && (
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedReview.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
