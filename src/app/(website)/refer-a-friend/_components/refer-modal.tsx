"use client";

import React, { useState, FormEvent, useEffect, useRef, useMemo } from "react";
import { X, Send, User, Mail, Phone, MapPin, Hash, MessageSquare, ChevronDown, Search, Check } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { countries } from "@/app/(website)/(boilers)/boilers/property-overview/_lib/countries";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReferModalProps = {
  open: boolean;
  onClose: () => void;
  referredBy: string;
};

type ReferPayload = {
  referred_by: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  address: string;
  message: string;
};

// ─── Postcode helpers (ported from personal-info-form) ────────────────────────

const UK_POSTCODE_REGEX = /^([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}|GIR\s*0AA)$/i;
const isValidUKPostcode = (postcode: string) => UK_POSTCODE_REGEX.test(postcode.trim());

type PostcodeApiResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  errorSources?: Array<{ path?: string; message?: string }>;
  data?: { postcode?: string; locations?: string[]; addresses?: string[]; total?: number } | string[] | null;
};

const resolvePostcodeEndpoint = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return `${process.env.NEXT_PUBLIC_API_BASE_URL}/postcode`;
  if (process.env.NEXT_PUBLIC_BACKEND_URL) return `${process.env.NEXT_PUBLIC_BACKEND_URL}/postcode`;
  return "/api/v1/postcode";
};

const normalizeLocationList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").map((s) => s.trim()).filter(Boolean);
};

const extractLocations = (result: PostcodeApiResponse | null): string[] => {
  const data = result?.data;
  if (Array.isArray(data)) return normalizeLocationList(data);
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  const addresses = normalizeLocationList(obj.addresses);
  return addresses.length > 0 ? addresses : normalizeLocationList(obj.locations);
};

const fetchPostcodeLocations = async (postcode: string, signal: AbortSignal): Promise<string[]> => {
  const res = await fetch(`${resolvePostcodeEndpoint()}/${encodeURIComponent(postcode.trim())}/addresses`, { signal });
  const result = (await res.json().catch(() => null)) as PostcodeApiResponse | null;
  const hasFailure = result?.success === false || result?.status === false;
  if (!res.ok || hasFailure) {
    const msg = result?.errorSources?.find((s) => typeof s?.message === "string" && s.message.trim())?.message;
    throw new Error(msg || result?.message || "Failed to fetch addresses.");
  }
  return extractLocations(result);
};

// ─── Phone validation helpers ────────────────────────────────────────────────

const getCountryDialCodeVariants = (dialCode: string): string[] => {
  const cleaned = dialCode.replace("+", "").trim();
  if (!cleaned) return [];
  const parts = cleaned.split("-").filter(Boolean);
  return parts.length === 1 ? [parts[0]] : [parts.join("")];
};

const normalizePhone = (phone: string) => phone.replace(/[^\d+]/g, "");

const ALL_COUNTRY_CODES = Array.from(
  new Set(countries.flatMap((c) => getCountryDialCodeVariants(c.dial_code)).filter(Boolean))
).sort((a, b) => b.length - a.length);

const isValidPhoneForCountry = (phone: string, selectedDialCode: string): boolean => {
  const normalized = normalizePhone(phone).trim();
  if (!normalized) return false;
  const digitsOnly = normalized.replace(/\D/g, "");
  if (digitsOnly.length < 6 || digitsOnly.length > 15) return false;
  const codeVariants = getCountryDialCodeVariants(selectedDialCode);
  if (codeVariants.length === 0) return false;
  if (normalized.startsWith("+")) {
    const matchedVariant = codeVariants.find((code) => digitsOnly.startsWith(code));
    if (!matchedVariant) return false;
    const subscriberNumber = digitsOnly.slice(matchedVariant.length);
    return subscriberNumber.length >= 6 && subscriberNumber.length <= 12;
  }
  const startsWithAnotherCode = ALL_COUNTRY_CODES.some(
    (code) => !codeVariants.includes(code) && digitsOnly.startsWith(code) && digitsOnly.length > code.length + 5
  );
  if (startsWithAnotherCode) return false;
  return digitsOnly.length >= 7 && digitsOnly.length <= 12;
};

