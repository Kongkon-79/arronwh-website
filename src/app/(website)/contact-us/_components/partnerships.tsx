import React from 'react'
import { Mail } from 'lucide-react'
import { FaHandsHelping } from "react-icons/fa";

const Partnerships = () => {
  return (
    <section className="relative h-full rounded-[22px] bg-[#d0d3d6] p-5 text-[#1f2329] sm:p-6">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em]">Partnerships</h2>
      <p className="mt-3 text-sm md:text-base font-medium leading-none tracking-[-0.01em] text-[#323741]">Want to team up?</p>

      <p
        // href="mailto:hello@yoloheat.co.uk"
        className="mt-5 inline-flex items-center gap-2 text-base font-medium cursor-pointer decoration-1 underline-offset-2 transition hover:opacity-90"
      >
        <Mail className="h-5 w-5" strokeWidth={2.2} />
        {/* Email partnerships */}
        hello@yoloheat.co.uk
      </p>

      <div className="mt-6 md:mt-8 lg:mt-10 flex justify-end text-black">
        <FaHandsHelping className="h-14 md:h-20 w-14 md:w-20" />
      </div>
    </section>
  )
}

export default Partnerships
