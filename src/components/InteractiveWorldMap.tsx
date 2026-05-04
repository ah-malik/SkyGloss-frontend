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

// Custom marker icons
const createCustomIcon = (type: "headquarters" | "Partner" | "retail" | "shop") => {
  const color = type === "headquarters" ? "#FFD700" : type === "shop" ? "#22c55e" : "#0EA0DC";
  const shadowColor = type === "headquarters" ? "rgba(255, 215, 0, 0.4)" : type === "shop" ? "rgba(34, 197, 94, 0.4)" : "rgba(14, 160, 220, 0.4)";

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
      items-center;
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
            const isPartner = user.role === "master_partner" || user.role === "regional_partner" || user.role === "partner";
            const isShopOnMap = user.role === "certified_shop" && user.isVisibleOnMap === true;

            return hasCoords && (isPartner || isShopOnMap);
          })
          .map((user: any) => ({
            name: user.companyName || `${user.firstName} ${user.lastName}`,
            country: user.country || "Unknown",
            city: user.city || "",
            lat: user.latitude,
            lng: user.longitude,
            type: user.role === "master_partner" ? "Partner" : user.role === "certified_shop" ? "shop" : "retail",
            address: user.address || "",
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
    const matchesSearch = !searchQuery ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.city && loc.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesView && matchesSearch;
  });

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

  return (
    <div className="w-full space-y-8">
      {/* View Mode Toggle - Integrated Style */}
      <div className="flex justify-center gap-2 sm:gap-4 px-4">
        <Button
          onClick={() => setViewMode("global")}
          className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 border-none ${viewMode === "global"
            ? "bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20"
            : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
        >
          <Globe className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base font-semibold">Global View</span>
        </Button>
        <Button
          onClick={() => setViewMode("regional")}
          className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 border-none ${viewMode === "regional"
            ? "bg-[#0EA0DC] text-white shadow-lg shadow-[#0EA0DC]/20"
            : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
        >
          <MapIcon className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base font-semibold">USA Regional</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.type === "headquarters" ? "bg-yellow-100" : location.type === "shop" ? "bg-green-50" : "bg-blue-50"
                        }`}>
                        {location.type === "headquarters" ? (
                          <Building2 className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <MapPin className={`w-5 h-5 ${location.type === "shop" ? "text-green-600" : "text-[#0EA0DC]"}`} />
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
                          ? "bg-green-100 text-green-700 border-none text-[8px]"
                          : "bg-blue-100 text-blue-700 border-none text-[8px]"
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
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${loc.type === "headquarters" ? "bg-yellow-100" : loc.type === "shop" ? "bg-green-100 group-hover:bg-green-600 group-hover:text-white" : "bg-blue-100 group-hover:bg-[#0EA0DC] group-hover:text-white"}`}>
                          {loc.type === "headquarters" ? (
                            <Building2 className="w-6 h-6 text-yellow-600" />
                          ) : (
                            <MapPin className={`w-6 h-6 ${loc.type === "shop" ? "text-green-600" : "text-[#0EA0DC]"} group-hover:text-white`} />
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

                <div className="flex items-center gap-6 ">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${selectedLocation.type === "headquarters"
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : selectedLocation.type === "shop"
                      ? "bg-gradient-to-br from-green-400 to-green-600"
                      : "bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3]"
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
                      className={`h-full bg-gradient-to-r ${selectedLocation.type === "shop" ? "from-green-400 to-green-600" : "from-[#0EA0DC] to-blue-600"}`}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button className={`flex-1 ${selectedLocation.type === "shop" ? "bg-green-600 hover:bg-green-700" : "bg-[#0EA0DC] hover:bg-[#272727]"} text-white py-6 rounded-2xl font-black shadow-xl`}>
                      {selectedLocation.type === "shop" ? "View Shop Profile" : "View Regional Analytics"}
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-200 py-6 rounded-2xl font-black text-white">
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
