"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RaiseIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RaiseIssueModal: React.FC<RaiseIssueModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Simple validations
    if (!formData.name.trim()) {
      toast.error("Please enter your name")
      return
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email address")
      return
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number")
      return
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a message or description of your issue")
      return
    }

    setLoading(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001/api/v1"
      const response = await fetch(`${backendUrl}/issue`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      })

      const data = await response.json().catch(() => null)

      if (response.ok && (data?.success || response.status === 201)) {
        toast.success(data?.message || "Issue created successfully")
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
        // Close modal
        onOpenChange(false)
      } else {
        toast.error(data?.message || "Failed to submit the issue. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting issue:", error)
      toast.error("An error occurred. Please check your network connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[95%] bg-white !rounded-2xl p-5 md:p-7 border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-[#22262d]">
            Raise an issue
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base font-medium text-[#757b84] leading-relaxed">
            Please fill out the form below to raise an issue, and our aftercare team will review it and get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 md:space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-[#424851]">
              Full Name <span className="text-[#db860f]">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Kongkon Jowarder"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              className="h-10 md:h-11 rounded-xl border-[#d4d8de] bg-[#f8f9fa] px-4 text-base text-[#22262d] placeholder:text-[#a9afb8] focus-visible:border-[#db860f] focus-visible:ring-1 focus-visible:ring-[#db860f]/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold text-[#424851]">
              Email Address <span className="text-[#db860f]">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g. kongkonbdcalling45@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className="h-10 md:h-11 rounded-xl border-[#d4d8de] bg-[#f8f9fa] px-4 text-base text-[#22262d] placeholder:text-[#a9afb8] focus-visible:border-[#db860f] focus-visible:ring-1 focus-visible:ring-[#db860f]/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-semibold text-[#424851]">
              Phone Number <span className="text-[#db860f]">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 01778934567"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              required
              className="h-10 md:h-11 rounded-xl border-[#d4d8de] bg-[#f8f9fa] px-4 text-base text-[#22262d] placeholder:text-[#a9afb8] focus-visible:border-[#db860f] focus-visible:ring-1 focus-visible:ring-[#db860f]/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-sm font-semibold text-[#424851]">
              Issue Details <span className="text-[#db860f]">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Describe your issue or what help you need..."
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              required
              className="min-h-[100px] rounded-xl border-[#d4d8de] bg-[#f8f9fa] px-4 py-2.5 text-base text-[#22262d] placeholder:text-[#a9afb8] focus-visible:border-[#db860f] focus-visible:ring-1 focus-visible:ring-[#db860f]/30 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-full text-base font-semibold border-[#d4d8de] text-[#424851] hover:bg-gray-50 active:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-full bg-[#db860f] hover:bg-[#c1760d] text-white text-base font-semibold transition-all duration-200 shadow-sm disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Issue"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
