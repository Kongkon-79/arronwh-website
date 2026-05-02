import { Check } from "lucide-react";
import Image from "next/image";

const heroPoints = [
  "Instant quotes in 60 seconds",
  "UK-wide new boiler installs",
];

const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-[#FBFF26]">
      <div className="container mx-auto px-1 py-2 md:py-16 lg:py-20">
        <div className="grid items-center lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8">
          {/* Left side: Text Content */}
          <div className="order-2 md:order-1 mx-auto w-full max-w-[580px] p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-semibold leading-normal text-[#2D3D4D]">
              <span className="font-normal">New boiler?</span> <br /> No Worries.
            </h1>

            <p className="mt-4 max-w-[410px] text-sm md:text-base text-[#2D3D4D] font-normal leading-normal">
              Get a fixed online quote for your new boiler today. Have it installed next working day.
            </p>

            <div className="h-[52px] mt-6 flex justify-between items-center gap-4 bg-white p-1 rounded-full w-full md:w-[80%]">
              <input
                type="text"
                placeholder="Enter postcode"
                className="px-4 py-2 w-1/2 rounded-full focus:outline-none "
              />
              <button className="px-6 py-[10px] bg-black text-white rounded-full">
                Fix my price
              </button>
            </div>

            <ul className="mt-6 space-y-2 text-lg">
              {heroPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#292D32] text-[#FBFF26]">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="mt-[3px] text-sm md:text-base text-[#2D3D4D] font-normal leading-normal">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side: Image */}
          <div className="order-1 md:order-2 mx-auto flex flex-col w-full max-w-[560px] items-center justify-center lg:justify-end ">
            <div className="relative w-full max-w-[520px]">
              <Image
                src="/assets/images/hero.png"
                alt="Hero Image"
                width={1000}
                height={600}
                className="h-[290px] w-full object-contain md:h-[390px] lg:h-[400px] rounded-[12px]"
              />
            </div>
            <h4 className="text-[292D32] text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-center font-semibold md:font-medium leading-normal">Save cash, switch <br /> boilers.</h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;








// import { Check } from "lucide-react";
// import Link from "next/link";

// const heroPoints = [
//   "Boiler installation from the next working day*",
//   "Finance options available, including 0% interest†",
//   "We'll beat any like-for-like price*",
// ];

// const HeroSection = () => {
//   return (
//     <section className="overflow-hidden bg-primary">
//       <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
//         <div className="grid items-center lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)] gap-6 md:gap-8 lg:gap-8">
//           <div className="order-2 md:order-1 mx-auto w-full max-w-[560px] rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(45,61,77,0.12)] md:p-8 lg:ml-10">
//             <div className="max-w-[420px]">
//               <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-normal text-[#2D3D4D]">
//                 Save £110 off all boilers
//               </h1>

//               <p className="mt-4 max-w-[410px] desc">
//                 Use code <span className="font-semibold ">BOILERS110</span> to{" "}
//                 <span className="font-semibold ">save £110</span> on your
//                 fixed-price boiler quote, with finance options and next working
//                 day installation available.
//               </p>

//               <Link href="boilers/property-overview">
//                 <button className="mt-6 inline-flex h-12 items-center gap-2 rounded-[8px] bg-primary px-6 text-sm md:text-base leading-normal font-semibold text-[#2D3D4D] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#F3D13B]">
//                   Get your fixed price
//                 </button>
//               </Link>

//               <ul className="mt-6 space-y-2">
//                 {heroPoints.map((point) => (
//                   <li key={point} className="flex items-start gap-3 desc">
//                     <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#0F172A]">
//                       <Check className="h-5 w-5" />
//                     </span>
//                     <span>{point}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           <div className="order-1 md:order-2 mx-auto flex w-full max-w-[560px] items-center justify-center lg:justify-end ">
//             <div className="relative w-full max-w-[520px] ">
//               <video
//                 src="/assets/videos/hero_video.mp4"
//                 autoPlay
//                 muted
//                 loop
//                 playsInline
//                 className="h-[420px] w-full object-cover md:h-[420px] lg:h-[456px] rounded-[12px]"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
