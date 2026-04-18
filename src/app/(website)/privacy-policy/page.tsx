import React from 'react'

import Faq from '../_components/faq'
import PrivacyPolicyContainer from './_components/privacy-policy-container'
import Navbar from '@/components/shared/Navbar/Navbar'

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Navbar />
      <PrivacyPolicyContainer/>
      <Faq/>
    </div>
  )
}

export default PrivacyPolicyPage