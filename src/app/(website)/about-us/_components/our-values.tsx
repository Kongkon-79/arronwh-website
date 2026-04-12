import { ArrowRight, Banknote, Clock3, ShieldCheck, Wrench } from "lucide-react";

type ValueItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
};

const values: ValueItem[] = [
  {
    id: 1,
    title: "Customer First",
    description:
      "We focus on delivering the best experience, ensuring every customer gets the right solution for their home.",
    icon: ShieldCheck,
    iconBg: "bg-[#FFDE59]",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "Transparent Pricing",
    description:
      "We provide clear, upfront pricing with no hidden costs, so you always know exactly what you're paying for.",
    icon: Banknote,
    iconBg: "bg-[#00A56F]",
    iconColor: "text-white",
  },
  {
    id: 3,
    title: "Fast",
    description:
      "We move quickly without compromising quality, making the entire process smooth and efficient.",
    icon: Clock3,
    iconBg: "bg-white",
    iconColor: "text-[#2F4358]",
  },
  {
    id: 4,
    title: "Installation",
    description:
      "Our certified engineers ensure professional, safe, and reliable installations every time.",
    icon: Wrench,
    iconBg: "bg-[#00A56F]",
    iconColor: "text-white",
  },
];

export default function OurValues() {
  return (
    <section className="bg-[#2D3D4D] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-normal text-white ">
            Our Values
          </h2>

          <p className="mt-3 text-sm md:text-base font-normal leading-normal text-white">
            We always put our customers first, delivering high-quality
            installations with transparent pricing and a fast, reliable service
            you can trust.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-[14px] border border-dashed border-white bg-transparent px-5 py-6 text-center"
              >
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${item.iconColor}`} strokeWidth={2.2} />
                </div>

                <h3 className="mt-4 text-base md:text-lg font-bold leading-normal text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm md:text-base font-normal leading-normal text-white">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[8px] bg-primary px-6 py-3 text-sm md:text-base font-medium text-[#2D3D4D] leading-normal transition hover:brightness-95"
          >
            Explore our services 
            <span aria-hidden="true"><ArrowRight /></span>
          </button>
        </div>
      </div>
    </section>
  );
}