import React from 'react'
import ContactUsHero from './_components/contact-us-hero'
import HeadOffice from './_components/head-office'
import Social from './_components/social'
import Partnerships from './_components/partnerships'
import Navbar from '@/components/shared/Navbar/Navbar'

const ContactUsPage = () => {
  return (
    <div className="bg-[#dfe1e3]">
      <Navbar />
      <ContactUsHero />

      <section className="px-4 pb-4 pt-2 md:pb-8 md:pt-3">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Social />
            <Partnerships />
          </div>
        </div>
      </section>

      <HeadOffice />
    </div>
  )
}

export default ContactUsPage
