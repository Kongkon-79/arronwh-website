"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import BoilerFrameFooter from "@/app/(website)/(boilers)/_components/boiler-frame-footer";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Plus,
  Thermometer,
  ToggleLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { usePropertyOverviewStore } from "../../property-overview/_store/use-property-overview-store";

type ControlItem = {
  id: string;
  name: string;
  description: string;
  price: string;
};

type ExtraItem = {
  id: string;
  name: string;
  description: string;
  price: string;
};

const controlItems: ControlItem[] = [
  {
    id: "wireless-programmer",
    name: "Wireless Programmer",
    description: "Simple schedule control with room temperature target.",
    price: "Included",
  },
  {
    id: "smart-thermostat",
    name: "Smart Thermostat",
    description: "Control from app with heating zones and automation.",
    price: "+ GBP 119",
  },
  {
    id: "weather-comp",
    name: "Weather Compensation",
    description: "Improves efficiency by adjusting flow temperature.",
    price: "+ GBP 89",
  },
  {
    id: "wireless-trv",
    name: "Wireless TRV Kit",
    description: "Room-by-room radiator control for better comfort.",
    price: "+ GBP 149",
  },
];

const extraItems: ExtraItem[] = [
  {
    id: "system-flush",
    name: "System Flush",
    description: "Deep clean for older heating systems.",
    price: "GBP 149",
  },
  {
    id: "scale-reducer",
    name: "Scale Reducer",
    description: "Protects boiler in hard water areas.",
    price: "GBP 89",
  },
  {
    id: "mag-filter-plus",
    name: "Premium Magnetic Filter",
    description: "Enhanced debris filtering and longer life.",
    price: "GBP 69",
  },
  {
    id: "chemical-pack",
    name: "Inhibitor + Cleaner Pack",
    description: "Additional system treatment protection.",
    price: "GBP 49",
  },
];

const summaryRows = [
  "Boiler package",
  "Standard installation",
  "Controls",
  "Optional extras",
  "Finance available",
  "Estimated installation",
];

