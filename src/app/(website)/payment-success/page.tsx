import React, { Suspense } from 'react'
import BookingPaymentSuccessContainer from './_components/payment-success-container'
import Navbar from '@/components/shared/Navbar/Navbar'

const PaymentSuccessPage = () => {
  return (
    <div>
      <Navbar/>
       <Suspense fallback={null}>
            <BookingPaymentSuccessContainer />
          </Suspense>
    </div>
  )
}

export default PaymentSuccessPage