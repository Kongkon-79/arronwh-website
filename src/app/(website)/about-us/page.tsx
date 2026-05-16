import React from "react";
import AboutHero from "./_components/about-hero";
import HowItWorks from "../_components/how-it-works";
import Reviews from "../_components/reviews";
import Faq from "../_components/faq";
import OurValues from "./_components/our-values";
import Navbar from "@/components/shared/Navbar/Navbar";
import Hero from "./_components/hero";
import OurMission from "./_components/our-mission";
import OurProducts from "./_components/our-products";

const AboutUsPage = () => {
  return (
    <div>
      <Navbar />
      <Hero/>
      <OurMission/>
      <AboutHero />
      <OurValues/>
      <OurProducts/>
      <HowItWorks />
      <Reviews />
      <Faq />
    </div>
  );
};

export default AboutUsPage;
