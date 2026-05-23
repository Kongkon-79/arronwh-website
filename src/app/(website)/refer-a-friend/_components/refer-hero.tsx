"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import ReferModal from "./refer-modal";

const ReferHeroSection = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [referredBy, setReferredBy] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    // Store email in localStorage and open the referral modal
    localStorage.setItem("refer_email", trimmedEmail);
    setReferredBy(trimmedEmail);
    setShowModal(true);
  };
  useEffect(() => {
    const stored = localStorage.getItem("refer_email");
    if (stored) {
      setReferredBy(stored);
    }
  }, []);
  return (
    <section className="bg-[#dfe1e3] px-4 py-10 sm:px-6 md:py-14 lg:py-16">
      <div className="container grid w-full  items-center gap-8 lg:grid-cols-[1fr_420px] lg:gap-10">
        <div className="max-w-[700px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-medium leading-[1.06] tracking-[-0.02em] text-[#161b22] ">
            Refer friends.
            <br />
            Get up-to £250.
          </h1>

          <p className="mt-5 max-w-[560px] leading-[1.4] text-[#222932] text-base lg:text-lg font-medium">
            Refer a friend or family member to Yolo heat - they&apos;ll save on
            their new boiler, and you&apos;ll get rewarded too.
          </p>

          <label
            htmlFor="refer-email"
            className="mt-6 block text-base md:text-lg xl:text-xl font-medium text-[#202734]"
          >
            Enter your email address <span className="text-[#d72638]">*</span>
          </label>

          <form
            onSubmit={handleSubmit}
            className="mt-2 flex w-full md:max-w-[580px]"
          >
            <input
              id="refer-email"
              type="email"
              placeholder="a.smith@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 md:h-12 flex-1 rounded-l-[8px] border border-[#d4d8de] bg-[#efefef] px-5 text-[18px] text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1a56db] focus:outline-none"
            />
            <button
              type="submit"
              className="h-11 md:h-12 rounded-r-[8px] bg-[#1450e6] px-7 text-base md:text-[18px] font-medium text-white transition hover:bg-[#1148cf] sm:ml-0 sm:rounded-l-none"
            >
             Continue
            </button>
          </form>
          <ReferModal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              setEmail("");
            }}
            referredBy={referredBy}
          />

          <div className="mt-4 flex w-full max-w-[580px] items-start gap-2 rounded-[8px] border border-[#e3d291] bg-[#f3e4a8] px-4 py-3 text-sm lg:text-base font-medium leading-[1.4] text-[#212734]">
            <Lightbulb
              className="mt-[1px] h-6 w-6 shrink-0"
              strokeWidth={2.3}
            />
            <p>
              Use the same email address linked to your original order. Need
              help? call{" "}
              <a className="underline" href="tel:07947125922">
                07947 125922
              </a>{" "}
              or email{" "}
              <a className="underline" href="mailto:hello@yoloheat.com">
                hello@yoloheat.com
              </a>
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[420px] lg:justify-self-end">
          <Image
            src="/assets/images/refer-hero.png"
            alt="Happy customer holding money"
            width={700}
            height={724}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default ReferHeroSection;
