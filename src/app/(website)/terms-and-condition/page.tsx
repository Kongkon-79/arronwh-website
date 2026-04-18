import React from 'react'

import Faq from '../_components/faq'
import TermsConditionsContainer from './_components/terms-and-condition-container'
import Navbar from '@/components/shared/Navbar/Navbar'

const TermsAndContionPage = () => {
  return (
    <div>
      <Navbar />
      <TermsConditionsContainer/>
      <Faq/>
    </div>
  )
}

export default TermsAndContionPage