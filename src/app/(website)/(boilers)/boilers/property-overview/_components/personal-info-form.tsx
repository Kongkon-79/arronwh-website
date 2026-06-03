
"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CountrySelector from "./country-selector";
import { countries } from "../_lib/countries";
import {
  fetchPostcodeLocations,
  isValidUKPostcode,
} from "../_lib/postcode-location";

interface PersonalInfo {
  title: string;
  fastName: string;
  sureName: string;
  email: string;
  postcode: string;
  installAddress: string;
  mobleNumber: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  canMoveNext: boolean;
  isLocationLocked: boolean;
}

const getCountryDialCodeVariants = (dialCode: string): string[] => {
  const cleaned = dialCode.replace("+", "").trim();
  if (!cleaned) return [];

  // Handles codes like +44, +880 and +1-268
  const parts = cleaned.split("-").filter(Boolean);
  if (parts.length === 1) return [parts[0]];
  return [parts.join("")];
};

const normalizePhone = (phone: string): string => {
  return phone.replace(/[^\d+]/g, "");
};

const ALL_COUNTRY_CODES = Array.from(
  new Set(
    countries
      .flatMap((country) => getCountryDialCodeVariants(country.dial_code))
      .filter(Boolean),
  ),
).sort((a, b) => b.length - a.length);

