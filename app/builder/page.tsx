"use client";
import React, { useState } from 'react';
import { format, addDays } from "date-fns";
import { CalendarIcon, PlusIcon, TrashIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {cn} from '@/lib/utils';
const cityData = [
  {
    value: "new_york_city",
    label: "New York City",
    image: "/api/placeholder/400/300",
    description: "The city that never sleeps, with iconic landmarks and vibrant culture.",
    attractions: ["Central Park", "Empire Building", "Metropolitan Museum"],
    tours: ["Statue of Liberty", "NYC Sightseeing", "Food"],
    hotels: ["The Plaza", "Mandarin Oriental", "The Ritz-Carlton"],
  },
  {
    value: "paris",
    label: "Paris",
    image: "/api/placeholder/400/300",
    description: "The romantic city of lights, known for its art, fashion, and cuisine.",
    attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
    tours: ["Seine River", "Montmartre", "Cooking Class"],
    hotels: ["Hôtel Ritz", "Shangri-La Hotel", "Le Bristol Paris"],
  },
  {
    value: "tokyo",
    label: "Tokyo",
    image: "/api/placeholder/400/300",
    description: "A vibrant and futuristic city, blending ancient traditions and modern technology.",
    attractions: ["Imperial Palace", "Sensoji Temple", "Shibuya Crossing"],
    tours: ["Tsukiji Fish Market", "Samurai Experience", "Robot Restaurant"],
    hotels: ["The Ritz-Carlton", "Park Hyatt Tokyo", "Aman Tokyo"],
  },
];

export default function TripPlanner() {
  const [selectedDates, setSelectedDates] = useState([new Date()]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("attractions");
  const [selectedCity, setSelectedCity] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [schedule, setSchedule] = useState({});

  const handleDateSelect = (date) => {
    if (!selectedDates.some(d => d.toDateString() === date.toDateString())) {
      setSelectedDates([...selectedDates, date].sort((a, b) => a - b));
    }
    setSelectedDate(date);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setSchedule(prevSchedule => ({
      ...prevSchedule,
      [dateKey]: {
        ...prevSchedule[dateKey],
        [timeSlot]: [...(prevSchedule[dateKey]?.[timeSlot] || []), item]
      }
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteItem = (dateKey, timeSlot, index) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      newSchedule[dateKey][timeSlot].splice(index, 1);
      return newSchedule;
    });
  };

  const handleDeleteDate = (date) => {
    setSelectedDates(selectedDates.filter(d => d !== date));
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      delete newSchedule[format(date, 'yyyy-MM-dd')];
      return newSchedule;
    });
  };

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="flex h-screen w-full">
      <aside className="bg-background border-r px-4 py-6 flex flex-col gap-6 w-80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Calendar</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <nav className="flex flex-col gap-2">
          {selectedDates.map((date, index) => (
            <div key={index} className="flex items-center justify-between">
              <Button
                variant={date.toDateString() === selectedDate.toDateString() ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setSelectedDate(date)}
              >
                {`Day ${index + 1}`}
              </Button>
              <Button variant="ghost" className="p-1" onClick={() => handleDeleteDate(date)}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="ghost" 
            className="justify-start"
            onClick={() => handleDateSelect(addDays(selectedDates[selectedDates.length - 1], 1))}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Date
          </Button>
        </nav>
      </aside>
      <aside className="bg-background border-r px-4 py-6 flex flex-col gap-6 w-80">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{format(selectedDate, 'PPP')}</h1>
        </div>
        <div className="mt-6 grid gap-4">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex flex-col gap-2">
              <span className="font-semibold">{timeSlot}</span>
              <div
                className="border-2 border-dashed border-gray-300 p-2 rounded-md min-h-[100px]"
                onDrop={(e) => handleDrop(e, timeSlot)}
                onDragOver={handleDragOver}
              >
                {schedule[format(selectedDate, 'yyyy-MM-dd')]?.[timeSlot]?.map((item, index) => (
                  <div key={index} className="bg-gray-100 p-2 mb-2 rounded flex justify-between">
                    <span>{item.name}</span>
                    <Button variant="ghost" className="p-1" onClick={() => handleDeleteItem(format(selectedDate, 'yyyy-MM-dd'), timeSlot, index)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )) || "Drag and drop items here"}
              </div>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="option-select" className="block mb-2 font-semibold">
              Select an option:
            </label>
            <Select value={selectedOption} onValueChange={handleOptionChange}>
              <SelectTrigger className="w-full" id="option-select">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attractions">Attractions</SelectItem>
                <SelectItem value="tours">Tours</SelectItem>
                <SelectItem value="hotels">Hotels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="search-input" className="block mb-2 font-semibold">
              Search:
            </label>
            <Select value={selectedCity?.value || ""} onValueChange={(value) => handleCitySelect(cityData.find((city) => city.value === value))}>
              <SelectTrigger className="w-full" id="search-input">
                <SelectValue placeholder="Search for a city" />
              </SelectTrigger>
              <SelectContent>
                {cityData.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedCity && (
            <div className="border rounded-lg p-4 cursor-pointer">
              <img src={selectedCity.image} alt={selectedCity.label} className="w-full h-48 object-cover mb-4 rounded" />
              <h3 className="text-xl font-semibold mb-2">{selectedCity.label}</h3>
              <p className="text-sm text-gray-600 mb-4">{selectedCity.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCity[selectedOption].map((item, index) => (
                  <div
                    key={index}
                    className="relative h-40 rounded-lg overflow-hidden cursor-move"
                    style={{
                      backgroundImage: `url(${selectedCity.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, { type: selectedOption.slice(0, -1), name: item })}
                  >
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
