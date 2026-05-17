import React from 'react'
import { Facebook, Instagram, Youtube } from 'lucide-react'

const Social = () => {
  return (
    <section className="h-full rounded-[20px] bg-[#17191c] p-6 text-white sm:p-8">
      <h2 className="text-[44px] font-medium leading-none tracking-[-0.02em]">Social</h2>
      <p className="mt-4 text-[24px] font-medium leading-none tracking-[-0.01em] text-[#d4d7dc]">
        Be our friend, follow us.
      </p>

      <div className="mt-14 flex items-center justify-end gap-4 text-[#f0f0f0] sm:mt-16 sm:gap-5">
        <a
          href="#"
          aria-label="Facebook"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:text-white/80"
        >
          <Facebook className="h-7 w-7" strokeWidth={2.4} />
        </a>

        <a
          href="#"
          aria-label="X (Twitter)"
          className="text-[34px] font-medium leading-none tracking-[-0.02em] transition hover:text-white/80"
        >
          X
        </a>

        <a
          href="#"
          aria-label="Instagram"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:text-white/80"
        >
          <Instagram className="h-7 w-7" strokeWidth={2.3} />
        </a>

        <a
          href="#"
          aria-label="YouTube"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:text-white/80"
        >
          <Youtube className="h-7 w-7" strokeWidth={2.3} />
        </a>
      </div>
    </section>
  )
}

export default Social
