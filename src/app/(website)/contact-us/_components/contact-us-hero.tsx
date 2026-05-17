import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ContactCard = {
  title: string
  lines: string[]
  hours?: {
    weekday: string
    weekdayTime: string
    saturday: string
    saturdayTime: string
  }
  phone?: string
  extra?: string
  cta?: string
}

const contactCards: ContactCard[] = [
  {
    title: 'Sales',
    lines: ['Looking to buy a new boiler, or', 'boiler panel?'],
    hours: {
      weekday: 'Mon-Fri',
      weekdayTime: '8am - 6pm',
      saturday: 'Saturday',
      saturdayTime: '8am - 4pm',
    },
    phone: '0330 113 1333',
    extra: 'mail sales',
  },
  {
    title: 'Aftercare',
    lines: ['Have an issue or need some', 'support?'],
    cta: 'Raise an issue',
  },
  {
    title: 'Engineers',
    lines: ['Want to join our network, or need', 'assistance?'],
    hours: {
      weekday: 'Mon-Fri',
      weekdayTime: '8am - 6pm',
      saturday: 'Saturday',
      saturdayTime: '8am - 4pm',
    },
    phone: '0330 113 1333',
    extra: 'Option 3',
  },
]

const ContactUsHero = () => {
  return (
    <section className="bg-[#e6e7e8] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-[1060px]">
        <h1 className="text-center text-[56px] font-medium leading-none tracking-[-0.02em] text-[#232323]">
          Contact us
        </h1>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {contactCards.map((card) => (
            <Card
              key={card.title}
              className="rounded-[22px] border-0 bg-white p-0 shadow-none"
            >
              <CardContent className="flex min-h-[278px] flex-col p-7">
                <h2 className="text-[43px] font-semibold leading-none tracking-[-0.02em] text-[#222222]">
                  {card.title}
                </h2>

                <div className="mt-5 space-y-[2px] text-[14px] font-semibold leading-[1.3] text-[#424242]">
                  {card.lines.map((line, index) => (
                    <p key={`${card.title}-line-${index}`}>{line}</p>
                  ))}
                </div>

                {card.hours ? (
                  <div className="mt-6 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[13px] font-semibold text-[#747474]">
                    <p>{card.hours.weekday}</p>
                    <p className="text-right">{card.hours.weekdayTime}</p>
                    <p>{card.hours.saturday}</p>
                    <p className="text-right">{card.hours.saturdayTime}</p>
                  </div>
                ) : null}

                {card.cta ? (
                  <div className="mt-auto pt-8">
                    <Button
                      type="button"
                      className="h-8 rounded-full bg-[#dd850f] px-7 text-[12px] font-semibold text-white shadow-none hover:bg-[#c8770d]"
                    >
                      {card.cta}
                    </Button>
                  </div>
                ) : null}

                {card.phone ? (
                  <p className="mt-auto pt-5 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#2d2d2d]">
                    {card.phone}
                  </p>
                ) : null}

                {card.extra ? (
                  <p className="mt-1 text-[22px] font-medium leading-none tracking-[-0.01em] text-[#8a8a8a]">
                    {card.extra}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ContactUsHero
