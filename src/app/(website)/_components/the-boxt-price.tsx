"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  BOXT_QUERY_KEY,
  fetchBoxtData,
} from "./the-boxt-price-data-type";

const TheBoxtPrice = () => {
  const { data, isLoading } = useQuery({
    queryKey: BOXT_QUERY_KEY,
    queryFn: fetchBoxtData,
  });

  const backgroundColor = data?.backgroundcolor?.trim() || "#0A4229";
  const textColor = data?.textcolor?.trim() || "#FFFFFF";

  if (isLoading) {
    return (
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto overflow-hidden rounded-[12px] bg-[#0A4229]">
            <div className="grid items-center gap-10 px-6 py-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-16 animate-pulse">
              <div className="max-w-[470px]">
                <div className="h-8 w-4/5 rounded bg-[#2E5D48]" />
                <div className="mt-3 h-4 w-full rounded bg-[#2E5D48]" />
                <div className="mt-2 h-4 w-11/12 rounded bg-[#2E5D48]" />
                <div className="mt-2 h-4 w-4/5 rounded bg-[#2E5D48]" />
              </div>

              <div className="mx-auto flex w-full justify-center lg:justify-end">
                <div className="relative h-[300px] w-full max-w-[260px] rounded bg-[#2E5D48] md:h-[350px] md:max-w-[300px] lg:h-[400px]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div
          className="mx-auto overflow-hidden rounded-[12px]"
          style={{ backgroundColor }}
        >
          <div className="grid items-center gap-10 px-6 py-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-16">
            <div className="max-w-[470px]">
              <h2
                className="text-xl md:text-2xl lg:text-3xl font-bold leading-normal"
                style={{ color: textColor }}
              >
                {data.title}
              </h2>

              <p
                className="mt-3 text-sm md:text-base font-normal leading-normal"
                style={{ color: textColor }}
              >
                {data.description}
              </p>

              {/* <button
                type="button"
                className="mt-5 inline-flex h-[42px] items-center justify-center rounded-[8px] bg-white px-6 text-[13px] font-medium text-[#2D3D4D] leading-normal transition-colors hover:bg-[#F8FAFC]"
              >
                Find Out more
              </button> */}
            </div>

            <div className="mx-auto flex w-full justify-center lg:justify-end">
              <div className="relative w-full max-w-[260px] md:max-w-[300px]">
                <Image
                  src={data.image}
                  alt={data.title}
                  width={800}
                  height={800}
                  className="h-[300px] md:h-[350px] lg:h-[400px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheBoxtPrice;
