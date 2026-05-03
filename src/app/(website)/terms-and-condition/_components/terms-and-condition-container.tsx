import { FileText, Mail, MapPin, Phone } from "lucide-react";

type TermsSection = {
  id: string;
  title: string;
  content?: string[];
  list?: string[];
};

const termsSections: TermsSection[] = [
  {
    id: "1",
    title: "1. Introduction",
    content: [
      "Welcome to YOUHEAT LTD. By using our website and services, you agree to comply with these Terms & Conditions. Please read them carefully before proceeding.",
    ],
  },
  {
    id: "2",
    title: "2. Services Overview",
    content: [
      "YOUHEAT provides boiler installation, repair, maintenance, and related heating services. All services are subject to availability and confirmation.",
    ],
  },
  {
    id: "3",
    title: "3. Quotes & Pricing",
    list: [
      "All quotes are fixed unless otherwise stated.",
      "Prices include standard installation unless additional work is required.",
      "Any variations will be clearly communicated before proceeding.",
      "Quotes are valid for a limited time, typically 30 days.",
    ],
  },
  {
    id: "4",
    title: "4. Booking & Appointments",
    list: [
      "Bookings are confirmed only after payment or deposit.",
      "Installations and visits must be scheduled in advance.",
      "Customers must ensure access to the property on the scheduled date.",
    ],
  },
  {
    id: "5",
    title: "5. Payments",
    list: [
      "We accept full payment methods as specified.",
      "Payment must be completed before or on installation day.",
      "Finance options may apply if approved and third-party terms are accepted.",
    ],
  },
  {
    id: "6",
    title: "6. Cancellations & Refunds",
    list: [
      "You may cancel before installation or visit if notice is given within the required period.",
      "Cancellation after scheduling may incur a fee.",
      "Refunds will be processed within a reasonable timeframe.",
    ],
  },
  {
    id: "7",
    title: "7. Installation Terms",
    list: [
      "Installations are completed only by certified engineers.",
      "Standard installation includes agreed scope only.",
      "Warranty does not cover misuse or unauthorised modification.",
    ],
  },
  {
    id: "8",
    title: "8. Warranty",
    list: [
      "Boilers come with manufacturer warranty terms, e.g. 5–10 years.",
      "Installation workmanship warranty may apply.",
      "Warranty terms do not cover wear and tear or excluded modifications.",
    ],
  },
  {
    id: "9",
    title: "9. Customer Responsibilities",
    list: [
      "Provide accurate info when requesting services or payments.",
      "Ensure a safe and accessible working environment.",
      "Notify us of any existing issues before installation.",
    ],
  },
  {
    id: "10",
    title: "10. Liability",
    list: [
      "YOUHEAT shall not be responsible for delays caused by unforeseen circumstances.",
      "We are not liable for indirect or consequential damages.",
      "Our liability is limited to the value of the service provided.",
    ],
  },
  {
    id: "11",
    title: "11. Use of Website",
    list: [
      "You agree not to misuse the website.",
      "All content is owned by YOUHEAT.",
      "Unauthorised use may result in legal action.",
    ],
  },
  {
    id: "12",
    title: "12. Privacy & Data",
    list: [
      "We collect and handle data in line with our Privacy Policy.",
      "By using our site and services, you consent to relevant communications.",
    ],
  },
  {
    id: "13",
    title: "13. Changes to Terms",
    content: [
      "YOUHEAT may update these Terms & Conditions at any time. Continued use of the website means you accept the updated terms.",
    ],
  },
  {
    id: "14",
    title: "14. Contact Information",
    list: ["+44 0123 567 890", "hello@youheat.co.uk", "London, United Kingdom"],
  },
];

export default function TermsConditionsContainer() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="container">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">
              <FileText />
            </span>
          </div>

          <h1 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-black ">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-xs md:text-sm font-medium leading-normal text-black">
            Please read these terms carefully before using our services. By
            accessing YOLO HEAT <br />
            you agree to be bound by these terms and conditions.
          </p>

          <p className="mt-2 text-xs md:text-sm font-medium leading-normal text-black">
            Last updated : April 1, 2026
          </p>
        </div>

        <div className="space-y-8">
          {termsSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-black ">
                {section.title}
              </h2>

              {section.content && (
                <div className="mt-3 space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm md:text-base font-medium leading-normal text-black"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {section.list && section.id !== "14" && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm md:text-base font-medium leading-normal text-black">
                  {section.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}

              {section.id === "14" && section.list && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-black">
                    <Phone className="h-5 w-5 text-[#24364B]" />
                    <span>{section.list[0]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-black">
                    <Mail className="h-5 w-5 text-[#24364B]" />
                    <span>{section.list[1]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-black">
                    <MapPin className="h-5 w-5 text-[#24364B]" />
                    <span>{section.list[2]}</span>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
