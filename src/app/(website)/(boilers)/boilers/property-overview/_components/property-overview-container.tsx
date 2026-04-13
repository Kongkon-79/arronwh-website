"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import BoilerFrameFooter from "@/app/(website)/(boilers)/_components/boiler-frame-footer";
import { cn } from "@/lib/utils";
import { ChevronLeft, Flame, MessageCircleQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { propertyChoiceSteps } from "../_lib/property-overview-data";
import { usePropertyOverviewStore } from "../_store/use-property-overview-store";

const topSteps = [
  "1. Property Overview",
  "2. System Selection",
  "3. Customer Details",
  "4. Installation Booking",
];

const PropertyOverviewContainer = () => {
  const router = useRouter();
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

  const canMoveNext = useMemo(() => {
    if (isPostcodeStep) {
      return Boolean(
        personalInfo.title.trim() &&
          personalInfo.fastName.trim() &&
          personalInfo.sureName.trim() &&
          personalInfo.email.trim() &&
          personalInfo.mobleNumber.trim()
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
    [answers]
  );

  const handleNext = async () => {
    if (!canMoveNext) {
      toast.error(
        isPostcodeStep
          ? "Please fill required fields to continue."
          : "Please select an option to continue."
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
    if (currentStep === 0) return;
    prevStep();
  };

  return (
    <BoilerFlowShell>
      <div className="h-[6px] w-full rounded-t-[12px] bg-primary" />

      <div className="border-b border-[#E8EDF3] px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 rounded-[10px] border border-[#E3E9F1] bg-white px-2 py-2">
          <div className="flex shrink-0 items-center gap-2 border-r border-[#E6EBF3] pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7E7AA]">
              <Flame className="h-4 w-4 text-[#2F3E4D]" />
            </div>
            <div>
              <p className="text-[10px] font-bold leading-none text-[#193A5A]">
                YOLO HEAT
              </p>
              <p className="mt-0.5 text-[9px] text-[#6F7E90]">Property overview</p>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 grid-cols-4 gap-1 md:grid">
            {topSteps.map((title, idx) => (
              <div
                key={title}
                className={cn(
                  "rounded-[999px] border px-2 py-1 text-center text-[10px] font-semibold",
                  idx === 0
                    ? "border-[#E9C446] bg-primary text-[#2D3D4D]"
                    : "border-transparent text-[#6F7D8D]"
                )}
              >
                {title}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-[8px] border border-[#E5EAF2] px-2 py-1 text-[10px] font-medium text-[#6A7788]"
          >
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            Help
          </button>

          <div className="shrink-0 text-[12px] font-semibold text-[#7C8898]">
            {isPostcodeStep
              ? "2/2"
              : `${currentStep + 1}/${propertyChoiceSteps.length}`}
          </div>
        </div>
      </div>

      <div className="bg-[#EEF2F6] px-4 py-6 md:px-6">
        <div className="mx-auto max-w-[940px] rounded-[8px] border border-[#E5EAF1] bg-[#F6F8FB] px-4 py-6 md:px-10">
          <h2 className="text-center text-[20px] font-semibold text-[#2D3D4D] md:text-[22px]">
            {isPostcodeStep
              ? "Finally, please enter your postcode and contact details"
              : step.question}
          </h2>

          {!isPostcodeStep ? (
            <div
              className={cn(
                "mx-auto mt-6 grid max-w-[640px] grid-cols-2 gap-3",
                step.cols ?? "md:grid-cols-3"
              )}
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
                      "group relative h-[160px] rounded-[6px] border bg-white px-3 py-3 text-[#2D3D4D] transition",
                      selected
                        ? "border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.8)]"
                        : "border-[#D6DCE5] hover:border-primary/70"
                    )}
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                      {Icon && <Icon className="h-7 w-7 text-[#8A97A7]" />}
                      <span className="text-center text-[13px] font-medium">
                        {option.label}
                      </span>
                      <span className="text-[10px] text-[#95A1B1]">
                        {selected ? "Selected" : ""}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "absolute bottom-0 left-0 h-3 w-full rounded-b-[6px]",
                        selected ? "bg-primary" : "bg-transparent"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-[760px] space-y-3">
              <div className="grid gap-3 md:grid-cols-4">
                <select
                  value={personalInfo.title}
                  onChange={(e) => setPersonalInfo("title", e.target.value)}
                  className="h-10 rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D]"
                >
                  <option value="">Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
                <input
                  value={personalInfo.fastName}
                  onChange={(e) => setPersonalInfo("fastName", e.target.value)}
                  placeholder="First Name"
                  className="h-10 rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D] md:col-span-2"
                />
                <input
                  value={personalInfo.sureName}
                  onChange={(e) => setPersonalInfo("sureName", e.target.value)}
                  placeholder="Surname"
                  className="h-10 rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D]"
                />
              </div>

              <input
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo("email", e.target.value)}
                placeholder="Email address"
                className="h-10 w-full rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D]"
              />
              <input
                value={personalInfo.mobleNumber}
                onChange={(e) => setPersonalInfo("mobleNumber", e.target.value)}
                placeholder="Mobile number"
                className="h-10 w-full rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D]"
              />
              <input
                placeholder="Postcode"
                className="h-10 w-full rounded-[4px] border border-[#D6DEE8] bg-white px-3 text-xs text-[#2D3D4D]"
              />

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
          disabled={currentStep === 0}
          className="inline-flex h-6 items-center gap-1 rounded-[3px] border border-[#DCE3EC] bg-white px-2 text-[10px] font-medium text-[#5A6878] transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3 w-3" />
          Back
        </button>

        <button
          type="button"
          onClick={() => void handleNext()}
          disabled={!canMoveNext}
          className="inline-flex h-6 items-center rounded-[3px] bg-primary px-3 text-[10px] font-semibold text-[#2D3D4D] transition hover:bg-[#F3CF43] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Continue"}
        </button>
      </div>

      <BoilerFrameFooter />
    </BoilerFlowShell>
  );
};

export default PropertyOverviewContainer;
