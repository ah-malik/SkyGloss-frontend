import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Building2, TrendingUp, Users, X, Map as MapIcon, Loader2 } from "lucide-react";
import api from "../api/axios";

// Custom marker icons
const createCustomIcon = (type: "headquarters" | "distributor" | "retail") => {
  const color = type === "headquarters" ? "#FFD700" : "#0EA0DC";
  const shadowColor = type === "headquarters" ? "rgba(255, 215, 0, 0.4)" : "rgba(14, 160, 220, 0.4)";

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

interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
  type: "headquarters" | "distributor" | "retail";
  address?: string;
  stats: {
    shops: number;
    revenue: string;
    growth: string;
  };
}

const headquarters: Location = {
  name: "Phoenix HQ",
  country: "USA",
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
  const [viewMode, setViewMode] = useState<"global" | "regional">("global");
  const [locations, setLocations] = useState<Location[]>([headquarters]);
  const [loading, setLoading] = useState(true);

  const mapCenter: [number, number] = viewMode === "global" ? [20, 0] : [37.0902, -95.7129];
  const mapZoom = viewMode === "global" ? 2 : 4;

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const res = await api.get("/users");
        const distributors = res.data
          .filter((user: any) =>
            (user.role === "master_distributor" || user.role === "regional_distributor") &&
            user.latitude != null && user.longitude != null
          )
          .map((user: any) => ({
            name: user.companyName || `${user.firstName} ${user.lastName}`,
            country: user.country || "Unknown",
            lat: user.latitude,
            lng: user.longitude,
            type: user.role === "master_distributor" ? "distributor" : "retail",
            address: user.address || "",
            stats: {
              shops: user.shops || Math.floor(Math.random() * 20) + 5,
              revenue: user.revenue || `$${(Math.random() * 500 + 100).toFixed(1)}k`,
              growth: (Math.random() * 15 + 5).toFixed(1)
            }
          }));
        setLocations([headquarters, ...distributors]);
      } catch (err) {
        console.error("Failed to fetch distributors for map:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);

  const currentLocations = locations.filter(loc => {
    if (viewMode === "global") return true;
    return loc.country === "USA";
  });

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

              {currentLocations.map((location, idx) => (
                <Marker
                  key={`${location.name}-${idx}`}
                  position={[location.lat, location.lng]}
                  icon={createCustomIcon(location.type)}
                  eventHandlers={{
                    click: () => setSelectedLocation(location),
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
              {viewMode === "global" ? "Direct Network" : "USA Hubs"}
            </h3>
            <Badge className="bg-[#0EA0DC]/10 text-[#0EA0DC] border-none font-bold">
              {currentLocations.length} Online
            </Badge>
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${location.type === "headquarters" ? "bg-yellow-100" : "bg-blue-50"
                        }`}>
                        {location.type === "headquarters" ? (
                          <Building2 className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <MapPin className="w-5 h-5 text-[#0EA0DC]" />
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
                        : "bg-blue-100 text-blue-700 border-none text-[8px]"
                    }>
                      {location.type === "headquarters" ? "HQ" : "PARTNER"}
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
                      {selectedLocation.country} · Partner Portal Live
                    </p>
                  </div>
                </div>
                {selectedLocation.address && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 text-sm">
                    <p className="font-bold mb-1 text-xs uppercase text-gray-400 tracking-wider">Distributor Address</p>
                    <p className="font-semibold text-[#272727]">{selectedLocation.address}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Building2 className="w-3 h-3 text-[#0EA0DC]" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Shops</span>
                    </div>
                    <p className="text-xl font-black text-[#272727]">{selectedLocation.stats.shops}</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue</span>
                    </div>
                    <p className="text-xl font-black text-[#272727]">{selectedLocation.stats.revenue}</p>
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
                      className="h-full bg-gradient-to-r from-[#0EA0DC] to-blue-600"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button className="flex-1 bg-[#0EA0DC] hover:bg-[#272727] text-white py-6 rounded-2xl font-black shadow-xl shadow-blue-500/20">
                      View Regional Analytics
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
