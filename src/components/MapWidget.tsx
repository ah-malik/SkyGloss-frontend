import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Building2, TrendingUp, Users, X, Loader2, Search } from "lucide-react";

// Custom marker icons
const createCustomIcon = (type: "headquarters" | "Partner" | "shop") => {
  const color = type === "headquarters" ? "#FFD700" : type === "shop" ? "#3B82F6" : "#A855F7";
  const shadowColor = type === "headquarters" ? "rgba(255, 215, 0, 0.4)" : type === "shop" ? "rgba(59, 130, 246, 0.4)" : "rgba(168, 85, 247, 0.4)";

  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      width: 20px;
      height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 15px ${shadowColor};
      position: relative;
    ">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid ${color};
        animation: pulse 2s infinite;
        top: 0px;
        left: 0px;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
    </style>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const createClusterIcon = (count: number) => {
  return L.divIcon({
    className: "custom-cluster-icon",
    html: `<div style="
      width: 32px;
      height: 32px;
      background: #0EA0DC;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(14, 160, 220, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 14px;
      position: relative;
      line-height: 26px;
    ">
      ${count}
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 4px solid #0EA0DC;
        animation: pulse 2s infinite;
        top: -3px;
        left: -3px;
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface Location {
  name: string;
  country: string;
  city?: string;
  lat: number;
  lng: number;
  type: "headquarters" | "Partner" | "shop";
  address?: string;
  role?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    website?: string;
  };
  stats: {
    shops: number;
    revenue: string;
    growth: string;
  };
}

interface GroupedLocation {
  country: string;
  locations: Location[];
  center: Location;
}

const headquarters: Location = {
  name: "Phoenix HQ",
  country: "USA",
  city: "Phoenix",
  lat: 33.4484,
  lng: -112.074,
  type: "headquarters",
  stats: {
    shops: 45,
    revenue: "$2.4M",
    growth: "24",
  },
  address: "2 E Camelback Rd, Phoenix, AZ 85012, USA",
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}


const API_BASE = (import.meta.env.VITE_API_URL || "https://skygloss-backend-production-3b96.up.railway.app").replace(/\/$/, "");

export default function MapWidget() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<GroupedLocation | null>(null);
  const [viewMode, setViewMode] = useState<"global" | "regional">("global");
  const [countryFilter, setCountryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([headquarters]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const mapCenter: [number, number] = viewMode === "global" ? [20, 0] : [37.0902, -95.7129];
  const mapZoom = viewMode === "global" ? 2 : 4;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log("Fetching map data from:", `${API_BASE}/public/map-locations`);
        const res = await fetch(`${API_BASE}/public/map-locations`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const responseData = await res.json();

        // Backend wraps response in { data, statusCode, message }
        const rawLocations = responseData.data || [];

        // Transform public data and filter out invalid coordinates
        const enrichedData = rawLocations
          .filter((user: any) =>
            user.lat != null &&
            user.lng != null &&
            !isNaN(Number(user.lat)) &&
            !isNaN(Number(user.lng))
          )
          .map((user: any) => ({
            ...user,
            stats: {
              shops: user.shops || Math.floor(Math.random() * 20) + 5,
              revenue: user.revenue || `$${(Math.random() * 500 + 100).toFixed(1)}k`,
              growth: (Math.random() * 15 + 5).toFixed(1)
            }
          }));

        setLocations([headquarters, ...enrichedData]);
      } catch (err) {
        console.error("Failed to fetch map locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);


  const currentLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesView = viewMode === "global" || loc.country === "USA";
      const matchesCountry = countryFilter === "All" || loc.country === countryFilter;
      const matchesSearch =
        !searchQuery ||
        loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        loc.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesView && matchesCountry && matchesSearch;
    });
  }, [locations, viewMode, countryFilter, searchQuery]);

  const availableCountries = useMemo(() => {
    const countries = new Set(locations.map((loc) => loc.country));
    return ["All", ...Array.from(countries)].sort();
  }, [locations]);

  const groupedLocations = useMemo(() => {
    const groups: Record<string, Location[]> = {};
    currentLocations.forEach((loc) => {
      if (!groups[loc.country]) groups[loc.country] = [];
      groups[loc.country].push(loc);
    });
    return Object.entries(groups).map(([country, locs]) => ({
      country,
      locations: locs,
      center: locs[0],
    }));
  }, [currentLocations]);

  return (
    <div className="w-full h-screen p-4 sm:p-8 bg-white overflow-y-auto">
      <div className="w-full space-y-8 max-w-[1600px] mx-auto">
        {/* View Mode Toggle */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
          <Button
            onClick={() => { setViewMode("global"); setCountryFilter("All"); }}
            className={`min-h-12 px-5 sm:px-8 rounded-xl transition-all duration-200 border-none ${viewMode === "global"
              ? "bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20"
              : "bg-[#272727] text-white hover:bg-[#272727]/90"
              }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            <span className="font-semibold">Global View</span>
          </Button>

          {/* Country Dropdown */}
          <div className="relative min-w-[200px] z-[1001]">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full min-h-12 px-5 bg-[#272727] text-white rounded-xl text-sm font-bold flex items-center justify-between hover:bg-[#272727]/90 transition-all border border-white/5 shadow-lg group"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0EA0DC]" />
                <span>{countryFilter === "All" ? "Select Country" : countryFilter}</span>
              </div>
              <motion.div animate={{ rotate: isDropdownOpen ? 180 : 0 }}>
                <X className={`w-4 h-4 transition-colors ${isDropdownOpen ? "text-[#0EA0DC]" : "text-gray-400 rotate-45"}`} />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 5 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full mt-2 bg-[#272727] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                    {availableCountries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setCountryFilter(country);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${countryFilter === country
                          ? "bg-[#0EA0DC] text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <span>{country}</span>
                        {countryFilter === country && <div className="w-2 h-2 rounded-full bg-white shadow-lg" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Map Section */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="
            hidden md:block
          lg:col-span-2">
            <Card className="p-0 rounded-2xl relative overflow-hidden bg-white border-2 border-[#0EA0DC]/10 shadow-xl" style={{ height: "600px" }}>
              {loading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                  <Loader2 className="w-10 h-10 text-[#0EA0DC] animate-spin" />
                </div>
              )}
              <MapContainer 
                center={mapCenter && !isNaN(mapCenter[0]) ? mapCenter : [20, 0]} 
                zoom={mapZoom || 2} 
                scrollWheelZoom={true} 
                className="w-full h-full" 
                zoomControl={false} 
                style={{ zIndex: 9 }}
              >
                <ChangeView center={mapCenter} zoom={mapZoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {groupedLocations.map((group, idx) => {
                  const lat = Number(group.center.lat);
                  const lng = Number(group.center.lng);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  
                  return (
                    <Marker
                      key={`${group.country}-${idx}`}
                      position={[lat, lng]}
                      icon={group.locations.length > 1 ? createClusterIcon(group.locations.length) : createCustomIcon(group.center.type)}
                      eventHandlers={{
                        click: () => {
                          if (group.locations.length > 1) setSelectedCountry(group);
                          else setSelectedLocation(group.locations[0]);
                        },
                      }}
                    />
                  );
                })}
              </MapContainer>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg z-[1000] border border-gray-100 hidden sm:block">
                <p className="text-xs text-[#666666] font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0EA0DC] animate-pulse"></span>
                  Global Network Live
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Feed Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#272727] uppercase">Network Locations</h3>
              <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-none font-bold">
                {currentLocations.length} Online
              </Badge>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search country or city..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#0EA0DC]/20 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {currentLocations.map((location, index) => (
                <Card
                  key={`${location.name}-${index}`}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedLocation?.name === location.name ? "border-[#0EA0DC] bg-[#0EA0DC]/5" : "border-transparent bg-white hover:shadow-md"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.type === "headquarters" ? "bg-yellow-100" : location.type === "shop" ? "bg-blue-50" : "bg-purple-50"}`}>
                        {location.type === "headquarters" ? <Building2 className="w-5 h-5 text-yellow-600" /> : <MapPin className={`w-5 h-5 ${location.type === "shop" ? "text-blue-600" : "text-purple-600"}`} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#272727]">{location.name}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">{location.country}</p>
                      </div>
                    </div>
                    <Badge className={location.type === "headquarters" ? "bg-yellow-100 text-yellow-700" : location.type === "shop" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                      {location.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-[10px] bg-gray-50 p-2 rounded-lg">
                    <div><span className="text-gray-400 font-bold">SHOPS: </span><span className="font-black">{location.stats.shops}</span></div>
                    <div><span className="text-gray-400 font-bold">REVENUE: </span><span className="font-black">{location.stats.revenue}</span></div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Multi-Location Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
            onClick={() => setSelectedCountry(null)}
          >
            <Card className="w-full max-w-xl p-6 rounded-[2.5rem] bg-white relative" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">{selectedCountry.country} Locations</h3>
                <button onClick={() => setSelectedCountry(null)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedCountry.locations.map((loc, idx) => (
                  <div key={idx} onClick={() => { setSelectedLocation(loc); setSelectedCountry(null); }} className="p-4 bg-gray-50 hover:bg-[#0EA0DC]/5 rounded-2xl cursor-pointer flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${loc.type === "headquarters" ? "bg-yellow-100" : "bg-blue-100"}`}>
                        {loc.type === "headquarters" ? <Building2 className="w-6 h-6 text-yellow-600" /> : <MapPin className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div><p className="font-bold">{loc.name}</p><p className="text-xs text-gray-500">{loc.city}</p></div>
                    </div>
                    <Badge className="bg-white text-gray-400">View</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <Card className="p-10 rounded-[2.5rem] bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA0DC]/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>
                <button onClick={() => setSelectedLocation(null)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full z-10"><X className="w-5 h-5" /></button>

                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${selectedLocation.type === "headquarters" ? "from-yellow-400 to-orange-500" : "from-blue-400 to-blue-600"}`}>
                    {selectedLocation.type === "headquarters" ? <Building2 className="w-8 h-8 text-white" /> : <MapPin className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{selectedLocation.name}</h2>
                    <p className="text-gray-500 font-semibold">{selectedLocation.country} · {selectedLocation.type.toUpperCase()}</p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="font-semibold">{selectedLocation.address}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-3xl bg-gray-50 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Shops</span>
                    <p className="text-xl font-black">{selectedLocation.stats.shops}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-gray-50 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Revenue</span>
                    <p className="text-xl font-black">{selectedLocation.stats.revenue}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-gray-50 text-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Growth</span>
                    <p className="text-xl font-black text-green-600">+{selectedLocation.stats.growth}%</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-black hover:bg-black/80 text-white py-6 rounded-2xl font-black">Contact Center</Button>
                  <Button variant="outline" onClick={() => setSelectedLocation(null)} className="flex-1 border-gray-200 py-6 rounded-2xl font-black">Close</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

