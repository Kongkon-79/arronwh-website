"use client";

import { AlertTriangle, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchPrivacyPolicy,
  PRIVACY_POLICY_QUERY_KEY,
} from "./privacy-policy-data-type";

const formatPolicyDate = (dateValue?: string) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function PrivacyPolicySkeleton() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="container">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">
              <Shield />
            </span>
          </div>

          <Skeleton className="mx-auto h-10 w-[260px]" />
          <Skeleton className="mx-auto mt-3 h-4 w-[190px]" />
        </div>

        <div className="space-y-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <section key={index}>
              <Skeleton className="h-10 w-full max-w-[420px]" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-[96%]" />
                <Skeleton className="h-5 w-[92%]" />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function PrivacyPolicyContainer() {
  const {
    data: policy,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: PRIVACY_POLICY_QUERY_KEY,
    queryFn: fetchPrivacyPolicy,
  });

  if (isLoading) {
    return <PrivacyPolicySkeleton />;
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="container">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">
              <Shield className="h-4 w-4 text-black" />
            </span>
          </div>

          <h1 className="text-2xl md:text-[28px] lg:text-[32px] font-bold leading-normal text-black">
            {policy?.title || "Privacy Policy"}
          </h1>

          <p className="mt-2 text-xs md:text-sm font-medium leading-normal text-black">
            Last updated : {formatPolicyDate(policy?.updatedAt || policy?.createdAt)}
          </p>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-[#F2B8B5] bg-[#FFF5F4] p-5 text-[#7A2D2A] shadow-sm md:p-6">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FFDCD9] text-[#B63730]">
                <AlertTriangle className="h-4 w-4" />
              </span>

              <div className="mt-3">
                <p className="text-base font-semibold leading-normal md:text-lg">
                  We could not load the privacy policy
                </p>
                <p className="mt-1 text-sm leading-normal md:text-base">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong while loading this page. Please try again."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mx-auto mt-4 block rounded-md bg-[#B63730] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9C2E29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFetching ? "Trying again..." : "Try again"}
            </button>
          </div>
        ) : !policy ? (
          <div className="rounded-lg border border-[#DDE4EC] bg-[#F8FAFC] p-4 text-center text-sm text-[#2D3D4D] md:text-base">
            No privacy policy found at the moment.
          </div>
        ) : (
          <div
            className="space-y-8 text-sm md:text-base font-medium leading-normal text-black [&_h1]:text-2xl [&_h1]:md:text-[28px] [&_h1]:lg:text-[32px] [&_h1]:font-bold [&_h1]:leading-normal [&_h1]:text-black [&_h1]:mt-8 [&_h1:first-child]:mt-0 [&_h2]:text-2xl [&_h2]:md:text-[28px] [&_h2]:lg:text-[32px] [&_h2]:font-bold [&_h2]:leading-normal [&_h2]:text-black [&_h2]:mt-8 [&_h2:first-child]:mt-0 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:font-bold [&_h3]:leading-normal [&_h3]:text-black [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:text-sm [&_li]:md:text-base"
            dangerouslySetInnerHTML={{ __html: policy.description }}
          />
        )}
      </div>
    </main>
  );
}
