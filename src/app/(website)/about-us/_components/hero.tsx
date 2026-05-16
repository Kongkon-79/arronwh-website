import Link from "next/link"
import { Button } from "@/components/ui/button"

const Hero = () => {
  return (
    <section className="w-full bg-white py-6 md:py-8 lg:py-10 xl:py-12">
      <div className="container mx-auto flex w-full justify-center items-center px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="max-w-[580px] ">
           <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal leading-9 md:leading-normal text-[#2C3E4D]"
            >
              <span className="text-[#00A56F]">Hello, we’re</span>
              <br />
              Yolo heat
            </h1>

          <p className="mt-3 md:mt-4 text-sm lg:text-base font-normal text-black">
            Discover the smart way to install and maintain the heart of your home
          </p>

          <Button
            asChild
            className="mt-3 lg:mt-4 h-10 md:h-11 rounded-[8px] bg-[#00A56F] px-6 text-sm md:text-base font-medium leading-normal text-white hover:bg-[#059460]"
          >
            <Link href="/contact-us">Finish Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
