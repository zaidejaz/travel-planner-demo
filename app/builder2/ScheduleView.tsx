import React from 'react';
import { format, differenceInDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Schedule, ScheduleItem } from './types';

interface ScheduleViewProps {
  selectedDate: Date;
  startDate: Date;
  schedule: Schedule;
  updateSchedule: (newSchedule: Schedule) => void;
}

export default function ScheduleView({ selectedDate, startDate, schedule, updateSchedule }: ScheduleViewProps) {
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, timeSlot: string) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json")) as ScheduleItem;
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const existingItems = schedule[dateKey]?.[timeSlot] || [];
      if (!existingItems.some(existingItem => existingItem.name === item.name)) {
        updateSchedule({
          ...schedule,
          [dateKey]: {
            ...schedule[dateKey],
            [timeSlot]: [...existingItems, item]
          }
        });
      }
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeScheduleItem = (timeSlot: string, index: number) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newSchedule = { ...schedule };
    newSchedule[dateKey][timeSlot] = newSchedule[dateKey][timeSlot].filter((_, i) => i !== index);
    updateSchedule(newSchedule);
  };

  return (
    <aside className="bg-white shadow-md px-4 py-6 flex flex-col gap-6 w-96">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Day {differenceInDays(selectedDate, startDate) + 1}</h1>
      </div>
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="grid gap-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex flex-col gap-2">
              <span className="font-semibold">{timeSlot}</span>
              <div
                className="border-2 border-dashed border-gray-300 p-2 rounded-md min-h-[120px]"
                onDrop={(e) => handleDrop(e, timeSlot)}
                onDragOver={handleDragOver}
              >
                {schedule[format(selectedDate, 'yyyy-MM-dd')]?.[timeSlot]?.length > 0 ? (
                  schedule[format(selectedDate, 'yyyy-MM-dd')][timeSlot].map((item, index) => (
                    <div key={index} className="relative mb-2 rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-between p-2">
                        <span className="text-white text-shadow">{item.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeScheduleItem(timeSlot, index)}>
                          <TrashIcon className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400">Drag and drop items here</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}