//this is  servey system code   so don't delete the  comment code =========================================
//note ::  when client need  servey system then use this code
// note : then uncomment   installation-booking-container  component code also
// note : uncomment install route all compoent code also


// import { Suspense } from "react";
// import InstallationBookingContainer from "./_components/installation-booking-container";

// const InstallationBookingPage = () => {
//   return (
//     <Suspense fallback={null}>
//       <InstallationBookingContainer />
//     </Suspense>
//   );
// };

// export default InstallationBookingPage;




import { Suspense } from "react";
import InstallContainer from "./_components/install-container";


const InstallPage = () => {
  return (
    <Suspense fallback={null}>
      <InstallContainer />
    </Suspense>
  );
};

export default InstallPage;
