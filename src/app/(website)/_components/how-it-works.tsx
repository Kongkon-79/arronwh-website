<<<<<<< HEAD
"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHowItWorksHeader,
  fetchHowItWorksSteps,
  HOW_IT_WORKS_HEADER_QUERY_KEY,
  HOW_IT_WORKS_STEPS_QUERY_KEY,
  type HowItWorksStep,
} from "./how-it-works-data-type";

type WorkStep = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

const toWorkStep = (step: HowItWorksStep, index: number): WorkStep => {
  const image = step.image?.trim() || "";
  const title = step.title?.trim() || "";
  const description = step.discription?.trim() || "";

  return {
    id: step._id || `step-${index + 1}`,
    title,
    description,
    image,
  };
};

const HowItWorks = () => {
  const { data: header, isLoading: isHeaderLoading } = useQuery({
    queryKey: HOW_IT_WORKS_HEADER_QUERY_KEY,
    queryFn: fetchHowItWorksHeader,
  });

  const { data: steps, isLoading: isStepsLoading } = useQuery({
    queryKey: HOW_IT_WORKS_STEPS_QUERY_KEY,
    queryFn: fetchHowItWorksSteps,
  });

  const isLoading = isHeaderLoading || isStepsLoading;
  const resolvedHeader = {
    title: header?.headerTitle?.trim() || "",
    description: header?.headerDiscription?.trim() || "",
  };
  const STEP_ORDER = ["online quote", "install", "choose", "discover"];
  const getStepRank = (title: string) => {
    const rank = STEP_ORDER.indexOf(title.toLowerCase().trim());
    return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
  };
  const workSteps = Array.isArray(steps)
    ? steps
        .map(toWorkStep)
        .sort((a, b) => getStepRank(a.title) - getStepRank(b.title))
    : [];

  if (isLoading) {
    return (
      <section id="how-it-works" className="bg-[#EAEBEC] py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[560px] text-center animate-pulse">
            <div className="mx-auto h-8 w-3/4 rounded bg-[#DDE4EC]" />
            <div className="mt-3 mx-auto h-4 w-5/6 rounded bg-[#DDE4EC]" />
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <article key={`how-it-works-skeleton-${index}`} className="relative">
                  <div className="mx-auto w-full max-w-[280px] animate-pulse">
                    <div className="h-[300px] w-[300px] rounded-[16px] bg-[#DDE4EC]" />

                    <div className="relative mt-7">
                      {index !== 3 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+5rem)] border-t border border-[#0A4229] lg:block" />
                      )}

                      <div className="relative z-10 mx-auto h-10 w-10 rounded-full bg-[#C8D2DC]" />
                    </div>

                    <div className="mt-6 text-center">
                      <div className="mx-auto h-6 w-2/3 rounded bg-[#DDE4EC]" />
                      <div className="mx-auto mt-3 h-4 w-full rounded bg-[#DDE4EC]" />
                      <div className="mx-auto mt-2 h-4 w-5/6 rounded bg-[#DDE4EC]" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="bg-[#EAEBEC] py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[560px] text-center">
            {resolvedHeader.title ? (
              <h2 className="heading">
                {resolvedHeader.title}
              </h2>
            ) : null}
            {resolvedHeader.description ? (
              <p className="desc mt-3">
                {resolvedHeader.description}
              </p>
            ) : null}
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {workSteps.map((step, index) => (
                <article key={step.id} className="relative">
                  <div className="mx-auto w-full">
                    <div className="overflow-hidden rounded-[16px]">
                      {step.image ? (
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={420}
                          className="h-[200px] md:h-[300px] w-full md:w-[300px] object-cover md:object-contain"
                        />
                      ) : (
                        <div className="h-[300px] w-[300px] rounded-[16px] bg-[#DDE4EC]" />
                      )}
                    </div>

                    <div className="relative mt-7">
                      {index !== workSteps.length - 1 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+3rem)] border-t border border-[#0A4229] lg:block" />
                      )}

                      <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0A4229] text-base md:text-lg font-bold text-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#2D3D4D] leading-normal">
                        {step.title}
                      </h3>
                      <p className="desc">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};

