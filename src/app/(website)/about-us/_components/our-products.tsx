"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type ProductSlide = {
  id: number
  image: string
}

const OurProducts = () => {
  const slides = useMemo<ProductSlide[]>(
    () => [
      { id: 1, image: "/product.png" },
      { id: 2, image: "/product2.png"  },
      { id: 3, image: "/product3.png" },
      { id: 4, image: "/product.png" },
      { id: 5, image: "/product2.png"  },
      { id: 6, image: "/product3.png" },
      { id: 7, image: "/product.png" },
      { id: 8, image: "/product2.png"  },
    ],
    [],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const currentSlide = slides[currentIndex]

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
              alt={`Product ${currentSlide.id}`}
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












// "use client"

// import { useMemo, useState } from "react"
// import Image from "next/image"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"

// type ProductSlide = {
//   id: number
//   image: string
//   title: string
//   rating: string
// }

// const OurProducts = () => {
//   const slides = useMemo<ProductSlide[]>(
//     () => [
//       { id: 1, image: "/product.png", title: "Worcester boilers", rating: "A" },
//       { id: 2, image: "/product2.png", title: "Navien boilers", rating: "A" },
//       { id: 3, image: "/product3.png", title: "Vaillant boilers", rating: "A" },
//       { id: 4, image: "/product.png", title: "Worcester boilers", rating: "A" },
//       { id: 5, image: "/product2.png", title: "Navien boilers", rating: "A" },
//       { id: 6, image: "/product3.png", title: "Vaillant boilers", rating: "A" },
//       { id: 7, image: "/product.png", title: "Worcester boilers", rating: "A" },
//       { id: 8, image: "/product2.png", title: "Navien boilers", rating: "A" },
//     ],
//     [],
//   )

//   const [currentIndex, setCurrentIndex] = useState(0)
//   const currentSlide = slides[currentIndex]

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
//   }

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % slides.length)
//   }

//   return (
//     <section className="w-full bg-[#ececec] py-12 sm:py-14">
//       <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8">
//         <div className="mx-auto max-w-[760px] text-center">
//           <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#2f4151] sm:text-[42px]">
//             Our Products
//           </h2>
//           <p className="mx-auto mt-2.5 max-w-[720px] text-[11px] leading-[1.4] text-[#7a7f87] sm:text-[12.5px]">
//             We began collaborating with leading boiler manufacturer Worcester Bosch back in 2026. As our product
//             list grew, we developed strong partnerships with more award-winning companies including Vaillant, Navien,
//             Tesla, and Susynk.
//           </p>
//         </div>

//         <div className="relative mx-auto mt-8 max-w-[820px]">
//           <div className="hidden md:block">
//             <Button
//               type="button"
//               size="icon"
//               variant="ghost"
//               onClick={handlePrev}
//               className="absolute left-[-56px] top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#637184] text-white shadow-md hover:bg-[#546275] hover:text-white"
//               aria-label="Previous product"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//           </div>
//           <div className="mx-auto overflow-hidden rounded-2xl border border-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
//             <Image
//               src={currentSlide.image}
//               alt={currentSlide.title}
//               width={620}
//               height={700}
//               className="h-[300px] w-full object-contain sm:h-[460px] md:h-[560px]"
//               priority
//             />

//             <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-end justify-between px-3 sm:bottom-6 sm:px-6">
//               <span className="rounded-full bg-[#4d5967]/95 px-3.5 py-1.5 text-xs font-medium text-white sm:px-5 sm:py-2 sm:text-[24px]">
//                 {currentSlide.title}
//               </span>
//               <span className="rounded-[4px] bg-[#09b267] px-3.5 py-1.5 text-[20px] font-bold leading-none text-white sm:px-5 sm:py-2 sm:text-[34px]">
//                 {currentSlide.rating}
//               </span>
//             </div>
//           </div>

//           <div className="hidden md:block">
//             <Button
//               type="button"
//               size="icon"
//               variant="ghost"
//               onClick={handleNext}
//               className="absolute right-[-56px] top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#637184] text-white shadow-md hover:bg-[#546275] hover:text-white"
//               aria-label="Next product"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </div>

//           <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
//             <Button
//               type="button"
//               size="icon"
//               variant="ghost"
//               onClick={handlePrev}
//               className="h-9 w-9 rounded-full bg-[#637184] text-white hover:bg-[#546275] hover:text-white"
//               aria-label="Previous product"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               type="button"
//               size="icon"
//               variant="ghost"
//               onClick={handleNext}
//               className="h-9 w-9 rounded-full bg-[#637184] text-white hover:bg-[#546275] hover:text-white"
//               aria-label="Next product"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>

//         <p className="mt-5 text-center text-sm font-medium text-[#6b7280]">
//           {currentIndex + 1}/{slides.length}
//         </p>
//       </div>
//     </section>
//   )
// }

// export default OurProducts
