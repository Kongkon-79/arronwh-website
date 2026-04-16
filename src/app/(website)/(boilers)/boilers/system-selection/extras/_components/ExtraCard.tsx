"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExtraItem = {
  id: number;
  title: string;
  description: string;
  priceText: string;
  buttonText: string;
  buttonVariant: "green" | "dark";
  image: string;
};

export function ExtraCard({ item }: { item: ExtraItem }) {
  return (
    <div className="rounded-[6px] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex min-h-[220px] items-center justify-center rounded-[8px] bg-[#FBFCFD]">
        <Image
          src={item.image}
          alt={item.title}
          width={240}
          height={220}
          className="h-[170px] w-auto object-contain sm:h-[200px]"
        />
      </div>

      <div className="mt-5">
        <h3 className="text-[18px] sm:text-[20px] font-bold leading-tight text-[#2D3D4D]">
          {item.title}
        </h3>

        <p className="mt-3 min-h-[78px] text-[14px] sm:text-[15px] leading-7 text-[#2D3D4D]">
          {item.description}
        </p>

        <p className="mt-3 text-[26px] sm:text-[28px] font-bold text-[#2D3D4D]">
          {item.priceText}
        </p>

        <Button
          className={cn(
            "mt-6 h-[46px] w-full rounded-[6px] text-[15px] sm:text-[16px] font-medium",
            item.buttonVariant === "green"
              ? "bg-[#00A56F] text-white hover:bg-[#009562]"
              : "bg-[#2D3D4D] text-white hover:bg-[#253442]"
          )}
        >
          {item.buttonText}
          {item.buttonVariant === "dark" ? (
            <Check className="ml-2 h-4 w-4" />
          ) : null}
        </Button>
      </div>
    </div>
  );
}