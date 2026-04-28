"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import CountrySelector from "./country-selector";
import { countries } from "../_lib/countries";
import { useState } from "react";

interface PersonalInfo {
  title: string;
  fastName: string;
  sureName: string;
  email: string;
  postcode: string;
  mobleNumber: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (field: keyof PersonalInfo, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  canMoveNext: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  setPersonalInfo,
  onSubmit,
  isSubmitting,
  submitError,
  canMoveNext,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === "GB") || countries[0]
  );
  return (
    <div className="mt-8 w-full container space-y-4 border-2 border-red-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            Title
          </label>
          <div className="relative">
            <select
              value={personalInfo.title}
              onChange={(e) => setPersonalInfo("title", e.target.value)}
              className="h-12 w-full appearance-none rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-sm md:text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Choose</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2D3D4D]" />
          </div>
        </div>

        {/* First Name */}
        <div className="space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.fastName}
            onChange={(e) => setPersonalInfo("fastName", e.target.value)}
            className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-sm md:text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Surname */}
        <div className="space-y-1">
          <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
            Sure Name
          </label>
          <input
            type="text"
            value={personalInfo.sureName}
            onChange={(e) => setPersonalInfo("sureName", e.target.value)}
            className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-sm md:text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-sm md:text-base text-[#2D3D4D] focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Postcode */}
      <div className="space-y-1">
        <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
          Enter your postcode
        </label>
        <input
          type="text"
          value={personalInfo.postcode}
          onChange={(e) => setPersonalInfo("postcode", e.target.value)}
          placeholder="e.g. SW1A 1AA"
          className="h-12 w-full rounded-none border-b border-[#2D3D4D] bg-[#F0F3F6] px-4 text-sm md:text-base text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-1">
        <label className="block text-base md:text-[17px] font-medium text-[#2D3D4D]">
          Mobile Number ( optional )
        </label>
        <div className="flex h-14 items-center gap-3 bg-[#E9EEF3] px-2">
          <CountrySelector
            selectedCountry={selectedCountry}
            onSelect={setSelectedCountry}
          />
          <input
            type="tel"
            value={personalInfo.mobleNumber}
            onChange={(e) => setPersonalInfo("mobleNumber", e.target.value)}
            placeholder="e.g. 07700 900000"
            className="h-full flex-1 bg-transparent px-2 !rounded-none text-sm md:text-base text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none"
          />
        </div>
      </div>

      {/* Marketing Consent */}
      <div className="pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-1">
            <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none border border-[#2D3D4D] rounded-[4px] bg-white checked:bg-primary checked:border-primary focus:outline-none" />
            <svg
              className="absolute left-1 top-1 h-3 w-3 text-[#2D3D4D] opacity-0 peer-checked:opacity-100 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[13px] md:text-[14px] font-normal leading-normal text-[#2D3D4D]">
            I&apos;m happy to receive an email with my installation quote from YOLO HEAT.
            <br />
            YOLO HEAT can also contact me if there are installation discounts available in the next 30 days.
          </span>
        </label>
      </div>

      {/* Privacy Policy */}
      <p className="text-[13px] md:text-[14px] font-normal leading-normal text-[#2D3D4D]">
        For more information on how we use your details please see our{" "}
        <a href="/privacy-policy" className="text-primary hover:underline underline-offset-4">
          privacy policy.
        </a>
      </p>

      {/* Error Message */}
      {submitError && (
        <p className="text-sm font-medium text-red-500">{submitError}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-0">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canMoveNext || isSubmitting}
          className={cn(
            "h-12 min-w-[160px] rounded-[8px] bg-primary px-8 text-base font-bold text-[#2D3D4D] transition-all hover:bg-[#F3CF43] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
            isSubmitting && "animate-pulse"
          )}
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
