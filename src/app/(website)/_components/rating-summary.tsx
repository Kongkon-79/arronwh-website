import { Star } from "lucide-react";

interface RatingSummaryProps {
  ratingLabel: string;
  averageRating: number;
  formattedAverageRating: string | number;
  totalReviews: number;
}

export const RatingSummary = ({
  ratingLabel,
  averageRating,
  formattedAverageRating,
  totalReviews,
}: RatingSummaryProps) => {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] leading-none text-[#334155] md:text-[11px]">
      <span className="text-sm md:text-base leading-normal font-medium text-[#2D3D4D]">
        {ratingLabel}
      </span>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`flex h-[14px] w-[14px] items-center justify-center rounded-[2px] text-white md:h-[15px] md:w-[15px] ${
              index < Math.round(averageRating) ? "bg-[#00B67A]" : "bg-[#CFD6DD]"
            }`}
          >
            <Star className="h-2.5 w-2.5 fill-current" />
          </span>
        ))}
      </div>

      <span className="text-sm md:text-base font-normal leading-normal text-[#2D3D4D]">
        {formattedAverageRating} Out of 5 based on {totalReviews.toLocaleString()} reviews
      </span>
    </div>
  );
};
