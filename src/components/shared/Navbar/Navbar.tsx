"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", activeKey: "home" },
  { label: "Boiler", href: "/#heating", activeKey: "heating" },
  { label: "How it works", href: "/#how-it-works", activeKey: "how-it-works" },
  { label: "Reviews", href: "/#reviews", activeKey: "reviews" },
  { label: "About us", href: "/about-us", activeKey: "about-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/about-us") {
      setActiveSection("about-us");
      return;
    }

    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSection(hash || "home");
    };

    updateFromHash();

    const sectionIds = ["heating", "how-it-works", "reviews"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        } else if (window.scrollY < 160) {
          setActiveSection("home");
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, [pathname]);

  const isActiveLink = (activeKey: string | null) => {
    if (!activeKey) {
      return false;
    }

    return activeSection === activeKey;
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="border-b border-[#E8EDF3] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 lg:gap-6">
            <div className="flex items-center gap-8 lg:gap-12">
              <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                <Image
                  src="/assets/images/logo.png"
                  alt="Yolo Heat logo"
                  width={1000}
                  height={1000}
                  className="h-[54px] w-auto object-contain md:h-[60px]"
                />
              </Link>

              <div className="hidden items-center gap-7 lg:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      if (item.activeKey) {
                        setActiveSection(item.activeKey);
                      }
                    }}
                    className={`border-b-2 text-[15px] font-medium leading-normal transition-all duration-300 ${
                      isActiveLink(item.activeKey)
                        ? "border-primary text-primary"
                        : "border-transparent text-[#2D3D4D] hover:border-primary hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <Link
                href="/boilers/property-overview"
                className="inline-flex h-[46px] items-center justify-center rounded-[8px] bg-primary px-5 text-[15px] font-medium leading-normal text-[#2D3D4D] transition-colors hover:bg-[#F3CF43]"
              >
                Get your fixed price
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#2D3D4D] transition-colors hover:bg-[#F8FAFC] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {isOpen && (
            <div className="mt-4 rounded-[16px] border border-[#E8EDF3] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:hidden">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false);
                      if (item.activeKey) {
                        setActiveSection(item.activeKey);
                      }
                    }}
                    className={`rounded-[10px] px-3 py-3 text-sm font-medium leading-normal transition-colors ${
                      isActiveLink(item.activeKey)
                        ? "bg-[#FFF7D1] text-primary"
                        : "text-[#2D3D4D] hover:bg-[#F8FAFC] hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/#heating"
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-medium text-[#2D3D4D] transition-colors hover:bg-[#F3CF43]"
              >
                Get your fixed price
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
