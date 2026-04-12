import { Check } from "lucide-react";

const heroPoints = [
  "Boiler installation from the next working day*",
  "Finance options available, including 0% interest†",
  "We'll beat any like-for-like price*",
];

const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-primary">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] gap-6 md:gap-8 lg:gap-8">
          <div className="order-2 md:order-1 mx-auto w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(45,61,77,0.12)] md:p-8 lg:ml-10">
            <div className="max-w-[420px]">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-normal text-[#2D3D4D]">
                Save £110 off all boilers
              </h1>

              <p className="mt-4 max-w-[410px] desc">
                Use code <span className="font-semibold ">BOILERS110</span> to{" "}
                <span className="font-semibold ">save £110</span> on your
                fixed-price boiler quote, with finance options and next working
                day installation available.
              </p>

              <button className="mt-6 inline-flex h-12 items-center gap-2 rounded-[8px] bg-primary px-6 text-sm md:text-base leading-normal font-semibold text-[#2D3D4D] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#F3D13B]">
                Get your fixed price
                {/* <ChevronRight className="h-4 w-4" /> */}
              </button>

              <ul className="mt-6 space-y-2">
                {heroPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 desc">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A]">
                      <Check className="h-5 w-5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="order-1 md:order-2 mx-auto flex w-full max-w-[560px] items-center justify-center lg:justify-end ">
            <div className="relative w-full max-w-[520px] ">
              <video
                src="/assets/videos/hero_video.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-[420px] w-full object-cover md:h-[420px] lg:h-[456px] rounded-[12px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
