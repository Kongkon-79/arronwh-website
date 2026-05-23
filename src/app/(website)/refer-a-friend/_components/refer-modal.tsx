"use client";

import React, { useState, FormEvent, useEffect, useRef } from "react";
import { X, Send, User, Mail, Phone, MapPin, Hash, MessageSquare } from "lucide-react";
import { toast } from "sonner";

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

const emptyForm = (referredBy: string): ReferPayload => ({
  referred_by: referredBy,
  name: "",
  email: "",
  phone: "",
  postcode: "",
  address: "",
  message: "",
});

const ReferModal: React.FC<ReferModalProps> = ({ open, onClose, referredBy }) => {
  const [formData, setFormData] = useState<ReferPayload>(emptyForm(referredBy));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync referred_by when prop changes & reset the form each time modal opens
  useEffect(() => {
    if (open) {
      setFormData(emptyForm(referredBy));
    }
  }, [open, referredBy]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/v1/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit referral");
      toast.success(data?.message || "Referral submitted successfully!");
      onClose(); // onClose in hero also resets the hero email input
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#1450e6] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Refer a Friend</h2>
            <p className="text-blue-200 text-sm mt-0.5">
              Fill in the details below and we&apos;ll take care of the rest.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            aria-label="Close modal"
          >
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
              <label
                htmlFor="ref-name"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
              >
                <User size={14} className="text-[#1450e6]" /> Name <span className="text-[#d72638]">*</span>
              </label>
              <input
                id="ref-name"
                name="name"
                type="text"
                required
                placeholder="John Smith"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="ref-email"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
              >
                <Mail size={14} className="text-[#1450e6]" /> Friend&apos;s Email <span className="text-[#d72638]">*</span>
              </label>
              <input
                id="ref-email"
                name="email"
                type="email"
                required
                placeholder="friend@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="ref-phone"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
              >
                <Phone size={14} className="text-[#1450e6]" /> Phone <span className="text-[#d72638]">*</span>
              </label>
              <input
                id="ref-phone"
                name="phone"
                type="tel"
                required
                placeholder="07700 900000"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition"
              />
            </div>

            {/* Postcode + Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="ref-postcode"
                  className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
                >
                  <Hash size={14} className="text-[#1450e6]" /> Postcode <span className="text-[#d72638]">*</span>
                </label>
                <input
                  id="ref-postcode"
                  name="postcode"
                  type="text"
                  required
                  placeholder="SW1A 1AA"
                  value={formData.postcode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition"
                />
              </div>
              <div>
                <label
                  htmlFor="ref-address"
                  className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
                >
                  <MapPin size={14} className="text-[#1450e6]" /> Address <span className="text-[#d72638]">*</span>
                </label>
                <input
                  id="ref-address"
                  name="address"
                  type="text"
                  required
                  placeholder="10 Downing St"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="ref-message"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#202734]"
              >
                <MessageSquare size={14} className="text-[#1450e6]" /> Message
              </label>
              <textarea
                id="ref-message"
                name="message"
                rows={3}
                placeholder="Add a personal note (optional)…"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#d4d8de] bg-[#f8f9fb] px-4 py-2.5 text-sm text-[#202734] placeholder:text-[#a9afb8] focus:border-[#1450e6] focus:outline-none focus:ring-2 focus:ring-[#1450e6]/10 transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-[#d4d8de] bg-white py-2.5 text-sm font-medium text-[#202734] transition hover:bg-[#f0f2f5] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1450e6] py-2.5 text-sm font-medium text-white transition hover:bg-[#1148cf] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Referral
                  </>
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
