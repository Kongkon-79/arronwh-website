import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

type ContactCard = {
  title: string
  lines: string[]
  hours?: {
    weekday: string
    weekdayTime: string
    saturday?: string
    saturdayTime?: string
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
    extra: 'Email sales',
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
      weekdayTime: '8am - 6pm'
    },
    phone: '0330 113 1333',
    extra: 'Option 3',
  },
]

const ContactUsHero = () => {
  return (
    <section className="bg-[#dfe1e3] px-4 pb-10 pt-12 md:pb-12 md:pt-14">
      <div className="container">
        <h1 className="text-center text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-medium leading-none tracking-[-0.02em] text-[#22262d]">
          Contact us
        </h1>

        <div className="mt-5 md:mt-7 lg:mt-10 grid gap-6 md:grid-cols-3">
          {contactCards.map((card) => (
            <Card key={card.title} className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
              <CardContent className="flex min-h-[198px] flex-col p-4 sm:p-5">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-none tracking-[-0.02em] text-[#2a2e36]">
                  {card.title}
                </h2>

                <div className="mt-2 space-y-[1px] text-sm md:text-base font-medium leading-[1.3] text-[#424851]">
                  {card.lines.map((line, index) => (
                    <p key={`${card.title}-line-${index}`}>{line}</p>
                  ))}
                </div>

                {card.hours ? (
                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs md:text-sm font-semibold text-[#757b84]">
                    <p>{card.hours.weekday}</p>
                    <p className="text-right">{card.hours.weekdayTime}</p>
                    <p>{card.hours.saturday}</p>
                    <p className="text-right">{card.hours.saturdayTime}</p>
                  </div>
                ) : null}

                {card.cta ? (
                  <div className="mt-auto pt-6 md:pt-8 lg:pt-10 xl:pt-12 2xl:pt-14">
                    <Button
                      type="button"
                      className="h-9 md:h-10 rounded-full bg-[#db860f] px-6 text-base font-semibold text-white shadow-none hover:bg-[#c1760d]"
                    >
                      {card.cta} <ArrowRight />
                    </Button>
                  </div>
                ) : null}

                {card.phone ? (
                  <p className="mt-auto pt-4 text-lg md:text-xl font-semibold leading-none tracking-[-0.02em] text-[#2d3239]">
                    {card.phone}
                  </p>
                ) : null}

                {card.extra ? (
                  <p className="mt-1 text-[17px] font-medium leading-none tracking-[-0.01em] text-[#767d86]">
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
