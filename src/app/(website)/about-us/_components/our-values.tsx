import { Banknote, Clock3, ShieldCheck, Wrench } from "lucide-react";

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
    iconBg: "bg-[#F2C94C]",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "Transparent Pricing",
    description:
      "We provide clear, upfront pricing with no hidden costs, so you always know exactly what you're paying for.",
    icon: Banknote,
    iconBg: "bg-[#27C087]",
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
    iconBg: "bg-[#27C087]",
    iconColor: "text-white",
  },
];

export default function OurValues() {
  return (
    <section className="bg-[#2F4358] px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="text-center">
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[32px] md:text-[36px]">
            Our Values
          </h2>

          <p className="mx-auto mt-3 max-w-[760px] text-[12px] leading-6 text-white/80 sm:text-[13px] md:text-[14px]">
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
                className="rounded-[14px] border border-dashed border-white/40 bg-transparent px-5 py-6 text-center"
              >
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${item.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${item.iconColor}`} strokeWidth={2.2} />
                </div>

                <h3 className="mt-4 text-[18px] font-semibold leading-tight text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-white/80">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#F2C94C] px-6 py-3 text-[14px] font-medium text-[#24364B] transition hover:brightness-95"
          >
            Explore our services
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}