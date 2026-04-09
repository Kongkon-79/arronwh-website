import HeroSection from './_components/hero'
import OurPartners from './_components/our-partners'
import ExploreOurHeating from './_components/explore-our-heating'
import HowItWorks from './_components/how-it-works'
import Reviews from './_components/reviews'
import TheBoxtPrice from './_components/the-boxt-price'
import Faq from './_components/faq'

const HomePage = () => {
  return (
    <div>
      <HeroSection/>
      <OurPartners/>
      <ExploreOurHeating/>
      <HowItWorks/>
      <Reviews/>
      <TheBoxtPrice/>
      <Faq/>
    </div>
  )
}

export default HomePage
