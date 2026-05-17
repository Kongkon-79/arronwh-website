import React from 'react'
import Image from 'next/image'

const HeadOffice = () => {
  return (
    <section className="bg-[#e6e7e8] px-4 pb-10 pt-1 md:pb-14">
      <div className="mx-auto max-w-[1060px]">
        <article className="relative h-[200px] overflow-hidden rounded-[20px] sm:h-[230px] md:h-[250px]">
          <Image
            src="/assets/images/hero_image.png"
            alt="Head office team support"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1060px"
            priority={false}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />

          <div className="absolute bottom-5 left-5 text-white sm:bottom-6 sm:left-6 md:bottom-7 md:left-7">
            <h2 className="text-[44px] font-medium leading-none tracking-[-0.02em]">Head office</h2>
            <p className="mt-3 text-[30px] font-medium leading-none tracking-[-0.01em] text-[#eef0f3]">
              Main road,
            </p>
            <p className="mt-1 text-[30px] font-medium leading-none tracking-[-0.01em] text-[#eef0f3]">
              barnolby le beck
            </p>
            <p className="mt-1 text-[30px] font-medium leading-none tracking-[-0.01em] text-[#eef0f3]">
              Grimsby
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

export default HeadOffice
