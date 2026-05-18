"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { AlertTriangle, ChevronLeft, ChevronRight, RefreshCw, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { fetchExploreHeatingProducts, Product } from "../../_components/explore-our-heating-data"

type ProductSlide = {
  id: string
  image: string
  title: string
}

function OurProductsSkeleton() {
  return (
    <section className="w-full bg-[#ececec] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-8">
        <div className="mx-auto max-w-[840px] text-center">
          <Skeleton className="mx-auto h-9 w-52 rounded-lg bg-primary/20" />
          <Skeleton className="mx-auto mt-3 h-4 w-full max-w-[720px] rounded-md bg-primary/20" />
          <Skeleton className="mx-auto mt-2 h-4 w-4/5 max-w-[620px] rounded-md bg-primary/20" />
        </div>

        <div className="mt-7 grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-1 sm:grid-cols-[56px_minmax(0,1fr)_56px] sm:gap-5">
          <Skeleton className="mx-auto h-8 w-8 rounded-full bg-primary/20 sm:h-10 sm:w-10" />
          <Skeleton className="h-[280px] w-full rounded-2xl bg-primary/20 sm:h-[420px] md:h-[450px]" />
          <Skeleton className="mx-auto h-8 w-8 rounded-full bg-primary/20 sm:h-10 sm:w-10" />
        </div>

        <Skeleton className="mx-auto mt-4 h-4 w-14 rounded-md bg-primary/20" />
      </div>
    </section>
  )
}

function OurProductsError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="w-full bg-[#ececec] py-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-5 px-4 text-center sm:px-8">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.5} />
        </span>

        <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-[#2C3E4D]">
          Couldn&apos;t Load Products
        </h2>

        <p className="text-sm 2xl:text-base font-normal leading-normal text-[#878787]">
          We ran into an issue while loading product images. Please try again.
        </p>

        <button
          onClick={onRetry}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-[#2D3D4D] transition-all duration-200 hover:brightness-105 active:scale-95"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" strokeWidth={2} />
          Try Again
        </button>
      </div>
    </section>
  )
}

function OurProductsNotFound() {
  return (
    <section className="w-full bg-[#ececec] py-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-5 px-4 text-center sm:px-8">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/50">
          <SearchX className="h-8 w-8 text-black/80" strokeWidth={1.5} />
        </span>

        <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-[#2C3E4D]">
          No Products Found
        </h2>

        <p className="text-sm 2xl:text-base font-normal leading-normal text-[#878787]">
          We don&apos;t have any product images to show right now. Please check again shortly.
        </p>
      </div>
    </section>
  )
}

const OurProducts = () => {
  const { data, isLoading, isError, refetch } = useQuery<Product[]>({
    queryKey: ["all-products"],
    queryFn: fetchExploreHeatingProducts,
  })

  const slides = useMemo<ProductSlide[]>(
    () =>
      (data ?? [])
        .filter((product) => Boolean(product.images?.[0]))
        .map((product) => ({
          id: product._id,
          image: product.images[0],
          title: product.title,
        })),
    [data],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = slides[currentIndex]

  if (isLoading) return <OurProductsSkeleton />
  if (isError) return <OurProductsError onRetry={refetch} />
  if (slides.length === 0) return <OurProductsNotFound />

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="w-full bg-[#ececec] py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[1080px] px-4 sm:px-8">
        <div className="mx-auto max-w-[840px] text-center">
          <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-[#2C3E4D]">
            Our Products
          </h2>
          <p className="mt-2 text-sm 2xl:text-base font-normal leading-normal text-[#878787]">
            We began collaborating with leading boiler manufacturer Worcester Bosch back in 2026. As our product
            list grew, we developed strong partnerships with more award-winning companies including Vaillant, Navien,
            Tesla, and Susynk.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-1 sm:grid-cols-[56px_minmax(0,1fr)_56px] sm:gap-5">
          <div className="flex justify-center">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handlePrev}
              className="h-8 w-8 rounded-full bg-[#59687b] text-white hover:bg-[#4a5869] hover:text-white sm:h-10 sm:w-10"
              aria-label="Previous product"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={currentSlide.image}
              alt={currentSlide.title}
              width={760}
              height={560}
              className="h-[280px] w-full object-contain sm:h-[420px] md:h-[450px]"
              priority
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-8 w-8 rounded-full bg-[#59687b] text-white hover:bg-[#4a5869] hover:text-white sm:h-10 sm:w-10"
              aria-label="Next product"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm font-medium text-[#6b7280]">
          {currentIndex + 1}/{slides.length}
        </p>
      </div>
    </section>
  )
}

export default OurProducts
