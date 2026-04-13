"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import BoilerFrameFooter from "@/app/(website)/(boilers)/_components/boiler-frame-footer";
import { boilerProducts } from "@/app/(website)/(boilers)/boilers/property-overview/_lib/property-overview-data";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Flame,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { usePropertyOverviewStore } from "../../property-overview/_store/use-property-overview-store";

const faqItems = [
  "How efficient are these boilers?",
  "Can I move the boiler location later?",
  "What warranty is included?",
  "How soon can installation start?",
  "Can I add smart controls now or later?",
  "Are there any hidden fees?",
];

const SystemSelectionContainer = () => {
  const router = useRouter();
  const { selectedProductId, setProductId } = usePropertyOverviewStore();
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => boilerProducts.find((item) => item.id === selectedProductId) ?? boilerProducts[0],
    [selectedProductId]
  );

  return (
    <BoilerFlowShell activeStep={2}>
      <div className="h-2 rounded-t-[12px] bg-primary" />

          <div className="border-b border-[#EAEFF4] px-5 py-5 md:px-8">
            <h2 className="text-[22px] font-semibold text-[#2D3D4D] md:text-[26px]">
              Choose boiler option
            </h2>
            <p className="mt-1 text-sm text-[#748192]">
              Compare models and select one package for your home.
            </p>
          </div>

          <div className="bg-[#F5F7FA] min-h-[560px] px-4 py-6 md:px-8 md:py-7">
            <div className="space-y-4">
              {boilerProducts.map((product) => {
                const active = selectedProductId === product.id;

                return (
                  <button
                    type="button"
                    key={product.id}
                    onClick={() => setProductId(product.id)}
                    className={cn(
                      "w-full rounded-[12px] border bg-white p-4 text-left transition",
                      active
                        ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.9)]"
                        : "border-[#D6DDE7] hover:border-primary/70"
                    )}
                  >
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex h-[120px] w-[90px] items-center justify-center rounded-[10px] border border-[#E4EAF2] bg-[#F9FBFD]">
                          <Flame className="h-8 w-8 text-[#95A3B5]" />
                        </div>

                        <div>
                          <p className="text-lg font-semibold text-[#2D3D4D]">{product.name}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#FFEFB3] px-2 py-1 text-[11px] font-semibold text-[#5C4A00]">
                              {product.badge}
                            </span>
                            <span className="rounded-full bg-[#EAFBF1] px-2 py-1 text-[11px] font-semibold text-[#127646]">
                              10 year warranty
                            </span>
                            <span className="rounded-full bg-[#EAF3FF] px-2 py-1 text-[11px] font-semibold text-[#1E5DA8]">
                              Free filter included
                            </span>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-[#5F6D7D]">
                            <p>Efficiency: {product.efficiency}</p>
                            <p>Yearly service: {product.yearlyService}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-2 text-sm text-[#5A6878]">
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#12A35D]" />
                          Boiler + standard horizontal flue
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#12A35D]" />
                          System clean and inhibitor
                        </p>
                        <p className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-[#12A35D]" />
                          Gas Safe installation included
                        </p>
                      </div>

                      <div className="rounded-[10px] border border-[#DDE5EF] bg-[#F8FAFC] p-3 text-right">
                        <p className="text-xs text-[#748192]">From</p>
                        <p className="text-xl font-semibold text-[#2D3D4D]">{product.monthlyPrice}</p>
                        <p className="mt-1 text-xs text-[#758293]">or one-off from GBP 2,999</p>
                        <div
                          className={cn(
                            "mt-3 rounded-[8px] px-3 py-2 text-center text-xs font-semibold",
                            active
                              ? "bg-primary text-[#2D3D4D]"
                              : "bg-[#E9EEF5] text-[#516173]"
                          )}
                        >
                          {active ? "Selected package" : "Select package"}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[12px] border border-[#DDE5EF] bg-white p-4 md:p-5">
              <p className="text-[18px] font-semibold text-[#2D3D4D]">Boiler details</p>
              <p className="mt-1 text-sm text-[#667588]">
                Details shown for: <span className="font-semibold">{selectedProduct.name}</span>
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-[10px] border border-[#E4EAF1] bg-[#F8FAFC] p-4">
                  <p className="font-semibold text-[#2D3D4D]">Powered by trusted brands</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#5B6979]">
                    <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#17A768]" />A-rated efficiency performance</li>
                    <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#17A768]" />Parts and labour cover available</li>
                    <li className="flex items-center gap-2"><Wrench className="h-4 w-4 text-[#17A768]" />Professional installation included</li>
                  </ul>
                </div>

                <div className="rounded-[10px] border border-[#E4EAF1] bg-white p-4">
                  <p className="font-semibold text-[#2D3D4D]">What is included</p>
                  <ul className="mt-3 space-y-2 text-sm text-[#5B6979]">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#17A768]" />Boiler unit and flue</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#17A768]" />Magnetic filter and system clean</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#17A768]" />Benchmark and handover certification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[12px] border border-[#DDE5EF] bg-white p-4 md:p-5">
              <p className="text-[18px] font-semibold text-[#2D3D4D]">Most frequently asked questions</p>

              <div className="mt-4 divide-y divide-[#E9EEF3] rounded-[10px] border border-[#E5EBF2]">
                {faqItems.map((faq) => {
                  const open = openFaq === faq;
                  return (
                    <button
                      type="button"
                      key={faq}
                      onClick={() => setOpenFaq(open ? null : faq)}
                      className="w-full px-4 py-3 text-left"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-[#3A4A5B]">{faq}</span>
                        <ChevronDown className={cn("h-4 w-4 text-[#7F8B99] transition", open && "rotate-180")} />
                      </div>
                      {open && (
                        <p className="mt-2 pr-6 text-xs text-[#6D7A89]">
                          This is a design-only placeholder answer section. We will connect real FAQ content later.
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-[8px] border border-[#E9EEF5] bg-[#F9FBFD] p-3 text-xs text-[#6F7D8D]">
                <CircleHelp className="mt-0.5 h-4 w-4" />
                <p>
                  Prices and details shown are design placeholders and can be replaced with backend values in future.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[#E8EDF3] px-5 py-4 md:px-8">
            <button
              type="button"
              onClick={() => router.push("/boilers/property-overview")}
              className="inline-flex h-10 items-center rounded-[8px] border border-[#D5DCE6] bg-white px-5 text-sm font-medium text-[#2D3D4D] transition hover:border-primary"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!selectedProductId}
              onClick={() => router.push("/boilers/customer-details")}
              className="inline-flex h-10 items-center rounded-[8px] bg-primary px-5 text-sm font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
          </div>

      <BoilerFrameFooter />
    </BoilerFlowShell>
  );
};

export default SystemSelectionContainer;
