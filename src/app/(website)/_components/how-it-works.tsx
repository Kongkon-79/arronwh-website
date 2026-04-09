import Image from "next/image";

type WorkStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const workSteps: WorkStep[] = [
  {
    id: "1",
    title: "Discover",
    description:
      "Answer a few quick questions about your home and get a fixed-price quote in minutes.",
    image: "/assets/images/hiw1.png",
  },
  {
    id: "2",
    title: "Choose",
    description:
      "Compare options, features, and prices to find the right solution for your home and budget.",
    image: "/assets/images/hiw2.png",
  },
  {
    id: "3",
    title: "Install",
    description:
      "Book your installation online and get it installed by a certified engineer at a time that suits you.",
    image: "/assets/images/hiw3.png",
  },
  {
    id: "4",
    title: "Maintain",
    description:
      "Track your service, manage bookings, and keep everything running smoothly with ongoing support.",
    image: "/assets/images/hiw4.png",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-[560px] text-center">
            <h2 className="font-sora text-[24px] font-semibold text-[#334155] md:text-[38px]">
              How Dose YOLO HEAT Work?
            </h2>
            <p className="mt-3 text-[11px] leading-5 text-[#64748B] md:text-[13px]">
              Get your quote, book your service, and install all in a few simple steps.
            </p>
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {workSteps.map((step, index) => (
                <article key={step.id} className="relative">
                  <div className="mx-auto w-full max-w-[240px]">
                    <div className="overflow-hidden rounded-[12px] border border-[#EAEFF5] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={600}
                        height={420}
                        className="h-[178px] w-full object-cover md:h-[188px]"
                      />
                    </div>

                    <div className="relative mt-7">
                      {index !== workSteps.length - 1 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+2rem)] border-t border-dashed border-[#F4D03F] lg:block" />
                      )}

                      <div className="relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary font-sora text-[13px] font-semibold text-[#334155] shadow-[0_6px_14px_rgba(255,217,90,0.4)]">
                        {step.id}
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="font-sora text-[18px] font-semibold text-[#334155]">
                        {step.title}
                      </h3>
                      <p className="mx-auto mt-3 max-w-[220px] text-[12px] leading-[1.45] text-[#475569] md:text-[13px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
