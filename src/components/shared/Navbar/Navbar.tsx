"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MessageCircleQuestionMark, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Boiler", href: "/#heating", activeKey: "boiler" },
  { label: "How it works", href: "/#how-it-works", activeKey: "how-it-works" },
  { label: "About us", href: "/about-us", activeKey: "about-us" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href); // Checks if the current path matches or starts with the href
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-[#EAEBEC] shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/navlogo.png"
                alt="Yolo Heat logo"
                width={1000}
                height={1000}
                className="h-[60px] w-[200px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex flex-grow justify-center items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm md:text-base font-medium text-[#2D3D4D] leading-normal transition duration-300 ${
                  isActiveLink(item.href)
                    ? " text-black"
                    : "border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Help Button - Right Aligned */}
          <div className="hidden md:flex ml-auto">
            <Link
              href="/helps"
              className="px-4 py-2 bg-transparent border border-[#2D3D4D] font-medium rounded-[8px] text-[#2D3D4D] text-base leading-normal flex items-center gap-2 hover:bg-primary hover:text-[#2D3D4D] transition duration-300"
            >
              Help <MessageCircleQuestionMark className="w-5 h-5" />
            </Link>
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
          <div className="md:hidden bg-[#EAEBEC] shadow-md px-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2 text-sm md:text-base font-medium text-[#2D3D4D] leading-normal transition duration-300 ${
                  isActiveLink(item.href)
                    ? " text-black"
                    : "border-transparent"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/helps"
              className="px-4 py-2 bg-transparent border border-[#2D3D4D] font-medium rounded-[8px] text-[#2D3D4D] text-base leading-normal flex justify-center items-center gap-2 hover:bg-primary hover:text-[#2D3D4D] transition duration-300"
            >
              Help <MessageCircleQuestionMark className="w-5 h-5" />
            </Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;










// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import { usePathname } from "next/navigation";

// const navItems = [
//   { label: "Home", href: "/", activeKey: "home" },
//   { label: "Boiler", href: "/#heating", activeKey: "heating" },
//   { label: "How it works", href: "/#how-it-works", activeKey: "how-it-works" },
//   { label: "Reviews", href: "/#reviews", activeKey: "reviews" },
//   { label: "About us", href: "/about-us", activeKey: "about-us" },
// ];

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("home");
//   const pathname = usePathname();

//   useEffect(() => {
//     setIsOpen(false);
//   }, [pathname]);

//   useEffect(() => {
//     if (pathname === "/about-us") {
//       setActiveSection("about-us");
//       return;
//     }

//     if (pathname !== "/") {
//       setActiveSection("");
//       return;
//     }

//     const updateFromHash = () => {
//       const hash = window.location.hash.replace("#", "");
//       setActiveSection(hash || "home");
//     };

//     updateFromHash();

//     const sectionIds = ["heating", "how-it-works", "reviews"];
//     const sections = sectionIds
//       .map((id) => document.getElementById(id))
//       .filter((section): section is HTMLElement => Boolean(section));

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visibleEntries = entries
//           .filter((entry) => entry.isIntersecting)
//           .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

//         if (visibleEntries.length > 0) {
//           setActiveSection(visibleEntries[0].target.id);
//         } else if (window.scrollY < 160) {
//           setActiveSection("home");
//         }
//       },
//       {
//         root: null,
//         rootMargin: "-35% 0px -45% 0px",
//         threshold: [0.2, 0.4, 0.6],
//       }
//     );

//     sections.forEach((section) => observer.observe(section));
//     window.addEventListener("hashchange", updateFromHash);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("hashchange", updateFromHash);
//     };
//   }, [pathname]);

//   const isActiveLink = (activeKey: string | null) => {
//     if (!activeKey) {
//       return false;
//     }

//     return activeSection === activeKey;
//   };

//   return (
//     <div className="sticky top-0 z-50">
//       <header className="border-b border-[#E8EDF3] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
//         <nav className="container mx-auto px-4 py-3">
//           <div className="flex items-center justify-between gap-4 lg:gap-6">
//             <div className="flex items-center gap-8 lg:gap-12">
//               <Link href="/" className="flex flex-shrink-0 items-center gap-2">
//                 <Image
//                   src="/assets/images/logo.png"
//                   alt="Yolo Heat logo"
//                   width={1000}
//                   height={1000}
//                   className="h-[52px] w-[200px] md:w-auto object-contain md:h-[60px]"
//                 />
//               </Link>

//               <div className="hidden items-center gap-7 lg:flex">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.label}
//                     href={item.href}
//                     onClick={() => {
//                       if (item.activeKey) {
//                         setActiveSection(item.activeKey);
//                       }
//                     }}
//                     className={`border-b-2 text-[15px] font-medium leading-normal transition-all duration-300 ${
//                       isActiveLink(item.activeKey)
//                         ? "border-primary text-primary"
//                         : "border-transparent text-[#2D3D4D] hover:border-primary hover:text-primary"
//                     }`}
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             <div className="hidden md:block">
//               <Link
//                 href="/boilers/property-overview"
//                 className="inline-flex h-[46px] items-center justify-center rounded-[8px] bg-primary px-5 text-[15px] font-medium leading-normal text-[#2D3D4D] transition-colors hover:bg-[#F3CF43]"
//               >
//                 Get your fixed price
//               </Link>
//             </div>

//             <button
//               type="button"
//               onClick={() => setIsOpen((prev) => !prev)}
//               className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#2D3D4D] transition-colors hover:bg-[#F8FAFC] lg:hidden"
//               aria-label="Toggle menu"
//               aria-expanded={isOpen}
//             >
//               {isOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>

//           {isOpen && (
//             <div className="mt-4 rounded-[16px] border border-[#E8EDF3] bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:hidden">
//               <div className="flex flex-col gap-1">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.label}
//                     href={item.href}
//                     onClick={() => {
//                       setIsOpen(false);
//                       if (item.activeKey) {
//                         setActiveSection(item.activeKey);
//                       }
//                     }}
//                     className={`rounded-[10px] px-3 py-3 text-sm font-medium leading-normal transition-colors ${
//                       isActiveLink(item.activeKey)
//                         ? "bg-[#FFF7D1] text-primary"
//                         : "text-[#2D3D4D] hover:bg-[#F8FAFC] hover:text-primary"
//                     }`}
//                   >
//                     {item.label}
//                   </Link>
//                 ))}
//               </div>

//               <Link
//                 href="/#heating"
//                 onClick={() => setIsOpen(false)}
//                 className="mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] bg-primary px-5 text-sm font-medium text-[#2D3D4D] transition-colors hover:bg-[#F3CF43]"
//               >
//                 Get your fixed price
//               </Link>
//             </div>
//           )}
//         </nav>
//       </header>
//     </div>
//   );
// };

// export default Navbar;
