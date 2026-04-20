import type { ComponentType } from "react";
import type { StaticImageData } from "next/image";


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
import One from "../../../../../../../public/assets/images/boilers/one.svg";
import Two from "../../../../../../../public/assets/images/boilers/two.svg";
import Three from "../../../../../../../public/assets/images/boilers/three.svg";
import Four from "../../../../../../../public/assets/images/boilers/four.svg";
import Five from "../../../../../../../public/assets/images/boilers/five.svg";
import SixPlus from "../../../../../../../public/assets/images/boilers/six-plus.svg";
import Zero from "../../../../../../../public/assets/images/boilers/zero.svg";
import ThreePlus from "../../../../../../../public/assets/images/boilers/three-plus.svg";
import TwoPlus from "../../../../../../../public/assets/images/boilers/two-plus.svg";
import ZeroFive from "../../../../../../../public/assets/images/boilers/zero-five.svg";
import SixNine from "../../../../../../../public/assets/images/boilers/six-nine.svg";
import TenThirteen from "../../../../../../../public/assets/images/boilers/ten-thirteen.svg";
import FourteenSixteen from "../../../../../../../public/assets/images/boilers/fourteen-sixteen.svg";
import SeventeenPlus from "../../../../../../../public/assets/images/boilers/seventeen-plus.svg";
import TRVYes from "../../../../../../../public/assets/images/boilers/trv-yes.svg";
import TRVNo from "../../../../../../../public/assets/images/boilers/trv-no.svg";
import Roof from "../../../../../../../public/assets/images/boilers/roof.svg";
import Wall from "../../../../../../../public/assets/images/boilers/wall.svg";
import SlopedRoof from "../../../../../../../public/assets/images/boilers/sloped-roof.svg";
import FlatRoof from "../../../../../../../public/assets/images/boilers/flat-roof-flue.svg";
import HighestThird from "../../../../../../../public/assets/images/boilers/highest-third.svg";
import LowestThird from "../../../../../../../public/assets/images/boilers/lowest-third.svg";
import Under1m from "../../../../../../../public/assets/images/boilers/under-one-metre.svg";
import OneTwoM from "../../../../../../../public/assets/images/boilers/one-to-two-metres.svg";
import TwoThreeM from "../../../../../../../public/assets/images/boilers/two-to-three-metres.svg";
import ThreePlusM from "../../../../../../../public/assets/images/boilers/three-plus-metres.svg";
import FlueSquare from "../../../../../../../public/assets/images/boilers/square.svg";
import FlueRound from "../../../../../../../public/assets/images/boilers/round.svg";
import FlueMoreThanTwoMetres from "../../../../../../../public/assets/images/boilers/flue-more-than-two-metres.svg";
import FlueLessThanTwoMetres from "../../../../../../../public/assets/images/boilers/flue-less-than-two-metres.svg";
import FlueMoreThanTwoMetresProperty from "../../../../../../../public/assets/images/boilers/flue-more-than-two-metres-property.svg";
import FlueLessThanTwoMetresProperty from "../../../../../../../public/assets/images/boilers/flue-less-than-two-metres-property.svg";
import FlueCarportYes from "../../../../../../../public/assets/images/boilers/flue-carport-yes.svg";
import FlueCarportNo from "../../../../../../../public/assets/images/boilers/flue-carport-no.svg";
import FlueUnderThirtyCm from "../../../../../../../public/assets/images/boilers/flue-under-thirty-cm.svg";
import FlueOverThirtyCm from "../../../../../../../public/assets/images/boilers/flue-over-thirty-cm.svg";

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
      { label: "1 bedroom", value: "1 bedroom", image: One },
      { label: "2 bedrooms", value: "2 bedrooms", image: Two },
      { label: "3 bedrooms", value: "3 bedrooms", image: Three },
      { label: "4 bedrooms", value: "4 bedrooms", image: Four },
      { label: "5 bedrooms", value: "5 bedrooms", image: Five },
      { label: "6+ bedrooms", value: "6+ bedrooms", image: SixPlus },
    ],
  },
  {
    id: "bathtubs",
    question: "How many bathtubs do you have, or plan to have in the future?",
    cols: "md:grid-cols-4",
    options: [
      { label: "0 bathtubs", value: "0 bathtubs", image: Zero },
      { label: "1 bathtub", value: "1 bathtub", image: One },
      { label: "2 bathtubs", value: "2 bathtubs", image: Two },
      { label: "3+ bathtubs", value: "3+ bathtubs", image: ThreePlus },
    ],
  },
  {
    id: "showers",
    question:
      "How many separate showers do you have, or plan to have in the future?",
    cols: "md:grid-cols-3",
    options: [
      { label: "0 showers", value: "0 showers", image: Zero },
      { label: "1 shower", value: "1 shower", image: One },
      { label: "2+ showers", value: "2+ showers", image: TwoPlus },
    ],
  },
  {
    id: "radiators",
    question: "How many radiators do you have?",
    cols: "md:grid-cols-5",
    options: [
      { label: "0-5 radiators", value: "0-5 radiators", image: ZeroFive },
      { label: "6-9 radiators", value: "6-9 radiators", image: SixNine },
      { label: "10-13 radiators", value: "10-13 radiators", image: TenThirteen },
      { label: "14-16 radiators", value: "14-16 radiators", image: FourteenSixteen },
      { label: "17+ radiators", value: "17+ radiators", image: SeventeenPlus },
    ],
  },
  {
    id: "trv",
    question: "Do you have Thermostatic Radiator Valves on all your radiators?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", image: TRVYes },
      { label: "No", value: "No", image: TRVNo },
    ],
  },
  {
    id: "waterMeter",
    question: "Do you have a water meter?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", image: Yes },
      { label: "No", value: "No", image: No },
    ],
  },
  {
    id: "flueOut",
    question: "Where does your flue come out?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Roof", value: "Roof", image: Roof },
      { label: "Wall", value: "Wall", image: Wall },
    ],
  },
  {
    id: "roofType",
    question: "Is your flue in a sloped roof or a flat roof?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Sloped", value: "Sloped", image: SlopedRoof },
      { label: "Flat", value: "Flat", image: FlatRoof },
    ],
  },
  {
    id: "roofPosition",
    question: "Where on the roof is it positioned?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Highest two-thirds", value: "Highest two-thirds", image: HighestThird },
      { label: "Lowest third", value: "Lowest third", image: LowestThird },
    ],
  },
  {
    id: "flueWallDistance",
    question: "How far is your current boiler from an outside wall?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Under 1 metre", value: "Under 1m", image: Under1m },
      { label: "1-2 metres", value: "1-2m", image: OneTwoM },
      { label: "2-3 metres", value: "2-3m", image: TwoThreeM },
      { label: "3+ metres", value: "3m+", image: ThreePlusM },
    ],
  },
  {
    id: "flueShape",
    question: "Is your current flue square or round?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Square", value: "Square", image: FlueSquare },
      { label: "Round", value: "Round", image: FlueRound },
    ],
  },
  {
    id: "flueGroundDistance",
    question: "How close to the ground is your flue?",
    cols: "md:grid-cols-2",
    options: [
      {
        label: "More than 2 metres",
        value: "More than 2 metres",
        image: FlueMoreThanTwoMetres,
      },
      {
        label: "Less than 2 metres",
        value: "Less than 2 metres",
        image: FlueLessThanTwoMetres,
      },
    ],
  },
  {
    id: "fluePropertyDistance",
    question: "How close to another property is your flue?",
    cols: "md:grid-cols-2",
    options: [
      {
        label: "More than 2 metres",
        value: "More than 2 metres",
        image: FlueMoreThanTwoMetresProperty,
      },
      {
        label: "Less than 2 metres",
        value: "Less than 2 metres",
        image: FlueLessThanTwoMetresProperty,
      },
    ],
  },
  {
    id: "flueUnderStructure",
    question: "Is the flue under a carport, balcony or other structure?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", image: FlueCarportYes },
      { label: "No", value: "No", image: FlueCarportNo },
    ],
  },
  {
    id: "flueDoorWindowDistance",
    question: "Is the flue 30cm or more from a door or window?",
    cols: "md:grid-cols-2",
    options: [
      { label: "Yes", value: "Yes", image: FlueOverThirtyCm },
      { label: "No", value: "No", image: FlueUnderThirtyCm },
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
