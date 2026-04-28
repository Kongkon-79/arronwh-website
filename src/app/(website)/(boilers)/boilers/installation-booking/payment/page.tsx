// "use client";

// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import {
//   Elements,
//   CardCvcElement,
//   CardExpiryElement,
//   CardNumberElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import {
//   BadgePercent,
//   CalendarDays,
//   Circle,
//   CreditCard,
//   Lock,
//   ShieldCheck,
// } from "lucide-react";
// import {
//   useProductById,
//   type ApiProductFull,
// } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
// import {
//   type ApiQuote,
//   type ApiQuoteController,
//   type ApiQuoteExtra,
//   useQuoteById,
// } from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useQuoteById";
// import {
//   type QuotePriceAdjustmentItem,
//   getPrimaryQuotePriceAdjustmentItem,
//   getQuotePriceAdjustmentTotal,
// } from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-price-adjustment";
// import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";

// const fallbackStripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
// const fallbackStripeCurrency = "gbp";
// const stripePromiseCache = new Map<string, ReturnType<typeof loadStripe>>();

// function getStripePromise(publishableKey: string) {
//   if (!stripePromiseCache.has(publishableKey)) {
//     stripePromiseCache.set(publishableKey, loadStripe(publishableKey));
//   }

//   return stripePromiseCache.get(publishableKey)!;
// }

// type CreatePaymentIntentResponse = {
//   statusCode?: number;
//   success?: boolean;
//   status?: boolean;
//   message?: string;
//   data?: {
//     clientSecret?: string;
//     paymentIntentId?: string;
//     amount?: number;
//     currency?: string;
//     publishableKey?: string;
//     applePayUrl?: string;
//   };
// };

// type PaymentIntentInfo = {
//   clientSecret: string;
//   paymentIntentId: string;
//   amount: number;
//   currency: string;
//   publishableKey: string;
//   applePayUrl: string | null;
// };

// function resolvePaymentEndpoint() {
//   if (process.env.NEXT_PUBLIC_API_BASE_URL) {
//     return `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment`;
//   }
//   if (process.env.NEXT_PUBLIC_BACKEND_URL) {
//     return `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment`;
//   }
//   return "/payment";
// }

// async function createPaymentIntent(bookingId: string): Promise<PaymentIntentInfo> {
//   const response = await fetch(`${resolvePaymentEndpoint()}/${encodeURIComponent(bookingId)}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   const result = (await response.json().catch(() => null)) as CreatePaymentIntentResponse | null;
//   const hasExplicitFailure = result?.success === false || result?.status === false;

//   const clientSecret = typeof result?.data?.clientSecret === "string" ? result.data.clientSecret : "";
//   const paymentIntentId =
//     typeof result?.data?.paymentIntentId === "string" ? result.data.paymentIntentId : "";
//   const amount =
//     typeof result?.data?.amount === "number" && Number.isFinite(result.data.amount)
//       ? result.data.amount
//       : 0;
//   const currency =
//     typeof result?.data?.currency === "string" && /^[a-z]{3}$/i.test(result.data.currency.trim())
//       ? result.data.currency.trim().toLowerCase()
//       : fallbackStripeCurrency;
//   const publishableKey =
//     typeof result?.data?.publishableKey === "string" && result.data.publishableKey.trim()
//       ? result.data.publishableKey.trim()
//       : fallbackStripePublishableKey;
//   const applePayUrl =
//     typeof result?.data?.applePayUrl === "string" && result.data.applePayUrl.trim()
//       ? result.data.applePayUrl.trim()
//       : null;

//   if (!response.ok || hasExplicitFailure || !clientSecret || !paymentIntentId || !publishableKey) {
//     throw new Error(result?.message || "Failed to create payment intent.");
//   }

//   return {
//     clientSecret,
//     paymentIntentId,
//     amount,
//     currency,
//     publishableKey,
//     applePayUrl,
//   };
// }

// function getOrdinalDay(day: number): string {
//   const remainder10 = day % 10;
//   const remainder100 = day % 100;
//   if (remainder10 === 1 && remainder100 !== 11) return `${day}st`;
//   if (remainder10 === 2 && remainder100 !== 12) return `${day}nd`;
//   if (remainder10 === 3 && remainder100 !== 13) return `${day}rd`;
//   return `${day}th`;
// }

// function formatInstallDateLabel(isoDate: string | null | undefined): string {
//   if (!isoDate) return "Not selected";
//   const parsed = new Date(isoDate);
//   if (Number.isNaN(parsed.getTime())) return "Not selected";

//   const day = getOrdinalDay(parsed.getUTCDate());
//   const month = parsed.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
//   const year = parsed.getUTCFullYear();
//   return `${day} ${month} ${year}`;
// }

// function formatMoney(value: number): string {
//   if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;
//   return `£${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
// }

// function getWarrantyText(product: ApiProductFull): string | undefined {
//   const warrantyFeature = product.boilerFeatures.find((feature) => /warranty/i.test(feature.title));
//   if (!warrantyFeature?.value) return undefined;
//   return `with ${warrantyFeature.value} warranty`;
// }

// function asRecord(value: unknown): Record<string, unknown> | null {
//   if (!value || typeof value !== "object") return null;
//   return value as Record<string, unknown>;
// }

// function firstNonEmptyString(...values: unknown[]): string {
//   for (const value of values) {
//     if (typeof value === "string" && value.trim()) {
//       return value.trim();
//     }
//   }
//   return "";
// }

// function extractInstallAddressLabel(quote: ApiQuote | null | undefined): string {
//   if (!quote) return "";

//   const quoteRecord = quote as unknown as Record<string, unknown>;
//   const personalInfo = asRecord(quoteRecord.personalInfo);

//   return firstNonEmptyString(
//     quoteRecord.installAddress,
//     quoteRecord.installationAddress,
//     personalInfo?.installAddress,
//     personalInfo?.address,
//     personalInfo?.fullAddress,
//     quoteRecord.address,
//     quoteRecord.location,
//     personalInfo?.location
//   );
// }

// function TopBanner({
//   payTodayTotal,
//   isLoading,
//   onViewDetails,
// }: {
//   payTodayTotal: number;
//   isLoading: boolean;
//   onViewDetails: () => void;
// }) {
//   return (
//     <div className="rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
//       <div className="flex items-start justify-between gap-3">
//         <div className="w-full text-center">
//           <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-[#2D3D4D]">
//             <ShieldCheck className="h-4 w-4" />
//             <span>Your total price is {isLoading ? "Loading..." : formatMoney(payTodayTotal)}</span>
//           </div>
//           <p className="mt-2 text-[12px] text-[#2D3D4D] sm:text-[16px]">
//             Installation available from next working day- choose your install date below
//           </p>
//         </div>
//         <button
//           type="button"
//           onClick={onViewDetails}
//           className="shrink-0 pt-1 text-[16px] font-bold text-[#FFDE59] underline underline-offset-2"
//         >
//           View
//         </button>
//       </div>
//     </div>
//   );
// }

// function PriceSummary({
//   product,
//   payTodayTotal,
//   originalTotal,
//   installDateLabel,
//   installedAtLabel,
//   isLoading,
//   quotePriceItem,
// }: {
//   product: ApiProductFull | null;
//   payTodayTotal: number;
//   originalTotal: number;
//   installDateLabel: string;
//   installedAtLabel: string;
//   isLoading: boolean;
//   quotePriceItem: QuotePriceAdjustmentItem | null;
// }) {
//   if (isLoading) {
//     return (
//       <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
//         <div className="h-6 w-48 rounded bg-[#e8edf1]" />
//         <div className="mt-3 grid grid-cols-2 gap-2">
//           <div className="h-24 rounded-[8px] bg-[#f5f6f7]" />
//           <div className="h-24 rounded-[8px] bg-[#f5f6f7]" />
//         </div>
//         <div className="mt-3 h-10 rounded-[8px] bg-[#f5f6f7]" />
//         <div className="mt-3 h-28 rounded-[10px] bg-[#f5f6f7]" />
//       </aside>
//     );
//   }

//   if (!product) {
//     return (
//       <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
//         <p className="text-[14px] text-[#2f3b4a]">
//           Product details not found. Please go back and select your boiler again.
//         </p>
//       </aside>
//     );
//   }

//   return (
//     <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
//       <h3 className="text-[18px] font-semibold text-[#2D3D4D]">Total fixed price including VAT</h3>

