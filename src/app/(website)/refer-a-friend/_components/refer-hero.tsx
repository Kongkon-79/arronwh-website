import React from 'react'
import Image from 'next/image'
import { Lightbulb } from 'lucide-react'

const ReferHeroSection = () => {
  return (
    <section className="bg-[#dfe1e3] px-4 py-10 sm:px-6 md:py-14 lg:py-16">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-8 lg:grid-cols-[1fr_420px] lg:gap-10">
        <div className="max-w-[700px]">
          <h1 className="text-[42px] font-semibold leading-[1.06] tracking-[-0.02em] text-[#161b22] sm:text-[56px] md:text-[66px] lg:text-[74px]">
            Refer friends.
            <br />
            Get up-to £250.
          </h1>

          <p className="mt-5 max-w-[660px] text-[22px] leading-[1.4] text-[#222932] sm:text-[24px] md:text-[26px] lg:text-[30px]">
            Refer a friend or family member to Yolo heat - they&apos;ll save on their new boiler, and
            you&apos;ll get rewarded too.
          </p>

          <label
            htmlFor="refer-email"
            className="mt-6 block text-[18px] font-medium text-[#202734] sm:text-[20px] md:text-[22px]"
          >
            Enter your email address <span className="text-[#d72638]">*</span>
          </label>

          <form className="mt-2 flex w-full max-w-[640px] flex-col gap-2 sm:flex-row sm:gap-0">
            <input
              id="refer-email"
              type="email"
              placeholder="a.smith@gmail.com"
              className="h-[50px] flex-1 rounded-[8px] border border-[#d4d8de] bg-[#efefef] px-5 text-[18px] text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1a56db] focus:outline-none"
            />
            <button
              type="submit"
              className="h-[50px] rounded-[8px] bg-[#1450e6] px-7 text-[18px] font-medium text-white transition hover:bg-[#1148cf] sm:ml-0 sm:rounded-l-none"
            >
              Submit
            </button>
          </form>

          <div className="mt-4 flex w-full max-w-[640px] items-start gap-2 rounded-[8px] border border-[#e3d291] bg-[#f0df9c] px-4 py-3 text-[13px] font-semibold leading-[1.4] text-[#212734] sm:text-[14px] md:text-[15px]">
            <Lightbulb className="mt-[1px] h-4 w-4 shrink-0" strokeWidth={2.3} />
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
          <div className="relative aspect-[0.85/1] w-full overflow-hidden rounded-[6px]">
            <Image
              src="/assets/images/hero_image.png"
              alt="Happy customer holding money"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 420px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReferHeroSection
