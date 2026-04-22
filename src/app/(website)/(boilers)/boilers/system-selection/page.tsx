import { Suspense } from "react";
import BoilerProductsPage from "./_components/BoilerProductsPage";
import BoilerProductsPageSkeleton from "./_components/BoilerProductsPageSkeleton";

const SystemSelectionPage = () => {
  return (
    <Suspense fallback={<BoilerProductsPageSkeleton />}>
      <BoilerProductsPage />
    </Suspense>
  );
};

export default SystemSelectionPage;