const isValidPhoneForCountry = (
  phone: string,
  selectedDialCode: string,
): boolean => {
  const normalized = normalizePhone(phone).trim();
  if (!normalized) return false;

  const digitsOnly = normalized.replace(/\D/g, "");
  if (digitsOnly.length < 6 || digitsOnly.length > 15) return false;

  const codeVariants = getCountryDialCodeVariants(selectedDialCode);
  if (codeVariants.length === 0) return false;

  // If number is entered in international format, it must match selected country.
  if (normalized.startsWith("+")) {
    const matchedVariant = codeVariants.find((code) =>
      digitsOnly.startsWith(code),
    );

    if (!matchedVariant) return false;

    const subscriberNumber = digitsOnly.slice(matchedVariant.length);
    return subscriberNumber.length >= 6 && subscriberNumber.length <= 12;
  }

  // National format (without +country code): basic mobile length validation.
  const startsWithAnotherCountryCode = ALL_COUNTRY_CODES.some(
    (code) =>
      !codeVariants.includes(code) &&
      digitsOnly.startsWith(code) &&
      digitsOnly.length > code.length + 5,
  );

  if (startsWithAnotherCountryCode) return false;

  return digitsOnly.length >= 7 && digitsOnly.length <= 12;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  setPersonalInfo,
  onSubmit,
  isSubmitting,
  submitError,
  canMoveNext,
  isLocationLocked,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === "GB") || countries[0],
  );

  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [mobileError, setMobileError] = useState<string | null>(null);

  const titles = ["Mr", "Mrs", "Ms", "Dr"];

  useEffect(() => {
    if (isLocationLocked) {
      setAddressOptions([]);
      setAddressError(null);
      setIsAddressLoading(false);
      setIsAddressDropdownOpen(false);
      return;
    }

    const postcode = personalInfo.postcode.trim();

    if (!postcode || !isValidUKPostcode(postcode)) {
      setAddressOptions([]);
      setAddressError(null);
      setIsAddressLoading(false);
      setIsAddressDropdownOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setIsAddressLoading(true);
      setAddressError(null);
      setIsAddressDropdownOpen(true);

      fetchPostcodeLocations(postcode, controller.signal)
        .then((locations) => {
          setAddressOptions(locations);
          setIsAddressDropdownOpen(true);
          if (locations.length === 0) {
            setAddressError("No addresses found for this postcode.");
          }
        })
        .catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setAddressOptions([]);
          setAddressError(
            error instanceof Error
              ? error.message
              : "Unable to fetch addresses for this postcode.",
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsAddressLoading(false);
          }
        });
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isLocationLocked, personalInfo.postcode]);

  const handlePostcodeChange = (value: string) => {
    if (isLocationLocked) {
      return;
    }

    setPersonalInfo("postcode", value);
    setPersonalInfo("installAddress", "");
    setAddressOptions([]);
    setAddressError(null);
    setIsAddressDropdownOpen(false);

    if (postcodeError) {
      setPostcodeError(null);
    }
  };

  const handleSubmit = () => {
    const postcode = personalInfo.postcode.trim();
    const installAddress = personalInfo.installAddress.trim();
    const mobileNumber = personalInfo.mobleNumber.trim();
    let hasError = false;

    if (!postcode) {
      setPostcodeError("Postcode is required.");
      hasError = true;
    } else if (!isValidUKPostcode(postcode)) {
      setPostcodeError("Only valid UK postcode is allowed.");
      hasError = true;
    } else {
      setPostcodeError(null);
    }

    if (!installAddress) {
      setAddressError("Please select your address.");
      setIsAddressDropdownOpen(true);
      hasError = true;
    } else {
      setAddressError(null);
    }

    if (!mobileNumber) {
      setMobileError("Mobile number is required.");
      hasError = true;
    } else if (!isValidPhoneForCountry(mobileNumber, selectedCountry.dial_code)) {
      setMobileError(
        `Please enter a valid mobile number for ${selectedCountry.name}. If you use international format, start with ${selectedCountry.dial_code}.`,
      );
      hasError = true;
    } else {
      setMobileError(null);
    }

    if (hasError) return;

    onSubmit();
  };

  return (
    <div className="mt-6 md:mt-8 w-full space-y-4 md:space-y-5">
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Title */}
        <div className="col-span-4 md:col-span-4 space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            Title
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTitleOpen((prev) => !prev)}
              className="flex h-12 w-full items-center justify-between border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-left text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <span>{personalInfo.title || "Choose"}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-[#2D3D4D] transition-transform",
                  isTitleOpen && "rotate-180",
                )}
              />
            </button>

            {isTitleOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-[#D5DCE3] bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setPersonalInfo("title", "");
                    setIsTitleOpen(false);
                  }}
                  className="block w-full px-4 py-3 text-left text-base text-[#2D3D4D] hover:bg-[#F0F3F6]"
                >
                  Choose
                </button>

                {titles.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => {
                      setPersonalInfo("title", title);
                      setIsTitleOpen(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-3 text-left text-base text-[#2D3D4D] hover:bg-[#F0F3F6]",
                      personalInfo.title === title &&
                        "bg-[#F0F3F6] font-medium",
                    )}
                  >
                    {title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* First Name */}
        <div className="col-span-8 md:col-span-4 space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.fastName}
            onChange={(e) => setPersonalInfo("fastName", e.target.value)}
            className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Surname */}
        <div className="col-span-12 md:col-span-4 space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            Surname
          </label>
          <input
            type="text"
            value={personalInfo.sureName}
            onChange={(e) => setPersonalInfo("sureName", e.target.value)}
            className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
          Email
        </label>
        <input
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo("email", e.target.value)}
          className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Postcode */}
      <div className="space-y-1">
        <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
          Enter your postcode
        </label>
        {isLocationLocked ? (
          <input
            type="text"
            value={personalInfo.postcode}
            disabled
            readOnly
            className="h-12 w-full cursor-not-allowed border-b border-[#2D3D4D] bg-[#E9EEF3] px-4 text-base text-[#2D3D4D] opacity-100 focus:outline-none"
          />
        ) : (
          <div className="relative">
            <input
              type="text"
              value={personalInfo.postcode}
              onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
              onFocus={() => {
                if (isAddressLoading || addressOptions.length > 0 || addressError) {
                  setIsAddressDropdownOpen(true);
                }
              }}
              onBlur={() => {
                window.setTimeout(() => setIsAddressDropdownOpen(false), 150);
              }}
              placeholder="e.g. SW1A 1AA"
              className={cn(
                "h-12 w-full rounded-none border-b bg-[#F0F3F6] px-4 pr-11 text-base text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none focus:ring-1",
                postcodeError || (addressError && !personalInfo.installAddress)
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#2D3D4D] focus:ring-primary",
              )}
            />
            <ChevronDown
              className={cn(
                "pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D3D4D] transition-transform",
                isAddressDropdownOpen && "rotate-180",
              )}
            />

            {isAddressDropdownOpen &&
              (isAddressLoading || addressOptions.length > 0 || addressError) && (
                <div
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  data-lenis-prevent-touch
                  onWheel={(event) => event.stopPropagation()}
                  onTouchMove={(event) => event.stopPropagation()}
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto overscroll-contain rounded-md border border-[#D5DCE3] bg-white shadow-lg"
                >
                  {isAddressLoading ? (
                    <div className="space-y-2 px-4 py-3 animate-pulse">
                      <div className="h-5 w-full rounded bg-[#F0F3F6]" />
                      <div className="h-5 w-[88%] rounded bg-[#F0F3F6]" />
                      <div className="h-5 w-[72%] rounded bg-[#F0F3F6]" />
                    </div>
                  ) : addressOptions.length > 0 ? (
                    addressOptions.map((address) => (
                      <button
                        key={address}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setPersonalInfo("installAddress", address);
                          setAddressError(null);
                          setIsAddressDropdownOpen(false);
                        }}
                        className={cn(
                          "block w-full px-4 py-3 text-left text-base text-[#2D3D4D] hover:bg-[#F0F3F6]",
                          personalInfo.installAddress === address &&
                            "bg-[#F0F3F6] font-medium",
                        )}
                      >
                        {address}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-base text-red-500">
                      {addressError || "No addresses found for this postcode."}
                    </div>
                  )}
                </div>
              )}
          </div>
        )}

        {postcodeError && (
          <p className="text-sm font-medium text-red-500">{postcodeError}</p>
        )}

        {!isLocationLocked && addressError && !isAddressDropdownOpen && (
          <p className="text-sm font-medium text-red-500">{addressError}</p>
        )}

        {isLocationLocked ? (
          <input
            type="text"
            value={personalInfo.installAddress}
            disabled
            readOnly
            className="h-12 w-full cursor-not-allowed border-b border-[#2D3D4D] bg-[#E9EEF3] px-4 text-base text-[#2D3D4D] opacity-100 focus:outline-none"
          />
        ) : personalInfo.installAddress ? (
          <p className="text-sm font-medium text-[#2D3D4D]">
            Selected address: {personalInfo.installAddress}
          </p>
        ) : null}
      </div>

      {/* Mobile Number */}
      <div className="space-y-1">
        <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
          Mobile Number
        </label>
        <div className="flex h-14 w-full items-center gap-3 overflow-hidden bg-[#E9EEF3] px-2">
          <div className="shrink-0">
            <CountrySelector
              selectedCountry={selectedCountry}
              onSelect={(country) => {
                setSelectedCountry(country);
                if (mobileError) {
                  setMobileError(null);
                }
              }}
            />
          </div>
          <input
            type="tel"
            value={personalInfo.mobleNumber}
            onChange={(e) => {
              setPersonalInfo("mobleNumber", e.target.value);
              if (mobileError) {
                setMobileError(null);
              }
            }}
            placeholder="e.g. 07700 900000"
            className="h-full min-w-0 flex-1 !rounded-none bg-transparent px-2 text-base text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none"
          />
        </div>
        {mobileError && (
          <p className="text-sm font-medium text-red-500">{mobileError}</p>
        )}
      </div>

      {/* Marketing Consent */}
      <div className="pt-2 md:pt-1">
        <label className="group flex cursor-pointer items-start gap-3">
          <div className="relative mt-[2px] shrink-0 md:mt-1">
            <input
              type="checkbox"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-[#2D3D4D] bg-white checked:border-primary checked:bg-primary focus:outline-none"
            />
            <svg
              className="pointer-events-none absolute left-1 top-1 h-3 w-3 text-[#2D3D4D] opacity-0 peer-checked:opacity-100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-[13px] font-normal leading-relaxed text-[#2D3D4D] md:text-[14px] md:leading-normal">
            I&apos;m happy to receive an email with my installation quote from
            YOLO HEAT.
            <br />
            YOLO HEAT can also contact me if there are installation discounts
            available in the next 30 days.
          </span>
        </label>
      </div>

      {/* Privacy Policy */}
      <p className="text-[13px] font-normal leading-normal text-[#2D3D4D] md:text-[14px]">
        For more information on how we use your details please see our{" "}
        <a
          href="/privacy-policy"
          className="text-[#2D3D4D] underline-offset-4 hover:underline"
        >
          privacy policy.
        </a>
      </p>

      {/* API Submit Error */}
      {submitError && (
        <p className="text-sm font-medium text-red-500">{submitError}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-2 md:pt-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canMoveNext || isSubmitting}
          className={cn(
            "h-12 w-full rounded-[8px] bg-primary px-8 text-base font-bold text-[#2D3D4D] transition-all hover:bg-[#F3CF43] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:min-w-[160px]",
            isSubmitting && "animate-pulse",
          )}
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
