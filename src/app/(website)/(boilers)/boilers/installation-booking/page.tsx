import { Suspense } from "react";
import InstallationBookingContainer from "./_components/installation-booking-container";

const InstallationBookingPage = () => {
  return (
    <Suspense fallback={null}>
      <InstallationBookingContainer />
    </Suspense>
  );
};

export default InstallationBookingPage;
