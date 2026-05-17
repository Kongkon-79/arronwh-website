import React from 'react'
import ReferHeroSection from './_components/refer-hero'
import ReferHowItWorks from './_components/how-it-works'
import Navbar from '@/components/shared/Navbar/Navbar'

const ReferAFriendPage = () => {
  return (
    <div>
        <Navbar />
        <ReferHeroSection/>
        <ReferHowItWorks/>
    </div>
  )
}

export default ReferAFriendPage