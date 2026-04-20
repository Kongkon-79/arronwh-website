"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import { cn } from "@/lib/utils";
import { ArrowLeft, Info, MessageCircleQuestion } from "lucide-react";
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
    goToStep,
    clearSubmissionState,
    submitQuote,
  } = usePropertyOverviewStore();
  const [isPostcodeStep, setIsPostcodeStep] = useState(false);
  const [isOtherRoomPrompt, setIsOtherRoomPrompt] = useState(false);
  const [otherRoomName, setOtherRoomName] = useState("");

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
    if (step?.id === "currentBoilerLocation" && isOtherRoomPrompt) {
      return Boolean(otherRoomName.trim());
    }
    if (!step) return false;
    return Boolean(answers[step.id]);
  }, [answers, isOtherRoomPrompt, isPostcodeStep, otherRoomName, personalInfo, step]);

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
  const stepOptions = useMemo(() => {
    if (!step) return [];
    if (
      step.id === "differentPlace" &&
      answers.currentBoilerLocation === "Airing cupboard"
    ) {
      return step.options.filter(
        (option) => option.value !== "Move to airing cupboard",
      );
    }

    return step.options;
  }, [answers.currentBoilerLocation, step]);
  const optionCardWidthClass = useMemo(() => {
    if (step?.id === "convertToCombi") return "w-[320px]";
    if (step?.id === "currentBoilerLocation") return "w-[320px]";
    const optionCount = stepOptions.length;
    if (optionCount <= 2) return "w-[360px]";
    if (optionCount <= 3) return "w-[400px]";
    if (optionCount <= 4) return "w-[325px]";
    return "w-[260px]";
  }, [step, stepOptions.length]);
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
      case "convertToCombi":
        return (
          <>
            Do you want to <span className="text-primary">convert</span> to a Combi
            boiler?
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
      case "waterFlowRate":
        return (
          <>
            How <span className="text-primary">quickly</span> does your water come
            out of your cold tap?
          </>
        );
      case "currentBoilerLocation":
        return (
          <>
            Where&apos;s your <span className="text-primary">current boiler</span>?
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
            Is your flue in a <span className="text-primary">sloped roof</span> or a{" "}
            <span className="text-primary">flat roof</span> ?
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
        const quoteId = response?.data?._id;
        router.push(
          quoteId
            ? `/boilers/system-selection?quoteId=${encodeURIComponent(quoteId)}`
            : "/boilers/system-selection",
        );
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
    if (step?.id === "currentBoilerLocation" && isOtherRoomPrompt) {
      setIsOtherRoomPrompt(false);
      return;
    }
    if (currentStep === 0) {
      router.push("/");
      return;
    }
    if (step?.id === "boilerCondition" && answers.boilerType === "Combi") {
      const boilerTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "boilerType",
      );
      if (boilerTypeStepIndex >= 0) {
        goToStep(boilerTypeStepIndex);
        return;
      }
    }
    if (step?.id === "mountedOnWall" && answers.boilerCondition) {
      const boilerConditionStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "boilerCondition",
      );
      if (boilerConditionStepIndex >= 0) {
        goToStep(boilerConditionStepIndex);
        return;
      }
    }
    if (step?.id === "boilerAge" && answers.mountedOnWall) {
      const mountedOnWallStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "mountedOnWall",
      );
      if (mountedOnWallStepIndex >= 0) {
        goToStep(mountedOnWallStepIndex);
        return;
      }
    }
    prevStep();
  };

  const handleOtherRoomSubmit = () => {
    const roomName = otherRoomName.trim();
    if (!roomName) return;
    setAnswer("otherRoomName", roomName);
    setIsOtherRoomPrompt(false);
    const differentPlaceStepIndex = propertyChoiceSteps.findIndex(
      (item) => item.id === "differentPlace",
    );
    if (differentPlaceStepIndex >= 0) {
      goToStep(differentPlaceStepIndex);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (!step) return;
    setAnswer(step.id, value);

    if (step.id === "fuelType" && value === "Oil") {
      router.push("/boilers/callout/oil");
      return;
    }
    if (step.id === "waterFlowRate" && value === "Slow") {
      router.push("/boilers/callout");
      return;
    }
    if (step.id === "boilerType" && value === "Combi") {
      const boilerConditionStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "boilerCondition",
      );
      if (boilerConditionStepIndex >= 0) {
        goToStep(boilerConditionStepIndex);
        return;
      }
    }
    if (step.id === "convertToCombi") {
      const boilerConditionStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "boilerCondition",
      );
      if (boilerConditionStepIndex >= 0) {
        goToStep(boilerConditionStepIndex);
        return;
      }
    }
    if (step.id === "boilerCondition") {
      const mountedOnWallStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "mountedOnWall",
      );
      if (mountedOnWallStepIndex >= 0) {
        goToStep(mountedOnWallStepIndex);
        return;
      }
    }
    if (step.id === "mountedOnWall") {
      const boilerAgeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "boilerAge",
      );
      if (boilerAgeStepIndex >= 0) {
        goToStep(boilerAgeStepIndex);
        return;
      }
    }
    if (step.id === "currentBoilerLocation") {
      if (value === "Other") {
        setIsOtherRoomPrompt(true);
        return;
      } else {
        setIsOtherRoomPrompt(false);
        if (
          value === "Airing cupboard" &&
          answers.differentPlace === "Move to airing cupboard"
        ) {
          setAnswer("differentPlace", "");
        }
        const differentPlaceStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "differentPlace",
        );
        if (differentPlaceStepIndex >= 0) {
          goToStep(differentPlaceStepIndex);
          return;
        }
      }
    }

    if (currentStep >= maxStep) {
      setIsPostcodeStep(true);
      return;
    }

    nextStep(maxStep);
  };

  return (
    <BoilerFlowShell>
      <div className="h-4 w-full bg-white">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8 mb-2 md:mb-3 lg:mb-4">
        <div className="overflow-hidden rounded-[999px] ">
          <div className="bg-white h-16 rounded-full grid grid-cols-[auto_1fr_auto] items-stretch pl-0 pr-1">
            <div
              className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary "
            >
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-full border border-[#2D3D4D] p-3 transition hover:bg-black/5 "
              >
                <ArrowLeft className="h-8 w-8 text-[#2D3D4D]" />
              </button>
              <Image
                src="/assets/images/multi_step_logo.png"
                alt="Multi Step Logo"
                width={332}
                height={332}
                className="h-[36px] w-[126px] object-contain"
              />
            </div>

            <div className="hidden min-w-0 grid-cols-4 md:grid ">
              {topSteps.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-center border-r border-[#E7ECF3] px-2 text-center text-sm md:text-base font-medium leading-normal",
                    item.id === 1 && activeTopStep === 1
                      ? "rounded-r-[999px] border-r-0 bg-primary text-[#2D3D4D]"
                      : item.id === activeTopStep
                        ? "bg-primary text-[#2D3D4D]"
                        : item.id < activeTopStep
                          ? "bg-[#FFF8DA] text-[#2D3D4D]"
                          : "text-[#2D3D4D]",
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
              className="inline-flex items-center gap-1 border-l border-[#E7ECF3] px-3 text-lg md:text-xl font-normal text-[#2D3D4D] leading-normal transition hover:bg-[#F8FAFC]"
            >
              <MessageCircleQuestion className="h-6 w-6" />
              Help
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6  md:px-0">
        <div className="rounded-[10px] bg-white px-5 md:px-6 lg:px-7 xl:px-8 py-7 md:py-9 lg:py-10 xl:py-12">
          <h2 className="mx-auto max-w-[850px] text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-normal text-[#2D3D4D]">
            {headingText}
          </h2>
          {isPostcodeStep ? (
            <p className="mx-auto mt-3 max-w-[640px] text-center text-[10px] leading-[1.45] text-[#5F6C7B]">
              We need this information to show the dates available for installation
              (order by 3pm for next working day installation)
            </p>
          ) : step?.id === "convertToCombi" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-[16px] md:text-[20px] leading-[1.45] text-[#2D3D4D]">
              We&apos;ll remove and safely dispose of your hot water cylinder together
              with re-configuring your current pipework to allow a combi boiler to be
              installed. All this will be included in your fixed price.
            </p>
          ) : null}

          {!isPostcodeStep && step?.id === "currentBoilerLocation" && isOtherRoomPrompt ? (
            <div className="mx-auto mt-7 w-full max-w-[760px]">
              <label className="block text-[26px] font-medium text-[#5A6675]">
                Room name
              </label>
              <input
                value={otherRoomName}
                onChange={(e) => setOtherRoomName(e.target.value)}
                placeholder="e.g. loft or attic"
                className="mt-2 h-[68px] w-full border-b border-[#8E99A8] bg-[#DEE3E8] px-4 text-[30px] text-[#2D3D4D] placeholder:text-[#A4ADB8] focus:outline-none"
              />
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleOtherRoomSubmit}
                  disabled={!otherRoomName.trim()}
                  className="inline-flex h-[58px] min-w-[120px] items-center justify-center rounded-[2px] bg-[#D9D7D7] px-6 text-[32px] font-medium text-[#6D7785] transition hover:bg-[#cfcdcd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Ok
                </button>
              </div>
            </div>
          ) : !isPostcodeStep ? (
            <div
              className="mt-7 flex  flex-wrap items-stretch justify-center gap-4  "
            >
              {stepOptions.map((option) => {
                const selected = answers[step.id] === option.value;
                const Icon = option.icon;
                const optionImage = option.image;
                const isHoverDescriptionCard =
                  step.id === "fuelType" || step.id === "boilerType";
                const isConvertStep = step.id === "convertToCombi";
                const isWaterFlowStep = step.id === "waterFlowRate";
                const isFuelTypeCard = step.id === "fuelType";

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={cn(
                      "group relative rounded-[12px] bg-white px-3 py-3 text-[#2D3D4D] transition ",
                      isConvertStep || isWaterFlowStep
                          ? "h-[340px]"
                          : "h-[375px]",
                      optionCardWidthClass,
                      selected
                          ? "border-[3px] border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.85)]"
                          : "border-[2px] border-[#AEB7C2] hover:border-primary hover:shadow-[0_0_0_1px_rgba(255,222,89,0.2)]"
                    )}
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-2 pb-3">
                      {optionImage ? (
                        <Image
                          src={optionImage}
                          alt={option.label}
                          width={220}
                          height={220}
                          className={cn(
                            "w-auto object-contain transition-all duration-200",
                            isFuelTypeCard ? "h-[100px]" : "h-[100px]",
                          )}
                        />
                      ) : Icon ? (
                        <Icon
                          className={cn(
                            isConvertStep || isWaterFlowStep ? "h-24 w-24" : "h-10 w-10",
                            isConvertStep || isWaterFlowStep
                              ? "text-[#2D3D4D]"
                              : "text-[#8A97A7]",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "text-center text-lg md:text-xl leading-normal font-semibold transition-colors duration-200",
                          selected ? "text-primary" : "text-[#2D3D4D]",
                          !selected && "group-hover:text-primary"
                        )}
                      >
                        {option.label}
                      </span>
                      {isHoverDescriptionCard || isWaterFlowStep ? (
                        <p
                          className={cn(
                            "max-w-[260px] text-center text-[14px] leading-[1.45] text-[#465466] transition-all duration-200",
                            selected || !option.hoverDescription
                              ? "max-h-0 opacity-0"
                              : "max-h-0 opacity-0 group-hover:mt-2 group-hover:max-h-[140px] group-hover:opacity-100",
                          )}
                        >
                          {option.hoverDescription}
                        </p>
                      ) : null}
                    </div>
                    {isHoverDescriptionCard ? (
                      <div
                        className={cn(
                          "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[#2D3D4D] transition-opacity duration-200",
                          selected
                            ? "opacity-0"
                            : "opacity-100 group-hover:opacity-0",
                        )}
                      >
                        <Info  className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                    ) : null}
                    {isWaterFlowStep ? (
                      <div
                        className={cn(
                          "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[#2D3D4D] transition-opacity duration-200",
                          selected
                            ? "opacity-0"
                            : "opacity-100 group-hover:opacity-0",
                        )}
                      >
                        <Info className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                    ) : null}

                    <div
                      className={cn(
                        "absolute bottom-0 left-0 flex h-14 w-full items-center justify-center rounded-b-[8px] text-base md:text-lg font-medium leading-normal transition-colors duration-200",
                        selected
                          ? "bg-primary text-[#2D3D4D]"
                          : "bg-transparent text-transparent group-hover:bg-primary group-hover:text-[#2D3D4D]"
                      )}
                    >
                      {selected ? "Selected" : "Select"}
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

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => void handleNext()}
                  disabled={!canMoveNext || isSubmitting}
                  className="inline-flex h-8 items-center rounded-[6px] bg-primary px-5 text-[10px] font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Continue"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BoilerFlowShell>
  );
};

export default PropertyOverviewContainer;
