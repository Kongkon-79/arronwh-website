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
    <section id="how-it-works" className="bg-white py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[560px] text-center">
            <h2 className="heading">
              How Dose YOLO HEAT Work?
            </h2>
            <p className="desc mt-3">
              Get your quote, book your service, and install all in a few simple steps.
            </p>
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {workSteps.map((step, index) => (
                <article key={step.id} className="relative">
                  <div className="mx-auto w-full max-w-[280px]">
                    <div className="overflow-hidden rounded-[16px]">
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={600}
                        height={420}
                        className="h-[300px] w-[300px] object-contain "
                      />
                    </div>

                    <div className="relative mt-7">
                      {index !== workSteps.length - 1 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+5rem)] border-t border border-primary lg:block" />
                      )}

                      <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-base md:text-lg font-bold text-white">
                        {step.id}
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#2D3D4D] leading-normal">
                        {step.title}
                      </h3>
                      <p className="desc">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};

export default HowItWorks;