// ─── Country Selector (inline) ───────────────────────────────────────────────

interface CountrySelectorProps {
  selectedCountry: (typeof countries)[0];
  onSelect: (country: (typeof countries)[0]) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const q = search.toLowerCase();
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dial_code.includes(search) || c.code.toLowerCase().includes(q)
    );
  }, [search]);

  useEffect(() => { setActiveIndex(-1); }, [search]);

  useEffect(() => {
    if (activeIndex >= 0) itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((p) => Math.min(p + 1, filteredCountries.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter" && activeIndex >= 0) { e.preventDefault(); onSelect(filteredCountries[activeIndex]); setOpen(false); setSearch(""); }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="flex h-10 items-center gap-2 rounded-[6px] bg-white px-3 shadow-sm transition hover:bg-gray-50 focus:outline-none">
          <div className="flex h-6 w-8 items-center justify-center overflow-hidden rounded-sm border border-gray-100">
            <Image src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`} alt={selectedCountry.name} width={40} height={30} className="h-full w-full object-cover" />
          </div>
          <span className="text-sm font-medium text-[#2D3D4D]">{selectedCountry.dial_code}</span>
          <ChevronDown className={cn("h-4 w-4 text-[#2D3D4D] transition-transform", open && "rotate-180")} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={8} className="z-[200] w-[320px] rounded-xl border border-gray-100 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200" onKeyDown={handleKeyDown}>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input autoFocus placeholder="Search country or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-10 w-full rounded-lg bg-gray-50 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1450e6]/20" />
          </div>
          <div className="h-[260px] overflow-y-auto overflow-x-hidden pr-1 overscroll-contain" style={{ scrollbarWidth: "thin" }}>
            <div className="space-y-0.5">
              {filteredCountries.length > 0 ? filteredCountries.map((country, index) => (
                <button key={country.code} ref={(el) => { itemRefs.current[index] = el; }} onClick={() => { onSelect(country); setOpen(false); setSearch(""); }} onMouseEnter={() => setActiveIndex(index)}
                  className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors", (selectedCountry.code === country.code || activeIndex === index) ? "bg-gray-100 font-semibold" : "hover:bg-gray-50")}>
                  <div className="flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-gray-100">
                    <Image width={40} height={30} src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} alt={country.name} className="h-full w-full object-cover" />
                  </div>
                  <span className="flex-1 truncate text-[#2D3D4D]">{country.name}</span>
                  <span className="text-xs text-gray-400">{country.dial_code}</span>
                  {selectedCountry.code === country.code && <Check className="h-4 w-4 text-[#1450e6]" />}
                </button>
              )) : (
                <div className="py-8 text-center text-sm text-gray-500">No results found</div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// ─── Empty form factory ──────────────────────────────────────────────────────

const emptyForm = (referredBy: string): ReferPayload => ({
  referred_by: referredBy,
  name: "",
  email: "",
  phone: "",
  postcode: "",
  address: "",
  message: "",
});

// ─── Main Modal ───────────────────────────────────────────────────────────────

const ReferModal: React.FC<ReferModalProps> = ({ open, onClose, referredBy }) => {
  const [formData, setFormData] = useState<ReferPayload>(emptyForm(referredBy));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ── Phone / country state ──
  const [selectedCountry, setSelectedCountry] = useState(countries.find((c) => c.code === "GB") || countries[0]);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // ── Postcode / address state ──
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData(emptyForm(referredBy));
      setSelectedCountry(countries.find((c) => c.code === "GB") || countries[0]);
      setPostcodeError(null);
      setAddressOptions([]);
      setAddressError(null);
      setIsAddressLoading(false);
      setIsAddressDropdownOpen(false);
      setPhoneError(null);
    }
  }, [open, referredBy]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Postcode → address lookup
  useEffect(() => {
    const postcode = formData.postcode.trim();
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
        .then((locs) => {
          setAddressOptions(locs);
          setIsAddressDropdownOpen(true);
          if (locs.length === 0) setAddressError("No addresses found for this postcode.");
        })
        .catch((err) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setAddressOptions([]);
          setAddressError(err instanceof Error ? err.message : "Unable to fetch addresses.");
        })
        .finally(() => { if (!controller.signal.aborted) setIsAddressLoading(false); });
    }, 400);
    return () => { window.clearTimeout(timeoutId); controller.abort(); };
  }, [formData.postcode]);

  const handlePostcodeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, postcode: value, address: "" }));
    setAddressOptions([]);
    setAddressError(null);
    setIsAddressDropdownOpen(false);
    if (postcodeError) setPostcodeError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Validate postcode
    const postcode = formData.postcode.trim();
    if (!postcode) { setPostcodeError("Postcode is required."); hasError = true; }
    else if (!isValidUKPostcode(postcode)) { setPostcodeError("Only valid UK postcode is allowed."); hasError = true; }
    else setPostcodeError(null);

    // Validate address
    if (!formData.address.trim()) { setAddressError("Please select your address."); setIsAddressDropdownOpen(true); hasError = true; }
    else setAddressError(null);

    // Validate phone
    const phone = formData.phone.trim();
    if (!phone) { setPhoneError("Phone number is required."); hasError = true; }
    else if (!isValidPhoneForCountry(phone, selectedCountry.dial_code)) {
      setPhoneError(`Enter a valid number for ${selectedCountry.name}. International format: ${selectedCountry.dial_code}…`);
      hasError = true;
    } else setPhoneError(null);

    if (hasError) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit referral");
      toast.success(data?.message || "Referral submitted successfully!");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (e.target === overlayRef.current) onClose();
  // };

  // onClick={handleOverlayClick}

  if (!open) return null;

  return (
    <div ref={overlayRef}  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#1450e6] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Refer a Friend</h2>
            <p className="text-blue-200 text-sm mt-0.5">Fill in the details below and we&apos;ll take care of the rest.</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-6 max-h-[75vh] overflow-y-auto">
          {/* Referred by badge */}
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-[#1450e6]">
            <Mail size={15} className="shrink-0" />
            <span className="font-medium">Referred by:&nbsp;</span>
            <span className="truncate">{referredBy}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="ref-name" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]">
                <User size={14} className="text-[#1450e6]" /> Name <span className="text-[#d72638]">*</span>
              </label>
              <input id="ref-name" name="name" type="text" required placeholder="John Smith" value={formData.name} onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="ref-email" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]">
                <Mail size={14} className="text-[#1450e6]" /> Friend&apos;s Email <span className="text-[#d72638]">*</span>
              </label>
              <input id="ref-email" name="email" type="email" required placeholder="friend@example.com" value={formData.email} onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition" />
            </div>

            {/* Phone with CountrySelector */}
            <div>
              <label htmlFor="ref-phone" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]">
                <Phone size={14} className="text-[#1450e6]" /> Phone <span className="text-[#d72638]">*</span>
              </label>
              <div className={cn("flex h-11 w-full items-center gap-2 overflow-hidden rounded-lg border bg-[#f8f9fb] px-2 transition", phoneError ? "border-red-400 ring-1 ring-red-400" : "border-[#d4d8de] focus-within:border-[#1450e6] focus-within:ring-1 focus-within:ring-[#1450e6]/20")}>
                <div className="shrink-0">
                  <CountrySelector selectedCountry={selectedCountry} onSelect={(c) => { setSelectedCountry(c); if (phoneError) setPhoneError(null); }} />
                </div>
                <input id="ref-phone" name="phone" type="tel" placeholder="07700 900000" value={formData.phone}
                  onChange={(e) => { handleChange(e); if (phoneError) setPhoneError(null); }}
                  className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:outline-none" />
              </div>
              {phoneError && <p className="mt-1 text-xs font-medium text-red-500">{phoneError}</p>}
            </div>

            {/* Postcode */}
            <div>
              <label htmlFor="ref-postcode" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]">
                <Hash size={14} className="text-[#1450e6]" /> Postcode <span className="text-[#d72638]">*</span>
              </label>
              <div className="relative">
                <input id="ref-postcode" name="postcode" type="text" required placeholder="e.g. SW1A 1AA"
                  value={formData.postcode}
                  onChange={(e) => handlePostcodeChange(e.target.value.toUpperCase())}
                  onFocus={() => { if (isAddressLoading || addressOptions.length > 0 || addressError) setIsAddressDropdownOpen(true); }}
                  onBlur={() => { window.setTimeout(() => setIsAddressDropdownOpen(false), 150); }}
                  className={cn(
                    "w-full rounded-lg border bg-[#f8f9fb] px-4 py-2.5 pr-10 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:outline-none focus:ring-2 transition",
                    postcodeError || (addressError && !formData.address)
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-[#d4d8de] focus:border-[#1450e6] focus:ring-[#1450e6]/10"
                  )} />
                <ChevronDown className={cn("pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-transform", isAddressDropdownOpen && "rotate-180")} />

                {/* Address Dropdown */}
                {isAddressDropdownOpen && (isAddressLoading || addressOptions.length > 0 || addressError) && (
                  <div
                    data-lenis-prevent data-lenis-prevent-wheel data-lenis-prevent-touch
                    onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-52 overflow-y-auto overscroll-contain rounded-lg border border-[#d4d8de] bg-white shadow-lg"
                  >
                    {isAddressLoading ? (
                      <div className="space-y-2 px-4 py-3 animate-pulse">
                        <div className="h-4 w-full rounded bg-gray-100" />
                        <div className="h-4 w-[85%] rounded bg-gray-100" />
                        <div className="h-4 w-[70%] rounded bg-gray-100" />
                      </div>
                    ) : addressOptions.length > 0 ? (
                      addressOptions.map((addr) => (
                        <button key={addr} type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => { setFormData((prev) => ({ ...prev, address: addr })); setAddressError(null); setIsAddressDropdownOpen(false); }}
                          className={cn("block w-full px-4 py-2.5 text-left text-sm text-[#202734] hover:bg-[#f8f9fb]", formData.address === addr && "bg-[#f8f9fb] font-medium")}>
                          {addr}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-red-500">{addressError || "No addresses found."}</div>
                    )}
                  </div>
                )}
              </div>
              {postcodeError && <p className="mt-1 text-xs font-medium text-red-500">{postcodeError}</p>}
              {addressError && !isAddressDropdownOpen && <p className="mt-1 text-xs font-medium text-red-500">{addressError}</p>}
              {formData.address && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#1450e6]">
                  <MapPin size={11} /> {formData.address}
                </p>
              )}
            </div>

            {/* Address manual input (hidden – selected via dropdown, but keep as read-only display) */}
            <input type="hidden" name="address" value={formData.address} />

            {/* Message */}
            <div>
              <label htmlFor="ref-message" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]">
                <MessageSquare size={14} className="text-[#1450e6]" /> Message
              </label>
              <textarea id="ref-message" name="message" rows={3} placeholder="Add a personal note (optional)…"
                value={formData.message} onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition resize-none" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button type="button" onClick={onClose} disabled={isSubmitting}
                className="flex-1 rounded-lg border border-[#d4d8de] bg-white py-2.5 text-sm font-medium text-[#202734] transition hover:bg-[#f0f2f5] disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1450e6] py-2.5 text-sm font-medium text-white transition hover:bg-[#1148cf] disabled:opacity-50">
                {isSubmitting ? (
                  <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Submitting…</>
                ) : (
                  <><Send size={14} /> Send Referral</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReferModal;
