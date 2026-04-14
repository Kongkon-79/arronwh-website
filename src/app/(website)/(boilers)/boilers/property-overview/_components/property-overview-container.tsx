"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, MessageCircleQuestion } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { propertyChoiceSteps } from "../_lib/property-overview-data";
import { usePropertyOverviewStore } from "../_store/use-property-overview-store";
import Image from "next/image";

const topSteps = [
  { id: 1, title: "1. Property Overview" },
  { id: 2, title: "2. System Selection" },
  { id: 3, title: "3. Customer Details" },
  { id: 4, title: "4. Installation Booking" },
];

const PropertyOverviewContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentStep,
    answers,
    personalInfo,
    isSubmitting,
    submitError,
    setAnswer,
    setPersonalInfo,
    nextStep,
    prevStep,
    clearSubmissionState,
    submitQuote,
  } = usePropertyOverviewStore();
  const [isPostcodeStep, setIsPostcodeStep] = useState(false);

  const step = propertyChoiceSteps[currentStep];
  const maxStep = propertyChoiceSteps.length - 1;
  const activeTopStep = useMemo(() => {
    if (pathname.startsWith("/boilers/system-selection")) return 2;
    if (pathname.startsWith("/boilers/customer-details")) return 3;
    if (pathname.startsWith("/boilers/installation-booking")) return 4;
    return 1;
  }, [pathname]);
  const progressWidth = useMemo(() => {
    if (activeTopStep === 1) {
      const totalPropertyFlowSteps = propertyChoiceSteps.length + 1;
      const currentPropertyFlowStep = isPostcodeStep
        ? totalPropertyFlowSteps
        : currentStep + 1;
      return `${(currentPropertyFlowStep / totalPropertyFlowSteps) * 100}%`;
    }

    return `${(activeTopStep / topSteps.length) * 100}%`;
  }, [activeTopStep, currentStep, isPostcodeStep]);

  const canMoveNext = useMemo(() => {
    if (isPostcodeStep) {
      return Boolean(
        personalInfo.title.trim() &&
        personalInfo.fastName.trim() &&
        personalInfo.sureName.trim() &&
        personalInfo.email.trim() &&
        personalInfo.mobleNumber.trim() &&
        personalInfo.postcode.trim(),
      );
    }
    if (!step) return false;
    return Boolean(answers[step.id]);
  }, [answers, isPostcodeStep, personalInfo, step]);

  const quizAnswers = useMemo(
    () =>
      propertyChoiceSteps
        .map((item) => ({
          question: item.question,
          answer: answers[item.id] || "",
        }))
        .filter((item) => item.answer),
    [answers],
  );
  const optionCardWidthClass = useMemo(() => {
    const optionCount = step?.options.length ?? 0;
    if (optionCount <= 2) return "w-[360px]";
    if (optionCount <= 4) return "w-[260px]";
    return "w-[260px]";
  }, [step]);
  const headingText = useMemo(() => {
    if (isPostcodeStep) {
      return (
        <>
          Finally, please enter the <span className="text-primary">postcode</span> of
          your property where we will be installing your new boiler.
        </>
      );
    }

    if (!step) return "";

    switch (step.id) {
      case "requirement":
        return (
          <>
            Are you a <span className="text-primary">homeowner</span> or a{" "}
            <span className="text-primary">landlord</span>?
          </>
        );
      case "fuelType":
        return (
          <>
            What kind of <span className="text-primary">fuel</span> does your boiler
            use?
          </>
        );
      case "boilerType":
        return (
          <>
            Currently, what <span className="text-primary">type</span> of boiler do you
            have?
          </>
        );
      case "boilerCondition":
        return (
          <>
            How would you describe your{" "}
            <span className="text-primary">current boiler</span>?
          </>
        );
      case "boilerAge":
        return (
          <>
            Roughly how <span className="text-primary">old</span> is your boiler?
          </>
        );
      case "mountedOnWall":
        return (
          <>
            Is your boiler <span className="text-primary">mounted on the wall</span>?
          </>
        );
      case "stayDuration":
        return (
          <>
            How long do you see yourself in your{" "}
            <span className="text-primary">current home</span>?
          </>
        );
      case "differentPlace":
        return (
          <>
            Do you want your new boiler in a{" "}
            <span className="text-primary">different place</span>?
          </>
        );
      case "homeType":
        return (
          <>
            Which of these best describes <span className="text-primary">your home</span>?
          </>
        );
      case "bedrooms":
        return (
          <>
            How many <span className="text-primary">bedrooms</span> do you have?
          </>
        );
      case "bathtubs":
        return (
          <>
            How many <span className="text-primary">bathtubs</span> do you have, or plan
            to have in the future?
          </>
        );
      case "showers":
        return (
          <>
            How many <span className="text-primary">separate showers</span> do you have,
            or plan to have in the future?
          </>
        );
      case "radiators":
        return (
          <>
            How many <span className="text-primary">radiators</span> do you have?
          </>
        );
      case "trv":
        return (
          <>
            Do you have{" "}
            <span className="text-primary">Thermostatic Radiator Valves</span> on all
            your radiators?
          </>
        );
      case "waterMeter":
        return (
          <>
            Do you have <span className="text-primary">a water meter?</span>
          </>
        );
      case "flueOut":
        return (
          <>
            Where does your <span className="text-primary">flue</span> come out?
          </>
        );
      case "roofType":
        return (
          <>
            Is your flue in a <span className="text-primary">sloped</span> roof or a{" "}
            <span className="text-primary">flat</span> roof?
          </>
        );
      case "roofPosition":
        return (
          <>
            Where on the roof is it <span className="text-primary">positioned</span>?
          </>
        );
      default:
        return step.question;
    }
  }, [isPostcodeStep, step]);

  const handleNext = async () => {
    if (!canMoveNext) {
      toast.error(
        isPostcodeStep
          ? "Please fill required fields to continue."
          : "Please select an option to continue.",
      );
      return;
    }

    if (currentStep >= maxStep) {
      if (!isPostcodeStep) {
        setIsPostcodeStep(true);
        return;
      }

      clearSubmissionState();
      const response = await submitQuote(quizAnswers);
      if (response?.success) {
        toast.success(response.message || "Quote created successfully");
        router.push("/boilers/system-selection");
      } else {
        toast.error("Failed to submit postcode details.");
      }
      return;
    }

    nextStep(maxStep);
  };

  const handlePrev = () => {
    if (isPostcodeStep) {
      setIsPostcodeStep(false);
      return;
    }
    if (currentStep === 0) {
      router.push("/");
      return;
    }
    prevStep();
  };

  return (
    <BoilerFlowShell>
      <div className="h-[6px] w-full rounded-t-[12px] bg-[#E5EAF1] ">
        <div
          className="h-full rounded-t-[12px] bg-primary transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="border-b border-[#E8EDF3] px-4 py-3 md:px-6 ">
        <div className="overflow-hidden rounded-[999px] border border-[#DDE4EE] bg-white">
          <div className="grid h-[48px] grid-cols-[auto_1fr_auto] items-stretch">
            <div
              className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary px-2"
            >
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-full border border-[#2D3D4D] p-2.5 transition hover:bg-black/5"
              >
                <ArrowLeft className="h-5 w-5 text-[#2D3D4D]" />
              </button>
              <Image
                src="/assets/images/multi_step_logo.png"
                alt="Multi Step Logo"
                width={332}
                height={332}
                className="h-[36px] w-[136px] object-contain"
              />
            </div>

            <div className="hidden min-w-0 grid-cols-4 md:grid ">
              {topSteps.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-center border-r border-[#E7ECF3] px-2 text-center text-[10px] font-semibold",
                    item.id === 1 && activeTopStep === 1
                      ? "rounded-r-[999px] border-r-0 bg-primary text-[#2D3D4D]"
                      : item.id === activeTopStep
                        ? "bg-primary text-[#2D3D4D]"
                        : item.id < activeTopStep
                          ? "bg-[#FFF8DA] text-[#2D3D4D]"
                          : "text-[#6F7D8D]",
                    idx === topSteps.length - 1 && "border-r-0",
                    item.id === 1 && activeTopStep > 1 && "bg-[#FFF8DA] text-[#2D3D4D]",
                  )}
                >
                  {item.title}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 border-l border-[#E7ECF3] px-3 text-[12px] font-medium text-[#6A7788] transition hover:bg-[#F8FAFC]"
            >
              <MessageCircleQuestion className="h-3.5 w-3.5" />
              Help
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#F0F3F6] px-4 py-6 md:px-6 ">
        <div className="rounded-[10px] border border-[#E6EBF2] bg-[#F7F9FB] px-4 py-6 md:px-10 md:py-8">
          <h2 className="mx-auto max-w-[760px] text-center text-[22px] font-semibold leading-[1.35] text-[#2D3D4D]">
            {headingText}
          </h2>
          {isPostcodeStep ? (
            <p className="mx-auto mt-3 max-w-[640px] text-center text-[10px] leading-[1.45] text-[#5F6C7B]">
              We need this information to show the dates available for installation
              (order by 3pm for next working day installation)
            </p>
          ) : null}

          {!isPostcodeStep ? (
            <div
              className="mt-7 flex  flex-wrap items-stretch justify-center gap-4  "
            >
              {step.options.map((option) => {
                const selected = answers[step.id] === option.value;
                const Icon = option.icon;

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setAnswer(step.id, option.value)}
                    className={cn(
                      "group relative h-[365px] rounded-[8px] border bg-white px-3 py-3 text-[#2D3D4D] transition ",
                      optionCardWidthClass,
                      selected
                        ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.85)]"
                        : "border-[#929BAB] hover:border-primary/70",
                    )}
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-3 pb-3">
                      {Icon && <Icon className="h-10 w-10 text-[#8A97A7]" />}
                      <span
                        className={cn(
                          "text-center text-[14px] font-semibold",
                          selected ? "text-[#E0B800]" : "text-[#2D3D4D]",
                        )}
                      >
                        {option.label}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "absolute bottom-0 left-0 flex h-7 w-full items-center justify-center rounded-b-[8px] text-[10px] font-semibold",
                        selected ? "bg-primary text-[#2D3D4D]" : "bg-transparent text-transparent",
                      )}
                    >
                      Selected
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-[900px] space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-[#3F4B5C]">
                    Title
                  </span>
                  <select
                    value={personalInfo.title}
                    onChange={(e) => setPersonalInfo("title", e.target.value)}
                    className="h-8 w-full rounded-[2px] border border-[#D8DEE8] bg-[#E9EEF3] px-2 text-[10px] text-[#2D3D4D] focus:outline-none"
                  >
                    <option value="">Choose</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                    <option value="Dr">Dr</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-[#3F4B5C]">
                    First Name
                  </span>
                  <input
                    value={personalInfo.fastName}
                    onChange={(e) => setPersonalInfo("fastName", e.target.value)}
                    className="h-8 w-full rounded-[2px] border border-[#D8DEE8] bg-[#E9EEF3] px-2 text-[10px] text-[#2D3D4D] focus:outline-none"
                  />
                </label>
                <label className="space-y-1">
                  <span className="block text-[11px] font-medium text-[#3F4B5C]">
                    Sure Name
                  </span>
                  <input
                    value={personalInfo.sureName}
                    onChange={(e) => setPersonalInfo("sureName", e.target.value)}
                    className="h-8 w-full rounded-[2px] border border-[#D8DEE8] bg-[#E9EEF3] px-2 text-[10px] text-[#2D3D4D] focus:outline-none"
                  />
                </label>
              </div>

              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-[#3F4B5C]">
                  Email
                </span>
                <input
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo("email", e.target.value)}
                  className="h-8 w-full rounded-[2px] border border-[#D8DEE8] bg-[#E9EEF3] px-2 text-[10px] text-[#2D3D4D] focus:outline-none"
                />
              </label>

              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-[#3F4B5C]">
                  Enter your postcode
                </span>
                <input
                  value={personalInfo.postcode}
                  onChange={(e) => setPersonalInfo("postcode", e.target.value)}
                  placeholder="e.g. SW1A 1AA"
                  className="h-8 w-full rounded-[2px] border border-[#D8DEE8] bg-[#E9EEF3] px-2 text-[10px] text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none"
                />
              </label>

              <label className="space-y-1">
                <span className="block text-[11px] font-medium text-[#3F4B5C]">
                  Mobile Number ( optional )
                </span>
                <div className="flex h-8 items-center rounded-[8px] border border-[#D8DEE8] bg-[#E9EEF3] px-1.5">
                  <div className="inline-flex h-6 items-center gap-1 rounded-[5px] border border-[#D6DDE7] bg-white px-2 text-[10px]">
                    <span>UK</span>
                    <span className="text-[#677586]">+44</span>
                  </div>
                  <input
                    value={personalInfo.mobleNumber}
                    onChange={(e) => setPersonalInfo("mobleNumber", e.target.value)}
                    placeholder="e.g. 07700 900000"
                    className="h-full w-full bg-transparent px-2 text-[10px] text-[#2D3D4D] placeholder:text-[#7D8A98] focus:outline-none"
                  />
                </div>
              </label>

              <label className="flex items-start gap-2 pt-2 text-[9px] leading-[1.4] text-[#4C5969]">
                <input type="checkbox" className="mt-0.5 h-3 w-3" />
                <span>
                  I&apos;m happy to receive an email with my installation quote from YOLO
                  HEAT.
                  <br />
                  YOLO HEAT can also contact me if there are installation discounts
                  available in the next 30 days.
                </span>
              </label>

              <p className="pt-1 text-[9px] text-[#4C5969]">
                For more information on how we use your details please see our{" "}
                <span className="text-primary">privacy policy.</span>
              </p>

              {submitError ? (
                <p className="text-xs text-red-500">{submitError}</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#E8EDF3] bg-[#EEF2F6] px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex h-7 items-center gap-1 rounded-[4px] border border-[#DCE3EC] bg-white px-3 text-[9px] font-medium text-[#5A6878] transition hover:border-primary"
        >
          <ChevronLeft className="h-3 w-3" />
          Back
        </button>

        <button
          type="button"
          onClick={() => void handleNext()}
          disabled={!canMoveNext}
          className="inline-flex h-7 items-center rounded-[6px] bg-primary px-4 text-[9px] font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>
    </BoilerFlowShell>
  );
};

export default PropertyOverviewContainer;
