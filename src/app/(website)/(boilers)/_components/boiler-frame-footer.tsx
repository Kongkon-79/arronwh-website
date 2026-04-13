import { Star } from "lucide-react";

const BoilerFrameFooter = () => {
  return (
    <div className="border-t border-[#E9EEF4] px-5 py-4 md:px-8">
      <div className="grid gap-4 text-[11px] text-[#748294] md:grid-cols-4">
        <div>
          <p className="font-semibold text-[#2D3D4D]">Trustpilot</p>
          <p>4.8 out of 5 from 7,000+ reviews</p>
        </div>
        <div>
          <p className="font-semibold text-[#2D3D4D]">Boilers</p>
          <p>Fixed pricing, no hidden costs</p>
        </div>
        <div>
          <p className="font-semibold text-[#2D3D4D]">Our Service</p>
          <p>Install, service and support</p>
        </div>
        <div>
          <p className="font-semibold text-[#2D3D4D]">Support</p>
          <div className="mt-1 flex items-center gap-1 text-[#F2B100]">
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
            <Star className="h-3 w-3 fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoilerFrameFooter;
