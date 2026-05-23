"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

type CustomerSayItem = {
  _id: string;
  review: string;
  rating: number;
  name: string;
  location: string;
  isActive?: boolean;
};

type CustomerSayResponse = {
  data: CustomerSayItem[];
  meta?: {
    total?: number;
  };
};

const Reviews = () => {
  const { data, isLoading, isError } = useQuery<CustomerSayResponse>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/customersay?sortBy=createdAt&sortOrder=desc&limit=20&page=1`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }

      return res.json();
    },
  });

  const reviews = (data?.data || []).filter((item) => item?.isActive !== false);

  return (
    <section
      id="reviews"
      className="overflow-x-hidden overflow-y-visible bg-white py-12 md:py-14"
    >
      <div className="container mx-auto px-0">
        <div className="px-4 text-center">
          <h2 className="heading">What Our Customers Say</h2>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] leading-none text-[#334155] md:text-[11px]">
            <span className="text-sm md:text-base leading-normal font-medium text-[#2D3D4D]">
              Excellent
            </span>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="flex h-[14px] w-[14px] items-center justify-center rounded-[2px] bg-[#00B67A] text-white md:h-[15px] md:w-[15px]"
                >
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
              ))}
            </div>

            <span className="text-sm md:text-base font-normal leading-normal text-[#2D3D4D]">
              4.8 Out of 5 based on 56,714 reviews
            </span>

            <span className="flex items-center gap-1 font-normal leading-normal text-sm md:text-base text-[#2D3D4D]">
              <Star className="text-[#00A56F] w-5 h-5 fill-[#00A56F]" />
              Trustpilot
            </span>
          </div>
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
                      <p className="mt-3 desc">{`"${review.review}"`}</p>

                      {/* Footer */}
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm md:text-base leading-normal font-bold text-[#2D3D4D]">
                            {review.name}
                          </h3>
                          <span className="text-xs font-medium text-black leading-normal">
                            Verified customer
                          </span>
                        </div>

                        <p className="mt-3 text-xs md:text-sm font-normal leading-normal text-[#2D3D4D]">
                          {review.location}
                        </p>
                      </div>
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
