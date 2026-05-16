import Image from "next/image"
import { Star } from "lucide-react"

const OurMission = () => {
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
             We’re on a mission to empower our customers.
            </h3>

            <p className="mx-auto mt-3 md:mt-4 max-w-[620px] text-sm md:text-base font-normal leading-normal text-[#878787]">
              We do this by providing by simple and affordable way for customers to purchase complex home
              upgrades, from developing the UK&apos;s first online questionnaire that offers free personalised boiler
              recommendations to creating an app that delivers ongoing support. Yolo Heat is here to help.
              Seven days a week.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-2.5 text-[13px] font-medium text-[#111827] sm:gap-3">
          <span className="font-semibold">Excellent</span>

          <span className="inline-flex items-center gap-0.5 rounded-[2px] bg-[#00b67a] px-1.5 py-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-white text-white" />
            ))}
          </span>

          <span>4.8 Out of 5 based on 56,714 reviews</span>

          <span className="inline-flex items-center gap-1.5 font-medium text-[#111827]">
            <Star className="h-3.5 w-3.5 fill-[#00b67a] text-[#00b67a]" />
            Trustpilot
          </span>
        </div>
      </div>
    </section>
  )
}

export default OurMission
