import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import Link from "next/link"
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons"
export default function DateSidebar() {
    return (
        <aside className="bg-background border-r px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">April 15, 2023</h1>
        </div>
        <div className="mt-6 grid gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Morning Meeting</span>
            </div>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Lunch with Team</span>
            </div>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Design Review</span>
            </div>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Yoga Class</span>
            </div>
            <Button variant="ghost" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    )
}