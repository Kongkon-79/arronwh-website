import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";
import {
  Bath,
  Building2,
  Check,
  House,
  ShowerHead,
  Waves,
  Wind,
  X,
} from "lucide-react";

import HomeownerImage from "../../../../../../../public/assets/images/boilers/homeowner.svg";
import LandlordImage from "../../../../../../../public/assets/images/boilers/landlord.svg";
import GasImage from "../../../../../../../public/assets/images/boilers/gas.svg";
import LpgImage from "../../../../../../../public/assets/images/boilers/lpg.svg";
import OilImage from "../../../../../../../public/assets/images/boilers/oil.svg";
import CombiImage from "../../../../../../../public/assets/images/boilers/combi.svg";
import StandardImage from "../../../../../../../public/assets/images/boilers/standard.svg";
import SystemImage from "../../../../../../../public/assets/images/boilers/system.svg";
import BackBoilerImage from "../../../../../../../public/assets/images/boilers/back-boiler.svg";
import NotWorking from "../../../../../../../public/assets/images/boilers/not-working.svg";
import OldInefficient from "../../../../../../../public/assets/images/boilers/old-inefficient.svg";
import DoesNotMeetNeeds from "../../../../../../../public/assets/images/boilers/doesnt-fit.svg";
import Other from "../../../../../../../public/assets/images/boilers/question-mark.svg";
import Yes from "../../../../../../../public/assets/images/boilers/yes.svg";
import No from "../../../../../../../public/assets/images/boilers/no.svg";
import YesWallMounted from "../../../../../../../public/assets/images/boilers/wall-mounted.svg";
import NoFloorStanding from "../../../../../../../public/assets/images/boilers/free-standing.svg";
import UpToTen from "../../../../../../../public/assets/images/boilers/up-to-ten.svg";
import TenToTwenty from "../../../../../../../public/assets/images/boilers/ten-twenty.svg";
import TwentyToTwentyFive from "../../../../../../../public/assets/images/boilers/twenty-twenty-five.svg";
import TwentyFivePlus from "../../../../../../../public/assets/images/boilers/twenty-five-plus.svg";
import UpToOne from "../../../../../../../public/assets/images/boilers/up-to-one.svg";
import OneToFive from "../../../../../../../public/assets/images/boilers/one-five.svg";
import SixToTen from "../../../../../../../public/assets/images/boilers/six-ten.svg";
import TenPlus from "../../../../../../../public/assets/images/boilers/ten-plus.svg";
import Fast from "../../../../../../../public/assets/images/boilers/fast.svg";
import Average from "../../../../../../../public/assets/images/boilers/average.svg";
import Slow from "../../../../../../../public/assets/images/boilers/slow.svg";
import UtilityRoom from "../../../../../../../public/assets/images/boilers/utility-room.svg";
import Kitchen from "../../../../../../../public/assets/images/boilers/kitchen.svg";
import Garage from "../../../../../../../public/assets/images/boilers/garage.svg";
import AiringCupboard from "../../../../../../../public/assets/images/boilers/cupboard.svg";
import Detached from "../../../../../../../public/assets/images/boilers/detached.svg";
import SemiDetached from "../../../../../../../public/assets/images/boilers/semi-detached.svg";
import Terraced from "../../../../../../../public/assets/images/boilers/terrace.svg";
import Flat from "../../../../../../../public/assets/images/boilers/flat.svg";
import Bungalow from "../../../../../../../public/assets/images/boilers/bungalow.svg";


export type Option = {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  image?: StaticImageData | string;
  hoverDescription?: string;
};

export type ChoiceStep = {
  id: string;
  question: string;
  options: Option[];
  cols?: string;
};

export type BoilerProduct = {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: string;
  yearlyService: string;
  efficiency: string;
};

