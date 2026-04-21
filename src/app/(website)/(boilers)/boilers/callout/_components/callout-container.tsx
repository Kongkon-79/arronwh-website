"use client"

import { ArrowLeft, MessageCircle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CalloutContainer = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <section className="min-h-screen bg-[#ECEDEF] px-2 py-1 md:px-4 md:py-2">
      <div className="mx-auto w-full">
        <div className="overflow-hidden rounded-[999px] shadow-[0_8px_18px_rgba(16,24,40,0.12)]">
          <div className="grid h-14 grid-cols-[auto_1fr] bg-primary">
            <div className="flex items-center gap-2 border-r border-[#E7ECF3] bg-primary pl-0 pr-4">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-[#2D3D4D] p-3 transition hover:bg-black/5"
                aria-label="Go back"
              >
                <ArrowLeft className="h-7 w-7 text-[#2D3D4D]" />
              </button>
              <Image
                src="/assets/images/multi_step_logo.png"
                alt="Multi Step Logo"
                width={332}
                height={332}
                className="h-[36px] w-[126px] object-contain"
                priority
              />
            </div>
            <div className="bg-primary" />
          </div>
        </div>

        <div className="mx-auto mt-20 w-full max-w-[760px]">
          <h1 className="text-center text-[44px] font-bold leading-[1.2] text-[#203A58]">
            We need some extra information
          </h1>
          <p className="mx-auto mt-5 max-w-[700px] text-center text-[20px] leading-[1.5] text-[#4C5969]">
            Based on what you told us, it&apos;ll be easier to talk you through your
            new installation over the phone, or over live chat.
          </p>

          <div className="mt-11 space-y-8">
            <div className="rounded-[10px] bg-[#DEE3E8] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[40px] font-semibold leading-[1.2] text-[#203A58]">
                    Request a callback
                  </h2>
                  <p className="mt-2 max-w-[520px] text-[18px] leading-[1.45] text-[#203A58]">
                    Our office hours are Mon-Fri 8am-8pm, Sat &amp; Sun 9am-3pm. We
                    aim to call within 1 hour.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-[58px] min-w-[280px] items-center justify-center gap-3 bg-[#00a56f] px-6 text-[20px] font-medium text-white transition hover:bg-[#009460]"
                >
                  <PhoneCall className="h-5 w-5" />
                  Request a callback
                </button>
              </div>
            </div>

            <div className="rounded-[10px] bg-[#DEE3E8] px-6 py-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-[40px] font-semibold leading-[1.2] text-[#203A58]">
                    Chat to us
                  </h2>
                  <p className="mt-2 max-w-[520px] text-[18px] leading-[1.45] text-[#203A58]">
                    Chat instantly with one of our experts.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-[58px] min-w-[280px] items-center justify-center gap-3 border border-[#00a56f] bg-transparent px-6 text-[20px] font-medium text-[#00a56f] transition hover:bg-[#00a56f]/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  Start a live chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalloutContainer;
