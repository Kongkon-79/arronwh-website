"use client";
import { Button } from "@/components/ui/button";
import { BadgePercent, Mail } from "lucide-react";
import { ExtraCard, ExtraItem } from "./_components/ExtraCard";

const systemCareExtras: ExtraItem[] = [
  {
    id: 1,
    title: "MagnaCleanse Flush with Sentinel X800 Power Cleane",
    description:
      "A MagnaCleanse flush gives your heating system an in-depth cleanse, to improve efficiency and extend the lifespan of your boiler.",
    priceText: "+£199",
    buttonText: "Added",
    buttonVariant: "dark",
    image: "/extra-system-care-1.png",
  },
  {
    id: 2,
    title: "In-line scale reducer",
    description:
      "A small device designed to help to prevent scale from forming in your boiler and pipework. A must in hard water areas",
    priceText: "+£65",
    buttonText: "Add to basket",
    buttonVariant: "green",
    image: "/extra-system-care-2.png",
  },
];

const radiatorExtras: ExtraItem[] = [
  {
    id: 3,
    title: "Thermostatic radiator valve (TRV)",
    description:
      "Regulate how much hot water flows into your radiators so you can get the temperature just right in every room",
    priceText: "+£40",
    buttonText: "Add to basket",
    buttonVariant: "green",
    image: "/extra-radiator-1.png",
  },
  {
    id: 4,
    title: "Amazon Alexa Echo Dot",
    description: "",
    priceText: "+£59",
    buttonText: "Add to basket",
    buttonVariant: "green",
    image: "/extra-radiator-2.png",
  },
];

const summaryItems = [
  { label: "Worcester Bosch Greenstar 4000 25kw", value: "$2,499" },
  { label: "View details", value: "", highlight: true },
  { label: "Hive Thermostat Mini", value: "£268" },
  { label: "Converting Standard Boiler to a Worcester Wall Mounted Combi", value: "£850" },
  { label: "Disposal of your old boiler", value: "Included" },
  { label: "Shock Arrestor Boiler Protection Pack", value: "£50" },
  { label: "Worcester Bosch Vertical Flue Installation", value: "£500" },
  { label: "Worcester Bosch 100mm Standard Flue Extension", value: "£50" },
  { label: "In-line scale reducer", value: "£65" },
  { label: "Carbon Monoxide Alarm", value: "Included" },
  { label: "Condensate pipework", value: "Included" },
  { label: "Pipework installation, alterations and upgrades", value: "Included" },
  { label: "Electrical work", value: "Included" },
  { label: "Boiler Aftercare: 10 years warranty (on-site parts & labour)", value: "Included" },
  { label: "BOXT to register the warranty & Building Control Certificate", value: "Included" },
  { label: "Sentinel Water Treatment", value: "Included" },
  { label: "Worcester Bosch Magnetic Filter", value: "Included" },
  { label: "Worcester Keyless Filling Link", value: "Included" },
];

export default function ExtrasPage() {
  return (
    <div className="min-h-screen bg-[#EEF2F5] px-3 py-5 sm:px-4 lg:px-6">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-[24px] sm:text-[30px] lg:text-[34px] font-bold leading-tight text-[#2D3D4D]">
            Add extras to your order
          </h1>
          <p className="mt-2 text-[12px] sm:text-[16px] text-[#2D3D4D]">
            All extras are installed at the same time as your boiler
            <br className="hidden sm:block" />
            for no extra cost.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left content */}
          <div className="space-y-6">
            {/* Section 1 */}
            <section>
              <h2 className="text-[26px] sm:text-[30px] font-bold text-[#2D3D4D]">
                System Care
              </h2>
              <p className="mt-1 text-[13px] sm:text-[16px] text-[#2D3D4D]">
                Enhance and protect your system for improved efficiency and longevity.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {systemCareExtras.map((item) => (
                  <ExtraCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-[24px] sm:text-[28px] font-bold text-[#2D3D4D]">
                Radiators & Thermostatic radiator valves (TRVs)
              </h2>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#445466]">
                Improve efficiency and optimise heating around your home to reduce your energy bills.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
                {radiatorExtras.map((item) => (
                  <ExtraCard key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* Footer note */}
            <p className="text-[11px] sm:text-[16px] leading-5 text-[#2D3D4D]">
              *Representative example for 120 month order: £4,282 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
              Representative APR: 9.9% APR. Total amount of credit £4,282 paid over 120 months as 120 monthly payments of
              £55.36 at 9.48% p.a. Cost of finance £2,361.20. Total amount payable £6,643.20. BOXT Limited is a credit broker
              and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status, affordability
              and a credit check. Terms and conditions apply.
            </p>
          </div>

          {/* Right summary */}
          <div className="h-fit rounded-[4px] bg-[#FFFFFF] p-4 sm:p-5 xl:sticky xl:top-5">
            <h3 className="mb-4 text-[18px] sm:text-[18px] font-medium text-[#2D3D4D]">
              Your fixed price including installation:
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Pay today</p>
                <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                  $3,099
                </p>
                <p className="mt-2 text-[11px] sm:text-[14px] font-medium text-[#00A56F] line-through">
                  was $3,369
                </p>
              </div>

              <div className="rounded-[8px] bg-[#F0F3F6] p-3 sm:p-4">
                <p className="text-[12px] sm:text-[16px] text-[#2D3D4D]">Monthly Cost</p>
                <p className="mt-2 text-[24px] sm:text-[18px] font-bold leading-none text-[#2D3D4D]">
                  $40.07+
                </p>
                <p className="mt-2 text-[11px] sm:text-[14px] font-medium text-[#00A56F] line-through">
                  was $43.56
                </p>
              </div>
            </div>

            <div className="mt-4 flex min-h-[48px] items-center justify-center rounded-[8px] bg-[#F0F3F6] px-3 text-center">
              <BadgePercent className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-[#64748B]" />
              <span className="text-[14px] sm:text-[16px] font-semibold text-[#2D3D4D]">
                4000 25 kw Discount
              </span>
              <span className="ml-2 text-[14px] sm:text-[16px] font-semibold text-[#00A56F]">
                -$270
              </span>
            </div>

            <Button className="mt-4 h-[48px] w-full rounded-[6px] bg-[#00A56F] text-[15px] sm:text-[16px] font-medium text-white hover:bg-[#009562]">
              Next Checkout
            </Button>

            <Button
              variant="outline"
              className="mt-3 h-[48px] w-full rounded-[6px] border border-[#F5D64E] bg-transparent text-[15px] sm:text-[16px] font-medium text-[#F5C842] hover:bg-transparent"
            >
              Email My quote
              <Mail className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-5 space-y-0">
              {summaryItems.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="flex items-start justify-between gap-4 border-b border-dotted border-[#A7B1BB] py-3 last:border-b-0"
                >
                  <div
                    className={
                      item.highlight
                        ? "text-[14px] sm:text-[15px] font-medium text-[#F5C842] underline"
                        : "text-[14px] sm:text-[15px] text-[#2D3D4D]"
                    }
                  >
                    {item.label}
                  </div>

                  {item.value ? (
                    <div className="shrink-0 text-[14px] sm:text-[15px] font-semibold text-[#2D3D4D]">
                      {item.value}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}