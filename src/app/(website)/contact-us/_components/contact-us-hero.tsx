"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, ArrowRight, RefreshCw, SearchX } from 'lucide-react'
import { RaiseIssueModal } from './raise-issue-modal'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

// ─── Loading, Error, Not Found Components ──────────────────────────

const CardSkeleton = () => (
  <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
    <CardContent className="flex min-h-[198px] flex-col p-4 sm:p-5">
      <Skeleton className="h-8 w-2/3 max-w-[200px] rounded-lg bg-[#d5d7d9]" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full rounded-md bg-[#d5d7d9]" />
        <Skeleton className="h-4 w-4/5 rounded-md bg-[#d5d7d9]" />
      </div>
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-1/2 rounded-md bg-[#d5d7d9]" />
        <Skeleton className="h-3 w-1/3 rounded-md bg-[#d5d7d9]" />
      </div>
      <div className="mt-auto pt-4">
        <Skeleton className="h-6 w-1/2 rounded-md bg-[#d5d7d9]" />
        <Skeleton className="mt-2 h-4 w-1/3 rounded-md bg-[#d5d7d9]" />
      </div>
    </CardContent>
  </Card>
)

const CardError = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
    <CardContent className="flex min-h-[198px] flex-col items-center justify-center p-4 sm:p-5 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" strokeWidth={1.5} />
      <h2 className="text-lg font-medium text-[#2a2e36]">Failed to load</h2>
      <button
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#db860f] px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#c1760d]"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    </CardContent>
  </Card>
)

const CardNotFound = () => (
  <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
    <CardContent className="flex min-h-[198px] flex-col items-center justify-center p-4 sm:p-5 text-center">
      <SearchX className="h-8 w-8 text-[#757b84] mb-2" strokeWidth={1.5} />
      <h2 className="text-lg font-medium text-[#2a2e36]">Not found</h2>
      <p className="mt-1 text-sm text-[#757b84]">No information available</p>
    </CardContent>
  </Card>
)

// ─── Contact Cards ─────────────────────────────────────────────

const SalesCard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sales-card'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sales?sortBy=createdAt&limit=10&page=1`)
      if (!res.ok) throw new Error('Failed to fetch sales data')
      return res.json()
    },
  })

  if (isLoading) return <CardSkeleton />
  if (isError) return <CardError onRetry={refetch} />
  
  const card = data?.data?.[0]
  if (!card) return <CardNotFound />

  return (
    <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
      <CardContent className="flex min-h-[198px] flex-col p-4 sm:p-5">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-none tracking-[-0.02em] text-[#2a2e36]">
          {card.title}
        </h2>
        <div className="mt-2 space-y-[1px] text-sm md:text-base font-medium leading-[1.3] text-[#424851]">
          <p>{card.subTitle}</p>
        </div>

        {card.dateTime && card.dateTime.length > 0 ? (
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs md:text-sm font-semibold text-[#757b84]">
            {card.dateTime.map((dt: { date: string; time: string }, idx: number) => (
              <React.Fragment key={idx}>
                <p>{dt.date}</p>
                <p className="text-right">{dt.time}</p>
              </React.Fragment>
            ))}
          </div>
        ) : null}

        {card.phonenumber ? (
          <p className="mt-auto pt-4 text-lg md:text-xl font-semibold leading-none tracking-[-0.02em] text-[#2d3239]">
            {card.phonenumber}
          </p>
        ) : null}
        
        {card.description ? (
          <p className="mt-1 text-[17px] font-medium leading-none tracking-[-0.01em] text-[#767d86]">
            {card.description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

const AftercareCard = ({ onRaiseIssue }: { onRaiseIssue: () => void }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['aftercare-card'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aftercare?sortBy=createdAt&limit=10&page=1`)
      if (!res.ok) throw new Error('Failed to fetch aftercare data')
      return res.json()
    },
  })

  if (isLoading) return <CardSkeleton />
  if (isError) return <CardError onRetry={refetch} />
  
  const card = data?.data?.[0]
  if (!card) return <CardNotFound />

  return (
    <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
      <CardContent className="flex min-h-[198px] flex-col p-4 sm:p-5">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-none tracking-[-0.02em] text-[#2a2e36]">
          {card.title}
        </h2>
        <div className="mt-2 space-y-[1px] text-sm md:text-base font-medium leading-[1.3] text-[#424851]">
          <p>{card.subTitle}</p>
        </div>

        <div className="mt-auto pt-6 md:pt-8 lg:pt-10 xl:pt-12 2xl:pt-14">
          <Button
            type="button"
            onClick={onRaiseIssue}
            className="h-9 md:h-10 rounded-full bg-[#db860f] px-6 text-base font-semibold text-white shadow-none hover:bg-[#c1760d]"
          >
            Raise an issue <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const EngineersCard = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['engineers-card'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/engineer?sortBy=createdAt&limit=10&page=1`)
      if (!res.ok) throw new Error('Failed to fetch engineers data')
      return res.json()
    },
  })

  if (isLoading) return <CardSkeleton />
  if (isError) return <CardError onRetry={refetch} />
  
  const card = data?.data?.[0]
  if (!card) return <CardNotFound />

  return (
    <Card className="rounded-[22px] border-0 bg-[#ececed] p-0 shadow-none">
      <CardContent className="flex min-h-[198px] flex-col p-4 sm:p-5">
        <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium leading-none tracking-[-0.02em] text-[#2a2e36]">
          {card.title}
        </h2>
        <div className="mt-2 space-y-[1px] text-sm md:text-base font-medium leading-[1.3] text-[#424851]">
          <p>{card.subTitle}</p>
        </div>

        {card.dateTime && card.dateTime.length > 0 ? (
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-xs md:text-sm font-semibold text-[#757b84]">
            {card.dateTime.map((dt: { date: string; time: string }, idx: number) => (
              <React.Fragment key={idx}>
                <p>{dt.date}</p>
                <p className="text-right">{dt.time}</p>
              </React.Fragment>
            ))}
          </div>
        ) : null}

        {card.phonenumber ? (
          <p className="mt-auto pt-4 text-lg md:text-xl font-semibold leading-none tracking-[-0.02em] text-[#2d3239]">
            {card.phonenumber}
          </p>
        ) : null}
        
        {card.description ? (
          <p className="mt-1 text-[17px] font-medium leading-none tracking-[-0.01em] text-[#767d86]">
            {card.description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

const ContactUsHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="bg-[#dfe1e3] px-4 pb-10 pt-12 md:pb-12 md:pt-14">
      <div className="container">
        <h1 className="text-center text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-medium leading-none tracking-[-0.02em] text-[#22262d]">
          Contact us
        </h1>
        <div className="mt-5 md:mt-7 lg:mt-10 grid gap-6 md:grid-cols-3">
          <SalesCard />
          <AftercareCard onRaiseIssue={() => setIsModalOpen(true)} />
          <EngineersCard />
        </div>
      </div>
      <RaiseIssueModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  )
}

export default ContactUsHero
