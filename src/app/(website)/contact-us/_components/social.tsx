import React from 'react'
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Social = () => {
  return (
    <section className="h-full rounded-[22px] bg-[#15171a] p-5 text-white sm:p-6">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em] text-[#f1f1f2]">Social</h2>
      <p className="mt-3 text-sm md:text-base font-medium leading-none tracking-[-0.01em] text-[#d2d6dc]">
        Be our friend, follow us.
      </p>

      <div className="mt-14 md:mt-14 lg:mt-16 xl:mt-24 flex items-center justify-end gap-4 text-[#f3f3f3]">
        <a href="#" aria-label="Facebook" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80">
          <FaFacebook className="h-8 w-8" />
        </a>
        <a href="#" aria-label="X (Twitter)" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80">
          <FaXTwitter className="h-8 w-8" />
        </a>
        <a href="#" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80">
          <FaInstagram className="h-8 w-8" />
        </a>
        <a href="#" aria-label="YouTube" className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80">
          <IoLogoYoutube className="h-8 w-8" />
        </a>
      </div>
    </section>
  )
}

export default Social
