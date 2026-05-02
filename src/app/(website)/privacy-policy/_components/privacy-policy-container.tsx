import { Mail, MapPin, Phone, Shield } from "lucide-react";

type PolicySection = {
  id: string;
  title: string;
  content?: string[];
  list?: string[];
  subsections?: {
    heading: string;
    items?: string[];
    text?: string[];
  }[];
};

const policySections: PolicySection[] = [
  {
    id: "1",
    title: "1. Introduction",
    content: [
      "YOUHEAT LTD (“we,” “us,” or “our”) is committed to protecting your personal data and respecting your privacy.",
      "This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.",
    ],
  },
  {
    id: "2",
    title: "2. Information We Collect",
    content: ["We may collect and process the following data:"],
    subsections: [
      {
        heading: "2.1 Personal Information",
        items: ["Full name", "Email address", "Phone number", "Home address", "Property address (if different)"],
      },
      {
        heading: "2.2 Property & Heating Info",
        items: ["Boiler/system details (e.g., type, fuel type, size)", "Photos of existing system", "Installation preferences"],
      },
      {
        heading: "2.3 Technical Data",
        items: ["IP address", "Browser type and version", "Device type, operating system, and time zone"],
      },
      {
        heading: "2.4 Communication Data",
        items: ["Messages, emails, or support requests", "Records of appointments or calls"],
      },
    ],
  },
  {
    id: "4",
    title: "4. Legal Basis for Processing",
    content: ["We process your data based on:"],
    list: [
      "Contractual necessity (to provide our service)",
      "Legitimate interests (service improvement, support)",
      "Legal obligation",
      "Consent (for marketing communications)",
    ],
  },
  {
    id: "5",
    title: "5. Sharing Your Information",
    content: ["We may share your data with:"],
    list: [
      "Certified engineers and installation partners",
      "Payment and finance providers",
      "Third-party support providers",
      "Authorities if required by law or for safety and fraud prevention",
    ],
  },
  {
    id: "6",
    title: "6. Data Retention",
    content: [
      "We retain your data only as long as necessary to:",
    ],
    list: [
      "Fulfil the purpose it was collected for",
      "Comply with legal and regulatory requirements",
    ],
  },
  {
    id: "7",
    title: "7. Your Rights",
    content: [
      "Under applicable data protection laws, you have the right to:",
    ],
    list: [
      "Request access to your personal data",
      "Request correction of inaccurate data",
      "Request deletion in certain cases",
      "Object to processing",
      "Request data portability",
    ],
  },
  {
    id: "8",
    title: "8. Cookies and Tracking",
    content: ["Our website may use cookies to:"],
    list: [
      "Improve functionality and performance",
      "Analyse user behaviour",
      "Enhance your browsing experience",
    ],
  },
  {
    id: "9",
    title: "9. Data Security",
    content: [
      "We implement appropriate technical and organisational measures to protect your data from:",
    ],
    list: ["Loss or misuse", "Unauthorised access", "Disclosure or destruction"],
  },
  {
    id: "10",
    title: "10. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites.",
      "We are not responsible for the privacy practices of those external platforms.",
    ],
  },
  {
    id: "11",
    title: "11. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time.",
      "Any changes will be posted on this page with an updated effective date.",
    ],
  },
  {
    id: "14",
    title: "14. Contact Information",
    list: [
      "+44 0123 567 890",
      "hello@youheat.co.uk",
      "London, United Kingdom",
    ],
  },
];

export default function PrivacyPolicyContainer() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="container">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white"><Shield /></span>
          </div>

          <h1 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-[#2D3D4D] ">
            Privacy Policy
          </h1>

          <p className="mt-2 text-xs md:text-sm font-medium leading-normal text-[#2D3D4D]">Last updated : April 1, 2026</p>
        </div>

        <div className="space-y-8">
          {policySections.map((section) => (
            <section key={section.id}>
              <h2 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-[#2D3D4D] ">
                {section.title}
              </h2>

              {section.content && (
                <div className="mt-3 space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm md:text-base font-medium leading-normal text-[#2D3D4D]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {section.subsections && (
                <div className="mt-4 space-y-5">
                  {section.subsections.map((subsection, index) => (
                    <div key={index}>
                      <h3 className="text-base md:text-lg font-bold leading-normal text-[#2D3D4D]">
                        {subsection.heading}
                      </h3>

                      {subsection.text && (
                        <div className="mt-2 space-y-2 ">
                          {subsection.text.map((text, i) => (
                            <p
                              key={i}
                              className="text-[13px] leading-6 text-[#4B5563] sm:text-[14px] "
                            >
                              {text}
                            </p>
                          ))}
                        </div>
                      )}

                      {subsection.items && (
                           <ul className="mt-2 list-disc space-y-1 pl-5 text-sm md:text-base font-medium leading-normal text-[#2D3D4D]">
                          {subsection.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.list && section.id !== "14" && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm md:text-base font-medium leading-normal text-[#2D3D4D]">
                  {section.list.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}

              {section.id === "14" && section.list && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-[#2D3D4D]">
                    <Phone className="h-5 w-5 text-[#24364B]" />
                    <span>{section.list[0]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-[#2D3D4D]">
                    <Mail className="h-5 w-5 text-[#24364B]" />
                    <span>{section.list[1]}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm md:text-base font-medium leading-normal text-[#2D3D4D]">
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