import React from "react";
import BoilerRouteStepper from "./boiler-route-stepper";

type BoilerFlowShellProps = {
  children: React.ReactNode;
  activeStep?: 1 | 2 | 3 | 4;
};

const BoilerFlowShell = ({ children, activeStep }: BoilerFlowShellProps) => {
  return (
    <section className="bg-[#F0F3F6]  md:pb-10 py-4 ">
      <div className="container mx-auto space-y-3 md:space-y-4 ">
        {activeStep ? (
          <div className=" ">
            <BoilerRouteStepper activeStep={activeStep} />
          </div>
        ) : null}

        <div className="">
          {children}
        </div>
      </div>
    </section>
  );
};

export default BoilerFlowShell;
