import React from "react";
import BoilerRouteStepper from "./boiler-route-stepper";

type BoilerFlowShellProps = {
  children: React.ReactNode;
  activeStep?: 1 | 2 | 3 | 4;
};

const BoilerFlowShell = ({ children, activeStep }: BoilerFlowShellProps) => {
  return (
    <section className="bg-[#ECEEF1] py-6 md:py-10">
      <div className="container space-y-3 md:space-y-4">
        {activeStep ? (
          <div className="mx-auto max-w-[1120px]">
            <BoilerRouteStepper activeStep={activeStep} />
          </div>
        ) : null}

        <div className="mx-auto max-w-[1120px] rounded-[12px] border border-[#D9E1EB] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          {children}
        </div>
      </div>
    </section>
  );
};

export default BoilerFlowShell;
