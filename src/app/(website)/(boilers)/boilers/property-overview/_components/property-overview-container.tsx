"use client";

import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";
import HelpContainer from "@/app/(website)/helps/_components.tsx/help-container";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ArrowLeft, Info, MessageCircleQuestion } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { propertyChoiceSteps } from "../_lib/property-overview-data";
import { usePropertyOverviewStore } from "../_store/use-property-overview-store";
import Image from "next/image";
import PersonalInfoForm from "./personal-info-form";
import Link from "next/link";

const topSteps = [
  { id: 1, title: "1. Property Overview" },
  { id: 2, title: "2. System Selection" },
  { id: 3, title: "3. Customer Details" },
  { id: 4, title: "4. Installation Booking" },
];

const parsePriceTag = (priceTag?: string): number | undefined => {
  if (!priceTag) return undefined;

  const numericValue = Number(priceTag.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numericValue) || numericValue < 0) return undefined;

  return numericValue;
};

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
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
  }, [
    answers,
    isOtherRoomPrompt,
    isPostcodeStep,
    otherRoomName,
    personalInfo,
    step,
  ]);

  const quizAnswers = useMemo(
    () =>
      propertyChoiceSteps
        .map((item) => {
          const selectedAnswer = answers[item.id] || "";
          const selectedOption = item.options.find(
            (option) => option.value === selectedAnswer,
          );
          const parsedPrice = parsePriceTag(selectedOption?.priceTag);

          return {
            question: item.question,
            answer: selectedAnswer,
            ...(parsedPrice !== undefined ? { price: parsedPrice } : {}),
          };
        })
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
    if (step?.id === "convertToCombi") return "w-[300px]";
    if (step?.id === "currentBoilerLocation") return "w-[300px]";
    const optionCount = stepOptions.length;
    if (optionCount <= 2) return "w-[300px]";
    if (optionCount <= 3) return "w-[300px]";
    if (optionCount <= 4) return "w-[300px]";
    return "w-[300px]";
  }, [step, stepOptions.length]);
  const headingText = useMemo(() => {
    if (isPostcodeStep) {
      return (
        <>
          Finally, please enter the{" "}
          <span className="text-primary">postcode</span> of your property where
          we will be installing your new boiler.
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
            What kind of <span className="text-primary">fuel</span> does your
            boiler use?
          </>
        );
      case "boilerType":
        return (
          <>
            Currently, what <span className="text-primary">type</span> of boiler
            do you have?
          </>
        );
      case "convertToCombi":
        return (
          <>
            Do you want to <span className="text-primary">convert</span> to a
            Combi boiler?
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
            Roughly how <span className="text-primary">old</span> is your
            boiler?
          </>
        );
      case "mountedOnWall":
        return (
          <>
            Is your boiler{" "}
            <span className="text-primary">mounted on the wall</span>?
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
            How <span className="text-primary">quickly</span> does your water
            come out of your cold tap?
          </>
        );
      case "currentBoilerLocation":
        return (
          <>
            Where&apos;s your{" "}
            <span className="text-primary">current boiler</span>?
          </>
        );
      case "differentPlace":
        return (
          <>
            Do you want your new boiler in a{" "}
            <span className="text-primary">different place</span>?
          </>
        );
      case "airingCupboardLocation":
        return (
          <>
            Where is your <span className="text-primary">airing cupboard</span>?
          </>
        );
      case "newBoilerLocation":
        return (
          <>
            Where do you want your{" "}
            <span className="text-primary">new boiler</span>?
          </>
        );
      case "homeType":
        return (
          <>
            Which of these best describes{" "}
            <span className="text-primary">your home</span>?
          </>
        );
      case "bungalowFloors":
        return (
          <>
            Is your <span className="text-primary">bungalow</span> on one or
            two floors?
          </>
        );
      case "flatOnSecondFloor":
        return (
          <>
            Is your <span className="text-primary">flat</span> on or above the
            second floor?
          </>
        );
      case "accessEquipmentCharges":
        return (
          <>
            <span className="text-primary">Do you accept</span> that there may
            be extra charges for access equipment?
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
            How many <span className="text-primary">bathtubs</span> do you have,
            or plan to have in the future?
          </>
        );
      case "bathtubShowerOver":
        return (
          <>
            Do any of your <span className="text-primary">bathtubs</span> have
            showers over them?
          </>
        );
      case "showers":
        return (
          <>
            How many <span className="text-primary">separate showers</span> do
            you have, or plan to have in the future?
          </>
        );
      case "electricShower":
        return (
          <>
            Do you have an <span className="text-primary">electric shower</span>
            ?
          </>
        );
      case "powerShower":
        return (
          <>
            Is it a <span className="text-primary">power shower</span>?
          </>
        );
      case "pumpSeparatedFromShower":
        return (
          <>
            Is the <span className="text-primary">pump</span> separated from
            the shower?
          </>
        );
      case "radiators":
        return (
          <>
            How many <span className="text-primary">radiators</span> do you
            have?
          </>
        );
      case "trv":
        return (
          <>
            Do you have{" "}
            <span className="text-primary">Thermostatic Radiator Valves</span>{" "}
            on all your radiators?
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
            Is your flue in a <span className="text-primary">sloped roof</span>{" "}
            or a <span className="text-primary">flat roof</span> ?
          </>
        );
      case "roofPosition":
        return (
          <>
            Where on the roof is it{" "}
            <span className="text-primary">positioned</span>?
          </>
        );
      case "flueWallDistance":
        return (
          <>
            How far is your current boiler from an{" "}
            <span className="text-primary">outside wall</span>?
          </>
        );
      case "flueShape":
        return (
          <>
            Is your current flue <span className="text-primary">square</span> or{" "}
            <span className="text-primary">round</span>?
          </>
        );
      case "flueGroundDistance":
        return (
          <>
            How close to the <span className="text-primary">ground</span> is
            your flue?
          </>
        );
      case "fluePropertyDistance":
        return (
          <>
            How close to <span className="text-primary">another property</span>{" "}
            is your flue?
          </>
        );
      case "flueUnderStructure":
        return (
          <>
            Is the flue under a{" "}
            <span className="text-primary">carport, balcony</span> or other
            structure?
          </>
        );
      case "flueDoorWindowDistance":
        return (
          <>
            Is the flue 30cm or more from a{" "}
            <span className="text-primary">door or window</span>?
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

    if (currentStep >= maxStep || isPostcodeStep) {
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
    if (
      step?.id === "currentBoilerLocation" &&
      answers.differentPlace === "Move somewhere else" &&
      answers.newBoilerLocation &&
      answers.newBoilerLocation !== "Airing cupboard" &&
      answers.newBoilerLocation !== "Somewhere else"
    ) {
      const newBoilerLocationStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "newBoilerLocation",
      );
      if (newBoilerLocationStepIndex >= 0) {
        goToStep(newBoilerLocationStepIndex);
        return;
      }
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
    if (
      (step?.id === "flatOnSecondFloor" ||
        step?.id === "accessEquipmentCharges") &&
      answers.homeType === "Flat"
    ) {
      const homeTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "homeType",
      );
      if (homeTypeStepIndex >= 0) {
        goToStep(homeTypeStepIndex);
        return;
      }
    }
    if (
      step?.id === "homeType" &&
      answers.differentPlace &&
      answers.differentPlace !== "Move somewhere else"
    ) {
      if (
        answers.differentPlace === "Move to airing cupboard" ||
        (answers.differentPlace === "No" &&
          answers.currentBoilerLocation === "Airing cupboard")
      ) {
        const airingCupboardLocationStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "airingCupboardLocation",
        );
        if (airingCupboardLocationStepIndex >= 0) {
          goToStep(airingCupboardLocationStepIndex);
          return;
        }
      }

      const differentPlaceStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "differentPlace",
      );
      if (differentPlaceStepIndex >= 0) {
        goToStep(differentPlaceStepIndex);
        return;
      }
    }
    if (
      step?.id === "bedrooms" &&
      answers.homeType === "Bungalow" &&
      answers.bungalowFloors
    ) {
      const bungalowFloorsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "bungalowFloors",
      );
      if (bungalowFloorsStepIndex >= 0) {
        goToStep(bungalowFloorsStepIndex);
        return;
      }
    }
    if (
      step?.id === "bedrooms" &&
      answers.homeType &&
      answers.homeType !== "Flat"
    ) {
      const homeTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "homeType",
      );
      if (homeTypeStepIndex >= 0) {
        goToStep(homeTypeStepIndex);
        return;
      }
    }
    if (
      step?.id === "bedrooms" &&
      answers.homeType === "Flat" &&
      answers.flatOnSecondFloor === "No"
    ) {
      const flatOnSecondFloorStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "flatOnSecondFloor",
      );
      if (flatOnSecondFloorStepIndex >= 0) {
        goToStep(flatOnSecondFloorStepIndex);
        return;
      }
    }
    if (step?.id === "radiators" && answers.showers === "0 showers") {
      const showersStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "showers",
      );
      if (showersStepIndex >= 0) {
        goToStep(showersStepIndex);
        return;
      }
    }
    if (step?.id === "radiators" && answers.electricShower === "No") {
      const electricShowerStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "electricShower",
      );
      if (electricShowerStepIndex >= 0) {
        goToStep(electricShowerStepIndex);
        return;
      }
    }
    if (step?.id === "radiators" && answers.powerShower === "No") {
      const powerShowerStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "powerShower",
      );
      if (powerShowerStepIndex >= 0) {
        goToStep(powerShowerStepIndex);
        return;
      }
    }
    if (
      step?.id === "radiators" &&
      answers.powerShower === "Yes" &&
      answers.pumpSeparatedFromShower
    ) {
      const pumpSeparatedStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "pumpSeparatedFromShower",
      );
      if (pumpSeparatedStepIndex >= 0) {
        goToStep(pumpSeparatedStepIndex);
        return;
      }
    }
    if (step?.id === "showers" && answers.bathtubs === "0 bathtubs") {
      const bathtubsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "bathtubs",
      );
      if (bathtubsStepIndex >= 0) {
        goToStep(bathtubsStepIndex);
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
    const shouldRouteToHomeTypeAfterCurrentLocation =
      answers.differentPlace === "Move somewhere else" &&
      answers.newBoilerLocation &&
      answers.newBoilerLocation !== "Airing cupboard" &&
      answers.newBoilerLocation !== "Somewhere else";

    if (shouldRouteToHomeTypeAfterCurrentLocation) {
      const homeTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "homeType",
      );
      if (homeTypeStepIndex >= 0) {
        goToStep(homeTypeStepIndex);
        return;
      }
    }

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
      if (value === "No" && answers.boilerType === "Back Boiler") {
        router.push("/boilers/callout");
        return;
      }
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
          setAnswer("airingCupboardLocation", "");
        }
        const shouldRouteToHomeTypeAfterCurrentLocation =
          answers.differentPlace === "Move somewhere else" &&
          answers.newBoilerLocation &&
          answers.newBoilerLocation !== "Airing cupboard" &&
          answers.newBoilerLocation !== "Somewhere else";

        if (shouldRouteToHomeTypeAfterCurrentLocation) {
          const homeTypeStepIndex = propertyChoiceSteps.findIndex(
            (item) => item.id === "homeType",
          );
          if (homeTypeStepIndex >= 0) {
            goToStep(homeTypeStepIndex);
            return;
          }
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
    if (step.id === "differentPlace") {
      if (value === "Move somewhere else") {
        setAnswer("airingCupboardLocation", "");
        const newBoilerLocationStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "newBoilerLocation",
        );
        if (newBoilerLocationStepIndex >= 0) {
          goToStep(newBoilerLocationStepIndex);
          return;
        }
      } else if (value === "Move to airing cupboard") {
        setAnswer("newBoilerLocation", "");
        const airingCupboardLocationStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "airingCupboardLocation",
        );
        if (airingCupboardLocationStepIndex >= 0) {
          goToStep(airingCupboardLocationStepIndex);
          return;
        }
      } else {
        setAnswer("newBoilerLocation", "");
        const shouldRouteToAiringCupboardLocation =
          value === "No" && answers.currentBoilerLocation === "Airing cupboard";
        if (!shouldRouteToAiringCupboardLocation) {
          setAnswer("airingCupboardLocation", "");
        }

        if (shouldRouteToAiringCupboardLocation) {
          const airingCupboardLocationStepIndex = propertyChoiceSteps.findIndex(
            (item) => item.id === "airingCupboardLocation",
          );
          if (airingCupboardLocationStepIndex >= 0) {
            goToStep(airingCupboardLocationStepIndex);
            return;
          }
        }

        const homeTypeStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "homeType",
        );
        if (homeTypeStepIndex >= 0) {
          goToStep(homeTypeStepIndex);
          return;
        }
      }
    }
    if (step.id === "airingCupboardLocation") {
      const homeTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "homeType",
      );
      if (homeTypeStepIndex >= 0) {
        goToStep(homeTypeStepIndex);
        return;
      }
    }
    if (step.id === "homeType" && value !== "Flat") {
      if (value === "Bungalow") {
        setAnswer("flatOnSecondFloor", "");
        setAnswer("accessEquipmentCharges", "");
        const bungalowFloorsStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "bungalowFloors",
        );
        if (bungalowFloorsStepIndex >= 0) {
          goToStep(bungalowFloorsStepIndex);
          return;
        }
      }

      setAnswer("flatOnSecondFloor", "");
      setAnswer("accessEquipmentCharges", "");
      setAnswer("bungalowFloors", "");
      const bedroomsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "bedrooms",
      );
      if (bedroomsStepIndex >= 0) {
        goToStep(bedroomsStepIndex);
        return;
      }
    }
    if (step.id === "homeType" && value === "Flat") {
      setAnswer("bungalowFloors", "");
      const flatOnSecondFloorStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "flatOnSecondFloor",
      );
      if (flatOnSecondFloorStepIndex >= 0) {
        goToStep(flatOnSecondFloorStepIndex);
        return;
      }
    }
    if (step.id === "bungalowFloors") {
      const bedroomsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "bedrooms",
      );
      if (bedroomsStepIndex >= 0) {
        goToStep(bedroomsStepIndex);
        return;
      }
    }
    if (step.id === "flatOnSecondFloor") {
      if (value === "Yes") {
        const accessEquipmentStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "accessEquipmentCharges",
        );
        if (accessEquipmentStepIndex >= 0) {
          goToStep(accessEquipmentStepIndex);
          return;
        }
      }

      // For "No" (and any unexpected value), continue directly to bedrooms.
      if (value !== "Yes") {
        setAnswer("accessEquipmentCharges", "");
        const bedroomsStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "bedrooms",
        );
        if (bedroomsStepIndex >= 0) {
          goToStep(bedroomsStepIndex);
          return;
        }
      }
    }
    if (step.id === "accessEquipmentCharges" && value === "No") {
      router.push("/boilers/callout");
      return;
    }
    if (step.id === "bathtubs") {
      if (value === "0 bathtubs") {
        setAnswer("bathtubShowerOver", "");
        const showersStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "showers",
        );
        if (showersStepIndex >= 0) {
          goToStep(showersStepIndex);
          return;
        }
      }

      const bathtubShowerOverStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "bathtubShowerOver",
      );
      if (bathtubShowerOverStepIndex >= 0) {
        goToStep(bathtubShowerOverStepIndex);
        return;
      }
    }
    if (step.id === "bathtubShowerOver") {
      const showersStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "showers",
      );
      if (showersStepIndex >= 0) {
        goToStep(showersStepIndex);
        return;
      }
    }
    if (step.id === "showers") {
      if (value === "0 showers") {
        setAnswer("electricShower", "");
        const radiatorsStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "radiators",
        );
        if (radiatorsStepIndex >= 0) {
          goToStep(radiatorsStepIndex);
          return;
        }
      }

      const electricShowerStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "electricShower",
      );
      if (electricShowerStepIndex >= 0) {
        goToStep(electricShowerStepIndex);
        return;
      }
    }
    if (step.id === "electricShower") {
      if (value === "Yes") {
        const powerShowerStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "powerShower",
        );
        if (powerShowerStepIndex >= 0) {
          goToStep(powerShowerStepIndex);
          return;
        }
      }

      setAnswer("powerShower", "");
      const radiatorsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "radiators",
      );
      if (radiatorsStepIndex >= 0) {
        goToStep(radiatorsStepIndex);
        return;
      }
    }
    if (step.id === "powerShower") {
      if (value === "Yes") {
        const pumpSeparatedStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "pumpSeparatedFromShower",
        );
        if (pumpSeparatedStepIndex >= 0) {
          goToStep(pumpSeparatedStepIndex);
          return;
        }
      }

      setAnswer("pumpSeparatedFromShower", "");
      const radiatorsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "radiators",
      );
      if (radiatorsStepIndex >= 0) {
        goToStep(radiatorsStepIndex);
        return;
      }
    }
    if (step.id === "pumpSeparatedFromShower") {
      const radiatorsStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "radiators",
      );
      if (radiatorsStepIndex >= 0) {
        goToStep(radiatorsStepIndex);
        return;
      }
    }
    if (step.id === "newBoilerLocation") {
      if (value === "Somewhere else") {
        router.push("/boilers/callout");
        return;
      }

      if (value === "Airing cupboard") {
        const airingCupboardLocationStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "airingCupboardLocation",
        );
        if (airingCupboardLocationStepIndex >= 0) {
          goToStep(airingCupboardLocationStepIndex);
          return;
        }
      }

      setAnswer("airingCupboardLocation", "");
      const homeTypeStepIndex = propertyChoiceSteps.findIndex(
        (item) => item.id === "homeType",
      );
      if (homeTypeStepIndex >= 0) {
        goToStep(homeTypeStepIndex);
        return;
      }
    }

    if (step.id === "flueOut") {
      if (value === "Roof") {
        const roofTypeStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "roofType",
        );
        if (roofTypeStepIndex >= 0) {
          goToStep(roofTypeStepIndex);
          return;
        }
      } else if (value === "Wall") {
        const flueWallDistanceStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "flueWallDistance",
        );
        if (flueWallDistanceStepIndex >= 0) {
          goToStep(flueWallDistanceStepIndex);
          return;
        }
      }
    }

    if (step.id === "roofType") {
      if (value === "Sloped") {
        const roofPositionStepIndex = propertyChoiceSteps.findIndex(
          (item) => item.id === "roofPosition",
        );
        if (roofPositionStepIndex >= 0) {
          goToStep(roofPositionStepIndex);
          return;
        }
      }

      if (value === "Flat") {
        setIsPostcodeStep(true);
        return;
      }
    }

    if (step.id === "roofPosition" || step.id === "flueDoorWindowDistance") {
      setIsPostcodeStep(true);
      return;
    }

    if (currentStep >= maxStep) {
      setIsPostcodeStep(true);
      return;
    }

    nextStep(maxStep);
  };

  return (
    <BoilerFlowShell>
      <div className="h-3 w-full bg-white">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: progressWidth }}
        />
      </div>

      <div className="mt-3 mb-2 md:mb-3 lg:mb-4">
        <div className="overflow-hidden rounded-[999px] ">
          <div className="bg-white h-14 rounded-full grid grid-cols-[auto_1fr_auto] items-stretch pl-0 pr-1">
            <div className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary ">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-full border border-[#2D3D4D] p-3 transition hover:bg-black/5 "
              >
                <ArrowLeft className="h-7 w-7 text-[#2D3D4D]" />
              </button>
              <Link href="/">
                <Image
                  src="/assets/images/multi_step_logo.png"
                  alt="Multi Step Logo"
                  width={332}
                  height={332}
                  className="h-[46px] w-[200px] object-contain"
                />
              </Link>
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
                    item.id === 1 &&
                      activeTopStep > 1 &&
                      "bg-[#FFF8DA] text-[#2D3D4D]",
                  )}
                >
                  {item.title}
                </div>
              ))}
            </div>

            <Sheet open={isHelpOpen} onOpenChange={setIsHelpOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 border-l border-[#E7ECF3] px-3 text-lg md:text-xl font-normal text-[#2D3D4D] leading-normal transition hover:bg-[#F8FAFC]"
                >
                  <MessageCircleQuestion className="h-6 w-6" />
                  Help
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full border-l-0 p-0 sm:max-w-[530px] [&>button]:hidden"
              >
                <HelpContainer embedded onClose={() => setIsHelpOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="px-4 py-6  md:px-0">
        <div className="rounded-[10px] bg-white px-2 md:px-6 lg:px-7 xl:px-8 py-7 md:py-9 lg:py-10 xl:py-12 ">
          <h2 className="mx-auto max-w-[850px] text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold leading-normal text-[#2D3D4D]">
            {headingText}
          </h2>
          {!isPostcodeStep && step?.id === "flueGroundDistance" ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#EEF2F6] px-5 py-2 text-lg font-medium text-[#2D3D4D]"
              >
                <MessageCircleQuestion className="h-5 w-5" />
                How to find out
              </button>
            </div>
          ) : null}
          {isPostcodeStep ? (
            <p className="mx-auto mt-3 max-w-[640px] text-center text-sm md:text-base leading-[1.45] text-[#5F6C7B]">
              We need this information to show the dates available for
              installation (order by 3pm for next working day installation)
            </p>
          ) : step?.id === "fluePropertyDistance" ? (
            <p className="mx-auto mt-3 max-w-[860px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              That&apos;s between your flue and the boundary of someone
              else&apos;s land, even if it&apos;s just the garden fence.
            </p>
          ) : step?.id === "flueUnderStructure" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              A carport is a shelter for your car made from a roof supported on
              posts. These can also be called lean-tos.
            </p>
          ) : step?.id === "flueDoorWindowDistance" ? (
            <p className="mx-auto mt-3 max-w-[860px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              This includes any opening in the wall, like a vent.
            </p>
          ) : step?.id === "flueWallDistance" ? (
            <p className="mx-auto mt-3 max-w-[760px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              This is so we can ensure we provide the correct length of flue for
              your new boiler.
            </p>
          ) : step?.id === "convertToCombi" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-[16px] md:text-[20px] leading-[1.45] text-[#2D3D4D]">
              We&apos;ll remove and safely dispose of your hot water cylinder
              together with re-configuring your current pipework to allow a
              combi boiler to be installed. All this will be included in your
              fixed price.
            </p>
          ) : step?.id === "electricShower" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              Electric showers heat water themselves, rather than getting hot
              water from the boiler.
            </p>
          ) : step?.id === "powerShower" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              It uses a pump to increase your water pressure, making a loud
              noise when you turn it on
            </p>
          )
          
          // : step?.id === "newBoilerLocation" ? (
          //   <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
          //     Big moves will cost a bit more. For a loft, you&apos;ll need a
          //     ladder and a light up there.
          //   </p>
          // )
          
          : step?.id === "flatOnSecondFloor" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              If your lowest floor is more than one storey off the ground,
              answer Yes.
            </p>
          ) : step?.id === "accessEquipmentCharges" ? (
            <p className="mx-auto mt-3 max-w-[900px] text-center text-sm md:text-base leading-[1.45] text-[#2D3D4D]">
              We will ask for photos after you checkout, and advise you if
              access equipment is required.
            </p>
          ) : null}

          {!isPostcodeStep &&
          step?.id === "currentBoilerLocation" &&
          isOtherRoomPrompt ? (
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
            <div className="mt-7 flex  flex-wrap items-stretch justify-center gap-4  ">
              {stepOptions.map((option) => {
                const selected = answers[step.id] === option.value;
                const Icon = option.icon;
                const optionImage = option.image;
                const isHoverDescriptionCard =
                  step.id === "fuelType" ||
                  step.id === "boilerType" ||
                  step.id === "homeType" ||
                  step.id === "airingCupboardLocation" ||
                  step.id === "bungalowFloors";
                const isConvertStep = step.id === "convertToCombi";
                const isWaterFlowStep = step.id === "waterFlowRate";
                const isFuelTypeCard = step.id === "fuelType";
                const isNewBoilerLocationStep = step.id === "newBoilerLocation";
                const isAiringCupboardLocationStep =
                  step.id === "airingCupboardLocation";

                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={cn(
                      "group relative rounded-[12px] px-3 py-3 text-[#2D3D4D] transition ",
                      isConvertStep || isWaterFlowStep
                        ? "h-[400px]"
                        : "h-[400px]",
                      optionCardWidthClass,
                      selected
                        ? isNewBoilerLocationStep
                          ? "bg-white border-[3px] border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.85)]"
                          : "bg-white border-[3px] border-primary shadow-[0_0_0_1px_rgba(255,222,89,0.85)]"
                        : isNewBoilerLocationStep
                          ? "border-[2px] border-[#8AA6C2] bg-white hover:border-[#6E90B3]"
                          : "border-[2px] border-[#AEB7C2] bg-white hover:border-primary hover:shadow-[0_0_0_1px_rgba(255,222,89,0.2)]",
                    )}
                  >
                    {isNewBoilerLocationStep && option.priceTag ? (
                      <div
                        className={cn(
                          "absolute top-2 right-2 rounded-[10px] px-3 py-1 text-sm font-bold text-white",
                          option.priceTag === "Free"
                            ? "bg-primary"
                            : "bg-[#24384B]",
                        )}
                      >
                        {option.priceTag}
                      </div>
                    ) : null}
                    <div className="flex h-full flex-col items-center justify-start gap-2 pb-3 ">
                      {optionImage ? (
                        <Image
                          src={optionImage}
                          alt={option.label}
                          width={220}
                          height={220}
                          className={cn(
                            "w-auto object-contain transition-all duration-200 ",
                            isFuelTypeCard ? "h-[150px]" : "h-[150px]",
                          )}
                        />
                      ) : Icon ? (
                        <Icon
                          className={cn(
                            isConvertStep || isWaterFlowStep
                              ? "h-24 w-24"
                              : "h-10 w-10",
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
                          !selected && "group-hover:text-primary",
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
                        <Info className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                    ) : null}
                    {isWaterFlowStep || isAiringCupboardLocationStep ? (
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
                          : "bg-transparent text-transparent group-hover:bg-primary group-hover:text-[#2D3D4D]",
                      )}
                    >
                      {selected ? "Selected" : "Select"}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <PersonalInfoForm
              personalInfo={personalInfo}
              setPersonalInfo={setPersonalInfo}
              onSubmit={() => void handleNext()}
              isSubmitting={isSubmitting}
              submitError={submitError}
              canMoveNext={canMoveNext}
            />
          )}
        </div>
      </div>
    </BoilerFlowShell>
  );
};

export default PropertyOverviewContainer;
