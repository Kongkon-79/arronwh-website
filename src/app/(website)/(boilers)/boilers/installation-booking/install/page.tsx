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