export const propertyChoiceSteps: ChoiceStep[] = [
  {
    id: "requirement",
    question: "Are you a homeowner or landlord?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Homeowner", value: "Homeowner", image: HomeownerImage },
      { label: "Landlord", value: "Landlord", image: LandlordImage },
    ],
  },
  {
    id: "fuelType",
    question: "What kind of fuel does your boiler use?",
    cols: "md:grid-cols-3",
    options: [
      {
        label: "Gas",
        value: "Gas",
        image: GasImage,
        hoverDescription: "If you have a gas meter, your boiler uses gas.",
      },
      {
        label: "LPG",
        value: "LPG",
        image: LpgImage,
        hoverDescription:
          "LPG stands for Liquid Petroleum Gas. It's a gas stored in a tank outside. It's not the same as oil, which unfortunately we don't provide.",
      },
      {
        label: "Oil",
        value: "Oil",
        image: OilImage,
        hoverDescription:
          "Oil boilers work by using a stored supply of oil in an external tank. These are more common in rural areas.",
      },
    ],
  },
  {
    id: "boilerType",
    question: "Currently, what type of boiler do you have?",
    cols: "md:grid-cols-4",
    options: [
      {
        label: "Combi",
        value: "Combi",
        image: CombiImage,
        hoverDescription:
          "Combi boilers heat water directly from the mains when you turn on a tap. So you get hot water instantly - without a cylinder or a tank in the loft.",
      },
      {
        label: "Standard",
        value: "Standard",
        image: StandardImage,
        hoverDescription:
          "If you have a hot water storage cylinder as well as a cold water tank in the loft, your boiler is likely to be Standard. These are also called Regular, Traditional or Conventional boilers.",
      },
      {
        label: "System",
        value: "System",
        image: SystemImage,
        hoverDescription:
          "If you have a hot water storage cylinder but no cold water tank in the loft, you're likely to have a System boiler. You can also choose this option if you have a Potterton Powermax.",
      },
      {
        label: "Back Boiler",
        value: "Back Boiler",
        image: BackBoilerImage,
        hoverDescription:
          "A Back Boiler Unit (BBU) is a boiler built-in behind a gas fireplace.",
      },
    ],
  },
  {
    id: "convertToCombi",
    question: "Do you want to convert to a Combi boiler?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", image: Yes },
      { label: "No", value: "No", image: No },
    ],
  },
  {
    id: "boilerCondition",
    question: "How would you describe your current boiler?",
    cols: "md:grid-cols-4",
    options: [
      { label: "Not working", value: "Not working", image: NotWorking },
      {
        label: "Old & inefficient",
        value: "Old & inefficient",
        image: OldInefficient,
      },
      {
        label: "Doesn't fit with our plans",
        value: "Doesn't fit with our plans",
        image: DoesNotMeetNeeds,
      },
      { label: "Other", value: "Other", image: Other },
    ],
  },
  {
    id: "mountedOnWall",
    question: "Is your boiler mounted on the wall?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes it is wall mounted", value: "Yes it is wall mounted", image: YesWallMounted },
      { label: "No it is floor standing", value: "No it is floor standing", image: NoFloorStanding },
    ],
  },
  {
    id: "boilerAge",
    question: "Roughly how old is your boiler?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Up to 10 years", value: "Up to 10 years", image: UpToTen },
      { label: "10-20 years", value: "10-20 years", image: TenToTwenty },
      {
        label: "20-25 years",
        value: "20-25 years",
        image: TwentyToTwentyFive,
      },
      { label: "25+ years", value: "25+ years", image: TwentyFivePlus },
      { label: "I don't know", value: "I don't know", image: Other },
    ],
  },
  
  {
    id: "stayDuration",
    question: "How long do you see yourself in your current home?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Up to 1 years", value: "Up to 1 years", image: UpToOne },
      { label: "1-5 years", value: "1-5 years", image: OneToFive },
      { label: "6-10 years", value: "6-10 years", image: SixToTen },
      { label: "10+ years", value: "10+ years", image: TenPlus },
      { label: "I don't know", value: "I don't know", image: Other },
    ],
  },
  {
    id: "waterFlowRate",
    question: "How quickly does your water come out of your cold tap?",
    cols: "md:grid-cols-3",
    options: [
      {
        label: "Fast",
        value: "Fast",
        image: Fast,
        hoverDescription: "Fills a pint glass in under 5 seconds.",
      },
      {
        label: "Average",
        value: "Average",
        image: Average,
        hoverDescription: "Fills a pint glass in less than 10 seconds.",
      },
      {
        label: "Slow",
        value: "Slow",
        image: Slow,
        hoverDescription: "Takes more than 10 seconds to fill a pint glass.",
      },
    ],
  },
  {
    id: "currentBoilerLocation",
    question: "Where's your current boiler?",
    cols: "md:grid-cols-4",
    options: [
      { label: "Utility room", value: "Utility room", image: UtilityRoom },
      { label: "Kitchen", value: "Kitchen", image: Kitchen },
      { label: "Garage", value: "Garage", image: Garage },
      { label: "Airing cupboard", value: "Airing cupboard", image: AiringCupboard },
      { label: "Other", value: "Other", image: Other },
    ],
  },
  {
    id: "differentPlace",
    question: "Do you want your new boiler in a different place?",
    cols: "md:grid-cols-3",
    options: [
      { label: "No", value: "No", image: No },
      {
        label: "Move to airing cupboard",
        value: "Move to airing cupboard",
        image: AiringCupboard,
      },
      {
        label: "Move somewhere else",
        value: "Move somewhere else",
        image: Other,
      },
    ],
  },
  {
    id: "homeType",
    question: "Which of these best describes your home?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Detached", value: "Detached", image: Detached },
      { label: "Semi Detached", value: "Semi Detached", image: SemiDetached },
      { label: "Terraced", value: "Terraced", image: Terraced },
      { label: "Flat", value: "Flat", image: Flat },
      { label: "Bungalow", value: "Bungalow", image: Bungalow },
    ],
  },
  {
    id: "bedrooms",
    question: "How many bedrooms do you have?",
    cols: "md:grid-cols-6",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
      { label: "6+", value: "6+" },
    ],
  },
  {
    id: "bathtubs",
    question: "How many bathtubs do you have, or plan to have in the future?",
    cols: "md:grid-cols-4",
    options: [
      { label: "0", value: "0", icon: Bath },
      { label: "1", value: "1", icon: Bath },
      { label: "2", value: "2", icon: Bath },
      { label: "3+", value: "3+", icon: Bath },
    ],
  },
  {
    id: "showers",
    question:
      "How many separate showers do you have, or plan to have in the future?",
    cols: "md:grid-cols-3",
    options: [
      { label: "0", value: "0", icon: ShowerHead },
      { label: "1", value: "1", icon: ShowerHead },
      { label: "2+", value: "2+", icon: ShowerHead },
    ],
  },
  {
    id: "radiators",
    question: "How many radiators do you have?",
    cols: "md:grid-cols-5",
    options: [
      { label: "0-5", value: "0-5", icon: Waves },
      { label: "6-9", value: "6-9", icon: Waves },
      { label: "10-13", value: "10-13", icon: Waves },
      { label: "14-16", value: "14-16", icon: Waves },
      { label: "17+", value: "17+", icon: Waves },
    ],
  },
  {
    id: "trv",
    question: "Do you have Thermostatic Radiator Valves on all your radiators?",
    cols: "md:grid-cols-2",
    options: [
      { label: "No", value: "No", icon: X },
      { label: "Yes", value: "Yes", icon: Check },
    ],
  },
  {
    id: "waterMeter",
    question: "Do you have a water meter?",
    cols: "md:grid-cols-2",
    options: [
      { label: "No", value: "No", icon: X },
      { label: "Yes", value: "Yes", icon: Check },
    ],
  },
  {
    id: "flueOut",
    question: "Where does your flue come out?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Roof", value: "Roof", icon: House },
      { label: "Wall", value: "Wall", icon: Building2 },
    ],
  },
  {
    id: "roofType",
    question: "Is your flue in a sloped roof or a flat roof?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Sloped", value: "Sloped", icon: House },
      { label: "Flat", value: "Flat", icon: Building2 },
    ],
  },
  {
    id: "roofPosition",
    question: "Where on the roof is it positioned?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Higher than ridge", value: "Higher than ridge", icon: Wind },
      { label: "Lower than ridge", value: "Lower than ridge", icon: Wind },
    ],
  },
];

export const boilerProducts: BoilerProduct[] = [
  {
    id: "alpha-e-tech",
    name: "Alpha E-Tech 30",
    badge: "Most popular",
    monthlyPrice: "GBP 29.99 / month",
    yearlyService: "GBP 120 / year",
    efficiency: "A-Rated, 93%",
  },
  {
    id: "worcester-4000",
    name: "Worcester Bosch 4000",
    badge: "Best value",
    monthlyPrice: "GBP 34.99 / month",
    yearlyService: "GBP 140 / year",
    efficiency: "A-Rated, 94%",
  },
  {
    id: "ideal-logic-max",
    name: "Ideal Logic Max",
    badge: "Long warranty",
    monthlyPrice: "GBP 39.99 / month",
    yearlyService: "GBP 150 / year",
    efficiency: "A-Rated, 94%",
  },
];
