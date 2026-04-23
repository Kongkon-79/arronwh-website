"use client";

import { MessageCircleQuestion, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HelpContainer from "@/app/(website)/helps/_components.tsx/help-container";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BoilerRouteStepperProps = {
  activeStep: 1 | 2 | 3 | 4;
};

const routeSteps = [
  {
    id: 1 as const,
    label: "1. Property Overview",
    href: "/boilers/property-overview",
  },
  {
    id: 2 as const,
    label: "2. System Selection",
    href: "/boilers/system-selection",
  },
  {
    id: 3 as const,
    label: "3. Customer Details",
    href: "/boilers/customer-details",
  },
  {
    id: 4 as const,
    label: "4. Installation Booking",
    href: "/boilers/installation-booking",
  },
];

const BoilerRouteStepper = ({ activeStep }: BoilerRouteStepperProps) => {
  const router = useRouter();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-full border border-[#DDE4EE] bg-white shadow-sm ">
      <div className="flex !h-[56px] items-stretch md:h-[64px] ">
        {/* Left Section: Back Button + Logo */}
       <div className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary ">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-full border border-[#2D3D4D] p-3 transition hover:bg-black/5 "
              >
                <ArrowLeft className="h-7 w-7 text-[#2D3D4D]" />
              </button>
              <Link href="/">
                <Image
                  src="/assets/images/multi_step_logo.png"
                  alt="Multi Step Logo"
                  width={332}
                  height={332}
                  className="h-[36px] w-[126px] object-contain"
                />
              </Link>
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
                  !isYellow && "bg-white",
                )}
              >
                {step.label}
              </Link>
            );
          })}
        </div>

        <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 border-l border-[#E7ECF3] px-3 text-lg md:text-xl font-normal text-[#2D3D4D] leading-normal transition hover:bg-[#F8FAFC]"
            >
              <MessageCircleQuestion className="h-6 w-6" />
              Help
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full border-l-0 p-0 sm:max-w-[530px] [&>button]:hidden"
          >
            <HelpContainer embedded onClose={() => setIsHelpOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default BoilerRouteStepper;
