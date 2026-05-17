import React from "react";
import { Handshake, MousePointerClick, SquarePen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

type Step = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    id: "question",
    title: "You",
    description:
      "enter the email address used for your original order so we can find your account details.",
    icon: SquarePen,
  },
  {
    id: "choose",
    title: "Choose",
    description:
      "the product you’d like to recommend to your friend or family member. brand-new boiler or heat pump.",
    icon: MousePointerClick,
  },
  {
    id: "share",
    title: "Share",
    description:
      "your unique referral link they’ll get money off their install, and once their install is complete, we’ll send you cash.",
    icon: Handshake,
  },
];

const ReferHowItWorks = () => {
  return (
    <section className="relative bg-[#dfe1e3] px-4 pb-14 pt-8 sm:px-6 md:pt-10">
      <div className="absolute left-4 top-8 hidden text-[#20242b] md:block">
        <Image
          src="/assets/images/robot.png"
          alt="robot"
          width={500}
          height={524}
          className="object-contain w-full h-[100px] md:h-[110px]"
        />
      </div>

      <div className="container">
        <h2 className="text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-none tracking-[-0.02em] text-[#1a2029]">
          How it works
        </h2>

        <div className="mt-6 md:mt-8 lg:mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.id}
                className="rounded-[20px] bg-[#eaebec] p-5 md:p-8"
              >
                <div className="mb-3 flex items-center text-black">
                  {index === 0 ? (
                    <span className="text-[56px] font-semibold leading-none">
                      ?
                    </span>
                  ) : (
                    <Icon
                      className="h-12 md:h-14 w-12 md:w-14"
                      strokeWidth={2.5}
                    />
                  )}
                </div>

                <p className="font-bold leading-none tracking-[-0.01em] text-[#1f242d] pt-1">
                  {step.title}{" "}
                  <span className="font-normal text-sm md:text-base xl:text-lg leading-none text-[#2c323c]">
                    {step.description}
                  </span>
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReferHowItWorks;
