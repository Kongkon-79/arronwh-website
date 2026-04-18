import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";
import {
  Bath,
  Building2,
  Check,
  CircleHelp,
  Droplets,
  Flame,
  House,
  Pipette,
  Radio,
  ShowerHead,
  TreePine,
  Waves,
  Wind,
  Wrench,
  X,
} from "lucide-react";

import HomeownerImage from "../../../../../../../public/assets/images/boilers/homeowner.svg";
import LandlordImage from "../../../../../../../public/assets/images/boilers/landlord.svg";

export type Option = {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  image?: StaticImageData | string;
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
      { label: "Gas", value: "Gas", icon: Flame },
      { label: "LPG", value: "LPG", icon: Droplets },
      { label: "Oil", value: "Oil", icon: Pipette },
    ],
  },
  {
    id: "boilerType",
    question: "Currently, what type of boiler do you have?",
    cols: "md:grid-cols-4",
    options: [
      { label: "Combi", value: "Combi", icon: Waves },
      { label: "Standard", value: "Standard", icon: Building2 },
      { label: "System", value: "System", icon: Radio },
      { label: "Back Boiler", value: "Back Boiler", icon: Wrench },
    ],
  },
  {
    id: "boilerCondition",
    question: "How would you describe your current boiler?",
    cols: "md:grid-cols-4",
    options: [
      { label: "Not working", value: "Not working", icon: X },
      {
        label: "Old and inefficient",
        value: "Old and inefficient",
        icon: TreePine,
      },
      {
        label: "Does not meet needs",
        value: "Does not meet needs",
        icon: CircleHelp,
      },
      { label: "Other", value: "Other", icon: CircleHelp },
    ],
  },
  {
    id: "boilerAge",
    question: "Roughly how old is your boiler?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Up to 10 years", value: "Up to 10 years" },
      { label: "10-20 years", value: "10-20 years" },
      { label: "20-25 years", value: "20-25 years" },
      { label: "25+ years", value: "25+ years" },
      { label: "I don't know", value: "I don't know" },
    ],
  },
  {
    id: "mountedOnWall",
    question: "Is your boiler mounted on the wall?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", icon: Check },
      { label: "No", value: "No", icon: X },
    ],
  },
  {
    id: "stayDuration",
    question: "How long do you see yourself in your current home?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Up to 5 years", value: "Up to 5 years" },
      { label: "5-8 years", value: "5-8 years" },
      { label: "8-10 years", value: "8-10 years" },
      { label: "10+ years", value: "10+ years" },
      { label: "I don't know", value: "I don't know" },
    ],
  },
  {
    id: "differentPlace",
    question: "Do you want your new boiler in a different place?",
    cols: "md:grid-cols-2",
    options: [
      { label: "No", value: "No", icon: X },
      { label: "Yes", value: "Yes", icon: Check },
    ],
  },
  {
    id: "homeType",
    question: "Which of these best describes your home?",
    cols: "md:grid-cols-5",
    options: [
      { label: "Detached", value: "Detached" },
      { label: "Semi Detached", value: "Semi Detached" },
      { label: "Terraced", value: "Terraced" },
      { label: "Flat", value: "Flat" },
      { label: "Bungalow", value: "Bungalow" },
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
