"use client";

import { BannerApiResponse } from "@/components/types/hero-data-type";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  fetchPostcodeLocations,
  clearPostcodeLocationSelection,
  isValidUKPostcode,
  loadPostcodeLocationSelection,
  savePostcodeLocationSelection,
} from "../(boilers)/boilers/property-overview/_lib/postcode-location";

const HeroSection = () => {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

  const { data, isLoading, isError } = useQuery<BannerApiResponse>({
    queryKey: ["heroData"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banner`);

      if (!res.ok) {
        throw new Error("Failed to fetch hero data");
      }

      return res.json();
    },
  });

  const banner = data?.data?.[0];

  const heroPoints: string[] = Array.isArray(banner?.feature)
    ? banner.feature.map((item) => item.replace(/[\[\]"]/g, "").trim())
    : [];

  useEffect(() => {
    const storedSelection = loadPostcodeLocationSelection();
    if (!storedSelection) {
      return;
    }

    if (storedSelection.postcode) {
      setPostcode(storedSelection.postcode);
    }

    if (storedSelection.installAddress) {
      setSelectedAddress(storedSelection.installAddress);
    }
  }, []);

  useEffect(() => {
    const trimmedPostcode = postcode.trim();

    if (!trimmedPostcode || !isValidUKPostcode(trimmedPostcode)) {
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

      fetchPostcodeLocations(trimmedPostcode, controller.signal)
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
  }, [postcode]);

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    setSelectedAddress("");
    setAddressOptions([]);
    setAddressError(null);
    setIsAddressDropdownOpen(false);

    if (postcodeError) {
      setPostcodeError(null);
    }
  };

  const handleGetQuote = () => {
    const trimmedPostcode = postcode.trim();
    const hasPostcode = Boolean(trimmedPostcode);
    const hasAddress = Boolean(selectedAddress.trim());

    if (hasPostcode && !isValidUKPostcode(trimmedPostcode)) {
      setPostcodeError("Only valid UK postcode is allowed.");
      toast.error("Please enter a valid postcode to continue.");
      return;
    }

    if (hasPostcode && !hasAddress) {
      setAddressError("Please select your address.");
      setIsAddressDropdownOpen(true);
      toast.error("Please select an address to continue.");
      return;
    }

    if (!hasPostcode) {
      setPostcodeError(null);
      setAddressError(null);
      setSelectedAddress("");
      setAddressOptions([]);
      setIsAddressDropdownOpen(false);
      clearPostcodeLocationSelection();
      router.push("/boilers/property-overview");
      return;
    }

    if (!trimmedPostcode) {
      setPostcodeError("Postcode is required.");
    } else {
      setPostcodeError(null);
    }

    savePostcodeLocationSelection({
      postcode: trimmedPostcode,
      installAddress: selectedAddress.trim(),
    }, "hero");

    router.push("/boilers/property-overview");
  };

  // =========================
  // Skeleton (UNCHANGED - your design kept)
  // =========================
  if (isLoading) {
    return (
      <section className="overflow-hidden bg-[#FBFF26]">
        <div className="container px-1 py-2 md:py-16 lg:py-20">
          <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 animate-pulse">
            {/* LEFT */}
            <div className="order-2 md:order-1 mx-auto w-full p-6 md:p-8">
              <div className="space-y-4">
                <div className="h-12 md:h-16 w-[90%] rounded-xl bg-[#d9dc52]" />
                <div className="h-12 md:h-16 w-[70%] rounded-xl bg-[#d9dc52]" />
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full rounded-full bg-[#d9dc52]" />
                <div className="h-4 w-[85%] rounded-full bg-[#d9dc52]" />
              </div>

              <div className="h-[52px] mt-8 flex items-center gap-4 bg-white p-1 rounded-full w-full md:w-[55%] shadow-md">
                <div className="h-10 w-1/2 rounded-full bg-gray-200" />
                <div className="h-10 w-36 rounded-full bg-[#2D3D4D]" />
              </div>

              <div className="mt-8 space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#2D3D4D]" />
                    <div className="h-4 w-56 rounded-full bg-[#d9dc52]" />
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden md:flex order-1 md:order-2 mx-auto flex-col w-full max-w-[560px] items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] overflow-hidden rounded-[20px] bg-[#d9dc52]">
                <div className="h-[290px] md:h-[390px] lg:h-[400px] w-full relative">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>

              <div className="mt-6 space-y-4 flex flex-col items-center">
                <div className="h-8 w-[320px] rounded-full bg-[#d9dc52]" />
                <div className="h-8 w-[260px] rounded-full bg-[#d9dc52]" />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </section>
    );
  }

  // =========================
  // ERROR (eye-catching)
  // =========================
  if (isError) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-red-50 via-white to-red-50">
        <div className="text-center p-8 rounded-2xl shadow-lg border border-red-200 bg-white max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            We couldn’t load hero content. Please refresh or try again later.
          </p>
        </div>
      </section>
    );
  }

  // =========================
  // EMPTY STATE (eye-catching)
  // =========================
  if (!banner) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 rounded-2xl shadow-md border bg-white max-w-md">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-700">
            No Hero Data Found
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Please check your CMS or backend configuration.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      style={{ backgroundColor: banner.backgroundColor || "#FBFF26" }}
      className="overflow-hidden"
    >
      <div className="container px-1 py-2 md:py-16 lg:py-20">
        <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8">
          {/* LEFT */}
          <div className="order-2 md:order-1 mx-auto w-full p-2 md:p-4">
            <h1
              style={{ color: banner?.textColor || "#2D3D4D" }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold leading-normal"
            >
              <span className="font-normal">{banner.firstTitle}</span>
              <br />
              {banner.secondTitle}
            </h1>

            <p
              style={{ color: banner?.textColor || "#2D3D4D" }}
              className="mt-4 max-w-[410px] text-sm md:text-base font-normal"
            >
              {banner.subTitle}
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleGetQuote();
              }}
              className="mt-6 w-full md:w-[80%]"
            >
              <div className="relative rounded-[999px] bg-white p-1 shadow-md">
                <div className="flex h-[52px] items-center gap-4 rounded-[999px]">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter postcode"
                      value={postcode}
                      onChange={(event) =>
                        handlePostcodeChange(event.target.value.toUpperCase())
                      }
                      onFocus={() => {
                        if (
                          isAddressLoading ||
                          addressOptions.length > 0 ||
                          addressError
                        ) {
                          setIsAddressDropdownOpen(true);
                        }
                      }}
                      onBlur={() => {
                        window.setTimeout(
                          () => setIsAddressDropdownOpen(false),
                          150,
                        );
                      }}
                      className="h-full w-full rounded-full px-4 py-2 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-[10px] bg-black text-white rounded-full hover:scale-105 transition-all duration-300"
                  >
                    {banner?.buttonText || "Get quote"}
                  </button>
                </div>

                {isAddressDropdownOpen &&
                  (isAddressLoading ||
                    addressOptions.length > 0 ||
                    addressError) && (
                    <div
                      className="absolute left-0 right-0 top-full z-50 mt-1 max-h-40 overflow-y-auto rounded-2xl border border-[#D5DCE3] bg-white shadow-lg"
                      data-lenis-prevent
                      data-lenis-prevent-wheel
                      data-lenis-prevent-touch
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
                              setSelectedAddress(address);
                              setAddressError(null);
                              setIsAddressDropdownOpen(false);
                            }}
                            className={`block w-full px-4 py-3 text-left text-base text-[#2D3D4D] hover:bg-[#F0F3F6] ${
                              selectedAddress === address
                                ? "bg-[#F0F3F6] font-medium"
                                : ""
                            }`}
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

              {postcodeError && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  {postcodeError}
                </p>
              )}

              {selectedAddress && !addressError && (
                <p className="mt-2 text-sm font-medium text-[#2D3D4D]">
                  Selected address: {selectedAddress}
                </p>
              )}
            </form>

            <ul className="mt-6 space-y-2">
              {heroPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#292D32] text-[#FBFF26]">
                    <Check className="h-4 w-4" />
                  </span>

                  <span
                    style={{ color: banner?.textColor || "#2D3D4D" }}
                    className="mt-[3px] text-sm md:text-base"
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="hidden md:block order-1 md:order-2 mx-auto w-full max-w-[560px]">
            <Image
              src={banner.image || "/assets/images/hero.png"}
              alt="Hero Image"
              width={1000}
              height={600}
              className="h-[290px] w-full object-contain md:h-[390px] lg:h-[400px] rounded-[12px]"
            />

            <h4
              style={{ color: banner?.textColor || "#292D32" }}
              className="mt-6 text-3xl md:text-4xl xl:text-5xl text-center font-semibold"
            >
              {banner.imageText}
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
