import React from 'react'
import Image from 'next/image'
import { Lightbulb } from 'lucide-react'

const ReferHeroSection = () => {
  return (
    <section className="bg-[#dfe1e3] px-4 py-10 sm:px-6 md:py-14 lg:py-16">
      <div className="container grid w-full  items-center gap-8 lg:grid-cols-[1fr_420px] lg:gap-10">
        <div className="max-w-[700px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium leading-[1.06] tracking-[-0.02em] text-[#161b22] ">
            Refer friends.
            <br />
            Get up-to £250.
          </h1>

          <p className="mt-5 max-w-[560px] leading-[1.4] text-[#222932] text-base lg:text-lg font-medium">
            Refer a friend or family member to Yolo heat - they&apos;ll save on their new boiler, and
            you&apos;ll get rewarded too.
          </p>

          <label
            htmlFor="refer-email"
            className="mt-6 block text-base md:text-lg xl:text-xl font-medium text-[#202734]"
          >
            Enter your email address <span className="text-[#d72638]">*</span>
          </label>

          <form className="mt-2 flex w-full md:max-w-[640px]">
            <input
              id="refer-email"
              type="email"
              placeholder="a.smith@gmail.com"
              className="w-full h-11 md:h-12 flex-1 rounded-l-[8px] border border-[#d4d8de] bg-[#efefef] px-5 text-[18px] text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1a56db] focus:outline-none"
            />
            <button
              type="submit"
              className="h-11 md:h-12 rounded-r-[8px] bg-[#1450e6] px-7 text-base md:text-[18px] font-medium text-white transition hover:bg-[#1148cf] sm:ml-0 sm:rounded-l-none"
            >
              Submit
            </button>
          </form>

          <div className="mt-4 flex w-full max-w-[640px] items-start gap-2 rounded-[8px] border border-[#e3d291] bg-[#f3e4a8] px-4 py-3 text-sm lg:text-base font-medium leading-[1.4] text-[#212734]">
            <Lightbulb className="mt-[1px] h-6 w-6 shrink-0" strokeWidth={2.3} />
            <p>
              Use the same email address linked to your original order. Need help? call{' '}
              <a className="underline" href="tel:07947125922">
                07947 125922
              </a>{' '}
              or email{' '}
              <a className="underline" href="mailto:hello@yoloheat.com">
                hello@yoloheat.com
              </a>
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[420px] lg:justify-self-end">
          <Image
              src="/assets/images/refer-hero.png"
              alt="Happy customer holding money"
              width={700}
              height={724}
              className="object-conver w-full h-[300px] md:h-[420px]"
            />
        </div>
      </div>
    </section>
  )
}

export default ReferHeroSection
