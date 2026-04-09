import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";

const heroPoints = [
  "Boiler installation from the next working day*",
  "Finance options available, including 0% interest†",
  "We'll beat any like-for-like price*",
];

const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-primary">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] lg:gap-6">
          <div className="mx-auto w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(45,61,77,0.12)] md:p-8 lg:ml-10">
            <div className="max-w-[420px]">
              <h1 className="font-sora text-[34px] font-semibold leading-[1.05] text-[#334155] md:text-[46px] lg:text-[52px]">
                Save £110 off all boilers
              </h1>

              <p className="mt-4 max-w-[410px] text-sm leading-6 text-[#475569] md:text-base">
                Use code <span className="font-semibold text-[#1E293B]">BOILERS110</span> to save £110 on your fixed-price boiler quote, with finance options and next working day installation available.
              </p>

              <button className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-[#233043] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#F3D13B]">
                Get your fixed price
                <ChevronRight className="h-4 w-4" />
              </button>

              <ul className="mt-6 space-y-3">
                {heroPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-6 text-[#334155] md:text-[15px]"
                  >
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A]">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[560px] items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[520px]">
              <Image
                src="/assets/images/hero_image.png"
                alt="Boiler discount promotion"
                width={1200}
                height={900}
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
