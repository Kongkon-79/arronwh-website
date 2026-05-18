import React from "react";
import Image from "next/image";

const HeadOffice = () => {
  return (
    <section className="relative bg-[#dfe1e3] px-4 pb-10 pt-3 md:pb-14">
      <div className="absolute left-4 bottom-24 hidden text-[#20242b] md:block">
        <Image
          src="/assets/images/robot.png"
          alt="robot"
          width={500}
          height={524}
          className="object-contain w-full h-[100px] md:h-[110px]"
        />
      </div>
      <div className="container">
        <article className="relative h-[300px] md:h-[360px] lg:h-[420px] overflow-hidden rounded-[18px]">
          <Image
            src="/assets/images/head_office_bg.jpeg"
            alt="Head office team support"
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 1060px"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/30 to-black/8" />

          <div className="absolute bottom-4 left-4 md:left-6 lg:left-8 xl:left-10 text-white sm:bottom-5">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em]">
              Head office
            </h2>
            <p className="mt-2 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
              Main road,
            </p>
            <p className="mt-1 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
              barnolby le beck
            </p>
            <p className="mt-1 text-base md:text-lg font-medium leading-none tracking-[-0.01em] text-[#a8a9aa]">
              Grimsby
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default HeadOffice;
