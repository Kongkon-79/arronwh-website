"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircleQuestionMark, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HelpContainer from "@/app/(website)/helps/_components.tsx/help-container";
import { fetchNavbarLogo, NAVBAR_LOGO_QUERY_KEY } from "./navbar-logo-data";

const navItems = [
  { label: "Boiler", href: "/#heating", activeKey: "boiler" },
  { label: "How it works", href: "/#how-it-works", activeKey: "how-it-works" },
  { label: "About us", href: "/about-us", activeKey: "about-us" },
  { label: "Contact us", href: "/contact-us", activeKey: "contact-us" },
  {
    label: "Refer a friend",
    href: "/refer-a-friend",
    activeKey: "refer-a-friend",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { data: logo, isLoading: isLogoLoading } = useQuery({
    queryKey: NAVBAR_LOGO_QUERY_KEY,
    queryFn: fetchNavbarLogo,
  });
  const logoSrc = logo?.image?.trim() || "/assets/images/navlogo.png";

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-[#EAEBEC] shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
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
                  className="h-[80px] w-[220px] object-cover "
                />
              )}
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex flex-grow justify-center items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm md:text-base font-medium text-[#2D3D4D] leading-normal transition duration-300 ${
                  isActiveLink(item.href) ? " text-black" : "border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Help Button - Right Aligned */}
          <div className="hidden md:flex ml-auto">
            <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-transparent border border-[#2D3D4D] font-medium rounded-[8px] text-[#2D3D4D] text-base leading-normal flex items-center gap-2 hover:bg-primary hover:text-[#2D3D4D] transition duration-300"
                >
                  Help <MessageCircleQuestionMark className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                onWheelCapture={(event) => event.stopPropagation()}
                onTouchMoveCapture={(event) => event.stopPropagation()}
                className="flex h-screen w-full flex-col overflow-hidden border-l-0 p-0 sm:max-w-[530px] [&>button]:hidden"
              >
                <HelpContainer embedded onClose={() => setIsHelpOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center text-gray-800 hover:bg-gray-200 p-2 rounded-md"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#EAEBEC] shadow-md space-y-2 px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2 text-sm md:text-base font-medium text-[#2D3D4D] leading-normal transition duration-300 ${
                  isActiveLink(item.href) ? " text-black" : "border-transparent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-transparent border border-[#2D3D4D] font-medium rounded-[8px] text-[#2D3D4D] text-base leading-normal flex justify-center items-center gap-2 hover:bg-primary hover:text-[#2D3D4D] transition duration-300"
                >
                  Help <MessageCircleQuestionMark className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                data-lenis-prevent
                data-lenis-prevent-wheel
                data-lenis-prevent-touch
                onWheelCapture={(event) => event.stopPropagation()}
                onTouchMoveCapture={(event) => event.stopPropagation()}
                className="flex h-screen w-full flex-col overflow-hidden border-l-0 p-0 sm:max-w-[530px] [&>button]:hidden"
              >
                <HelpContainer embedded onClose={() => setIsHelpOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
