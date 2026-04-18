import React from "react";
import AboutHero from "./_components/about-hero";
import HowItWorks from "../_components/how-it-works";
import Reviews from "../_components/reviews";
import Faq from "../_components/faq";
import OurValues from "./_components/our-values";
import Navbar from "@/components/shared/Navbar/Navbar";

const AboutUsPage = () => {
  return (
    <div>
      <Navbar />
      <AboutHero />
      <OurValues/>
      <HowItWorks />
      <Reviews />
      <Faq />
    </div>
  );
};

export default AboutUsPage;