//       <div className="mt-3 grid grid-cols-2 gap-2">
//         <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
//           <p className="text-[18px] text-[#64748B]">Pay today</p>
//           <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(payTodayTotal)}</p>
//           {originalTotal > payTodayTotal ? (
//             <p className="mt-1 text-[14px] font-medium text-[#00A56F] line-through">was {formatMoney(originalTotal)}</p>
//           ) : null}
//         </div>

//         <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
//           <p className="text-[18px] text-[#64748B]">Monthly Cost</p>
//           <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">{formatMoney(payTodayTotal / 12)}/mo</p>
//         </div>
//       </div>

//       <div className="mt-3 flex min-h-[34px] items-center justify-center rounded-[6px] bg-[#F0F3F6] px-2 text-center">
//         <BadgePercent className="mr-2 h-5 w-5 shrink-0 text-[#64748B]" />
//         <span className="text-[16px] font-semibold text-[#2D3D4D]">{product.boilerAbility || product.title} Discount</span>
//         <span className="ml-2 text-[16px] font-semibold text-[#00A56F]">-{formatMoney(product.discountPrice ?? 0)}</span>
//       </div>

//       <div className="mt-3">
//         <h4 className="text-[18px] font-semibold text-[#2D3D4D]">Order Summary</h4>
//         <div className="mt-2 space-y-2 rounded-[6px] bg-[#F0F3F6] p-2.5">
//           <div className="flex items-center gap-3">
//             <div className="h-[48px] w-[48px] overflow-hidden">
//               <Image
//                 src={product.images?.[0] ?? "/product.png"}
//                 alt={product.boilerAbility || product.title}
//                 width={48}
//                 height={48}
//                 className="h-[48px] w-[48px] object-contain"
//               />
//             </div>
//             <div>
//               <p className="text-[16px] font-semibold text-[#2D3D4D]">{product.boilerAbility || product.title}</p>
//               {getWarrantyText(product) ? (
//                 <p className="text-[16px] text-[#2D3D4D]">{getWarrantyText(product)}</p>
//               ) : null}
//             </div>
//           </div>

//           <div className="flex items-center justify-between pt-1">
//             <span className="text-[18px] text-[#2D3D4D]">Install date</span>
//             <span className="text-[18px] font-semibold text-[#2D3D4D]">{installDateLabel}</span>
//           </div>

//           <div className="flex items-start justify-between gap-3 pt-1">
//             <span className="text-[18px] text-[#2D3D4D]">Installed at</span>
//             <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">{installedAtLabel}</span>
//           </div>

//           {quotePriceItem ? (
//             <div className="flex items-start justify-between gap-3 border-t border-dotted border-[#A7B1BB] pt-2">
//               <span className="text-[18px] text-[#2D3D4D]">{quotePriceItem.label}</span>
//               <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">
//                 {formatMoney(quotePriceItem.price)}
//               </span>
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </aside>
//   );
// }

// function CollapsedStep({ label }: { label: string }) {
//   return (
//     <div className="rounded-[10px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed]">
//       <div className="flex items-center justify-center gap-3 text-center">
//         <CalendarDays className="h-4 w-4 text-[#304153]" />
//         <span className="text-[18px] font-medium text-[#2D3D4D]">{label}</span>
//       </div>
//     </div>
//   );
// }

// function CardBadges() {
//   return (
//     <div className="flex items-center gap-2 text-[11px] font-semibold text-[#2f3b4a]">
//       <span className="text-[#1a49d3]">VISA</span>
//       <span className="rounded bg-[#2b66dd] px-1 py-[2px] text-[9px] text-white">AMEX</span>
//       <span className="inline-flex items-center gap-[2px]">
//         <span className="h-4 w-4 rounded-full bg-[#ea4f24]" />
//         <span className="-ml-2 h-4 w-4 rounded-full bg-[#f7b500]" />
//       </span>
//       <span className="inline-flex items-center gap-1 rounded bg-white px-1 py-[2px] text-[18px] text-[#5f6977]">
//         <span className="font-bold text-[#4285F4]">G</span>
//         <span>Pay</span>
//       </span>
//     </div>
//   );
// }

// function PaymentOption({
//   title,
//   onClick,
//   right,
//   active = false,
//   disabled = false,
// }: {
//   title: string;
//   onClick: () => void;
//   right?: React.ReactNode;
//   active?: boolean;
//   disabled?: boolean;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex w-full items-center justify-between rounded-[6px] border bg-white px-3 py-4 text-left transition ${
//         active
//           ? "border-[#00A56F] ring-1 ring-[#00A56F]/40"
//           : "border-[#8f99a6] hover:bg-[#fbfbfc]"
//       } disabled:cursor-not-allowed disabled:opacity-70`}
//     >
//       <div className="flex items-center gap-3">
//         <Circle
//           className={`h-[18px] w-[18px] ${
//             active ? "fill-[#00aa63] text-[#00aa63]" : "text-[#344255]"
//           }`}
//         />
//         <span className="text-[14px] font-medium text-[#2f3b4a]">{title}</span>
//       </div>
//       {right ? <div className="ml-3 shrink-0">{right}</div> : null}
//     </button>
//   );
// }

// type CardPaymentStatus = {
//   type: "success" | "error";
//   message: string;
// } | null;

// type CardCheckoutMethod = "card" | "applePay";

// function FieldLabel({ children }: { children: React.ReactNode }) {
//   return <label className="mb-2 block text-[18px] font-medium text-[#2D3D4D]">{children}</label>;
// }

// function StripeInputField({
//   children,
//   right,
// }: {
//   children: React.ReactNode;
//   right?: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
//       <div className="w-full text-[13px] text-[#2f3b4a]">{children}</div>
//       {right ? <div className="ml-3 shrink-0">{right}</div> : null}
//     </div>
//   );
// }

// const stripeElementOptions = {
//   style: {
//     base: {
//       fontSize: "13px",
//       color: "#2f3b4a",
//       "::placeholder": {
//         color: "#667281",
//       },
//     },
//     invalid: {
//       color: "#b42318",
//     },
//   },
// };

// function StripeCardForm({
//   clientSecret,
//   amount,
//   applePayUrl,
//   onStatusChange,
//   onPaymentSuccess,
// }: {
//   clientSecret: string;
//   amount: number;
//   applePayUrl: string | null;
//   onStatusChange: (status: CardPaymentStatus) => void;
//   onPaymentSuccess?: (paymentIntentId: string, status: string) => void;
// }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [zip, setZip] = React.useState("");
//   const [isCardNumberComplete, setIsCardNumberComplete] = React.useState(false);
//   const [isExpiryComplete, setIsExpiryComplete] = React.useState(false);
//   const [isCvcComplete, setIsCvcComplete] = React.useState(false);
//   const [isSubmitting, setIsSubmitting] = React.useState(false);
//   const [isRedirectingToApplePay, setIsRedirectingToApplePay] = React.useState(false);
//   const [checkoutMethod, setCheckoutMethod] = React.useState<CardCheckoutMethod>("card");

//   const reportPaymentResult = React.useCallback(
//     (status: string | undefined, paymentIntentId?: string) => {
//       if (status === "succeeded" || status === "processing" || status === "requires_capture") {
//         onStatusChange({
//           type: "success",
//           message:
//             status === "succeeded"
//               ? "Payment successful. Your booking is now being confirmed."
//               : "Payment submitted successfully. We are finalizing your booking.",
//         });
//         if (paymentIntentId) {
//           onPaymentSuccess?.(paymentIntentId, status);
//         }
//         return true;
//       }

//       onStatusChange({
//         type: "error",
//         message: "Payment could not be completed. Please try again.",
//       });
//       return false;
//     },
//     [onPaymentSuccess, onStatusChange]
//   );

//   const handleApplePayClick = React.useCallback(() => {
//     setCheckoutMethod("applePay");

//     if (!applePayUrl) {
//       onStatusChange({
//         type: "error",
//         message: "Apple Pay link is not available right now. Please use card payment.",
//       });
//       return;
//     }

//     onStatusChange(null);
//     setIsRedirectingToApplePay(true);

//     if (typeof window !== "undefined") {
//       window.location.assign(applePayUrl);
//     }
//   }, [applePayUrl, onStatusChange]);

//   const handleSubmit = React.useCallback(
//     async (event: React.FormEvent<HTMLFormElement>) => {
//       event.preventDefault();

