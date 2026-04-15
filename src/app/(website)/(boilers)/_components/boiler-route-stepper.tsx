"use client";

import { MessageCircleQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BoilerRouteStepperProps = {
  activeStep: 1 | 2 | 3 | 4;
};

const routeSteps = [
  { id: 1 as const, label: "1. Property Overview", href: "/boilers/property-overview" },
  { id: 2 as const, label: "2. System Selection", href: "/boilers/system-selection" },
  { id: 3 as const, label: "3. Customer Details", href: "/boilers/customer-details" },
  { id: 4 as const, label: "4. Installation Booking", href: "/boilers/installation-booking" },
];

const BoilerRouteStepper = ({ activeStep }: BoilerRouteStepperProps) => {
  const visibleSteps =
    activeStep === 1 ? routeSteps : routeSteps.filter((step) => step.id >= 2);

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#DDE4EE] bg-white">
      <div className="grid h-[56px] grid-cols-[104px_1fr_90px] md:grid-cols-[126px_1fr_104px]">
        <div className="flex items-center justify-center border-r border-[#E7ECF3] bg-[#FBFCFE]">
          <Image
            src="/assets/images/logo.png"
            alt="Yolo Heat"
            width={72}
            height={28}
            className="h-5 w-auto object-contain"
          />
        </div>

        <div className="grid grid-cols-3 bg-white">
          {visibleSteps.map((step, index) => {
            const active = step.id === activeStep;
            const completed = step.id < activeStep;

            return (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  "relative flex items-center justify-center border-r border-[#E7ECF3] px-2 text-center text-[11px] font-semibold text-[#4D5A6A] transition md:text-[13px]",
                  active && "bg-primary text-[#2D3D4D]",
                  active && "rounded-r-[999px]",
                  completed && "bg-[#FFF8DA]",
                  index === visibleSteps.length - 1 && "border-r-0"
                )}
              >
                {step.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-1 border-l border-[#E7ECF3] bg-white text-[#5A6776] transition hover:bg-[#F8FAFC]"
        >
          <MessageCircleQuestion className="h-4 w-4" />
          <span className="text-sm font-medium">Help</span>
          <span className="hidden text-xs text-[#7E8996] md:inline">2:40</span>
        </button>
      </div>
    </div>
  );
};

export default BoilerRouteStepper;
