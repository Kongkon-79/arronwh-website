import Image from "next/image";

const TheBoxtPrice = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto overflow-hidden rounded-[12px] bg-[#2D3D4D]">
          <div className="grid items-center gap-10 px-6 py-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-16">
            <div className="max-w-[470px]">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-normal text-white">
                The BOXT Price Match Promise
              </h2>

              <p className="mt-3 text-white text-sm md:text-base font-normal leading-normal">
                We enjoy saving you time and money, that&apos;s why we regularly
                review our prices. In fact, we guarantee to beat any like-for-like
                boiler installation quote by £50, so you can shop with peace of
                mind.
              </p>

              {/* <button
                type="button"
                className="mt-5 inline-flex h-[42px] items-center justify-center rounded-[8px] bg-white px-6 text-[13px] font-medium text-[#2D3D4D] leading-normal transition-colors hover:bg-[#F8FAFC]"
              >
                Find Out more
              </button> */}
            </div>

            <div className="mx-auto flex w-full justify-center lg:justify-end">
              <div className="relative w-full max-w-[260px] md:max-w-[300px]">
                <Image
                  src="/assets/images/the-boxl-price.png"
                  alt="BOXT price match promise boiler graphic"
                  width={800}
                  height={800}
                  className="h-[300px] md:h-[350px] lg:h-[400px] w-full object-cover"
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
