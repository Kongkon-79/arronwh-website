"use client";

import { Phone, X } from "lucide-react";
import { useState } from "react";
// import { useState } from "react";

type HelpFaqItem = {
  question: string;
  answers: string[];
};

type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
};

const FAQ_ITEMS: HelpFaqItem[] = [
  {
    question: "Can I get a quote from YOLO HEAT?",
    answers: [
      "Yes. Just click \"Save Quote\" on the checkout page and we'll email a quote over to you.",
      "Don't forget, with the YOLO HEAT Price Promise we'll beat any like-for-like quote, or give you £50 if we can't.",
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
    question: "Are YOLO HEAT installers trained and Gas Safe registered?",
    answers: [
      "Yes. All of our installers are professional, experienced central heating engineers with Gas Safe certification.",
    ],
  },
];

const countryNameFormatter = new Intl.DisplayNames(["en"], { type: "region" });

const ISO_COUNTRY_CODES = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR",
  "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
  "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF",
  "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
  "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM",
  "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY",
  "LI", "LT", "LU", "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
  "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI",
  "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH",
  "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC",
  "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS",
  "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
  "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU",
  "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW",
] as const;

const COUNTRY_DIAL_CODES: Record<string, string> = {
  ZZ: "",
  BD: "+880",
  GB: "+44",
  US: "+1",
  IN: "+91",
  AE: "+971",
  SA: "+966",
  AU: "+61",
  CA: "+1",
  PK: "+92",
  MY: "+60",
  SG: "+65",
  QA: "+974",
  OM: "+968",
  KW: "+965",
  BH: "+973",
  FR: "+33",
  DE: "+49",
  IT: "+39",
  ES: "+34",
  NL: "+31",
};

