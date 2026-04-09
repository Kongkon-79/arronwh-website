import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const trustpilotStars = Array.from({ length: 5 });

const Footer = () => {
  return (
    <footer className="border-t border-[#E8EDF3] bg-white">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-[260px]">
            <Link href="/" className="inline-flex">
              <Image
                src="/assets/images/logo.png"
                alt="Yolo Heat logo"
                width={180}
                height={72}
                className="h-auto w-[120px] object-contain"
              />
            </Link>

            <div className="mt-4">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#334155]">
                <span className="text-[#00B67A]">★</span>
                <span>Trustpilot</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                {trustpilotStars.map((_, index) => (
                  <span
                    key={index}
                    className="flex h-[16px] w-[16px] items-center justify-center rounded-[2px] bg-[#00B67A] text-[10px] text-white"
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className="mt-2 text-[11px] leading-4 text-[#475569]">
                4.8 in 56,714 reviews
              </p>
            </div>

            <p className="mt-4 max-w-[230px] text-[12px] leading-[1.45] text-[#475569]">
              Your trusted boiler installation experts. Fast, professional, and
              affordable heating solutions.
            </p>
          </div>

          <div>
            <h3 className="font-sora text-[22px] font-semibold text-[#334155] md:text-[24px]">
              Boilers
            </h3>

            <div className="mt-4 space-y-3">
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                New boilers
              </Link>
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                Reviews
              </Link>
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                How It Works
              </Link>
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                About Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-sora text-[22px] font-semibold text-[#334155] md:text-[24px]">
              Our Services
            </h3>

            <div className="mt-4 space-y-3">
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                Heating&apos;s Installation
              </Link>
              <Link href="/" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                Boiler Installation
              </Link>
              <Link href="/privacy-policy" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                Privacy Policy
              </Link>
              <Link href="/terms-and-condition" className="block text-[13px] text-[#475569] transition-colors hover:text-[#334155]">
                Terms of Service
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-sora text-[22px] font-semibold text-[#334155] md:text-[24px]">
              Contact
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-[13px] text-[#475569]">
                <Phone className="h-4 w-4 text-[#334155]" />
                <Link href="tel:08001234567">0800 123 4567</Link>
              </div>

              <div className="flex items-center gap-3 text-[13px] text-[#475569]">
                <Mail className="h-4 w-4 text-[#334155]" />
                <Link href="mailto:hello@yoloheat.co.uk">hello@yoloheat.co.uk</Link>
              </div>

              <div className="flex items-start gap-3 text-[13px] text-[#475569]">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#334155]" />
                <span>London, United Kingdom</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                aria-label="Twitter"
              >
                <FaTwitter className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <FaInstagram className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[#334155] transition-transform hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-[12px] text-[#64748B]">
          © 2026 YOLO HEAT. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
