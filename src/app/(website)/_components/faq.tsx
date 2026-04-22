"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FAQ_QUERY_KEY, fetchFaqs } from "./faq-data-type";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const {
    data: faqItems = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: FAQ_QUERY_KEY,
    queryFn: fetchFaqs,
  });

  return (
    <section className="bg-white py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4 pb-4 md:pb-5 lg:pb-6">
        <div className="">
          <div className="text-center">
            <h2 className="heading">
              Most frequently asked questions
            </h2>
          </div>

          <div className="mt-8 space-y-3 md:mt-10">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse border-b border-[#2D3D4D] pb-2">
                    <div className="h-6 w-4/5 rounded bg-[#EEF2F5]" />
                    <div className="mt-2 h-4 w-full rounded bg-[#EEF2F5]" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-lg border border-[#F2B8B5] bg-[#FFF5F4] p-4 text-[#7A2D2A]">
                <p className="text-sm md:text-base">
                  {error instanceof Error
                    ? error.message
                    : "Unable to load FAQs right now. Please try again."}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetching ? "Retrying..." : "Try again"}
                </button>
              </div>
            ) : faqItems.length === 0 ? (
              <div className="rounded-lg border border-[#DDE4EC] bg-[#F8FAFC] p-4 text-sm md:text-base text-[#2D3D4D]">
                No FAQs found at the moment.
              </div>
            ) : faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={item._id || item.question} className="border-b border-[#2D3D4D] pb-2">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-start justify-between gap-6 py-2 text-left"
                  >
                    <span className="text-base md:text-lg font-medium leading-normal text-[#2D3D4D]">
                      {item.question}
                    </span>
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center text-[20px] font-light leading-none text-primary">
                      {isOpen ?  <Minus /> : <Plus />}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm md:text-base font-normal leading-normal text-[#2D3D4D]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
