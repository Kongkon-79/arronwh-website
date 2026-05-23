"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import {
  fetchNavbarLogo,
  NAVBAR_LOGO_QUERY_KEY,
} from "../Navbar/navbar-logo-data";
import { Badge } from "@/components/ui/badge";
import { FaPoundSign } from "react-icons/fa";

const trustpilotStars = Array.from({ length: 5 });

const Footer = () => {
  const { data: logo, isLoading: isLogoLoading } = useQuery({
    queryKey: NAVBAR_LOGO_QUERY_KEY,
    queryFn: fetchNavbarLogo,
  });
  const logoSrc = logo?.image?.trim() || "/assets/images/navlogo.png";

  const { data: socialData } = useQuery({
    queryKey: ["socialPartnership"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/v1/socialpartership");
      const result = await res.json();
      return result?.data?.[0];
    },
  });

  return (
    <footer className="shadow-[0px_-2px_4px_0px_#0000001A] bg-[#EAEBEC]">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-[260px]">
            <Link href="/" className="inline-flex">
              {isLogoLoading ? (
                <div
                  aria-hidden="true"
                  className="h-[80px] w-[220px] animate-pulse rounded-[8px] bg-[#DDE4EC]"
                />
              ) : (
                <Image
                  src={logoSrc}
                  alt="Yolo Heat logo"
                  width={1000}
                  height={1000}
                  className="h-[80px] w-[220px] object-cover"
                />
              )}
            </Link>

            <div className="mt-2">
              {/* <div className="flex items-center gap-2 ">
                <span className="text-[#00A56F]">
                  <Star className="fill-current" />
                </span>
                <span className="desc">Trustpilot</span>
              </div> */}

              <div className="mt-2 flex items-center gap-1">
                {trustpilotStars.map((_, index) => (
                  <span
                    key={index}
                    className="flex h-6 w-6 items-center justify-center rounded-[2px] bg-[#00A56F] text-[10px] text-white"
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </span>
                ))}
              </div>

              <p className="mt-2 desc">4.8 in 56,714 reviews</p>
            </div>

            <p className="mt-2 desc">
              Your trusted boiler installation experts. Fast, professional, and
              affordable heating solutions.
            </p>
          </div>

          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#2D3D4D] font-medium leading-normal">
              Boilers
            </h3>

            <div className="mt-4 space-y-3">
              <Link href="/#heating" className="block desc">
                New boilers
              </Link>
              <Link href="/#reviews" className="block desc">
                Reviews
              </Link>
              <Link href="/#how-it-works" className="block desc">
                How It Works
              </Link>
              <Link href="/about-us" className="block desc">
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#2D3D4D] font-medium leading-normal">
              Our Services
            </h3>

            <div className="mt-4 space-y-3">
              <Link href="/#heating" className="block desc">
                Boiler Installation
              </Link>
              <Link href="/privacy-policy" className="block desc">
                Privacy Policy
              </Link>
              <Link href="/terms-and-condition" className="block desc">
                Terms of Service
              </Link>
              <Link
                href="/refer-a-friend"
                className="desc flex items-center gap-2"
              >
                Refer a friend{" "}
                <Badge className="rounded-full px-3 py-[2px] ">
                  Get <FaPoundSign />
                  250
                </Badge>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg md:text-xl lg:text-2xl text-[#2D3D4D] font-medium leading-normal">
              Contact
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 desc">
                <Phone className="h-4 w-4 text-[#334155]" />
                <Link href="tel:08001234567">0800 123 4567</Link>
              </div>

              <div className="flex items-center gap-3 desc">
                <Mail className="h-4 w-4 text-[#334155]" />
                <Link href="mailto:hello@yoloheat.co.uk">
                  hello@yoloheat.co.uk
                </Link>
              </div>

              <div className="flex items-start gap-3 desc">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#334155]" />
                <span>London, United Kingdom</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {socialData?.socialLink?.length > 0 ? (
                socialData.socialLink.map((social: { link: string; icon: string }, index: number) => (
                  <Link
                    key={index}
                    target="_blank"
                    href={social.link}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5 overflow-hidden"
                    aria-label="Social Link"
                  >
                    <Image
                      src={social.icon}
                      alt="Social Icon"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    target="_blank"
                    href="https://www.facebook.com/Yoloheat"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                    aria-label="Twitter"
                  >
                    <FaTwitter className="h-4 w-4" />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://www.instagram.com/yolo.heat"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 md:mt-8 lg:mt-10 text-center desc">
          © 2026 YOLO HEAT. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
