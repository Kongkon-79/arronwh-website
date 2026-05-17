import React from 'react'
import { Handshake, MousePointerClick, SquarePen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Step = {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

const steps: Step[] = [
  {
    id: 'question',
    title: 'You',
    description:
      'enter the email address used for your original order so we can find your account details.',
    icon: SquarePen,
  },
  {
    id: 'choose',
    title: 'Choose',
    description:
      'the product you’d like to recommend to your friend or family member. brand-new boiler or heat pump.',
    icon: MousePointerClick,
  },
  {
    id: 'share',
    title: 'Share',
    description:
      'your unique referral link they’ll get money off their install, and once their install is complete, we’ll send you cash.',
    icon: Handshake,
  },
]

const ReferHowItWorks = () => {
  return (
    <section className="relative bg-[#dfe1e3] px-4 pb-14 pt-8 sm:px-6 md:pt-10">
      <div className="absolute left-4 top-8 hidden text-[#20242b] md:block">
        <SquarePen className="h-12 w-12" strokeWidth={2.1} />
      </div>

      <div className="container">
        <h2 className="text-center text-[42px] font-semibold leading-none tracking-[-0.02em] text-[#1a2029] sm:text-[52px] md:text-[58px]">
          How it works
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:mt-12">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={step.id}
                className="rounded-[20px] bg-[#eaebec] p-5 sm:p-6"
              >
                <div className="mb-3 flex items-center text-black">
                  {index === 0 ? (
                    <span className="text-[52px] font-semibold leading-none">?</span>
                  ) : (
                    <Icon className="h-10 w-10" strokeWidth={2.5} />
                  )}
                </div>

                <p className="text-[33px] font-semibold leading-none tracking-[-0.01em] text-[#1f242d]">
                  {step.title}{' '}
                  <span className="text-[32px] font-normal leading-none text-[#2c323c]">
                    {step.description}
                  </span>
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ReferHowItWorks
