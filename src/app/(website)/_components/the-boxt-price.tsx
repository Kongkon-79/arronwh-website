import Image from "next/image";

const TheBoxtPrice = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto overflow-hidden rounded-[2px] border border-[#D7DEE7] bg-[#334155]">
          <div className="grid items-center gap-10 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-16 lg:py-16">
            <div className="max-w-[470px]">
              <h2 className="font-sora text-[30px] font-semibold leading-[1.12] text-white md:text-[40px]">
                The BOXT Price Match Promise
              </h2>

              <p className="mt-5 max-w-[520px] text-[13px] leading-[1.45] text-[#E2E8F0] md:text-[14px]">
                We enjoy saving you time and money, that&apos;s why we regularly
                review our prices. In fact, we guarantee to beat any like-for-like
                boiler installation quote by £50, so you can shop with peace of
                mind.
              </p>

              <button
                type="button"
                className="mt-8 inline-flex h-[42px] items-center justify-center rounded-[6px] bg-white px-6 text-[13px] font-medium text-[#334155] transition-colors hover:bg-[#F8FAFC]"
              >
                Find Out more
              </button>
            </div>

            <div className="mx-auto flex w-full justify-center lg:justify-end">
              <div className="relative w-full max-w-[260px] md:max-w-[300px]">
                <Image
                  src="/assets/images/the-boxl-price.png"
                  alt="BOXT price match promise boiler graphic"
                  width={800}
                  height={800}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheBoxtPrice;
