"use client"
import React, { useState, useEffect } from 'react';
import { format, addDays } from "date-fns";
import { CalendarIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TripPlanner() {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tripDays, setTripDays] = useState(1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [cityData] = useState([
    { name: "New York City", attractions: ["Central Park", "Empire State Building", "Metropolitan Museum of Art"], tours: ["Statue of Liberty Tour", "NYC Sightseeing Tour", "Food Tour"], hotels: ["The Plaza", "Mandarin Oriental", "The Ritz-Carlton"] },
    { name: "Paris", attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"], tours: ["Seine River Cruise", "Montmartre Walking Tour", "Cooking Class"], hotels: ["Hôtel Ritz", "Shangri-La Hotel", "Le Bristol Paris"] },
    { name: "Tokyo", attractions: ["Imperial Palace", "Sensoji Temple", "Shibuya Crossing"], tours: ["Tsukiji Fish Market Tour", "Samurai Experience", "Robot Restaurant"], hotels: ["The Ritz-Carlton", "Park Hyatt Tokyo", "Aman Tokyo"] },
  ]);

  useEffect(() => {
    setSelectedDate(startDate);
  }, [startDate]);

  const handleStartDateSelect = (date) => {
    setStartDate(date);
    setSelectedDate(date);
  };

  const handleDaySelect = (day) => {
    setSelectedDate(addDays(startDate, day - 1));
  };

  const addDay = () => {
    setTripDays(prevDays => prevDays + 1);
  };

  const removeDay = (dayToRemove) => {
    if (tripDays > 1) {
      setTripDays(prevDays => prevDays - 1);
      setSchedule(prevSchedule => {
        const newSchedule = { ...prevSchedule };
        delete newSchedule[format(addDays(startDate, dayToRemove - 1), 'yyyy-MM-dd')];
        return newSchedule;
      });
    }
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData("application/json"));
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      setSchedule(prevSchedule => ({
        ...prevSchedule,
        [dateKey]: {
          ...prevSchedule[dateKey],
          [timeSlot]: [...(prevSchedule[dateKey]?.[timeSlot] || []), item]
        }
      }));
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeScheduleItem = (timeSlot, index) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      newSchedule[dateKey][timeSlot] = newSchedule[dateKey][timeSlot].filter((_, i) => i !== index);
      return newSchedule;
    });
  };

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <aside className="bg-white shadow-md px-4 py-6 flex flex-col gap-6 w-80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trip Start Date</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="flex flex-col gap-2">
            {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => (
              <div key={day} className="flex items-center justify-between">
                <Button
                  variant={addDays(startDate, day - 1).toDateString() === selectedDate.toDateString() ? "default" : "ghost"}
                  className="justify-between flex-grow"
                  onClick={() => handleDaySelect(day)}
                >
                  <span>
                    Day {day}
                  </span>
                  {day !== 1 && (
                    <TrashIcon
                      className="h-4 w-4 ml-2 text-red-500 hover:text-red-700 flex-end"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDay(day);
                      }}
                    />
                  )}
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={addDay}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Day
            </Button>
          </nav>
        </ScrollArea>
      </aside>
      <aside className="bg-white shadow-md px-4 py-6 flex flex-col gap-6 w-80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Day {Math.floor((selectedDate - startDate) / (1000 * 60 * 60 * 24)) + 1}</h1>
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
                  {schedule[format(selectedDate, 'yyyy-MM-dd')]?.[timeSlot]?.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-2 mb-2 rounded flex justify-between items-center">
                      <span>{item.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeScheduleItem(timeSlot, index)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )) || "Drag and drop items here"}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <div className="flex-1 p-6 overflow-auto bg-white shadow-md m-6 rounded-lg">
        <div className="mb-6 space-y-4">
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attractions">Attractions</SelectItem>
              <SelectItem value="tours">Tours</SelectItem>
              <SelectItem value="hotels">Hotels</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSelectedCity(cityData.find(city => city.name === value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cityData.map(city => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedCity && selectedCategory && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 capitalize">{selectedCategory}</h3>
              {selectedCity[selectedCategory].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 mb-2 rounded cursor-move hover:bg-gray-200 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: selectedCategory, name: item })}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}