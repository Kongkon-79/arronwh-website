import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="bg-[#f3f3f3] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 text-center sm:mb-12 lg:mb-14">
          <h2 className="text-[26px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#24364B] sm:text-[34px] md:text-[42px] lg:text-[48px]">
            We’re on a mission to simplify home heating.
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-[13px] leading-6 text-[#5D6B7A] sm:text-[14px] md:text-[15px]">
            No confusing quotes · No hidden cost · Everything online, fast &
            transparent
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-12 xl:gap-16">
          <div className="max-w-[500px]">
            <h3 className="mb-5 text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#24364B] sm:text-[32px] md:text-[36px]">
              Our story
            </h3>

            <div className="space-y-4 text-[14px] leading-7 text-[#445468] sm:text-[15px] md:text-[16px] md:leading-8">
              <p>
                When you decide to upgrade your boiler, it shouldn’t feel
                complicated or stressful — but for many homeowners, it still
                does. From unclear pricing to long waiting times, the
                traditional process often creates more problems than solutions.
              </p>

              <p>At YOUHEAT, we set out to change that.</p>

              <p>
                We built a smarter, simpler way to buy and install boilers —
                one that puts transparency, speed, and customer experience
                first. By bringing everything online, we’ve made it possible to
                get a fixed price, choose your system, and book installation in
                just a few steps.
              </p>

              <p>
                No hidden costs. No confusion. Just a straightforward, reliable
                service designed around you.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[14px] sm:rounded-[16px] lg:rounded-[18px]">
            <div className="relative aspect-[16/10] w-full md:aspect-[16/9] lg:aspect-[1.58/1]">
              <Image
                src="/assets/images/about_hero.png"
                alt="Engineer working on home heating service"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}