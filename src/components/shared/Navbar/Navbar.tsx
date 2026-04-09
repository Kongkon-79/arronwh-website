


"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

import LogoutModal from "@/components/modals/LogoutModal"
import { toast } from "sonner"


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)


 

  

  const handLogout = async () => {
    try {
      toast.success("Logout successful!")
      await signOut({ callbackUrl: "/" })
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    }
  }

  return (
    <div className="sticky top-0 z-50">
      <header className="w-full bg-white shadow-[0px_-2px_10px_0px_#00000040]">
        <nav className="container mx-auto px-4 py-3 ">
          <div className="flex items-center justify-between gap-5">
           <div className="flex items-center gap-8 md:gap-10 lg:gap-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={1000}
                height={1000}
                className="w-auto h-[60px] object-contain"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Home
              </Link>


              <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Broiler
              </Link>

               <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Heating
              </Link>

               <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                How it works
              </Link>

               <Link
                href="/"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                Reviews
              </Link>
               <Link
                href="/about-us"
                className={`text-sm md:text-[15px] hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/about-us" ? "border-b-[2px] border-primary text-primary" : "border-0"
                  }`}
              >
                About us
              </Link>

            </div>
           </div>

            <div>
              <button className="h-[48px] bg-primary text-[#2D3D4D] font-medium text-base leading-normal rounded-[8px] px-5">Get your fixed price</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="mt-4 md:hidden flex flex-col space-y-3 pb-4">

              <Link
                href="/"
                className={`w-fit text-sm md:text-base hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/" ? "border-b-[2px] border-primary" : "border-0"
                  }`}
              >
                Home
              </Link>

              <Link
                href="/about-us"
                className={`w-fit text-sm md:text-base hover:text-primary leading-normal text-[#2D3D4D] font-medium transition-all ease-in-out duration-300 ${pathname === "/about-us" ? "border-b-[2px] border-primary" : "border-0"
                  }`}
              >
                About Us
              </Link>
            </div>
          )}
        </nav>
      </header>

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handLogout}
        />
      )}
    </div>
  )
}

export default Navbar