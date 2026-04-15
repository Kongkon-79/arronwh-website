"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  Landmark,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const paymentOptions = [
  "Pay in full",
  "Pay monthly",
  "Pay by card",
  "Pay with finance",
];

const visitOptions = ["Use selected property address", "Enter address manually"];

const InstallationBookingContainer = () => {
  const router = useRouter();
  const [subStep, setSubStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("14");
  const [selectedVisit, setSelectedVisit] = useState(visitOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentOptions[1]);

  const monthDays = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
  ];

  const subTitles = [
    "When should we install?",
    "Where are we visiting?",
    "How would you like to pay?",
    selectedPayment === "Pay monthly" ? "Pay monthly" : "Pay by card",
  ];

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="h-2 rounded-t-[12px] bg-primary" />

          <div className="border-b border-[#EAEFF4] px-5 py-5 md:px-8">
            <h2 className="text-[22px] font-semibold text-[#2D3D4D] md:text-[26px]">{subTitles[subStep]}</h2>
            <p className="mt-1 text-sm text-[#748192]">Installation and payment journey design screens.</p>
          </div>

          <div className="bg-[#F5F7FA] min-h-[560px] px-4 py-6 md:px-8">
            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                {subStep === 0 && (
                  <>
                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="flex items-center gap-2 text-sm font-medium text-[#3A4B5D]">
                        <CalendarDays className="h-4 w-4 text-[#738091]" />
                        Select your preferred installation date
                      </p>

                      <div className="mt-4 grid grid-cols-7 gap-2">
                        {monthDays.map((day) => {
                          const active = selectedDate === day;
                          const disabled = ["7", "11", "22"].includes(day);
                          return (
                            <button
                              type="button"
                              key={day}
                              disabled={disabled}
                              onClick={() => setSelectedDate(day)}
                              className={cn(
                                "h-9 rounded-[8px] border text-xs font-medium transition",
                                disabled
                                  ? "border-[#E4EAF2] bg-[#F7F9FC] text-[#AFBBC9]"
                                  : active
                                    ? "border-primary bg-primary/40 text-[#2D3D4D]"
                                    : "border-[#D8E0EA] bg-white text-[#5B6878] hover:border-primary/60"
                              )}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        "Morning arrival (8am - 12pm)",
                        "Midday arrival (11am - 3pm)",
                        "Afternoon arrival (1pm - 5pm)",
                      ].map((slot, idx) => (
                        <button
                          type="button"
                          key={slot}
                          className={cn(
                            "w-full rounded-[10px] border bg-white px-4 py-3 text-left text-sm",
                            idx === 0
                              ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.8)]"
                              : "border-[#DBE3EC]"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {subStep === 1 && (
                  <>
                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm font-medium text-[#3B4B5B]">Where are we visiting?</p>
                      <div className="mt-3 space-y-2">
                        {visitOptions.map((item) => {
                          const active = selectedVisit === item;
                          return (
                            <button
                              type="button"
                              key={item}
                              onClick={() => setSelectedVisit(item)}
                              className={cn(
                                "flex w-full items-center justify-between rounded-[10px] border px-4 py-3 text-left text-sm",
                                active
                                  ? "border-primary bg-primary/20 text-[#2D3D4D]"
                                  : "border-[#D9E1EA] bg-white text-[#596879]"
                              )}
                            >
                              {item}
                              {active && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm font-medium text-[#3B4B5B]">Address details</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input
                          className="h-11 rounded-[8px] border border-[#D7DEE7] bg-white px-3 text-sm outline-none focus:border-primary"
                          placeholder="Postcode"
                          defaultValue="SW1A 1AA"
                        />
                        <input
                          className="h-11 rounded-[8px] border border-[#D7DEE7] bg-white px-3 text-sm outline-none focus:border-primary"
                          placeholder="House number"
                          defaultValue="221B"
                        />
                        <input
                          className="h-11 rounded-[8px] border border-[#D7DEE7] bg-white px-3 text-sm outline-none focus:border-primary md:col-span-2"
                          placeholder="Address line"
                          defaultValue="Baker Street"
                        />
                        <textarea
                          className="min-h-[100px] rounded-[8px] border border-[#D7DEE7] bg-white px-3 py-2 text-sm outline-none focus:border-primary md:col-span-2"
                          placeholder="Additional notes"
                          defaultValue="Design placeholder: parking available after 8am."
                        />
                      </div>
                    </div>
                  </>
                )}

                {subStep === 2 && (
                  <>
                    <div className="space-y-2">
                      {paymentOptions.map((item) => {
                        const active = selectedPayment === item;
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => setSelectedPayment(item)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-[10px] border bg-white px-4 py-3 text-sm",
                              active
                                ? "border-primary bg-primary/20 text-[#2D3D4D]"
                                : "border-[#DBE3EC] text-[#576677]"
                            )}
                          >
                            <span>{item}</span>
                            {active ? <Check className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm text-[#617080]">Secure payment details</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Cardholder name" defaultValue="John Doe" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Card number" defaultValue="4242 4242 4242 4242" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="MM/YY" defaultValue="10/29" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="CVC" defaultValue="123" />
                      </div>
                    </div>
                  </>
                )}

                {subStep === 3 && selectedPayment === "Pay monthly" && (
                  <>
                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm font-medium text-[#3A4A5B]">Monthly finance eligibility</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Date of birth" defaultValue="12/08/1992" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Employment status" defaultValue="Full-time" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Annual income" defaultValue="35000" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Residential status" defaultValue="Homeowner" />
                      </div>
                    </div>

                    <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                      <p className="text-sm font-medium text-[#3A4A5B]">Bank details (Direct Debit)</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Account holder" defaultValue="John Doe" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Sort code" defaultValue="12-34-56" />
                        <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm md:col-span-2" placeholder="Account number" defaultValue="12345678" />
                      </div>
                    </div>
                  </>
                )}

                {subStep === 3 && selectedPayment !== "Pay monthly" && (
                  <div className="rounded-[12px] border border-[#DBE3EC] bg-white p-4">
                    <p className="text-sm font-medium text-[#3A4A5B]">Confirm card payment</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Cardholder name" defaultValue="John Doe" />
                      <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="Card number" defaultValue="4242 4242 4242 4242" />
                      <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="MM/YY" defaultValue="10/29" />
                      <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm" placeholder="CVC" defaultValue="123" />
                      <input className="h-11 rounded-[8px] border border-[#D7DEE7] px-3 text-sm md:col-span-2" placeholder="Billing postcode" defaultValue="SW1A 1AA" />
                    </div>
                  </div>
                )}
              </div>

              <aside className="h-fit rounded-[12px] border border-[#DCE5EF] bg-white p-4">
                <p className="text-sm font-semibold text-[#2D3D4D]">Your summary</p>
                <div className="mt-3 space-y-2 text-xs text-[#657385]">
                  <div className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] px-3 py-2">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Location</span>
                    <span>SW1A 1AA</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] px-3 py-2">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />Install date</span>
                    <span>{selectedDate} Mar</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] px-3 py-2">
                    <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" />Payment</span>
                    <span>{selectedPayment}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] bg-[#F8FAFC] px-3 py-2">
                    <span className="flex items-center gap-1"><Landmark className="h-3.5 w-3.5" />Address</span>
                    <span>{selectedVisit === visitOptions[0] ? "Saved" : "Manual"}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="text-xs text-[#6E7C8B]">Order total</p>
                  <p className="text-2xl font-semibold text-[#2D3D4D]">$3,248</p>
                  <p className="text-xs text-[#738294]">From $29.99 / month</p>
                </div>
              </aside>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#E8EDF3] px-5 py-4 md:px-8">
            <button
              type="button"
              onClick={() => {
                if (subStep === 0) {
                  router.push("/boilers/customer-details");
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
              onClick={() => {
                if (subStep < 3) {
                  setSubStep((prev) => prev + 1);
                  return;
                }
              }}
              className="inline-flex h-10 items-center rounded-[8px] bg-primary px-5 text-sm font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43]"
            >
              {subStep < 3 ? "Continue" : "Place order (Design only)"}
            </button>
          </div>

    </BoilerFlowShell>
  );
};

export default InstallationBookingContainer;
