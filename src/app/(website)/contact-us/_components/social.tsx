"use client";

import React from "react";
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

const SocialSkeleton = () => (
  <section className="h-full rounded-[22px] bg-[#15171a] p-5 sm:p-6 flex flex-col justify-between">
    <div>
      <Skeleton className="h-10 w-32 bg-gray-700 mb-3" />
      <Skeleton className="h-5 w-48 bg-gray-700" />
    </div>
    <div className="mt-14 md:mt-14 lg:mt-16 xl:mt-24 flex items-center justify-end gap-4">
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
    </div>
  </section>
);

const SocialError = ({ onRetry }: { onRetry: () => void }) => (
  <section className="h-full rounded-[22px] bg-[#15171a] p-5 sm:p-6 flex flex-col items-center justify-center text-center">
    <AlertTriangle className="h-8 w-8 text-red-500 mb-2" strokeWidth={1.5} />
    <h2 className="text-lg font-medium text-white">Failed to load Social</h2>
    <button
      onClick={onRetry}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-gray-700"
    >
      <RefreshCw className="h-4 w-4" />
      Retry
    </button>
  </section>
);

const Social = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["socialpartnership"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/socialpartership`);
      if (!res.ok) throw new Error("Failed to fetch socialpartnership data");
      return res.json();
    },
  });

  if (isLoading) return <SocialSkeleton />;
  if (isError) return <SocialError onRetry={refetch} />;

  const socialData = data?.data?.[0];

  const getIcon = (link: string) => {
    if (link.includes("facebook.com")) return <FaFacebook className="h-8 w-8" />;
    if (link.includes("twitter.com") || link.includes("x.com")) return <FaXTwitter className="h-8 w-8" />;
    if (link.includes("instagram.com")) return <FaInstagram className="h-8 w-8" />;
    if (link.includes("youtube.com")) return <IoLogoYoutube className="h-8 w-8" />;
    return null;
  };

  return (
    <section 
      className="h-full rounded-[22px] p-5 text-white sm:p-6"
      style={{ backgroundColor: socialData?.backgroundColor || "#15171a", color: socialData?.textColor || "#ffffff" }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.02em] text-[#f1f1f2]">
        {socialData?.title || "Social"}
      </h2>
      <p className="mt-3 text-sm md:text-base font-medium leading-none tracking-[-0.01em] text-[#d2d6dc]">
        {socialData?.subTitle || "Be our friend, follow us."}
      </p>

      <div className="mt-14 md:mt-14 lg:mt-16 xl:mt-24 flex flex-wrap items-center justify-end gap-4 text-[#f3f3f3]">
        {socialData?.socialLink && socialData.socialLink.length > 0 ? (
          socialData.socialLink.map((item: { link: string; icon?: string }, index: number) => (
            <a
              key={index}
              target="_blank"
              href={item.link}
              aria-label={item.link}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
            >
              {item.icon ? (
                 /* eslint-disable-next-line @next/next/no-img-element */
                 <img src={item.icon} alt="Social Icon" className="h-8 w-8 object-contain" />
              ) : (
                 getIcon(item.link)
              )}
            </a>
          ))
        ) : (
          <>
            <a
              target="_blank"
              href="https://www.facebook.com/Yoloheat"
              aria-label="Facebook"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
            >
              <FaFacebook className="h-8 w-8" />
            </a>
            <a
              href="#"
              aria-label="X (Twitter)"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
            >
              <FaXTwitter className="h-8 w-8" />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/yolo.heat"
              aria-label="Instagram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
            >
              <FaInstagram className="h-8 w-8" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:opacity-80"
            >
              <IoLogoYoutube className="h-8 w-8" />
            </a>
          </>
        )}
      </div>
    </section>
  );
};

export default Social;
