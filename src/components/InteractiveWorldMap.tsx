import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Building2, TrendingUp, Users, X, Map as MapIcon, Loader2, Search } from "lucide-react";
import api from "../api/axios";
import MapWidget from "./MapWidget";

// Custom marker icons
const createCustomIcon = (type: "headquarters" | "Partner" | "retail" | "shop") => {
  // Partners: Purple, Shops: Blue, HQ: Gold
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
  state?: string;
  lat: number;
  lng: number;
  type: "headquarters" | "Partner" | "retail" | "shop";
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
  lng: -112.0740,
  type: "headquarters",
  stats: {
    shops: 45,
    revenue: "$2.4M",
    growth: "24"
  },
  address: "2 E Camelback Rd, Phoenix, AZ 85012, USA"
};

// Map view controller component
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export function InteractiveWorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<GroupedLocation | null>(null);
  const [viewMode, setViewMode] = useState<"global" | "regional">("global");
  const [countryFilter, setCountryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState<Location[]>([headquarters]);
  const [loading, setLoading] = useState(true);

  const mapCenter: [number, number] = viewMode === "global" ? [20, 0] : [37.0902, -95.7129];
  const mapZoom = viewMode === "global" ? 2 : 4;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/users");
        const allUsers = res.data;

        const mapLocations = allUsers
          .filter((user: any) => {
            const hasCoords = user.latitude != null && user.longitude != null;
            const isPartner = ["master_partner", "regional_partner", "partner"].includes(user.role);
            // Shop only shows on map if ACTIVE + CERTIFIED
            const isActiveShop = user.role === "certified_shop" && user.isCertified === true && user.status === "active";

            return hasCoords && (isPartner || isActiveShop);
          })
          .map((user: any) => ({
            name: user.companyName || user.shopName || `${user.firstName} ${user.lastName}`,
            country: user.country || "Unknown",
            city: user.city || "",
            lat: user.latitude,
            lng: user.longitude,
            type: ["master_partner", "regional_partner", "partner"].includes(user.role) ? "Partner" : "shop",
            role: user.role,
            address: user.address || "",
            socials: {
              facebook: user.facebook,
              instagram: user.instagram,
              linkedin: user.linkedin,
              youtube: user.youtube,
              tiktok: user.tiktok,
              website: user.website,
            },
            stats: {
              shops: user.shops || Math.floor(Math.random() * 20) + 5,
              revenue: user.revenue || `$${(Math.random() * 500 + 100).toFixed(1)}k`,
              growth: (Math.random() * 15 + 5).toFixed(1)
            }
          }));
        setLocations([headquarters, ...mapLocations]);
      } catch (err) {
        console.error("Failed to fetch locations for map:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const currentLocations = locations.filter(loc => {
    const matchesView = viewMode === "global" || loc.country === "USA";
    const matchesCountry = countryFilter === "All" || loc.country === countryFilter;
    const matchesSearch = !searchQuery ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesView && matchesCountry && matchesSearch;
  });

  const availableCountries = useMemo(() => {
    const countries = new Set(locations.map(loc => loc.country));
    return ["All", ...Array.from(countries)].sort();
  }, [locations]);

  // Group locations by country
  const groupedLocations = useMemo(() => {
    const groups: Record<string, Location[]> = {};
    currentLocations.forEach(loc => {
      if (!groups[loc.country]) groups[loc.country] = [];
      groups[loc.country].push(loc);
    });
    return Object.entries(groups).map(([country, locs]) => ({
      country,
      locations: locs,
      center: locs[0] // Use the first location's coordinates as the center for the country
    }));
  }, [currentLocations]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (

    <div className="w-full space-y-8">
      <MapWidget />
      {/* View Mode Toggle - Integrated Style */}
      <div className="hidden flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-4">
        <Button
          onClick={() => { setViewMode("global"); setCountryFilter("All"); }}
          className={`px-4 min-h-12 px-5 py-2.5 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 border-none ${viewMode === "global"
            ? "bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20"
            : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
        >
          <Globe className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base font-semibold">Global View</span>
        </Button>
        {/* <Button
          onClick={() => { setViewMode("regional"); setCountryFilter("USA"); }}
          className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 border-none ${viewMode === "regional"
            ? "bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20"
            : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
        >
          <MapIcon className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base font-semibold">USA Regional</span>
        </Button> */}

        {/* Premium Country Filter Dropdown */}
        <div className="relative min-w-[200px] z-[1001]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full min-h-12 px-5 py-2.5 bg-[#272727] text-white rounded-xl text-sm font-bold flex items-center justify-between hover:bg-[#272727]/90 transition-all border border-white/5 shadow-lg group"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0EA0DC]" />
              <span>{countryFilter === "All" ? "Select Country" : countryFilter}</span>
            </div>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className={`w-4 h-4 transition-colors ${isDropdownOpen ? "text-[#0EA0DC]" : "text-gray-400 rotate-45"}`} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 5, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
                      {countryFilter === country && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Real World Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2"
        >
          <Card className="skygloss-card p-0 rounded-2xl relative overflow-hidden bg-white border-2 border-[#0EA0DC]/10 shadow-xl" style={{ height: "600px" }}>
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                <Loader2 className="w-10 h-10 text-[#0EA0DC] animate-spin" />
              </div>
            )}

            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              scrollWheelZoom={false}
              className="w-full h-full"
              zoomControl={false}
              style={{ zIndex: 9 }}
            >
              <ChangeView center={mapCenter} zoom={mapZoom} />

              {/* Premium CartoDB Positron Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {groupedLocations.map((group: GroupedLocation, idx: number) => (
                <Marker
                  key={`${group.country}-${idx}`}
                  position={[group.center.lat, group.center.lng]}
                  icon={group.locations.length > 1 ? createClusterIcon(group.locations.length) : createCustomIcon(group.center.type)}
                  eventHandlers={{
                    click: () => {
                      if (group.locations.length > 1) {
                        setSelectedCountry(group);
                      } else {
                        setSelectedLocation(group.locations[0]);
                      }
                    },
                  }}
                />
              ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-lg z-[1000] border border-gray-100 hidden sm:block">
              <p className="text-xs text-[#666666] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0EA0DC]"></span>
                Global Network Live
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Location Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black text-[#272727] uppercase tracking-tight">
              {viewMode === "global" ? "Find a Shop" : "USA Hubs"}
            </h3>
            <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-none font-bold">
              {currentLocations.length} Online
            </Badge>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search country or city..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA0DC]/20 transition-all font-medium text-[#272727]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="!max-h-[520px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {currentLocations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => setSelectedLocation(location)}
                  className={`skygloss-card p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${selectedLocation?.name === location.name
                    ? "border-[#0EA0DC] bg-[#0EA0DC]/5"
                    : "border-transparent bg-white hover:border-gray-200 hover:shadow-md"
                    } shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.type === "headquarters" ? "bg-yellow-100" : location.type === "shop" ? "bg-blue-50" : "bg-purple-50"
                        }`}>
                        {location.type === "headquarters" ? (
                          <Building2 className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <MapPin className={`w-5 h-5 ${location.type === "shop" ? "text-blue-600" : "text-purple-600"}`} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#272727] truncate max-w-[120px]">
                          {location.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">{location.country}</p>
                      </div>
                    </div>
                    <Badge className={
                      location.type === "headquarters"
                        ? "bg-yellow-100 text-yellow-700 border-none text-[8px]"
                        : location.type === "shop"
                          ? "bg-blue-100 text-blue-700 border-none text-[8px]"
                          : "bg-purple-100 text-purple-700 border-none text-[8px]"
                    }>
                      {location.type === "headquarters" ? "HQ" : location.type === "shop" ? "SHOP" : "PARTNER"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-[10px] bg-gray-50 p-2 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-gray-400 font-bold">SHOPS</span>
                      <span className="text-[#272727] font-black">{location.stats.shops}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-gray-400 font-bold">REVENUE</span>
                      <span className="text-[#272727] font-black">{location.stats.revenue}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Partner Selection Modal (For grouped countries) */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl"
            >
              <Card className="skygloss-card p-6 rounded-[2.5rem] bg-white border-none shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-[#272727]">{selectedCountry.country} Partners</h3>
                    <p className="text-sm text-gray-500 font-medium">Multiple partners found in this region</p>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedCountry.locations.map((loc: Location, idx: number) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setSelectedCountry(null);
                      }}
                      className="p-4 bg-gray-50 hover:bg-[#0EA0DC]/5 border border-gray-100 hover:border-[#0EA0DC]/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${loc.type === "headquarters" ? "bg-yellow-100" : loc.type === "shop" ? "bg-blue-100 group-hover:bg-blue-600 group-hover:text-white" : "bg-purple-100 group-hover:bg-purple-600 group-hover:text-white"}`}>
                          {loc.type === "headquarters" ? (
                            <Building2 className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <MapPin className={`w-6 h-6 ${loc.type === "shop" ? "text-blue-600" : "text-purple-600"} group-hover:text-white`} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[#272727]">{loc.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{loc.address || "Live Partner"}</p>
                        </div>
                      </div>
                      <Badge className="bg-white text-gray-400 border border-gray-100 font-bold group-hover:bg-[#0EA0DC] group-hover:text-white group-hover:border-transparent transition-all">
                        View
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Detail Modal - Restored */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
            style={{ zIndex: 9999 }}
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="skygloss-card p-6 sm:p-10 rounded-[2.5rem] bg-white border-none shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0EA0DC]/5 rounded-bl-[5rem] -mr-10 -mt-10"></div>

                <button
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-6  right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedLocation.type === "headquarters"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : selectedLocation.type === "shop"
                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                      : "bg-gradient-to-br from-purple-400 to-purple-600"
                    }`}>
                    {selectedLocation.type === "headquarters" ? (
                      <Building2 className="w-8 h-8 text-white" />
                    ) : (
                      <MapPin className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black text-[#272727]">{selectedLocation.name}</h2>
                      <Badge className="bg-green-100 text-green-700 border-none font-bold">Active</Badge>
                    </div>
                    <p className="text-gray-500 font-semibold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {selectedLocation.country} · {selectedLocation.type === "shop" ? "Certified Shop" : "Partner Portal Live"}
                    </p>
                  </div>
                </div>

                {/* Social Media Icons */}
                {selectedLocation.socials && Object.values(selectedLocation.socials).some(v => v) && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {selectedLocation.socials.website && (
                      <a href={selectedLocation.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-[#0EA0DC]/10 rounded-xl transition-all">
                        <Globe className="w-5 h-5 text-gray-600 hover:text-[#0EA0DC]" />
                      </a>
                    )}
                    {selectedLocation.socials.facebook && (
                      <a href={selectedLocation.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-blue-100 rounded-xl transition-all">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                      </a>
                    )}
                    {selectedLocation.socials.instagram && (
                      <a href={selectedLocation.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-pink-100 rounded-xl transition-all">
                        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </a>
                    )}
                    {selectedLocation.socials.linkedin && (
                      <a href={selectedLocation.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-blue-50 rounded-xl transition-all">
                        <svg className="w-5 h-5 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                    )}
                    {selectedLocation.socials.youtube && (
                      <a href={selectedLocation.socials.youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-red-100 rounded-xl transition-all">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                      </a>
                    )}
                    {selectedLocation.socials.tiktok && (
                      <a href={selectedLocation.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-black hover:bg-black/50 rounded-xl transition-all">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21,7V9a1,1,0,0,1-1,1,8,8,0,0,1-4-1.08V15.5A6.5,6.5,0,1,1,6.53,9.72a1,1,0,0,1,1.47.9v2.52a.92.92,0,0,1-.28.62,2.49,2.49,0,0,0,2,4.23A2.61,2.61,0,0,0,12,15.35V3a1,1,0,0,1,1-1h2.11a1,1,0,0,1,1,.83A4,4,0,0,0,20,6,1,1,0,0,1,21,7Z"></path></svg>
                      </a>
                    )}
                  </div>
                )}

                {selectedLocation.address && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 text-sm">
                    <p className="font-bold mb-1 text-xs uppercase text-gray-400 tracking-wider">Address</p>
                    <p className="font-semibold text-[#272727]">{selectedLocation.address}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Building2 className="w-3 h-3 text-[#0EA0DC]" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedLocation.type === "shop" ? "Rating" : "Shops"}</span>
                    </div>
                    <p className="text-xl font-black text-[#272727]">{selectedLocation.type === "shop" ? "5.0" : selectedLocation.stats.shops}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{selectedLocation.type === "shop" ? "Jobs" : "Revenue"}</span>
                    </div>
                    <p className="text-xl font-black text-[#272727]">{selectedLocation.type === "shop" ? "120+" : selectedLocation.stats.revenue}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Users className="w-3 h-3 text-blue-600" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Growth</span>
                    </div>

                    <p className="text-xl font-black text-green-600">+{selectedLocation.stats.growth}%</p>
                  </div>
                </div>



                <div className="space-y-4">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      className={`h-full bg-gradient-to-r ${selectedLocation.type === "shop" ? "from-blue-400 to-blue-600" : "from-purple-400 to-purple-600"}`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button className={`flex-1 ${selectedLocation.type === "shop" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} text-white py-6 rounded-2xl font-black shadow-xl`}>
                      {selectedLocation.type === "shop" ? "View Shop Profile" : "View Regional Analytics"}
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-200 py-6 rounded-2xl font-black text-white hover:text-white  bg-black hover:bg-black/80 transition-colors">
                      Contact Center
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
