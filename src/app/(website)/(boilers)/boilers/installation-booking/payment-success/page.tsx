import React, { Suspense } from "react";
import BookingPaymentSuccessContainer from "./_components/booking-payment-success-container";

export default function BoilerInstallationPaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <BookingPaymentSuccessContainer />
    </Suspense>
  );
}
