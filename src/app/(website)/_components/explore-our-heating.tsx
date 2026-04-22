"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  EXPLORE_HEATING_PRODUCTS_QUERY_KEY,
  fetchExploreHeatingProducts,
  type Product,
} from "./explore-our-heating-data";
import Link from "next/link";

type ExploreCard = {
  badge: string;
  title: string;
  description: string;
  theme: "navy" | "yellow" | "light";
  variant: "large" | "small";
  image: string;
};

const themeClasses = {
  navy: "bg-[#2D3D4D] text-white",
  yellow: "bg-[#FFDE59] text-[#2D3D4D]",
  light: "bg-[#F0F3F6] text-[#2D3D4D]",
};

const stripHtml = (value?: string) =>
  value
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim() ?? "";

const fallbackImages = [
  "/assets/images/eoh/eoh1.png",
  "/assets/images/eoh/eoh2.png",
  "/assets/images/eoh/eoh3.png",
  "/assets/images/eoh/eoh4.png",
  "/assets/images/eoh/eoh5.png",
  "/assets/images/eoh/eoh6.png",
];

const toExploreCard = (product: Product, index: number): ExploreCard => {
  const isFirstCard = index === 0;
  const isSecondCard = index === 1;

  const theme: ExploreCard["theme"] = isFirstCard
    ? "navy"
    : isSecondCard
      ? "yellow"
      : "light";
  const variant: ExploreCard["variant"] = index < 2 ? "large" : "small";
  const image =
    product.images?.[0] || fallbackImages[index % fallbackImages.length];
  const badge = product.badges?.[0] || "BOILERS";
  const title = stripHtml(product.title) || "Boiler solution";
  const description =
    stripHtml(product.shortDescription) ||
    stripHtml(product.description) ||
    "Get the right heating solution for your home.";

  return {
    badge,
    title,
    description,
    theme,
    variant,
    image,
  };
};

const ExploreOurHeating = () => {
  const [showAll, setShowAll] = useState(false);
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: EXPLORE_HEATING_PRODUCTS_QUERY_KEY,
    queryFn: fetchExploreHeatingProducts,
  });

  const exploreCards = products.map(toExploreCard);
  const visibleCards = showAll ? exploreCards : exploreCards.slice(0, 6);
  const shouldShowViewAllButton =
    !isLoading && !isError && !showAll && exploreCards.length > 6;

  return (
    <section id="heating" className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="">
          <div className="pb-4">
            <h2 className="heading text-center">
              Explore our heating & energy solutions
            </h2>
            <p className="desc text-center mt-3">
              Get instant prices for boilers, air conditioning, solar, and more
              all tailored to your home in minutes.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:gap-5 lg:gap-6 md:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <article
                  key={`loading-${index}`}
                  className="min-h-[220px] animate-pulse overflow-hidden rounded-[24px] bg-[#EEF2F5] p-4 md:p-5"
                >
                  <div className="h-6 w-1/3 rounded bg-[#DDE4EC]" />
                  <div className="mt-4 h-8 w-3/4 rounded bg-[#DDE4EC]" />
                  <div className="mt-3 h-4 w-full rounded bg-[#DDE4EC]" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-[#DDE4EC]" />
                  <div className="mt-8 h-10 w-full rounded bg-[#DDE4EC]" />
                </article>
              ))
            ) : isError ? (
              <div className="md:col-span-2 rounded-lg border border-[#F2B8B5] bg-[#FFF5F4] p-4 text-[#7A2D2A]">
                <p className="text-sm md:text-base">
                  {error instanceof Error
                    ? error.message
                    : "Unable to load products right now. Please try again."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetching ? "Retrying..." : "Try again"}
                </button>
              </div>
            ) : exploreCards.length === 0 ? (
              <div className="md:col-span-2 rounded-lg border border-[#DDE4EC] bg-[#F8FAFC] p-4 text-sm md:text-base text-[#2D3D4D]">
                No products found at the moment.
              </div>
            ) : (
              visibleCards.map((card, index) => {
                const isLarge = card.variant === "large";

                return (
                  <article
                    key={`${card.title}-${index}`}
                    className={`overflow-hidden rounded-[24px] ${themeClasses[card.theme]} ${
                      isLarge
                        ? "flex min-h-[318px] flex-col p-4 md:p-5 "
                        : "grid min-h-[148px] grid-cols-[96px_minmax(0,1fr)] gap-4 md:gap-5 lg:gap-6 p-4 md:grid-cols-[120px_minmax(0,1fr)] "
                    }`}
                  >
                    <div
                      className={
                        isLarge
                          ? "flex h-[270px] items-center justify-center"
                          : "flex h-[250px] items-center justify-center"
                      }
                    >
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={500}
                        height={360}
                        className={`object-contain w-[300px] h-[250px] `}
                      />
                    </div>

                    <div
                      className={
                        isLarge
                          ? "mt-2 flex h-full flex-col"
                          : "flex h-full flex-col justify-between"
                      }
                    >
                      <div>
                        <p
                          className={`text-sm md:text-base font-medium leading-normal uppercase tracking-[0.16em] ${
                            card.theme === "yellow"
                              ? "text-[#2D3D4D]"
                              : "text-[#FFDE59]"
                          }`}
                        >
                          {card.badge}
                        </p>

                        <h3 className="mt-2 font-bold leading-normal text-xl md:text-2xl lg:text-3xl">
                          {card.title}
                        </h3>

                        <p
                          className={`mt-2 ${
                            isLarge ? "max-w-[400px]" : "max-w-[255px]"
                          } text-sm md:text-base font-normal leading-normal ${
                            card.theme === "navy"
                              ? "text-white"
                              : "text-[#2D3D4D]"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>

                      <div className={isLarge ? "mt-auto pt-4" : "pt-3"}>
                        <Link href="boilers/property-overview">
                          <button
                            type="button"
                            className={`flex h-10 w-full items-center justify-center rounded-[8px] text-sm md:text-base font-medium leading-normal transition-colors ${
                              card.theme === "navy"
                                ? "bg-primary text-[#2D3D4D] hover:bg-[#F3CF43]"
                                : "bg-[#00A56F] text-white hover:bg-[#0A965F]"
                            }`}
                          >
                            Get a fixed price
                          </button>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {shouldShowViewAllButton ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="rounded-[8px] bg-primary px-6 py-2.5 text-sm md:text-base font-medium text-[#2D3D4D] transition-colors hover:bg-[#F3CF43]"
              >
                View all
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ExploreOurHeating;
