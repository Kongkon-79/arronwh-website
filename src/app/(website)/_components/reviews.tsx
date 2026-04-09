"use client";

import { MessageCircleMore, Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const reviews = [
  {
    quote:
      '"Amazing service from start to finish. Had the new boiler installed the next day and the engineers were professional and tidy. Highly recommend!"',
    name: "Sarah Johnson",
    location: "London, UK",
  },
  {
    quote:
      '"The quote process was so simple and transparent. No hidden fees, no surprises. Got exactly what was promised at the price quoted."',
    name: "Michael Brown",
    location: "Manchester, UK",
  },
  {
    quote:
      '"The quote process was so simple and transparent. No hidden fees, no surprises. Got exactly what was promised at the price quoted."',
    name: "Michael Brown",
    location: "Manchester, UK",
  },
  {
    quote:
      '"Best decision we made. Our heating bills have dropped significantly and the boiler is whisper quiet. Five stars!"',
    name: "Emma Davis",
    location: "Birmingham, UK",
  },
  {
    quote:
      '"Best decision we made. Our heating bills have dropped significantly and the boiler is whisper quiet. Five stars!"',
    name: "Emma Davis",
    location: "Birmingham, UK",
  },
];

const Reviews = () => {
  return (
    <section className="overflow-hidden bg-white py-12 md:py-14">
      <div className="container mx-auto px-0">
        <div className="mx-auto max-w-[540px] px-4 text-center">
          <h2 className="font-sora text-[24px] font-semibold text-[#334155] md:text-[34px]">
            What Our Customers Say
          </h2>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] leading-none text-[#334155] md:text-[11px]">
            <span className="text-[#475569]">Excellent</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="flex h-[15px] w-[15px] items-center justify-center rounded-[2px] bg-[#00B67A] text-white"
                >
                  <Star className="h-2.5 w-2.5 fill-current" />
                </span>
              ))}
            </div>
            <span className="text-[#475569]">4.8 Out of 5 based on 56,714 reviews</span>
            <span className="font-semibold text-[#00B67A]">Trustpilot</span>
          </div>
        </div>

        <div className="mt-8">
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
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem
                  key={`${review.name}-${index}`}
                  className="basis-[88%] pl-4 sm:basis-[62%] md:basis-[38%] lg:basis-[31%] xl:basis-[28%]"
                >
                  <article className="flex min-h-[165px] flex-col rounded-[10px] border border-[#F4C8C3] bg-white px-4 py-4 shadow-[0_4px_18px_rgba(244,200,195,0.24)]">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className="flex h-[15px] w-[15px] items-center justify-center rounded-[2px] bg-[#00B67A] text-white"
                        >
                          <Star className="h-2.5 w-2.5 fill-current" />
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-[12px] leading-[1.45] text-[#334155]">
                      {review.quote}
                    </p>

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[12px] font-semibold text-[#334155]">
                          {review.name}
                        </h3>
                        <span className="text-[9px] font-medium text-[#F1B94B]">
                          Verified customer
                        </span>
                      </div>
                      <p className="mt-3 text-[10px] text-[#64748B]">
                        {review.location}
                      </p>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="mx-auto mt-9 flex max-w-[760px] flex-col items-center justify-between gap-5 px-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0EA76B] text-[#0EA76B]">
              <MessageCircleMore className="h-5 w-5" />
            </span>
            <p className="text-[13px] font-medium text-[#334155] md:text-[14px]">
              Want to know more reasons why people choose YOLO HEAT?
            </p>
          </div>

          <button
            type="button"
            className="flex h-10 min-w-[112px] items-center justify-center rounded-[6px] bg-[#0EA76B] px-6 text-[12px] font-semibold text-white transition-colors hover:bg-[#0A965F]"
          >
            Tell me more
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
