"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface IProps {
  Title: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
}

export function Calendar22({ Title, value, onChange, className }: IProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = value ?? undefined

  const handleSelect = (date: Date | undefined) => {
    if (onChange) onChange(date)
    setOpen(false)
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {selectedDate ? selectedDate.toLocaleDateString() : Title}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