const POPULAR_COUNTRY_CODES = ["BD", "GB", "US", "IN", "AE", "SA", "AU", "CA"];

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "ZZ", name: "International", dialCode: "" },
  ...ISO_COUNTRY_CODES
    .map((code) => ({
      code,
      name: countryNameFormatter.of(code) ?? code,
      dialCode: COUNTRY_DIAL_CODES[code] ?? "",
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
];

const getFlagEmoji = (countryCode: string) => {
  if (countryCode === "ZZ") {
    return "🌐";
  }

  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
};

// const FAQ_CATEGORIES = [
//   "Buying with YOLO HEAT",
//   "Delivery and installation",
//   "After your boiler is installed",
// ] as const;

type HelpContainerProps = {
  embedded?: boolean;
  onClose?: () => void;
  defaultOpenCallback?: boolean;
};

const resolveCallbackEndpoint = () => {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    return `${apiBase.replace(/\/$/, "")}/subscriber/callback`;
  }

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (backendBase) {
    return `${backendBase.replace(/\/$/, "")}/subscriber/callback`;
  }

  return "http://localhost:5001/api/v1/subscriber/callback";
};

const HelpContainer = ({
  embedded = false,
  onClose,
  defaultOpenCallback = false,
}: HelpContainerProps) => {
  const [openCallback, setOpenCallback] = useState(defaultOpenCallback);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [subject, setSubject] = useState("Choosing a product");
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("BD");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null,
  );
  // const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<(typeof FAQ_CATEGORIES)[number]>(
  //   "After your boiler is installed"
  // );

  const handleCallbackSubmit = async () => {
    if (!name.trim()) {
      setFeedbackType("error");
      setFeedbackMessage("Please enter your name.");
      return;
    }

    if (!phoneNumber.trim()) {
      setFeedbackType("error");
      setFeedbackMessage("Please enter your mobile number.");
      return;
    }

    const selectedCountry = COUNTRY_OPTIONS.find((country) => country.code === countryCode);
    const dialCode = selectedCountry?.dialCode?.trim() ?? "";
    const normalizedNumber = phoneNumber.trim();
    const phoneNumberWithCode =
      dialCode && !normalizedNumber.startsWith("+")
        ? `${dialCode} ${normalizedNumber}`
        : normalizedNumber;

    setIsSubmitting(true);
    setFeedbackMessage(null);
    setFeedbackType(null);

    try {
      const response = await fetch(resolveCallbackEndpoint(), {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          reason: subject.trim(),
          phoneNumber: phoneNumberWithCode,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to send callback request.");
      }

      setFeedbackType("success");
      setFeedbackMessage(result.message || "Callback request sent successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setFeedbackType("error");
      setFeedbackMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const panelContent = (
    <div className="w-full bg-white px-5 py-7 md:px-7 md:py-8">
      <div className="mx-auto w-full max-w-[560px]">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="text-[36px] font-semibold leading-none text-[#24374B]">Need some help?</h2>
              <button
                type="button"
                onClick={() => onClose?.()}
                aria-label="Close help panel"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00A870] text-white"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

             <div className="border-b border-[#8FA8C6] pb-4">
              <button
                type="button"
                onClick={() => {
                  setOpenCallback((prev) => {
                    const next = !prev;
                    if (next) {
                      setOpenIndex(null);
                    }
                    return next;
                  });
                }}
                className="flex w-full items-center gap-2 text-left text-[21px] font-semibold text-[#21384A]"
              >
                <span className="text-[22px] font-light leading-none text-[#EF4E47]">
                  {openCallback ? "-" : "+"}
                </span>
                <span>Request a callback</span>
                <Phone size={12} className="ml-1" />
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-300 ${
                  openCallback ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <div className="space-y-4 rounded-md bg-[#E4F3FD] p-5">
                    <div>
                      <label htmlFor="help-topic" className="mb-2 block text-[15px] text-[#4E6478]">
                        What do you need help with?
                      </label>
                      <select
                        id="help-topic"
                        className="h-11 w-full border border-[#C8D3DE] bg-white px-3 text-[16px] text-[#2D3D4D] outline-none"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                      >
                        <option>Choosing a product</option>
                        <option>Installation support</option>
                        <option>Payments and finance</option>
                        <option>Aftercare</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="help-name" className="mb-2 block text-[15px] text-[#4E6478]">
                        Your name
                      </label>
                      <input
                        id="help-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="h-11 w-full border border-[#C8D3DE] bg-white px-3 text-[16px] text-[#2D3D4D] outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="help-mobile" className="mb-2 block text-[15px] text-[#4E6478]">
                        Mobile number
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative min-w-[210px]">
                          <select
                            id="help-country"
                            value={countryCode}
                            onChange={(event) => setCountryCode(event.target.value)}
                            className="h-11 w-full border border-[#C8D3DE] bg-white pl-10 pr-8 text-[14px] text-[#2D3D4D] outline-none"
                          >
                            <optgroup label="Popular">
                              {COUNTRY_OPTIONS.filter((country) =>
                                POPULAR_COUNTRY_CODES.includes(country.code),
                              ).map((country) => (
                                <option key={country.code} value={country.code}>
                                  {country.name}
                                  {country.dialCode ? ` (${country.dialCode})` : ""}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="All countries">
                              {COUNTRY_OPTIONS.filter(
                                (country) => !POPULAR_COUNTRY_CODES.includes(country.code),
                              ).map((country) => (
                                <option key={country.code} value={country.code}>
                                  {country.name}
                                  {country.dialCode ? ` (${country.dialCode})` : ""}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] leading-none">
                            {getFlagEmoji(countryCode)}
                          </span>
                        </div>
                        <input
                          id="help-mobile"
                          type="tel"
                          value={phoneNumber}
                          onChange={(event) => setPhoneNumber(event.target.value)}
                          placeholder="17XXXXXXXX"
                          className="h-11 w-full border border-[#C8D3DE] bg-white px-3 text-[16px] text-[#2D3D4D] outline-none"
                        />
                      </div>
                      <p className="mt-1 text-[12px] text-[#5E7488]">
                        Country code will be added automatically when you submit.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCallbackSubmit}
                      disabled={isSubmitting}
                      className="mt-2 flex h-12 w-full items-center justify-center gap-2 bg-[#00A870] text-[18px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Give me a call"}
                      <Phone size={14} />
                    </button>
                    {feedbackMessage ? (
                      <p
                        className={`text-[14px] ${
                          feedbackType === "success" ? "text-[#0B7A4F]" : "text-[#C73A3A]"
                        }`}
                      >
                        {feedbackMessage}
                      </p>
                    ) : null}

                    <p className="text-[13px] text-[#4E6478]">
                      Our office hours are Mon-Fri 8am-8pm, Sat & Sun 9am-3pm
                    </p>
                    <p className="-mt-2 text-[13px] text-[#4E6478]">We aim to call within 1 hour</p>

                    <div className="border-t border-[#ADC9DD]" />

                    <p className="text-[15px] text-[#2D3D4D]">
                      Urgent issue? Call for free{" "}
                      <a href="tel:08001937777" className="text-[#EF3E37] underline">
                        0800 193 7777
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div> 

            <div className="pt-5">
              {/* <h3 className="mb-4 text-[36px] font-semibold leading-none text-[#24374B]">Frequently asked questions</h3>

              <div className="relative mb-1 border-b border-[#8FA8C6] pb-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen((prev) => !prev)}
                  className={`flex h-11 w-full items-center justify-between bg-[#F3F3F3] px-4 text-left text-[18px] text-[#24374B] ${
                    isCategoryOpen ? "border border-[#0FA67A]" : ""
                  }`}
                >
                  <span>{selectedCategory}</span>
                  <span className="text-[18px]">{isCategoryOpen ? "⌃" : "⌄"}</span>
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
                          className={`block w-full px-4 py-2 text-left text-[16px] leading-none ${
                            isSelected ? "bg-[#1E63C8] text-white" : "bg-white text-[#111827]"
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div> */}

              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={item.question} className="border-b border-[#8FA8C6] py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex((prev) => {
                          const next = prev === index ? null : index;
                          if (next !== null) {
                            setOpenCallback(false);
                          }
                          return next;
                        })
                      }
                      className="flex w-full items-start gap-3 text-left text-[20px] font-semibold leading-snug text-[#24374B]"
                    >
                      <span className="pt-[1px] text-[22px] font-light leading-none text-[#EF4E47]">
                        {isOpen ? "-" : "+"}
                      </span>
                      <span>{item.question}</span>
                    </button>

                    <div
                      className={`grid overflow-hidden pl-6 transition-all duration-300 ${
                        isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 space-y-3 text-[16px] leading-relaxed text-[#2D3D4D]">
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
    return (
      <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-white">
        {panelContent}
      </div>
    );
  }

  return (
    <section className="h-screen w-full bg-white">
      <div className="flex h-full w-full">
        <div className="hidden flex-1 bg-[#95A1AF]/85 md:block" />
        <div className="h-full min-h-0 w-full overflow-y-auto overscroll-contain md:w-[48%]">
          {panelContent}
        </div>
      </div>
    </section>
  );
};

export default HelpContainer;
