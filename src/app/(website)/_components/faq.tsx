"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Are yolo heat installers trained and Gas Safe registered?",
    answer:
      "Yes, all Yolo Heat installers are fully trained and Gas Safe registered.",
  },
  {
    question: "What services do Yolo heat installers provide?",
    answer:
      "Yolo Heat installers offer installation, maintenance, and repair services for heating systems.",
  },
  {
    question: "How can I book a Yolo heat installation service?",
    answer:
      "You can book a service through our website or by calling our customer service.",
  },
  {
    question: "What types of heating systems do you install?",
    answer:
      "We install various heating systems including combi boilers, conventional boilers, and underfloor heating.",
  },
  {
    question: "Do you offer emergency heating services?",
    answer:
      "Yes, we provide emergency heating services to ensure your home stays warm.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={item.question} className="border-b border-[2D3D4D] pb-2">
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
