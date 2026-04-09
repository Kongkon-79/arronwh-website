"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const partnerLogos = [
  { src: "/assets/images/our_partners/op1.png", alt: "Google" },
  { src: "/assets/images/our_partners/op2.png", alt: "ITV" },
  { src: "/assets/images/our_partners/op3.png", alt: "B and Q" },
  { src: "/assets/images/our_partners/op4.png", alt: "Tesla Powerwall Certified Installer" },
  { src: "/assets/images/our_partners/op5.png", alt: "Worcester" },
  { src: "/assets/images/our_partners/op6.png", alt: "Bosch" },
  { src: "/assets/images/our_partners/op7.png", alt: "Sky" },
  { src: "/assets/images/our_partners/op8.png", alt: "HomeServe" },
  { src: "/assets/images/our_partners/op9.png", alt: "Leeds United" },
];

const loopedPartnerLogos = [...partnerLogos, ...partnerLogos];

const OurPartners = () => {
  return (
    <section className="overflow-hidden bg-white py-7 md:py-8">
      <div className="container mx-auto px-0">
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 px-4 text-center text-[9px] font-medium leading-none text-[#334155] md:text-[10px]">
            <span className="font-medium text-[#475569]">Excellent</span>

            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className="flex h-[14px] w-[14px] items-center justify-center rounded-[2px] bg-[#00B67A] text-white md:h-[15px] md:w-[15px]"
                >
                  <Star className="h-2 w-2 fill-current md:h-2.5 md:w-2.5" />
                </span>
              ))}
            </div>

            <span className="text-[#475569]">4.8 Out of 5 based on 56,714 reviews</span>
            <span className="font-semibold text-[#00B67A]">Trustpilot</span>
          </div>

          <h2 className="pt-5 font-sora text-[22px] font-semibold leading-none text-[#334155] md:text-[24px]">
            Our Partners
          </h2>
        </div>

        <div className="relative mt-7 w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent md:w-16" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent md:w-16" />

          <div className="partners-marquee group flex overflow-hidden">
            <div className="partners-track flex min-w-max items-center gap-12 pr-12 will-change-transform md:gap-16 md:pr-16">
              {loopedPartnerLogos.map((partner, index) => (
                <div
                  key={`${partner.src}-${index}`}
                  className="flex h-[34px] w-[88px] flex-shrink-0 items-center justify-center md:h-[40px] md:w-[112px]"
                >
                  <Image
                    src={partner.src}
                    alt={partner.alt}
                    width={160}
                    height={52}
                    className="h-auto max-h-[22px] w-auto max-w-full object-contain opacity-65 grayscale md:max-h-[26px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .partners-track {
          animation: partnerMarquee 30s linear infinite;
        }

        .group:hover .partners-track {
          animation-play-state: paused;
        }

        @keyframes partnerMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default OurPartners;