export default HowItWorks;
=======
"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHowItWorksHeader,
  fetchHowItWorksSteps,
  HOW_IT_WORKS_HEADER_QUERY_KEY,
  HOW_IT_WORKS_STEPS_QUERY_KEY,
  type HowItWorksStep,
} from "./how-it-works-data-type";

type WorkStep = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

const toWorkStep = (step: HowItWorksStep, index: number): WorkStep => {
  const image = step.image?.trim() || "";
  const title = step.title?.trim() || "";
  const description = step.discription?.trim() || "";

  return {
    id: step._id || `step-${index + 1}`,
    title,
    description,
    image,
  };
};

const HowItWorks = () => {
  const { data: header, isLoading: isHeaderLoading } = useQuery({
    queryKey: HOW_IT_WORKS_HEADER_QUERY_KEY,
    queryFn: fetchHowItWorksHeader,
  });

  const { data: steps, isLoading: isStepsLoading } = useQuery({
    queryKey: HOW_IT_WORKS_STEPS_QUERY_KEY,
    queryFn: fetchHowItWorksSteps,
  });

  const isLoading = isHeaderLoading || isStepsLoading;
  const resolvedHeader = {
    title: header?.headerTitle?.trim() || "",
    description: header?.headerDiscription?.trim() || "",
  };
  const STEP_ORDER = ["online quote", "install", "choose", "discover"];
  const getStepRank = (title: string) => {
    const rank = STEP_ORDER.indexOf(title.toLowerCase().trim());
    return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
  };
  const workSteps = Array.isArray(steps)
    ? steps
        .map(toWorkStep)
        .sort((a, b) => getStepRank(a.title) - getStepRank(b.title))
    : [];

  if (isLoading) {
    return (
      <section id="how-it-works" className="bg-[#EAEBEC] py-6 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-[560px] text-center animate-pulse">
            <div className="mx-auto h-8 w-3/4 rounded bg-[#DDE4EC]" />
            <div className="mt-3 mx-auto h-4 w-5/6 rounded bg-[#DDE4EC]" />
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <article key={`how-it-works-skeleton-${index}`} className="relative">
                  <div className="mx-auto w-full max-w-[280px] animate-pulse">
                    <div className="h-[300px] w-[300px] rounded-[16px] bg-[#DDE4EC]" />

                    <div className="relative mt-7">
                      {index !== 3 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+5rem)] border-t border border-[#0A4229] lg:block" />
                      )}

                      <div className="relative z-10 mx-auto h-10 w-10 rounded-full bg-[#C8D2DC]" />
                    </div>

                    <div className="mt-6 text-center">
                      <div className="mx-auto h-6 w-2/3 rounded bg-[#DDE4EC]" />
                      <div className="mx-auto mt-3 h-4 w-full rounded bg-[#DDE4EC]" />
                      <div className="mx-auto mt-2 h-4 w-5/6 rounded bg-[#DDE4EC]" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="how-it-works" className="bg-[#EAEBEC] py-6 md:py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-[560px] text-center">
            {resolvedHeader.title ? (
              <h2 className="heading">
                {resolvedHeader.title}
              </h2>
            ) : null}
            {resolvedHeader.description ? (
              <p className="desc mt-3">
                {resolvedHeader.description}
              </p>
            ) : null}
          </div>

          <div className="mt-10 md:mt-12">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {workSteps.map((step, index) => (
                <article key={step.id} className="relative">
                  <div className="mx-auto w-full">
                    <div className="overflow-hidden rounded-[16px]">
                      {step.image ? (
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={420}
                          className="h-[200px] md:h-[300px] w-[300px] object-contain "
                        />
                      ) : (
                        <div className="h-[300px] w-[300px] rounded-[16px] bg-[#DDE4EC]" />
                      )}
                    </div>

                    <div className="relative mt-7">
                      {index !== workSteps.length - 1 && (
                        <div className="absolute left-1/2 top-4 hidden h-[1px] w-[calc(100%+3rem)] border-t border border-[#0A4229] lg:block" />
                      )}

                      <div className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0A4229] text-base md:text-lg font-bold text-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <h3 className="text-base md:text-lg lg:text-xl font-bold text-[#2D3D4D] leading-normal">
                        {step.title}
                      </h3>
                      <p className="desc">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};

export default HowItWorks;
>>>>>>> 6e95feb076ea9bf8b3b1d9ed639fc3b91f1386c5