//       if (!stripe || !elements) return;
//       if (!zip.trim()) {
//         onStatusChange({
//           type: "error",
//           message: "Please enter your zip code.",
//         });
//         return;
//       }

//       const cardNumberElement = elements.getElement(CardNumberElement);
//       if (!cardNumberElement) {
//         onStatusChange({
//           type: "error",
//           message: "Card details are not ready. Please try again.",
//         });
//         return;
//       }

//       setIsSubmitting(true);
//       onStatusChange(null);

//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: cardNumberElement,
//           billing_details: {
//             address: {
//               postal_code: zip.trim(),
//             },
//           },
//         },
//       });

//       if (error) {
//         onStatusChange({
//           type: "error",
//           message: error.message || "Payment failed. Please check your card details and try again.",
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       const status = paymentIntent?.status;
//       if (status === "succeeded" || status === "processing" || status === "requires_capture") {
//         setIsSubmitting(false);
//         reportPaymentResult(status, paymentIntent?.id);
//         return;
//       }

//       setIsSubmitting(false);
//       reportPaymentResult(status);
//     },
//     [clientSecret, elements, onStatusChange, reportPaymentResult, stripe, zip]
//   );

//   return (
//     <div className="space-y-4">
//       <div>
//         <FieldLabel>Payment method</FieldLabel>
//         <div className="overflow-hidden rounded-[8px] border border-[#c9d1d8]">
//           <button
//             type="button"
//             onClick={() => {
//               setCheckoutMethod("card");
//               setIsRedirectingToApplePay(false);
//               onStatusChange(null);
//             }}
//             className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
//               checkoutMethod === "card" ? "bg-[#f2f6f9]" : "bg-white hover:bg-[#fbfbfc]"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <Circle
//                 className={`h-[18px] w-[18px] ${
//                   checkoutMethod === "card" ? "fill-[#00aa63] text-[#00aa63]" : "text-[#7a8895]"
//                 }`}
//               />
//               <span className="text-[18px] font-medium text-[#2D3D4D]">Card</span>
//             </div>
//             <CardBadges />
//           </button>

//           <button
//             type="button"
//             onClick={handleApplePayClick}
//             disabled={!applePayUrl || isRedirectingToApplePay}
//             className={`flex w-full items-center justify-between border-t border-[#e6ebef] px-4 py-3 text-left transition ${
//               checkoutMethod === "applePay" ? "bg-[#f2f6f9]" : "bg-white hover:bg-[#fbfbfc]"
//             } disabled:cursor-not-allowed disabled:opacity-70`}
//           >
//             <div className="flex items-center gap-3">
//               <Circle
//                 className={`h-[18px] w-[18px] ${
//                   checkoutMethod === "applePay" ? "fill-[#00aa63] text-[#00aa63]" : "text-[#7a8895]"
//                 }`}
//               />
//               <span className="text-[18px] font-medium text-[#2D3D4D]">Apple Pay</span>
//             </div>
//             <span className="rounded-[6px] bg-black px-3 py-1 text-[16px] font-medium text-white">Apple Pay</span>
//           </button>
//         </div>

//         {!applePayUrl ? (
//           <p className="mt-2 text-[13px] text-[#5f6977]">
//             Apple Pay link is not available right now. Please choose card payment.
//           </p>
//         ) : null}
//       </div>

//       {checkoutMethod === "applePay" ? (
//         <div className="space-y-3">
//           {applePayUrl ? (
//             <>
//               <div className="rounded-[8px] border border-[#c9d1d8] bg-white px-4 py-4 text-[14px] text-[#2D3D4D]">
//                 You will be redirected to Apple Pay secure checkout.
//               </div>
//               <button
//                 type="button"
//                 onClick={handleApplePayClick}
//                 disabled={isRedirectingToApplePay}
//                 className="w-full rounded-[6px] bg-black px-4 py-3 text-[16px] font-medium text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {isRedirectingToApplePay ? "Redirecting to Apple Pay..." : "Continue to Apple Pay"}
//               </button>
//             </>
//           ) : (
//             <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
//               Apple Pay link is not available right now. Please choose card payment.
//             </div>
//           )}

//           <p className="text-center text-[13px] text-[#2D3D4D] sm:text-[15px]">
//             Amount to pay today: {formatMoney(amount)}
//           </p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <FieldLabel>Card number</FieldLabel>
//             <StripeInputField right={<CardBadges />}>
//               <CardNumberElement
//                 options={{
//                   ...stripeElementOptions,
//                   placeholder: "1234 1234 1234 1234",
//                 }}
//                 onChange={(event) => setIsCardNumberComplete(event.complete)}
//               />
//             </StripeInputField>
//           </div>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <FieldLabel>Expiry date</FieldLabel>
//               <StripeInputField>
//                 <CardExpiryElement
//                   options={stripeElementOptions}
//                   onChange={(event) => setIsExpiryComplete(event.complete)}
//                 />
//               </StripeInputField>
//             </div>
//             <div>
//               <FieldLabel>Security Code</FieldLabel>
//               <StripeInputField>
//                 <CardCvcElement
//                   options={stripeElementOptions}
//                   onChange={(event) => setIsCvcComplete(event.complete)}
//                 />
//               </StripeInputField>
//             </div>
//           </div>

//           <div>
//             <FieldLabel>Zip Code</FieldLabel>
//             <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
//               <input
//                 value={zip}
//                 onChange={(event) => setZip(event.target.value)}
//                 placeholder="12345"
//                 className="h-full w-full bg-transparent text-[13px] text-[#2f3b4a] outline-none placeholder:text-[#667281]"
//               />
//             </div>
//           </div>

//           <button type="button" className="w-full rounded-[6px] bg-[#edf0f2] px-4 py-3 text-[16px] font-medium text-[#465260]">
//             Start finance application
//           </button>

//           <button
//             type="submit"
//             disabled={!stripe || !elements || isSubmitting || !isCardNumberComplete || !isExpiryComplete || !isCvcComplete}
//             className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#0cab63] px-4 text-[16px] font-medium text-white transition hover:bg-[#099656] disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             <Lock className="h-4 w-4" />
//             <span>{isSubmitting ? "Processing payment..." : "Book installation"}</span>
//           </button>

//           <p className="text-center text-[13px] text-[#2D3D4D] sm:text-[15px]">
//             Amount to pay today: {formatMoney(amount)}
//           </p>
//         </form>
//       )}
//     </div>
//   );
// }

// function PaymentSection({
//   bookingId,
//   paymentIntentInfo,
//   isLoadingPaymentIntent,
//   paymentIntentError,
//   onRetryPaymentIntent,
//   onSelectMonthly,
//   onPaymentSuccess,
// }: {
//   bookingId: string | null;
//   paymentIntentInfo: PaymentIntentInfo | undefined;
//   isLoadingPaymentIntent: boolean;
//   paymentIntentError: string | null;
//   onRetryPaymentIntent: () => void;
//   onSelectMonthly: () => void;
//   onPaymentSuccess: (paymentIntentId: string, status: string) => void;
// }) {
//   const [paymentType, setPaymentType] = React.useState<"card" | "monthly">("card");
//   const [paymentStatus, setPaymentStatus] = React.useState<CardPaymentStatus>(null);
//   const stripePromise = React.useMemo(
//     () => (paymentIntentInfo?.publishableKey ? getStripePromise(paymentIntentInfo.publishableKey) : null),
//     [paymentIntentInfo?.publishableKey]
//   );

//   return (
//     <div className="rounded-[10px] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
//       <div className="flex items-center justify-center gap-3 text-center">
//         <CreditCard className="h-4 w-4 text-[#304153]" />
//         <span className="text-[18px] font-medium text-[#2D3D4D]">How would you like to pay?</span>
//       </div>

//       <p className="mt-4 text-center text-[12px] leading-5 text-[#2D3D4D] sm:text-[16px]">
//         Make one payment by card or pay in monthly installments with our finance options
//       </p>

//       <div className="mt-4 space-y-3">
//         <PaymentOption
//           title="Pay by card"
//           active={paymentType === "card"}
//           onClick={() => setPaymentType("card")}
//           right={<CardBadges />}
//         />
//         <PaymentOption
//           title="Pay monthly"
//           active={paymentType === "monthly"}
//           onClick={() => {
//             setPaymentType("monthly");
//             onSelectMonthly();
//           }}
//         />
//       </div>

//       <div className="mt-4 rounded-[6px] bg-[#edf0f2] px-4 py-3 text-center text-[18px] font-medium text-[#2D3D4D]">
//         Secure payments powered by stripe.
//       </div>

