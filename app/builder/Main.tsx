"use client"

import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function Main() {
  const [selectedOption, setSelectedOption] = useState("attractions")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [cityData, setCityData] = useState([
    {
      name: "New York City",
      image: "/placeholder.svg",
      description: "The city that never sleeps, with iconic landmarks and vibrant culture.",
      attractions: ["Central Park", "Empire State Building", "Metropolitan Museum of Art"],
      tours: ["Statue of Liberty Tour", "NYC Sightseeing Tour", "Food Tour"],
      hotels: ["The Plaza", "Mandarin Oriental", "The Ritz-Carlton"],
    },
    {
      name: "Paris",
      image: "/placeholder.svg",
      description: "The romantic city of lights, known for its art, fashion, and cuisine.",
      attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral"],
      tours: ["Seine River Cruise", "Montmartre Walking Tour", "Cooking Class"],
      hotels: ["Hôtel Ritz", "Shangri-La Hotel", "Le Bristol Paris"],
    },
    {
      name: "Tokyo",
      image: "/placeholder.svg",
      description: "A vibrant and futuristic city, blending ancient traditions and modern technology.",
      attractions: ["Imperial Palace", "Sensoji Temple", "Shibuya Crossing"],
      tours: ["Tsukiji Fish Market Tour", "Samurai Experience", "Robot Restaurant"],
      hotels: ["The Ritz-Carlton", "Park Hyatt Tokyo", "Aman Tokyo"],
    },
  ])
  const handleOptionChange = (option) => {
    setSelectedOption(option)
  }
  const handleSearch = (query) => {
    setSearchQuery(query)
  }
  const handleCitySelect = (city) => {
    setSelectedCity(city)
  }
  const filteredCities = cityData.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="option-select" className="block mb-2 font-semibold">
            Select an option:
          </label>
          <Select id="option-select" value={selectedOption} onValueChange={handleOptionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attractions">Attractions</SelectItem>
              <SelectItem value="tours">Tours</SelectItem>
              <SelectItem value="hotels">Hotels</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-4">
            <label htmlFor="location-input" className="block mb-2 font-semibold">
              Location:
            </label>
            <Input
              id="location-input"
              type="text"
              placeholder="Enter a location"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="search-input" className="block mb-2 font-semibold">
            Search:
          </label>
          <Select
            id="search-input"
            value={selectedCity?.name || ""}
            onValueChange={(value) => handleCitySelect(cityData.find((city) => city.name === value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Search for a city" />
            </SelectTrigger>
            <SelectContent>
              {filteredCities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {selectedCity && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">{selectedCity.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedOption === "attractions" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Attractions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCity.attractions.map((attraction, index) => (
                    <div
                      key={index}
                      className="relative h-40 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${selectedCity.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">{attraction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedOption === "tours" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Tours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCity.tours.map((tour, index) => (
                    <div
                      key={index}
                      className="relative h-40 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${selectedCity.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">{tour}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedOption === "hotels" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Hotels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCity.hotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="relative h-40 rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${selectedCity.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">{hotel}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}