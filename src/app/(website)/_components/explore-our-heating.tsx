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
  navy: "bg-[#334155] text-white",
  yellow: "bg-[#FFD95A] text-[#1E293B]",
  light: "bg-[#F8FAFC] text-[#1E293B]",
};

const ExploreOurHeating = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[1030px]">
          <div className="mx-auto max-w-[520px] text-center">
            <h2 className="font-sora text-[24px] font-semibold leading-tight text-[#334155] md:text-[31px]">
              Explore our heating & energy solutions
            </h2>
            <p className="mt-2 text-[10px] leading-4 text-[#64748B] md:text-[11px]">
              Get instant prices for boilers, air conditioning, solar, and more
              all tailored to your home in minutes.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {exploreCards.map((card, index) => {
              const isLarge = card.variant === "large";

              return (
                <article
                  key={`${card.title}-${index}`}
                  className={`overflow-hidden rounded-[10px] ${themeClasses[card.theme]} ${
                    isLarge
                      ? "flex min-h-[318px] flex-col p-4 md:p-5"
                      : "grid min-h-[148px] grid-cols-[96px_minmax(0,1fr)] gap-4 p-4 md:grid-cols-[120px_minmax(0,1fr)] md:gap-5"
                  }`}
                >
                  <div className={isLarge ? "flex h-[124px] items-center justify-center md:h-[142px]" : "flex h-full items-center justify-center"}>
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={500}
                      height={360}
                      className={`h-auto w-full object-contain ${
                        isLarge ? "max-h-[128px] max-w-[230px] md:max-h-[142px] md:max-w-[250px]" : "max-h-[112px] max-w-[100px] md:max-h-[118px] md:max-w-[120px]"
                      }`}
                    />
                  </div>

                  <div className={isLarge ? "mt-2 flex h-full flex-col" : "flex h-full flex-col justify-between"}>
                    <div>
                      <p
                        className={`text-[8px] font-semibold uppercase tracking-[0.16em] ${
                          card.theme === "navy" ? "text-[#FFD95A]" : "text-[#EAB308]"
                        }`}
                      >
                        {card.badge}
                      </p>

                      <h3
                        className={`mt-2 font-sora font-semibold leading-[1.12] ${
                          isLarge
                            ? "max-w-[350px] text-[17px] md:text-[19px]"
                            : "max-w-[210px] text-[15px] md:text-[16px]"
                        }`}
                      >
                        {card.title}
                      </h3>

                      <p
                        className={`mt-2 ${
                          isLarge ? "max-w-[400px]" : "max-w-[255px]"
                        } text-[9px] leading-[1.45] ${
                          card.theme === "navy" ? "text-[#E2E8F0]" : "text-[#475569]"
                        }`}
                      >
                        {card.description}
                      </p>
                    </div>

                    <div className={isLarge ? "mt-auto pt-4" : "pt-3"}>
                      <button
                        type="button"
                        className={`flex h-8 w-full items-center justify-center rounded-[5px] text-[9px] font-semibold transition-colors ${
                          card.theme === "navy"
                            ? "bg-[#FFD95A] text-[#243244] hover:bg-[#F3CF43]"
                            : "bg-[#0EA76B] text-white hover:bg-[#0A965F]"
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
