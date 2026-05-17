import React from 'react'
import { Handshake, Mail } from 'lucide-react'

const Partnerships = () => {
  return (
    <section className="relative h-full rounded-[20px] bg-[#d9dcdf] p-6 text-[#1f2022] sm:p-8">
      <h2 className="text-[44px] font-medium leading-none tracking-[-0.02em]">Partnerships</h2>
      <p className="mt-4 text-[24px] font-medium leading-none tracking-[-0.01em] text-[#313337]">
        Want to team up?
      </p>

      <a
        href="mailto:partnerships@example.com"
        className="mt-6 inline-flex items-center gap-2 text-[18px] font-medium underline decoration-1 underline-offset-2 transition hover:opacity-80"
      >
        <Mail className="h-4 w-4" strokeWidth={2.3} />
        Email partnerships
      </a>

      <div className="mt-12 flex justify-end text-black sm:mt-14">
        <Handshake className="h-14 w-14" strokeWidth={2.4} />
      </div>
    </section>
  )
}

export default Partnerships