//       {paymentStatus ? (
//         <div
//           className={`mt-4 rounded-[6px] border px-3 py-2 text-[14px] ${
//             paymentStatus.type === "success"
//               ? "border-[#00A56F] bg-[#ebf9f3] text-[#0a6b4a]"
//               : "border-[#f0b4b4] bg-[#fff6f6] text-[#b42318]"
//           }`}
//         >
//           {paymentStatus.message}
//         </div>
//       ) : null}

//       {paymentType === "card" ? (
//         <div className="mt-5">
//           <h3 className="text-center text-[28px] font-semibold tracking-[-0.02em] text-[#334155] sm:text-[30px]">
//             Complete your payment below
//           </h3>

//           <div className="mt-6">
//             {!bookingId ? (
//               <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
//                 Booking ID not found. Please go back and select your payment option again.
//               </div>
//             ) : isLoadingPaymentIntent ? (
//               <div className="rounded-[6px] bg-[#edf0f2] px-4 py-6 text-center text-[15px] text-[#2D3D4D]">
//                 Preparing secure payment form...
//               </div>
//             ) : paymentIntentError ? (
//               <div className="space-y-3 rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-4 py-4 text-center">
//                 <p className="text-[14px] text-[#b42318]">{paymentIntentError}</p>
//                 <button
//                   type="button"
//                   onClick={onRetryPaymentIntent}
//                   className="rounded-[6px] bg-[#2D3D4D] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#243241]"
//                 >
//                   Retry payment setup
//                 </button>
//               </div>
//             ) : paymentIntentInfo?.clientSecret && stripePromise ? (
//               <Elements stripe={stripePromise}>
//                 <StripeCardForm
//                   clientSecret={paymentIntentInfo.clientSecret}
//                   amount={paymentIntentInfo.amount}
//                   applePayUrl={paymentIntentInfo.applePayUrl}
//                   onStatusChange={setPaymentStatus}
//                   onPaymentSuccess={onPaymentSuccess}
//                 />
//               </Elements>
//             ) : paymentIntentInfo?.clientSecret ? (
//               <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
//                 Stripe payment configuration is missing. Please contact support.
//               </div>
//             ) : (
//               <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
//                 Payment setup is not ready yet. Please refresh and try again.
//               </div>
//             )}

//             <p className="mt-4 text-center text-[10px] text-[#2D3D4D] sm:text-[16px]">
//               We do not charge a fee for our retail finance services
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-5 rounded-[6px] border border-dashed border-[#c9d1d8] bg-[#fafbfb] px-4 py-8 text-center text-[13px] text-[#5f6977]">
//           Redirecting to monthly payment options...
//         </div>
//       )}
//     </div>
//   );
// }

// function FooterDisclaimer() {
//   return (
//     <p className="pt-2 text-[11px] leading-6 text-[#2D3D4D] sm:text-[16px]">
//       *Representative example for 120 month order: £3,099 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
//       Representative APR: 9.9% APR. Total amount of credit £3,099 paid over 120 months as 120 monthly payments of
//       £40.07 at 9.48% p.a. Cost of finance £1,709.40. Total amount payable £4,808.40. BOXI Limited is a credit broker
//       and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status,
//       affordability and credit check. Terms and conditions apply.
//     </p>
//   );
// }

// function BoilerCardPaymentCloneContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const quoteId = searchParams.get("quoteId");
//   const productIdFromQuery = searchParams.get("productId");
//   const bookingId = searchParams.get("bookingId");
//   const monthlyPaymentUrl = React.useMemo(() => {
//     const query = searchParams.toString();
//     return query
//       ? `/boilers/installation-booking/monthly-payment?${query}`
//       : "/boilers/installation-booking/monthly-payment";
//   }, [searchParams]);
//   const {
//     data: paymentIntentInfo,
//     isLoading: isLoadingPaymentIntent,
//     isFetching: isFetchingPaymentIntent,
//     error: paymentIntentQueryError,
//     refetch: refetchPaymentIntent,
//   } = useQuery({
//     queryKey: ["create-payment-intent", bookingId],
//     enabled: Boolean(bookingId),
//     retry: 1,
//     staleTime: 60 * 1000,
//     refetchOnWindowFocus: false,
//     queryFn: () => createPaymentIntent(bookingId as string),
//   });
//   const paymentIntentError = paymentIntentQueryError
//     ? paymentIntentQueryError instanceof Error
//       ? paymentIntentQueryError.message
//       : "Failed to prepare payment."
//     : null;
//   const handleSelectMonthly = React.useCallback(() => {
//     router.push(monthlyPaymentUrl);
//   }, [monthlyPaymentUrl, router]);
//   const handlePaymentSuccess = React.useCallback(
//     (paymentIntentId: string, status: string) => {
//       const params = new URLSearchParams(searchParams.toString());
//       params.set("paymentIntentId", paymentIntentId);
//       params.set("paymentStatus", status);
//       const query = params.toString();
//       router.replace(
//         query
//           ? `/boilers/installation-booking/payment-success?${query}`
//           : "/boilers/installation-booking/payment-success"
//       );
//     },
//     [router, searchParams]
//   );

//   const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);
//   const quoteProductId =
//     typeof quote?.productId === "string" ? quote.productId : quote?.productId?._id ?? null;
//   const resolvedProductId = productIdFromQuery ?? quoteProductId;
//   const customerDetailsUrl = React.useMemo(() => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (resolvedProductId) {
//       params.set("productId", resolvedProductId);
//     }
//     if (quoteId) {
//       params.set("quoteId", quoteId);
//     }
//     const query = params.toString();
//     return query ? `/boilers/customer-details?${query}` : "/boilers/customer-details";
//   }, [quoteId, resolvedProductId, searchParams]);
//   const { data: product, isLoading: productLoading } = useProductById(resolvedProductId);

//   const selectedController: ApiQuoteController | null =
//     quote?.controller && typeof quote.controller !== "string" ? quote.controller : null;
//   const selectedExtra: ApiQuoteExtra | null =
//     quote?.extra && typeof quote.extra !== "string" ? quote.extra : null;

//   const selectedControllerPrice =
//     selectedController && typeof selectedController.price === "number" && selectedController.price > 0
//       ? selectedController.price
//       : 0;
//   const selectedExtraPrice =
//     selectedExtra && typeof selectedExtra.price === "number" && selectedExtra.price > 0
//       ? selectedExtra.price
//       : 0;
//   const quotePriceAdjustment = getQuotePriceAdjustmentTotal(quote?.quizAnswers);
//   const quotePriceItem = getPrimaryQuotePriceAdjustmentItem(quote?.quizAnswers);

//   const payTodayTotal = product
//     ? (product.payablePrice ?? product.price ?? 0) +
//       selectedControllerPrice +
//       selectedExtraPrice +
//       quotePriceAdjustment
//     : 0;
//   const originalTotal = product
//     ? (product.price ?? 0) + selectedControllerPrice + selectedExtraPrice + quotePriceAdjustment
//     : 0;

//   const installDateRaw = (quote as unknown as Record<string, unknown> | null)?.installDate;
//   const installDateLabel = formatInstallDateLabel(
//     typeof installDateRaw === "string" ? installDateRaw : null
//   );
//   const installedAtLabel = extractInstallAddressLabel(quote) || "Not selected";
//   const isLoading = (quoteId ? quoteLoading : false) || (resolvedProductId ? productLoading : false);

//   return (
//     <BoilerFlowShell activeStep={4}>
//       <div className="py-12">
//         <div className="mx-auto container">
//           <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
//             <div className="space-y-4">
//               <TopBanner
//                 payTodayTotal={payTodayTotal}
//                 isLoading={isLoading}
//                 onViewDetails={() => router.push(customerDetailsUrl)}
//               />
//               <CollapsedStep label="When should we Survey?" />
//               <CollapsedStep label="When should we install?" />
//               <CollapsedStep label="Where are we visiting?" />
//               <PaymentSection
//                 bookingId={bookingId}
//                 paymentIntentInfo={paymentIntentInfo}
//                 isLoadingPaymentIntent={isLoadingPaymentIntent || isFetchingPaymentIntent}
//                 paymentIntentError={paymentIntentError}
//                 onRetryPaymentIntent={() => {
//                   void refetchPaymentIntent();
//                 }}
//                 onSelectMonthly={handleSelectMonthly}
//                 onPaymentSuccess={handlePaymentSuccess}
//               />
//               <FooterDisclaimer />
//             </div>

//             <div>
//               <PriceSummary
//                 product={product ?? null}
//                 payTodayTotal={payTodayTotal}
//                 originalTotal={originalTotal}
//                 installDateLabel={installDateLabel}
//                 installedAtLabel={installedAtLabel}
//                 isLoading={isLoading}
//                 quotePriceItem={quotePriceItem}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </BoilerFlowShell>
//   );
// }

// export default function BoilerCardPaymentClone() {
//   return (
//     <React.Suspense fallback={null}>
//       <BoilerCardPaymentCloneContent />
//     </React.Suspense>
//   );
// }









"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Elements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BadgePercent,
  CalendarDays,
  Circle,
  CreditCard,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  useProductById,
  type ApiProductFull,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useProductById";
import {
  type ApiQuote,
  type ApiQuoteController,
  type ApiQuoteExtra,
  useQuoteById,
} from "@/app/(website)/(boilers)/boilers/system-selection/_hooks/useQuoteById";
import {
  type QuotePriceAdjustmentItem,
  getPrimaryQuotePriceAdjustmentItem,
  getQuotePriceAdjustmentTotal,
} from "@/app/(website)/(boilers)/boilers/system-selection/_utils/quote-price-adjustment";
import BoilerFlowShell from "@/app/(website)/(boilers)/_components/boiler-flow-shell";

const fallbackStripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "";
const fallbackStripeCurrency = "gbp";
const stripePromiseCache = new Map<string, ReturnType<typeof loadStripe>>();

function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache.has(publishableKey)) {
    stripePromiseCache.set(publishableKey, loadStripe(publishableKey));
  }

  return stripePromiseCache.get(publishableKey)!;
}

