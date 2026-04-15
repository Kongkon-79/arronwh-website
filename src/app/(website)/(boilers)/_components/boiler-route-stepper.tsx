"use client";

import { MessageCircleQuestion, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // Find previous step for back button navigation
  const prevStep = routeSteps.find((s) => s.id === activeStep - 1);

  return (
    <div className="overflow-hidden rounded-full border border-[#DDE4EE] bg-white shadow-sm">
      <div className="flex h-[56px] items-stretch md:h-[64px]">
        {/* Left Section: Back Button + Logo */}
        <div 
          className={cn(
            "flex items-center gap-2 border-r border-[#E7ECF3] px-3 md:gap-4 md:px-6 transition-colors duration-300 bg-primary"
          )}
        >
          <button 
            type="button"
            onClick={() => prevStep ? router.push(prevStep.href) : router.back()}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 transition hover:bg-black/5 md:h-10 md:w-10"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-[#2D3D4D]" />
          </button>
          <Image
            src="/assets/images/logo.png"
            alt="Yolo Heat"
            width={120}
            height={40}
            className="h-4 w-auto object-contain md:h-8"
          />
        </div>

        {/* Steps Section */}
        <div className="flex flex-1 items-stretch bg-white">
          {routeSteps.map((step) => {
            const active = step.id === activeStep;
            const completed = step.id < activeStep;
            const isYellow = active || completed;
            const isLastYellow = active;

            return (
              <Link
                key={step.id}
                href={step.href}
                className={cn(
                  "relative flex flex-1 items-center justify-center px-1 text-center text-[9px] font-semibold text-[#4D5A6A] transition md:px-4 md:text-[13px] last:border-r-0 border-r border-[#E7ECF3]",
                  isYellow && "bg-primary text-[#2D3D4D] border-transparent",
                  isLastYellow && "rounded-r-full z-10",
                  !isYellow && "bg-white"
                )}
              >
                {step.label}
              </Link>
            );
          })}
        </div>

        {/* Help Button */}
        <div className="flex items-center px-3 md:px-8 border-l border-[#E7ECF3] bg-white">
          <button
            type="button"
            className="flex items-center gap-1 md:gap-2 text-[#5A6776] transition hover:text-[#2D3D4D]"
          >
            <MessageCircleQuestion className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm font-semibold">Help</span>
            <span className="hidden text-xs text-[#7E8996] md:inline font-normal">2:40</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoilerRouteStepper;