const CustomerDetailsContainer = () => {
  const router = useRouter();
  const { selectedProductId } = usePropertyOverviewStore();

  const [subStep, setSubStep] = useState(0);
  const [selectedControl, setSelectedControl] = useState(controlItems[0].id);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["system-flush"]);
  const [openSection, setOpenSection] = useState<string | null>("what-included");

  const titles = ["Choose controls", "Add extras to your order", "Your total price is $3,248"];

  const canContinue = useMemo(() => {
    if (subStep === 0) return Boolean(selectedControl);
    if (subStep === 1) return true;
    return true;
  }, [selectedControl, subStep]);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <BoilerFlowShell activeStep={3}>
      <div className="h-2 rounded-t-[12px] bg-primary" />

          <div className="border-b border-[#E9EEF5] px-5 py-5 md:px-8">
            <h2 className="text-[22px] font-semibold text-[#2D3D4D] md:text-[26px]">{titles[subStep]}</h2>
            <p className="mt-1 text-sm text-[#748192]">Design-only checkout screens. API integration can be added later.</p>
          </div>

          <div className="bg-[#F5F7FA] min-h-[560px] px-4 py-6 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                {subStep === 0 && (
                  <>
                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm text-[#738192]">Choose one control option for your selected system.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {controlItems.map((item) => {
                        const active = selectedControl === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedControl(item.id)}
                            className={cn(
                              "rounded-[12px] border bg-white p-4 text-left transition",
                              active
                                ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.9)]"
                                : "border-[#D6DEE8] hover:border-primary/60"
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-base font-semibold text-[#2D3D4D]">{item.name}</p>
                              <span className="rounded-[6px] bg-[#E9F8EF] px-2 py-1 text-xs font-semibold text-[#137B49]">{item.price}</span>
                            </div>
                            <p className="mt-2 text-sm text-[#667586]">{item.description}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#5B6A7A]">
                              <Thermometer className="h-4 w-4" />
                              Compatible with selected boiler
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {subStep === 1 && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {extraItems.map((item) => {
                      const active = selectedExtras.includes(item.id);
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => toggleExtra(item.id)}
                          className={cn(
                            "rounded-[12px] border bg-white p-4 text-left transition",
                            active
                              ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.9)]"
                              : "border-[#D8E0EA] hover:border-primary/60"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-base font-semibold text-[#2D3D4D]">{item.name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#2D3D4D]">{item.price}</span>
                              <span
                                className={cn(
                                  "rounded-[6px] px-2 py-1 text-xs font-semibold",
                                  active
                                    ? "bg-primary text-[#2D3D4D]"
                                    : "bg-[#EAF1F8] text-[#5E6D7D]"
                                )}
                              >
                                {active ? "Added" : "Add"}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-[#677687]">{item.description}</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {subStep === 2 && (
                  <div className="space-y-3">
                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-base font-semibold text-[#2D3D4D]">Your selected package summary</p>
                        <span className="rounded-[8px] bg-[#E9F8EF] px-2 py-1 text-xs font-semibold text-[#147E4C]">
                          Ready for booking
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-[#5F6E7E] md:grid-cols-2">
                        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A665]" />Selected boiler package</p>
                        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A665]" />Selected controls</p>
                        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A665]" />Optional extras</p>
                        <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#16A665]" />Installation prep</p>
                      </div>
                    </div>

                    {[
                      { id: "what-included", label: "What is included?" },
                      { id: "finance", label: "Finance options" },
                      { id: "next-steps", label: "What happens next?" },
                    ].map((item) => {
                      const open = openSection === item.id;
                      return (
                        <div key={item.id} className="rounded-[10px] border border-[#DCE4EE] bg-white">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                            onClick={() => setOpenSection(open ? null : item.id)}
                          >
                            <span className="text-sm font-medium text-[#36485A]">{item.label}</span>
                            {open ? (
                              <ChevronUp className="h-4 w-4 text-[#8290A0]" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-[#8290A0]" />
                            )}
                          </button>
                          {open && (
                            <div className="border-t border-[#E7ECF3] px-4 py-3 text-sm text-[#667586]">
                              Placeholder content based on your design. Real data/content can be wired later.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F9FBFD] p-3 text-xs text-[#6D7B8B]">
                  <p className="flex items-start gap-2">
                    <CircleHelp className="mt-0.5 h-4 w-4" />
                    This section is intentionally UI-only now. You can connect prices and product APIs later.
                  </p>
                </div>
              </div>

              <aside className="h-fit rounded-[12px] border border-[#DCE5EF] bg-white p-4">
                <p className="text-sm font-semibold text-[#2D3D4D]">Your summary</p>
                <p className="mt-1 text-xs text-[#778597]">Package: {selectedProductId || "not selected"}</p>

                <div className="mt-3 space-y-2">
                  {summaryRows.map((row) => (
                    <div key={row} className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] px-3 py-2 text-xs">
                      <span className="text-[#647384]">{row}</span>
                      <ToggleLeft className="h-4 w-4 text-[#A0ADBC]" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#6E7C8B]">Estimated total</p>
                  <p className="text-2xl font-semibold text-[#2D3D4D]">$3,248</p>
                  <p className="text-xs text-[#738294]">or from $29.99/month</p>
                </div>
              </aside>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E8EDF3] px-5 py-4 md:px-8">
            <button
              type="button"
              onClick={() => {
                if (subStep === 0) {
                  router.push("/boilers/system-selection");
                  return;
                }
                setSubStep((prev) => Math.max(prev - 1, 0));
              }}
              className="inline-flex h-10 items-center rounded-[8px] border border-[#D5DCE6] bg-white px-5 text-sm font-medium text-[#2D3D4D] transition hover:border-primary"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!canContinue}
              onClick={() => {
                if (subStep < 2) {
                  setSubStep((prev) => prev + 1);
                  return;
                }
                router.push("/boilers/installation-booking");
              }}
              className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-primary px-5 text-sm font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {subStep < 2 ? (
                <>
                  Continue <Plus className="h-4 w-4" />
                </>
              ) : (
                "Continue to Installation Booking"
              )}
            </button>
          </div>

      <BoilerFrameFooter />
    </BoilerFlowShell>
  );
};

export default CustomerDetailsContainer;
