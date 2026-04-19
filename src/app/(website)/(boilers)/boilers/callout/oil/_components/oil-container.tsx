"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePropertyOverviewStore } from "../../../property-overview/_store/use-property-overview-store";

const OilContainer = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleResetAnswers = () => {
    usePropertyOverviewStore.setState({
      currentStep: 0,
      answers: {},
      selectedProductId: null,
      personalInfo: {
        title: "",
        fastName: "",
        sureName: "",
        email: "",
        mobleNumber: "",
        postcode: "",
      },
      isSubmitting: false,
      submitError: null,
      submitSuccessMessage: null,
      quoteId: null,
    });

    router.push("/boilers/property-overview");
  };

  return (
    <section className="min-h-screen bg-[#ECEDEF] px-3 py-4 md:px-6 md:py-5">
      <div className="mx-auto w-full">

        <div className="mt-4 overflow-hidden rounded-[999px] shadow-[0_8px_18px_rgba(16,24,40,0.12)]">
          <div className="grid h-16 grid-cols-[auto_1fr] bg-primary">
            <div className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary pl-0 pr-4">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-[#2D3D4D] p-3 transition hover:bg-black/5"
                aria-label="Go back"
              >
                <ArrowLeft className="h-8 w-8 text-[#2D3D4D]" />
              </button>
              <Image
                src="/assets/images/multi_step_logo.png"
                alt="Multi Step Logo"
                width={332}
                height={332}
                className="h-[36px] w-[126px] object-contain"
                priority
              />
            </div>
            <div className="bg-primary" />
          </div>
        </div>

        <div className="mx-auto mt-12 w-full max-w-[850px] px-2 md:mt-14">
          <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-bold leading-noramal text-[#2D3D4D]">
            We currently only offer installations for Gas powered boilers
          </h1>

          <div className="mx-auto mt-6 flex w-full max-w-[790px] flex-col items-start gap-6 rounded-[10px] bg-[#DEE3E8] px-6 py-6 md:flex-row md:items-center md:justify-between md:px-7">
            <p className="max-w-[500px] text-base md:text-lg leading-[1.45] text-[#203A58]">
              We&apos;re hoping to extend this to other fuel types in the near
              future but unfortunately for now we cannot replace your boiler.
            </p>

            <button
              type="button"
              onClick={handleResetAnswers}
              className="inline-flex h-[50px] min-w-[176px] items-center justify-center rounded-[10px] bg-[#00A86B] px-6 text-[20px] font-medium text-white transition hover:bg-[#009460]"
            >
              Reset answers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OilContainer;
