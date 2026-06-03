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

type ReviewItem = {
  _id: string;
  rating: number;
  isActive?: boolean;
};

type ReviewResponse = {
  data: ReviewItem[];
  meta?: { page?: number; limit?: number; total?: number };
};

type FooterManagement = {
  location?: string;
  email?: string;
  phone?: string;
  reviewDescription?: string;
};

type FooterManagementResponse = {
  success?: boolean;
  message?: string;
  data?: FooterManagement[];
};

const FOOTER_MANAGEMENT_QUERY_KEY = ["footer-management"];

const footerFallback: Required<FooterManagement> = {
  location: "London, United Kingdom",
  email: "hello@yoloheat.co.uk",
  phone: "0800 123 4567",
  reviewDescription:
    "Your trusted boiler installation experts. Fast, professional, and affordable heating solutions.",
};

const resolveFooterManagementEndpoint = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/footer-management`;
  }

  return "/api/v1/footer-management";
};

const fetchFooterManagement = async (): Promise<FooterManagement | null> => {
  const response = await fetch(resolveFooterManagementEndpoint(), {
    headers: {
      accept: "application/json",
    },
  });

  const result = (await response
    .json()
    .catch(() => null)) as FooterManagementResponse | null;

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch footer management");
  }

  return result.data?.[0] ?? null;
};

const FooterSkeletonLine = ({ className }: { className: string }) => (
  <span
    aria-hidden="true"
    className={`block animate-pulse rounded bg-[#DDE4EC] ${className}`}
  />
);

const Footer = () => {
  const { data: logo, isLoading: isLogoLoading } = useQuery({
    queryKey: NAVBAR_LOGO_QUERY_KEY,
    queryFn: fetchNavbarLogo,
  });
  const logoSrc = logo?.image?.trim() || "/assets/images/navlogo.png";

  const { data: footerManagement, isLoading: isFooterManagementLoading } =
    useQuery({
      queryKey: FOOTER_MANAGEMENT_QUERY_KEY,
      queryFn: fetchFooterManagement,
    });

  const footerContact = {
    location: footerManagement?.location?.trim() || footerFallback.location,
    email: footerManagement?.email?.trim() || footerFallback.email,
    phone: footerManagement?.phone?.trim() || footerFallback.phone,
    reviewDescription:
      footerManagement?.reviewDescription?.trim() ||
      footerFallback.reviewDescription,
  };
  const phoneHref = `tel:${footerContact.phone.replace(/[^\d+]/g, "")}`;

  const { data: reviewData } = useQuery<ReviewResponse>({
    queryKey: ["reviews-summary"],
    queryFn: async () => {
      const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/review`;
      const firstRes = await fetch(
        `${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=50&page=1`
      );
      if (!firstRes.ok) throw new Error("Failed to fetch reviews");

      const firstPage: ReviewResponse = await firstRes.json();
      const firstPageData = firstPage?.data || [];
      const total = firstPage?.meta?.total || firstPageData.length;
      const limit = firstPage?.meta?.limit || 50;
      const totalPages = Math.max(1, Math.ceil(total / limit));

      if (totalPages === 1) return { ...firstPage, data: firstPageData };

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }).map((_, i) =>
          fetch(
            `${baseUrl}?sortBy=createdAt&sortOrder=desc&limit=${limit}&page=${i + 2}`
          ).then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch all reviews");
            const pageData: ReviewResponse = await res.json();
            return pageData?.data || [];
          })
        )
      );

      const flattenedData = [firstPageData, ...remainingPages].flat();
      return {
        ...firstPage,
        data: flattenedData,
        meta: { ...firstPage.meta, total: flattenedData.length },
      };
    },
  });

  const reviews = (reviewData?.data || []).filter((item) => item?.isActive !== false);
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / totalReviews
    : 0;
  const formattedAverageRating = averageRating.toFixed(1);

  const { data: socialData } = useQuery({
    queryKey: ["socialPartnership"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/socialpartership`);
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
                  className="h-[80px] w-[170px] animate-pulse rounded-[8px] bg-[#DDE4EC]"
                />
              ) : (
                <Image
                  src={logoSrc}
                  alt="Yolo Heat logo"
                  width={1000}
                  height={1000}
                  className="h-[80px] w-[170px] object-contain"
                />
              )}
            </Link>

            <div className="mt-2">
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`flex h-6 w-6 items-center justify-center rounded-[2px] text-[10px] text-white ${
                      index < Math.round(averageRating) ? "bg-[#00A56F]" : "bg-[#CFD6DD]"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </span>
                ))}
              </div>

              <p className="mt-2 desc">
                {totalReviews > 0
                  ? `${formattedAverageRating} in ${totalReviews.toLocaleString()} reviews`
                  : "4.8 in 56,714 reviews"}
              </p>
            </div>

            {isFooterManagementLoading ? (
              <div className="mt-2 space-y-2">
                <FooterSkeletonLine className="h-3 w-full" />
                <FooterSkeletonLine className="h-3 w-11/12" />
                <FooterSkeletonLine className="h-3 w-4/5" />
              </div>
            ) : (
              <p className="mt-2 desc">{footerContact.reviewDescription}</p>
            )}
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
              {isFooterManagementLoading ? (
                <>
                  <div className="flex items-center gap-3 desc">
                    <Phone className="h-4 w-4 text-[#334155]" />
                    <FooterSkeletonLine className="h-4 w-28" />
                  </div>

                  <div className="flex items-center gap-3 desc">
                    <Mail className="h-4 w-4 text-[#334155]" />
                    <FooterSkeletonLine className="h-4 w-40" />
                  </div>

                  <div className="flex items-start gap-3 desc">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#334155]" />
                    <FooterSkeletonLine className="h-4 w-36" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 desc">
                    <Phone className="h-4 w-4 text-[#334155]" />
                    <Link href={phoneHref}>{footerContact.phone}</Link>
                  </div>

                  <div className="flex items-center gap-3 desc">
                    <Mail className="h-4 w-4 text-[#334155]" />
                    <Link href={`mailto:${footerContact.email}`}>
                      {footerContact.email}
                    </Link>
                  </div>

                  <div className="flex items-start gap-3 desc">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#334155]" />
                    <span>{footerContact.location}</span>
                  </div>
                </>
              )}
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
