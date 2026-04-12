import Image from "next/image";

type ExploreCard = {
  badge: string;
  title: string;
  description: string;
  theme: "navy" | "yellow" | "light";
  variant: "large" | "small";
  image: string;
};

const exploreCards: ExploreCard[] = [
  {
    badge: "YOLO HEAT LIFE",
    title: "All-inclusive worry-free boiler plan",
    description:
      "New boiler + annual servicing + unlimited repairs + replacement from only £13.31 a month.",
    theme: "navy",
    variant: "large",
    image: "/assets/images/eoh/eoh1.png",
  },
  {
    badge: "BOILERS",
    title: "Save £110 on a new boiler",
    description:
      "Use code BOILERS321 to get £110 off new boiler installation fees.*",
    theme: "yellow",
    variant: "large",
    image: "/assets/images/eoh/eoh2.png",
  },
  {
    badge: "BOILERS",
    title: "Find the right boiler for your home",
    description:
      "Compare the best boiler options tailored to your home size, usage, and budget. Get the perfect fit with efficient performance, trusted brands, and fixed-price installation.",
    theme: "light",
    variant: "small",
    image: "/assets/images/eoh/eoh3.png",
  },
  {
    badge: "BOILERS",
    title: "New boiler installation",
    description:
      "Get a brand-new, energy-efficient boiler installed by certified engineers. Enjoy reliable heating, lower energy bills, and a smooth installation process.",
    theme: "light",
    variant: "small",
    image: "/assets/images/eoh/eoh4.png",
  },
  {
    badge: "BOILERS",
    title: "Find the right boiler for your home",
    description:
      "Easily discover the ideal boiler for your home with smart recommendations based on your needs. Compare options, understand costs, and choose in confidence.",
    theme: "light",
    variant: "small",
    image: "/assets/images/eoh/eoh5.png",
  },
  {
    badge: "BOILERS",
    title: "Upgrade your old boiler",
    description:
      "Replace your old, inefficient boiler with a modern energy-efficient system. Enjoy lower energy bills, better performance, and reliable heating with less hassle.",
    theme: "light",
    variant: "small",
    image: "/assets/images/eoh/eoh6.png",
  },
];

const themeClasses = {
  navy: "bg-[#2D3D4D] text-white",
  yellow: "bg-[#FFDE59] text-[#2D3D4D]",
  light: "bg-[#F0F3F6] text-[#2D3D4D]",
};

const ExploreOurHeating = () => {
  return (
    <section id="heating" className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="">
          <div className="pb-4">
            <h2 className="heading text-center">
              Explore our heating & energy solutions
            </h2>
            <p className="desc text-center mt-3">
              Get instant prices for boilers, air conditioning, solar, and more
              all tailored to your home in minutes.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:gap-5 lg:gap-6 md:grid-cols-2">
            {exploreCards?.map((card, index) => {
              const isLarge = card.variant === "large";

              return (
                <article
                  key={`${card.title}-${index}`}
                  className={`overflow-hidden rounded-[24px] ${themeClasses[card.theme]} ${
                    isLarge
                      ? "flex min-h-[318px] flex-col p-4 md:p-5 "
                      : "grid min-h-[148px] grid-cols-[96px_minmax(0,1fr)] gap-4 md:gap-5 lg:gap-6 p-4 md:grid-cols-[120px_minmax(0,1fr)] "
                  }`}
                >
                  <div className={isLarge ? "flex h-[270px] items-center justify-center" : "flex h-[250px] items-center justify-center"}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={500}
                      height={360}
                      className={`object-contain w-[300px] h-[250px] `}
                    />
                  </div>

                  <div className={isLarge ? "mt-2 flex h-full flex-col" : "flex h-full flex-col justify-between"}>
                    <div>
                      <p
                        className={`text-sm md:text-base font-medium leading-normal uppercase tracking-[0.16em] ${
                          card.theme === "yellow" ? "text-[#2D3D4D]" : "text-[#FFDE59]"
                        }`}
                      >
                        {card.badge}
                      </p>

                      <h3
                        className="mt-2 font-bold leading-normal text-xl md:text-2xl lg:text-3xl">
                        {card.title}
                      </h3>

                      <p
                        className={`mt-2 ${
                          isLarge ? "max-w-[400px]" : "max-w-[255px]"
                        } text-sm md:text-base font-normal leading-normal ${
                          card.theme === "navy" ? "text-white" : "text-[#2D3D4D]"
                        }`}
                      >
                        {card.description}
                      </p>
                    </div>

                    <div className={isLarge ? "mt-auto pt-4" : "pt-3"}>
                      <button
                        type="button"
                        className={`flex h-10 w-full items-center justify-center rounded-[8px] text-sm md:text-base font-medium leading-normal transition-colors ${
                          card.theme === "navy"
                            ? "bg-primary text-[#2D3D4D] hover:bg-[#F3CF43]"
                            : "bg-[#00A56F] text-white hover:bg-[#0A965F]"
                        }`}
                      >
                        Get a fixed price
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreOurHeating;