if (fallbackStripePublishableKey) {
  getStripePromise(fallbackStripePublishableKey);
}

type CreatePaymentIntentResponse = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  data?: {
    clientSecret?: string;
    paymentIntentId?: string;
    amount?: number;
    currency?: string;
    publishableKey?: string;
    applePayUrl?: string;
  };
};

type PaymentIntentInfo = {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  publishableKey: string;
  applePayUrl: string | null;
};

function resolvePaymentEndpoint() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment`;
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment`;
  }
  return "/payment";
}

async function createPaymentIntent(
  bookingId: string
): Promise<PaymentIntentInfo> {
  const response = await fetch(
    `${resolvePaymentEndpoint()}/${encodeURIComponent(bookingId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = (await response.json().catch(() => null)) as
    | CreatePaymentIntentResponse
    | null;

  const hasExplicitFailure =
    result?.success === false || result?.status === false;

  const clientSecret =
    typeof result?.data?.clientSecret === "string"
      ? result.data.clientSecret
      : "";

  const paymentIntentId =
    typeof result?.data?.paymentIntentId === "string"
      ? result.data.paymentIntentId
      : "";

  const amount =
    typeof result?.data?.amount === "number" &&
    Number.isFinite(result.data.amount)
      ? result.data.amount
      : 0;

  const currency =
    typeof result?.data?.currency === "string" &&
    /^[a-z]{3}$/i.test(result.data.currency.trim())
      ? result.data.currency.trim().toLowerCase()
      : fallbackStripeCurrency;

  const publishableKey =
    typeof result?.data?.publishableKey === "string" &&
    result.data.publishableKey.trim()
      ? result.data.publishableKey.trim()
      : fallbackStripePublishableKey;

  const applePayUrl =
    typeof result?.data?.applePayUrl === "string" &&
    result.data.applePayUrl.trim()
      ? result.data.applePayUrl.trim()
      : null;

  if (
    !response.ok ||
    hasExplicitFailure ||
    !clientSecret ||
    !paymentIntentId ||
    !publishableKey
  ) {
    throw new Error(result?.message || "Failed to create payment intent.");
  }

  return {
    clientSecret,
    paymentIntentId,
    amount,
    currency,
    publishableKey,
    applePayUrl,
  };
}

function getOrdinalDay(day: number): string {
  const remainder10 = day % 10;
  const remainder100 = day % 100;

  if (remainder10 === 1 && remainder100 !== 11) return `${day}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${day}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${day}rd`;

  return `${day}th`;
}

function formatInstallDateLabel(isoDate: string | null | undefined): string {
  if (!isoDate) return "Not selected";

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return "Not selected";

  const day = getOrdinalDay(parsed.getUTCDate());
  const month = parsed.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });
  const year = parsed.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

function formatMoney(value: number): string {
  if (value % 1 === 0) return `£${value.toLocaleString("en-US")}`;

  return `£${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getWarrantyText(product: ApiProductFull): string | undefined {
  const warrantyFeature = product.boilerFeatures.find((feature) =>
    /warranty/i.test(feature.title)
  );

  if (!warrantyFeature?.value) return undefined;

  return `with ${warrantyFeature.value} warranty`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function firstNonEmptyString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function extractInstallAddressLabel(quote: ApiQuote | null | undefined): string {
  if (!quote) return "";

  const quoteRecord = quote as unknown as Record<string, unknown>;
  const personalInfo = asRecord(quoteRecord.personalInfo);

  return firstNonEmptyString(
    quoteRecord.installAddress,
    quoteRecord.installationAddress,
    personalInfo?.installAddress,
    personalInfo?.address,
    personalInfo?.fullAddress,
    quoteRecord.address,
    quoteRecord.location,
    personalInfo?.location
  );
}

function TopBanner({
  payTodayTotal,
  isLoading,
  onViewDetails,
}: {
  payTodayTotal: number;
  isLoading: boolean;
  onViewDetails: () => void;
}) {
  return (
    <div className="rounded-[10px] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-2 text-[18px] font-semibold text-[#2D3D4D]">
            <ShieldCheck className="h-4 w-4" />
            <span>
              Your total price is {isLoading ? "Loading..." : formatMoney(payTodayTotal)}
            </span>
          </div>

          <p className="mt-2 text-[12px] text-[#2D3D4D] sm:text-[16px]">
            Installation available from next working day- choose your install date below
          </p>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="shrink-0 pt-1 text-[16px] font-bold text-[#FFDE59] underline underline-offset-2"
        >
          View
        </button>
      </div>
    </div>
  );
}

function PriceSummary({
  product,
  payTodayTotal,
  originalTotal,
  installDateLabel,
  installedAtLabel,
  isLoading,
  quotePriceItem,
}: {
  product: ApiProductFull | null;
  payTodayTotal: number;
  originalTotal: number;
  installDateLabel: string;
  installedAtLabel: string;
  isLoading: boolean;
  quotePriceItem: QuotePriceAdjustmentItem | null;
}) {
  if (isLoading) {
    return (
      <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
        <div className="h-6 w-48 animate-pulse rounded bg-[#e8edf1]" />
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="h-24 animate-pulse rounded-[8px] bg-[#f5f6f7]" />
          <div className="h-24 animate-pulse rounded-[8px] bg-[#f5f6f7]" />
        </div>
        <div className="mt-3 h-10 animate-pulse rounded-[8px] bg-[#f5f6f7]" />
        <div className="mt-3 h-28 animate-pulse rounded-[10px] bg-[#f5f6f7]" />
      </aside>
    );
  }

  if (!product) {
    return (
      <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
        <p className="text-[14px] text-[#2f3b4a]">
          Product details not found. Please go back and select your boiler again.
        </p>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-[8px] bg-white p-3 shadow-sm xl:sticky xl:top-5">
      <h3 className="text-[18px] font-semibold text-[#2D3D4D]">
        Total fixed price including VAT
      </h3>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
          <p className="text-[18px] text-[#64748B]">Pay today</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">
            {formatMoney(payTodayTotal)}
          </p>

          {originalTotal > payTodayTotal ? (
            <p className="mt-1 text-[14px] font-medium text-[#00A56F] line-through">
              was {formatMoney(originalTotal)}
            </p>
          ) : null}
        </div>

        <div className="rounded-[6px] bg-[#F0F3F6] p-2.5">
          <p className="text-[18px] text-[#64748B]">Monthly Cost</p>
          <p className="mt-1 text-[18px] font-bold leading-none text-[#2D3D4D]">
            {formatMoney(payTodayTotal / 12)}/mo
          </p>
        </div>
      </div>

      <div className="mt-3 flex min-h-[34px] items-center justify-center rounded-[6px] bg-[#F0F3F6] px-2 text-center">
        <BadgePercent className="mr-2 h-5 w-5 shrink-0 text-[#64748B]" />
        <span className="text-[16px] font-semibold text-[#2D3D4D]">
          {product.boilerAbility || product.title} Discount
        </span>
        <span className="ml-2 text-[16px] font-semibold text-[#00A56F]">
          -{formatMoney(product.discountPrice ?? 0)}
        </span>
      </div>

      <div className="mt-3">
        <h4 className="text-[18px] font-semibold text-[#2D3D4D]">
          Order Summary
        </h4>

        <div className="mt-2 space-y-2 rounded-[6px] bg-[#F0F3F6] p-2.5">
          <div className="flex items-center gap-3">
            <div className="h-[48px] w-[48px] overflow-hidden">
              <Image
                src={product.images?.[0] ?? "/product.png"}
                alt={product.boilerAbility || product.title}
                width={48}
                height={48}
                className="h-[48px] w-[48px] object-contain"
              />
            </div>

            <div>
              <p className="text-[16px] font-semibold text-[#2D3D4D]">
                {product.boilerAbility || product.title}
              </p>

              {getWarrantyText(product) ? (
                <p className="text-[16px] text-[#2D3D4D]">
                  {getWarrantyText(product)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[18px] text-[#2D3D4D]">Install date</span>
            <span className="text-[18px] font-semibold text-[#2D3D4D]">
              {installDateLabel}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 pt-1">
            <span className="text-[18px] text-[#2D3D4D]">Installed at</span>
            <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">
              {installedAtLabel}
            </span>
          </div>

          {quotePriceItem ? (
            <div className="flex items-start justify-between gap-3 border-t border-dotted border-[#A7B1BB] pt-2">
              <span className="text-[18px] text-[#2D3D4D]">
                {quotePriceItem.label}
              </span>
              <span className="text-right text-[18px] font-semibold text-[#2D3D4D]">
                {formatMoney(quotePriceItem.price)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function CollapsedStep({ label }: { label: string }) {
  return (
    <div className="rounded-[10px] bg-white px-5 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed]">
      <div className="flex items-center justify-center gap-3 text-center">
        <CalendarDays className="h-4 w-4 text-[#304153]" />
        <span className="text-[18px] font-medium text-[#2D3D4D]">{label}</span>
      </div>
    </div>
  );
}

function CardBadges() {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold text-[#2f3b4a]">
      <span className="text-[#1a49d3]">VISA</span>
      <span className="rounded bg-[#2b66dd] px-1 py-[2px] text-[9px] text-white">
        AMEX
      </span>
      <span className="inline-flex items-center gap-[2px]">
        <span className="h-4 w-4 rounded-full bg-[#ea4f24]" />
        <span className="-ml-2 h-4 w-4 rounded-full bg-[#f7b500]" />
      </span>
      <span className="inline-flex items-center gap-1 rounded bg-white px-1 py-[2px] text-[18px] text-[#5f6977]">
        <span className="font-bold text-[#4285F4]">G</span>
        <span>Pay</span>
      </span>
    </div>
  );
}

function PaymentOption({
  title,
  onClick,
  right,
  active = false,
  disabled = false,
}: {
  title: string;
  onClick: () => void;
  right?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-between rounded-[6px] border bg-white px-3 py-4 text-left transition ${
        active
          ? "border-[#00A56F] ring-1 ring-[#00A56F]/40"
          : "border-[#8f99a6] hover:bg-[#fbfbfc]"
      } disabled:cursor-not-allowed disabled:opacity-70`}
    >
      <div className="flex items-center gap-3">
        <Circle
          className={`h-[18px] w-[18px] ${
            active ? "fill-[#00aa63] text-[#00aa63]" : "text-[#344255]"
          }`}
        />
        <span className="text-[14px] font-medium text-[#2f3b4a]">{title}</span>
      </div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </button>
  );
}

type CardPaymentStatus = {
  type: "success" | "error";
  message: string;
} | null;

type CardCheckoutMethod = "card" | "applePay";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[18px] font-medium text-[#2D3D4D]">
      {children}
    </label>
  );
}

function StripeInputField({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
      <div className="w-full text-[13px] text-[#2f3b4a]">{children}</div>
      {right ? <div className="ml-3 shrink-0">{right}</div> : null}
    </div>
  );
}

function StripePaymentFormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Payment method</FieldLabel>
        <div className="overflow-hidden rounded-[8px] border border-[#c9d1d8]">
          <div className="flex w-full items-center justify-between bg-[#f2f6f9] px-4 py-3">
            <div className="flex items-center gap-3">
              <Circle className="h-[18px] w-[18px] fill-[#00aa63] text-[#00aa63]" />
              <span className="text-[18px] font-medium text-[#2D3D4D]">Card</span>
            </div>
            <CardBadges />
          </div>

          <div className="flex w-full items-center justify-between border-t border-[#e6ebef] bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <Circle className="h-[18px] w-[18px] text-[#7a8895]" />
              <span className="text-[18px] font-medium text-[#2D3D4D]">
                Apple Pay
              </span>
            </div>
            <span className="rounded-[6px] bg-black px-3 py-1 text-[16px] font-medium text-white">
              Apple Pay
            </span>
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Card number</FieldLabel>
        <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
          <div className="h-3 w-40 animate-pulse rounded bg-[#dfe5ea]" />
          <div className="ml-auto">
            <CardBadges />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Expiry date</FieldLabel>
          <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
            <div className="h-3 w-20 animate-pulse rounded bg-[#dfe5ea]" />
          </div>
        </div>

        <div>
          <FieldLabel>Security Code</FieldLabel>
          <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
            <div className="h-3 w-16 animate-pulse rounded bg-[#dfe5ea]" />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Zip Code</FieldLabel>
        <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
          <div className="h-3 w-24 animate-pulse rounded bg-[#dfe5ea]" />
        </div>
      </div>

      <div className="h-[48px] w-full animate-pulse rounded-[6px] bg-[#edf0f2]" />
      <div className="h-[48px] w-full animate-pulse rounded-[6px] bg-[#0cab63]/70" />
    </div>
  );
}

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "13px",
      color: "#2f3b4a",
      "::placeholder": {
        color: "#667281",
      },
    },
    invalid: {
      color: "#b42318",
    },
  },
};

function StripeCardForm({
  clientSecret,
  amount,
  applePayUrl,
  onStatusChange,
  onPaymentSuccess,
}: {
  clientSecret: string;
  amount: number;
  applePayUrl: string | null;
  onStatusChange: (status: CardPaymentStatus) => void;
  onPaymentSuccess?: (paymentIntentId: string, status: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [zip, setZip] = React.useState("");
  const [isCardNumberComplete, setIsCardNumberComplete] = React.useState(false);
  const [isExpiryComplete, setIsExpiryComplete] = React.useState(false);
  const [isCvcComplete, setIsCvcComplete] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRedirectingToApplePay, setIsRedirectingToApplePay] =
    React.useState(false);
  const [checkoutMethod, setCheckoutMethod] =
    React.useState<CardCheckoutMethod>("card");

  const reportPaymentResult = React.useCallback(
    (status: string | undefined, paymentIntentId?: string) => {
      if (
        status === "succeeded" ||
        status === "processing" ||
        status === "requires_capture"
      ) {
        onStatusChange({
          type: "success",
          message:
            status === "succeeded"
              ? "Payment successful. Your booking is now being confirmed."
              : "Payment submitted successfully. We are finalizing your booking.",
        });

        if (paymentIntentId) {
          onPaymentSuccess?.(paymentIntentId, status);
        }

        return true;
      }

      onStatusChange({
        type: "error",
        message: "Payment could not be completed. Please try again.",
      });

      return false;
    },
    [onPaymentSuccess, onStatusChange]
  );

  const handleApplePayClick = React.useCallback(() => {
    setCheckoutMethod("applePay");

    if (!applePayUrl) {
      onStatusChange({
        type: "error",
        message: "Apple Pay link is not available right now. Please use card payment.",
      });
      return;
    }

    onStatusChange(null);
    setIsRedirectingToApplePay(true);

    if (typeof window !== "undefined") {
      window.location.assign(applePayUrl);
    }
  }, [applePayUrl, onStatusChange]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) return;

      if (!zip.trim()) {
        onStatusChange({
          type: "error",
          message: "Please enter your zip code.",
        });
        return;
      }

      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        onStatusChange({
          type: "error",
          message: "Card details are not ready. Please try again.",
        });
        return;
      }

      setIsSubmitting(true);
      onStatusChange(null);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              address: {
                postal_code: zip.trim(),
              },
            },
          },
        }
      );

      if (error) {
        onStatusChange({
          type: "error",
          message:
            error.message ||
            "Payment failed. Please check your card details and try again.",
        });
        setIsSubmitting(false);
        return;
      }

      const status = paymentIntent?.status;

      if (
        status === "succeeded" ||
        status === "processing" ||
        status === "requires_capture"
      ) {
        setIsSubmitting(false);
        reportPaymentResult(status, paymentIntent?.id);
        return;
      }

      setIsSubmitting(false);
      reportPaymentResult(status);
    },
    [clientSecret, elements, onStatusChange, reportPaymentResult, stripe, zip]
  );

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Payment method</FieldLabel>

        <div className="overflow-hidden rounded-[8px] border border-[#c9d1d8]">
          <button
            type="button"
            onClick={() => {
              setCheckoutMethod("card");
              setIsRedirectingToApplePay(false);
              onStatusChange(null);
            }}
            className={`flex w-full items-center justify-between px-4 py-3 text-left transition ${
              checkoutMethod === "card"
                ? "bg-[#f2f6f9]"
                : "bg-white hover:bg-[#fbfbfc]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Circle
                className={`h-[18px] w-[18px] ${
                  checkoutMethod === "card"
                    ? "fill-[#00aa63] text-[#00aa63]"
                    : "text-[#7a8895]"
                }`}
              />
              <span className="text-[18px] font-medium text-[#2D3D4D]">Card</span>
            </div>
            <CardBadges />
          </button>

          <button
            type="button"
            onClick={handleApplePayClick}
            disabled={!applePayUrl || isRedirectingToApplePay}
            className={`flex w-full items-center justify-between border-t border-[#e6ebef] px-4 py-3 text-left transition ${
              checkoutMethod === "applePay"
                ? "bg-[#f2f6f9]"
                : "bg-white hover:bg-[#fbfbfc]"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            <div className="flex items-center gap-3">
              <Circle
                className={`h-[18px] w-[18px] ${
                  checkoutMethod === "applePay"
                    ? "fill-[#00aa63] text-[#00aa63]"
                    : "text-[#7a8895]"
                }`}
              />
              <span className="text-[18px] font-medium text-[#2D3D4D]">
                Apple Pay
              </span>
            </div>
            <span className="rounded-[6px] bg-black px-3 py-1 text-[16px] font-medium text-white">
              Apple Pay
            </span>
          </button>
        </div>

        {!applePayUrl ? (
          <p className="mt-2 text-[13px] text-[#5f6977]">
            Apple Pay link is not available right now. Please choose card payment.
          </p>
        ) : null}
      </div>

      {checkoutMethod === "applePay" ? (
        <div className="space-y-3">
          {applePayUrl ? (
            <>
              <div className="rounded-[8px] border border-[#c9d1d8] bg-white px-4 py-4 text-[14px] text-[#2D3D4D]">
                You will be redirected to Apple Pay secure checkout.
              </div>

              <button
                type="button"
                onClick={handleApplePayClick}
                disabled={isRedirectingToApplePay}
                className="w-full rounded-[6px] bg-black px-4 py-3 text-[16px] font-medium text-white transition hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRedirectingToApplePay
                  ? "Redirecting to Apple Pay..."
                  : "Continue to Apple Pay"}
              </button>
            </>
          ) : (
            <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
              Apple Pay link is not available right now. Please choose card payment.
            </div>
          )}

          <p className="text-center text-[13px] text-[#2D3D4D] sm:text-[15px]">
            Amount to pay today: {formatMoney(amount)}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Card number</FieldLabel>
            <StripeInputField right={<CardBadges />}>
              <CardNumberElement
                options={{
                  ...stripeElementOptions,
                  placeholder: "1234 1234 1234 1234",
                }}
                onChange={(event) => setIsCardNumberComplete(event.complete)}
              />
            </StripeInputField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Expiry date</FieldLabel>
              <StripeInputField>
                <CardExpiryElement
                  options={stripeElementOptions}
                  onChange={(event) => setIsExpiryComplete(event.complete)}
                />
              </StripeInputField>
            </div>

            <div>
              <FieldLabel>Security Code</FieldLabel>
              <StripeInputField>
                <CardCvcElement
                  options={stripeElementOptions}
                  onChange={(event) => setIsCvcComplete(event.complete)}
                />
              </StripeInputField>
            </div>
          </div>

          <div>
            <FieldLabel>Zip Code</FieldLabel>
            <div className="flex h-[48px] items-center rounded-[6px] border border-[#8f99a6] bg-white px-3">
              <input
                value={zip}
                onChange={(event) => setZip(event.target.value)}
                placeholder="12345"
                className="h-full w-full bg-transparent text-[13px] text-[#2f3b4a] outline-none placeholder:text-[#667281]"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-[6px] bg-[#edf0f2] px-4 py-3 text-[16px] font-medium text-[#465260]"
          >
            Start finance application
          </button>

          <button
            type="submit"
            disabled={
              !stripe ||
              !elements ||
              isSubmitting ||
              !isCardNumberComplete ||
              !isExpiryComplete ||
              !isCvcComplete
            }
            className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#0cab63] px-4 text-[16px] font-medium text-white transition hover:bg-[#099656] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Lock className="h-4 w-4" />
            <span>{isSubmitting ? "Processing payment..." : "Book installation"}</span>
          </button>

          <p className="text-center text-[13px] text-[#2D3D4D] sm:text-[15px]">
            Amount to pay today: {formatMoney(amount)}
          </p>
        </form>
      )}
    </div>
  );
}

function PaymentSection({
  bookingId,
  paymentIntentInfo,
  isLoadingPaymentIntent,
  paymentIntentError,
  onRetryPaymentIntent,
  onSelectMonthly,
  onPaymentSuccess,
}: {
  bookingId: string | null;
  paymentIntentInfo: PaymentIntentInfo | undefined;
  isLoadingPaymentIntent: boolean;
  paymentIntentError: string | null;
  onRetryPaymentIntent: () => void;
  onSelectMonthly: () => void;
  onPaymentSuccess: (paymentIntentId: string, status: string) => void;
}) {
  const [paymentType, setPaymentType] = React.useState<"card" | "monthly">("card");
  const [paymentStatus, setPaymentStatus] = React.useState<CardPaymentStatus>(null);

  const stripePromise = React.useMemo(
    () =>
      paymentIntentInfo?.publishableKey
        ? getStripePromise(paymentIntentInfo.publishableKey)
        : fallbackStripePublishableKey
          ? getStripePromise(fallbackStripePublishableKey)
          : null,
    [paymentIntentInfo?.publishableKey]
  );

  React.useEffect(() => {
    const publishableKey = paymentIntentInfo?.publishableKey || fallbackStripePublishableKey;

    if (publishableKey) {
      void getStripePromise(publishableKey);
    }
  }, [paymentIntentInfo?.publishableKey]);

  return (
    <div className="rounded-[10px] bg-white px-4 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-[#e8eaed] sm:px-6">
      <div className="flex items-center justify-center gap-3 text-center">
        <CreditCard className="h-4 w-4 text-[#304153]" />
        <span className="text-[18px] font-medium text-[#2D3D4D]">
          How would you like to pay?
        </span>
      </div>

      <p className="mt-4 text-center text-[12px] leading-5 text-[#2D3D4D] sm:text-[16px]">
        Make one payment by card or pay in monthly installments with our finance options
      </p>

      <div className="mt-4 space-y-3">
        <PaymentOption
          title="Pay by card"
          active={paymentType === "card"}
          onClick={() => setPaymentType("card")}
          right={<CardBadges />}
        />

        <PaymentOption
          title="Pay monthly"
          active={paymentType === "monthly"}
          onClick={() => {
            setPaymentType("monthly");
            onSelectMonthly();
          }}
        />
      </div>

      <div className="mt-4 rounded-[6px] bg-[#edf0f2] px-4 py-3 text-center text-[18px] font-medium text-[#2D3D4D]">
        Secure payments powered by stripe.
      </div>

      {paymentStatus ? (
        <div
          className={`mt-4 rounded-[6px] border px-3 py-2 text-[14px] ${
            paymentStatus.type === "success"
              ? "border-[#00A56F] bg-[#ebf9f3] text-[#0a6b4a]"
              : "border-[#f0b4b4] bg-[#fff6f6] text-[#b42318]"
          }`}
        >
          {paymentStatus.message}
        </div>
      ) : null}

      {paymentType === "card" ? (
        <div className="mt-5">
          <h3 className="text-center text-[28px] font-semibold tracking-[-0.02em] text-[#334155] sm:text-[30px]">
            Complete your payment below
          </h3>

          <div className="mt-6">
            {!bookingId ? (
              <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
                Booking ID not found. Please go back and select your payment option again.
              </div>
            ) : isLoadingPaymentIntent ? (
              <StripePaymentFormSkeleton />
            ) : paymentIntentError ? (
              <div className="space-y-3 rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-4 py-4 text-center">
                <p className="text-[14px] text-[#b42318]">{paymentIntentError}</p>
                <button
                  type="button"
                  onClick={onRetryPaymentIntent}
                  className="rounded-[6px] bg-[#2D3D4D] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#243241]"
                >
                  Retry payment setup
                </button>
              </div>
            ) : paymentIntentInfo?.clientSecret && stripePromise ? (
              <Elements stripe={stripePromise}>
                <StripeCardForm
                  clientSecret={paymentIntentInfo.clientSecret}
                  amount={paymentIntentInfo.amount}
                  applePayUrl={paymentIntentInfo.applePayUrl}
                  onStatusChange={setPaymentStatus}
                  onPaymentSuccess={onPaymentSuccess}
                />
              </Elements>
            ) : paymentIntentInfo?.clientSecret ? (
              <div className="rounded-[6px] border border-[#f0b4b4] bg-[#fff6f6] px-3 py-3 text-[14px] text-[#b42318]">
                Stripe payment configuration is missing. Please contact support.
              </div>
            ) : (
              <StripePaymentFormSkeleton />
            )}

            <p className="mt-4 text-center text-[10px] text-[#2D3D4D] sm:text-[16px]">
              We do not charge a fee for our retail finance services
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[6px] border border-dashed border-[#c9d1d8] bg-[#fafbfb] px-4 py-8 text-center text-[13px] text-[#5f6977]">
          Redirecting to monthly payment options...
        </div>
      )}
    </div>
  );
}

function FooterDisclaimer() {
  return (
    <p className="pt-2 text-[11px] leading-6 text-[#2D3D4D] sm:text-[16px]">
      *Representative example for 120 month order: £3,099 purchase. Deposit £0. Annual rate of interest 9.48% p.a.
      Representative APR: 9.9% APR. Total amount of credit £3,099 paid over 120 months as 120 monthly payments of
      £40.07 at 9.48% p.a. Cost of finance £1,709.40. Total amount payable £4,808.40. BOXI Limited is a credit broker
      and not a lender. Credit provided by HomeServe Finance Limited. Finance available subject to status,
      affordability and credit check. Terms and conditions apply.
    </p>
  );
}

function BoilerCardPaymentCloneContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams.get("quoteId");
  const productIdFromQuery = searchParams.get("productId");
  const bookingId = searchParams.get("bookingId");

  const monthlyPaymentUrl = React.useMemo(() => {
    const query = searchParams.toString();

    return query
      ? `/boilers/installation-booking/monthly-payment?${query}`
      : "/boilers/installation-booking/monthly-payment";
  }, [searchParams]);

  const {
    data: paymentIntentInfo,
    isLoading: isLoadingPaymentIntent,
    isFetching: isFetchingPaymentIntent,
    error: paymentIntentQueryError,
    refetch: refetchPaymentIntent,
  } = useQuery({
    queryKey: ["create-payment-intent", bookingId],
    enabled: Boolean(bookingId),
    retry: 1,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: () => createPaymentIntent(bookingId as string),
  });

  const paymentIntentError = paymentIntentQueryError
    ? paymentIntentQueryError instanceof Error
      ? paymentIntentQueryError.message
      : "Failed to prepare payment."
    : null;

  const handleSelectMonthly = React.useCallback(() => {
    router.push(monthlyPaymentUrl);
  }, [monthlyPaymentUrl, router]);

  const handlePaymentSuccess = React.useCallback(
    (paymentIntentId: string, status: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("paymentIntentId", paymentIntentId);
      params.set("paymentStatus", status);

      const query = params.toString();

      router.replace(
        query
          ? `/boilers/installation-booking/payment-success?${query}`
          : "/boilers/installation-booking/payment-success"
      );
    },
    [router, searchParams]
  );

  const { data: quote, isLoading: quoteLoading } = useQuoteById(quoteId);

  const quoteProductId =
    typeof quote?.productId === "string"
      ? quote.productId
      : quote?.productId?._id ?? null;

  const resolvedProductId = productIdFromQuery ?? quoteProductId;

  const customerDetailsUrl = React.useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (resolvedProductId) {
      params.set("productId", resolvedProductId);
    }

    if (quoteId) {
      params.set("quoteId", quoteId);
    }

    const query = params.toString();

    return query ? `/boilers/customer-details?${query}` : "/boilers/customer-details";
  }, [quoteId, resolvedProductId, searchParams]);

  const { data: product, isLoading: productLoading } =
    useProductById(resolvedProductId);

  const selectedController: ApiQuoteController | null =
    quote?.controller && typeof quote.controller !== "string"
      ? quote.controller
      : null;

  const selectedExtra: ApiQuoteExtra | null =
    quote?.extra && typeof quote.extra !== "string" ? quote.extra : null;

  const selectedControllerPrice =
    selectedController &&
    typeof selectedController.price === "number" &&
    selectedController.price > 0
      ? selectedController.price
      : 0;

  const selectedExtraPrice =
    selectedExtra &&
    typeof selectedExtra.price === "number" &&
    selectedExtra.price > 0
      ? selectedExtra.price
      : 0;

  const quotePriceAdjustment = getQuotePriceAdjustmentTotal(quote?.quizAnswers);
  const quotePriceItem = getPrimaryQuotePriceAdjustmentItem(quote?.quizAnswers);

  const payTodayTotal = product
    ? (product.payablePrice ?? product.price ?? 0) +
      selectedControllerPrice +
      selectedExtraPrice +
      quotePriceAdjustment
    : 0;

  const originalTotal = product
    ? (product.price ?? 0) +
      selectedControllerPrice +
      selectedExtraPrice +
      quotePriceAdjustment
    : 0;

  const installDateRaw = (quote as unknown as Record<string, unknown> | null)
    ?.installDate;

  const installDateLabel = formatInstallDateLabel(
    typeof installDateRaw === "string" ? installDateRaw : null
  );

  const installedAtLabel = extractInstallAddressLabel(quote) || "Not selected";

  const isLoading =
    (quoteId ? quoteLoading : false) ||
    (resolvedProductId ? productLoading : false);

  return (
    <BoilerFlowShell activeStep={4}>
      <div className="py-12">
        <div className="mx-auto container">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
            <div className="space-y-4">
              <TopBanner
                payTodayTotal={payTodayTotal}
                isLoading={isLoading}
                onViewDetails={() => router.push(customerDetailsUrl)}
              />

              <CollapsedStep label="When should we Survey?" />
              <CollapsedStep label="When should we install?" />
              <CollapsedStep label="Where are we visiting?" />

              <PaymentSection
                bookingId={bookingId}
                paymentIntentInfo={paymentIntentInfo}
                isLoadingPaymentIntent={
                  isLoadingPaymentIntent || isFetchingPaymentIntent
                }
                paymentIntentError={paymentIntentError}
                onRetryPaymentIntent={() => {
                  void refetchPaymentIntent();
                }}
                onSelectMonthly={handleSelectMonthly}
                onPaymentSuccess={handlePaymentSuccess}
              />

              <FooterDisclaimer />
            </div>

            <div>
              <PriceSummary
                product={product ?? null}
                payTodayTotal={payTodayTotal}
                originalTotal={originalTotal}
                installDateLabel={installDateLabel}
                installedAtLabel={installedAtLabel}
                isLoading={isLoading}
                quotePriceItem={quotePriceItem}
              />
            </div>
          </div>
        </div>
      </div>
    </BoilerFlowShell>
  );
}

export default function BoilerCardPaymentClone() {
  return (
    <React.Suspense fallback={null}>
      <BoilerCardPaymentCloneContent />
    </React.Suspense>
  );
}