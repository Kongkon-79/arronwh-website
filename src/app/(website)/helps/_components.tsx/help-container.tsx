"use client";

import { Phone, X } from "lucide-react";
import { useState } from "react";

type HelpFaqItem = {
  question: string;
  answers: string[];
};

const FAQ_ITEMS: HelpFaqItem[] = [
  {
    question: "Can I get a quote from BOXT?",
    answers: [
      "Yes. Just click \"Save Quote\" on the checkout page and we'll email a quote over to you.",
      "Don't forget, with the BOXT Price Promise we'll beat any like-for-like quote, or give you £50 if we can't.",
    ],
  },
  {
    question: "What if my preferred installation date isn't available?",
    answers: [
      "If you need a specific date for your install and it isn't available, get in touch and we'll see what we can do.",
      "If you are flexible on install date, don't forget that we offer discounts on days where we are less busy.",
    ],
  },
  {
    question: "What payment methods can I use?",
    answers: [
      "You can pay by card, or spread the cost with our finance plans.",
      "We offer 0% finance on selected boilers.",
    ],
  },
  {
    question: "Why does it sound too good to be true?",
    answers: [
      "Our award winning technology means we are able to streamline our operations, cut out the middle man and pass these savings on to you.",
    ],
  },
  {
    question: "Are BOXT installers trained and Gas Safe registered?",
    answers: [
      "Yes. All of our installers are professional, experienced central heating engineers with Gas Safe certification.",
    ],
  },
];

const FAQ_CATEGORIES = [
  "Buying with BOXT",
  "Delivery and installation",
  "After your boiler is installed",
] as const;

type HelpContainerProps = {
  embedded?: boolean;
  onClose?: () => void;
};

const HelpContainer = ({ embedded = false, onClose }: HelpContainerProps) => {
  const [openCallback, setOpenCallback] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<(typeof FAQ_CATEGORIES)[number]>(
    "After your boiler is installed"
  );

  const panelContent = (
    <div className="w-full bg-white px-4 py-6 md:px-6 md:py-7">
      <div className="mx-auto w-full max-w-[560px]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-[32px] font-semibold leading-none text-[#24374B]">Need some help?</h2>
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label="Close help panel"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00A870] text-white"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="border-b border-[#8FA8C6] pb-3">
              <button
                type="button"
                onClick={() => setOpenCallback(!openCallback)}
                className="flex w-full items-center gap-2 text-left text-[13px] font-semibold text-[#21384A]"
              >
                <span className="text-[22px] font-light leading-none text-[#EF4E47]">
                  {openCallback ? "-" : "+"}
                </span>
                <span>Request a callback</span>
                <Phone size={12} className="ml-1" />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  openCallback ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <div className="space-y-3 rounded-md bg-[#E4F3FD] p-4">
                    <div>
                      <label htmlFor="help-topic" className="mb-1 block text-xs text-[#4E6478]">
                        What do you need help with?
                      </label>
                      <select
                        id="help-topic"
                        className="h-9 w-full border border-[#C8D3DE] bg-white px-3 text-[14px] text-[#2D3D4D] outline-none"
                        defaultValue="Choosing a product"
                      >
                        <option>Choosing a product</option>
                        <option>Installation support</option>
                        <option>Payments and finance</option>
                        <option>Aftercare</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="help-name" className="mb-1 block text-xs text-[#4E6478]">
                        Your name
                      </label>
                      <input
                        id="help-name"
                        type="text"
                        className="h-9 w-full border border-[#C8D3DE] bg-white px-3 text-[14px] text-[#2D3D4D] outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="help-mobile" className="mb-1 block text-xs text-[#4E6478]">
                        Mobile number
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] leading-none">🇬🇧</span>
                        <input
                          id="help-mobile"
                          type="tel"
                          className="h-9 w-full border border-[#C8D3DE] bg-white px-3 text-[14px] text-[#2D3D4D] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-1 flex h-10 w-full items-center justify-center gap-2 bg-[#E8E8E8] text-[16px] font-medium text-[#7A7A7A]"
                    >
                      Give me a call
                      <Phone size={14} />
                    </button>

                    <p className="text-[11px] text-[#4E6478]">
                      Our office hours are Mon-Fri 8am-8pm, Sat & Sun 9am-3pm
                    </p>
                    <p className="-mt-2 text-[11px] text-[#4E6478]">We aim to call within 1 hour</p>

                    <div className="border-t border-[#ADC9DD]" />

                    <p className="text-[13px] text-[#2D3D4D]">
                      Urgent issue? Call for free{" "}
                      <a href="tel:08001937777" className="text-[#EF3E37] underline">
                        0800 193 7777
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="mb-3 text-[20px] font-semibold leading-none text-[#24374B]">Frequently asked questions</h3>

              <div className="relative mb-1 border-b border-[#8FA8C6] pb-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className={`flex h-8 w-full items-center justify-between bg-[#F3F3F3] px-3 text-left text-[13px] text-[#24374B] ${
                    isCategoryOpen ? "border border-[#0FA67A]" : ""
                  }`}
                >
                  <span>{selectedCategory}</span>
                  <span className="text-[13px]">{isCategoryOpen ? "⌃" : "⌄"}</span>
                </button>

                {isCategoryOpen ? (
                  <div className="absolute left-0 right-0 top-8 z-20 border border-[#0FA67A] border-t-0 bg-white">
                    {FAQ_CATEGORIES.map((category) => {
                      const isSelected = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsCategoryOpen(false);
                          }}
                          className={`block w-full px-3 py-[6px] text-left text-[13px] leading-none ${
                            isSelected ? "bg-[#1E63C8] text-white" : "bg-white text-[#111827]"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={item.question} className="border-b border-[#8FA8C6] py-2">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start gap-2 text-left text-[13px] font-semibold leading-snug text-[#24374B]"
                    >
                      <span className="pt-[1px] text-[22px] font-light leading-none text-[#EF4E47]">
                        {isOpen ? "-" : "+"}
                      </span>
                      <span>{item.question}</span>
                    </button>

                    <div
                      className={`grid overflow-hidden pl-6 transition-all duration-300 ${
                        isOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 space-y-2 text-[12px] leading-relaxed text-[#2D3D4D]">
                        {item.answers.map((answer) => (
                          <p key={answer}>{answer}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
  );

  if (embedded) {
    return <div className="h-full overflow-y-auto bg-white">{panelContent}</div>;
  }

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="flex min-h-screen w-full">
        <div className="hidden flex-1 bg-[#95A1AF]/85 md:block" />
        <div className="w-full md:w-[48%]">{panelContent}</div>
      </div>
    </section>
  );
};

export default HelpContainer;
