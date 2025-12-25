import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Globe, MapPin, Building2, TrendingUp, Users, X, Map } from "lucide-react";

interface Location {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
  type: "headquarters" | "distributor" | "retail";
  stats: {
    shops: number;
    revenue: string;
    growth: string;
  };
}

const globalLocations: Location[] = [
  {
    name: "Phoenix HQ",
    country: "USA",
    lat: 33.4484,
    lng: -112.0740,
    type: "headquarters",
    stats: {
      shops: 45,
      revenue: "$2.4M",
      growth: "+24%"
    }
  },
  {
    name: "Madrid",
    country: "Spain",
    lat: 40.4168,
    lng: -3.7038,
    type: "distributor",
    stats: {
      shops: 28,
      revenue: "$890K",
      growth: "+18%"
    }
  },
  {
    name: "São Paulo",
    country: "Brazil",
    lat: -23.5505,
    lng: -46.6333,
    type: "distributor",
    stats: {
      shops: 34,
      revenue: "$1.2M",
      growth: "+32%"
    }
  },
  {
    name: "Mumbai",
    country: "India",
    lat: 19.0760,
    lng: 72.8777,
    type: "distributor",
    stats: {
      shops: 52,
      revenue: "$1.8M",
      growth: "+45%"
    }
  }
];

const usLocations: Location[] = [
  {
    name: "Phoenix",
    country: "USA",
    state: "Arizona",
    lat: 33.4484,
    lng: -112.0740,
    type: "headquarters",
    stats: {
      shops: 45,
      revenue: "$2.4M",
      growth: "+24%"
    }
  },
  {
    name: "Los Angeles",
    country: "USA",
    state: "California",
    lat: 34.0522,
    lng: -118.2437,
    type: "retail",
    stats: {
      shops: 38,
      revenue: "$1.8M",
      growth: "+28%"
    }
  },
  {
    name: "San Francisco",
    country: "USA",
    state: "California",
    lat: 37.7749,
    lng: -122.4194,
    type: "retail",
    stats: {
      shops: 22,
      revenue: "$1.2M",
      growth: "+21%"
    }
  },
  {
    name: "Seattle",
    country: "USA",
    state: "Washington",
    lat: 47.6062,
    lng: -122.3321,
    type: "retail",
    stats: {
      shops: 18,
      revenue: "$950K",
      growth: "+19%"
    }
  },
  {
    name: "Denver",
    country: "USA",
    state: "Colorado",
    lat: 39.7392,
    lng: -104.9903,
    type: "retail",
    stats: {
      shops: 15,
      revenue: "$780K",
      growth: "+16%"
    }
  },
  {
    name: "Dallas",
    country: "USA",
    state: "Texas",
    lat: 32.7767,
    lng: -96.7970,
    type: "retail",
    stats: {
      shops: 31,
      revenue: "$1.5M",
      growth: "+25%"
    }
  },
  {
    name: "Houston",
    country: "USA",
    state: "Texas",
    lat: 29.7604,
    lng: -95.3698,
    type: "retail",
    stats: {
      shops: 27,
      revenue: "$1.3M",
      growth: "+22%"
    }
  },
  {
    name: "Chicago",
    country: "USA",
    state: "Illinois",
    lat: 41.8781,
    lng: -87.6298,
    type: "retail",
    stats: {
      shops: 35,
      revenue: "$1.7M",
      growth: "+20%"
    }
  },
  {
    name: "New York",
    country: "USA",
    state: "New York",
    lat: 40.7128,
    lng: -74.0060,
    type: "retail",
    stats: {
      shops: 52,
      revenue: "$2.8M",
      growth: "+30%"
    }
  },
  {
    name: "Miami",
    country: "USA",
    state: "Florida",
    lat: 25.7617,
    lng: -80.1918,
    type: "retail",
    stats: {
      shops: 29,
      revenue: "$1.4M",
      growth: "+27%"
    }
  }
];

export function InteractiveWorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<"global" | "regional">("global");
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  const currentLocations = viewMode === "global" ? globalLocations : usLocations;

  // Convert lat/lng to 3D sphere coordinates (for global view)
  const latLngToXYZ = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return { x, y, z };
  };

  // Convert lat/lng to 2D map coordinates (for USA view)
  const latLngToUSMap = (lat: number, lng: number, width: number, height: number) => {
    // USA bounds: roughly lat 24-50, lng -125 to -66
    const latMin = 24, latMax = 50;
    const lngMin = -125, lngMax = -66;
    
    const x = ((lng - lngMin) / (lngMax - lngMin)) * width * 0.8 + width * 0.1;
    const y = ((latMax - lat) / (latMax - latMin)) * height * 0.8 + height * 0.1;
    
    return { x: x + panOffset.x, y: y + panOffset.y };
  };

  // Draw the globe (global view)
  const drawGlobe = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw globe base
    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      radius * 0.1,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, "#0EA0DC");
    gradient.addColorStop(0.5, "#0B7FB3");
    gradient.addColorStop(1, "#085A7F");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw latitude lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      const yOffset = (lat / 90) * radius * 0.8;
      const ellipseRadius = Math.sqrt(radius * radius - yOffset * yOffset);
      ctx.ellipse(centerX, centerY - yOffset, ellipseRadius, ellipseRadius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw longitude lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.3, angle + rotation, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw location markers
    globalLocations.forEach((location) => {
      const adjustedLng = location.lng + (rotation * 180) / Math.PI;
      const pos3D = latLngToXYZ(location.lat, adjustedLng, radius);
      
      // Check if point is on visible side
      if (pos3D.x > 0) {
        const screenX = centerX + pos3D.z;
        const screenY = centerY - pos3D.y;

        // Draw marker shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.beginPath();
        ctx.arc(screenX + 2, screenY + 2, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw marker pin
        const markerGradient = ctx.createRadialGradient(screenX, screenY - 3, 2, screenX, screenY, 8);
        if (location.type === "headquarters") {
          markerGradient.addColorStop(0, "#FFD700");
          markerGradient.addColorStop(1, "#FFA500");
        } else {
          markerGradient.addColorStop(0, "#FFFFFF");
          markerGradient.addColorStop(1, "#E0E0E0");
        }
        
        ctx.fillStyle = markerGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw marker border
        ctx.strokeStyle = location.type === "headquarters" ? "#FF8C00" : "#0EA0DC";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw pulse effect
        const pulseRadius = 8 + Math.sin(Date.now() / 300) * 3;
        ctx.strokeStyle = location.type === "headquarters" 
          ? "rgba(255, 215, 0, 0.4)" 
          : "rgba(14, 160, 220, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screenX, screenY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  };

  // Draw US map (regional view)
  const drawUSMap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Draw simplified USA outline
    ctx.strokeStyle = "#0EA0DC";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(14, 160, 220, 0.05)";
    
    // Simplified USA shape
    ctx.beginPath();
    const usOutline = [
      [0.15, 0.85], [0.18, 0.75], [0.25, 0.65], [0.28, 0.55], 
      [0.32, 0.45], [0.38, 0.35], [0.42, 0.28], [0.48, 0.25],
      [0.55, 0.22], [0.62, 0.20], [0.70, 0.22], [0.78, 0.25],
      [0.83, 0.30], [0.87, 0.40], [0.88, 0.50], [0.87, 0.60],
      [0.85, 0.70], [0.82, 0.78], [0.75, 0.82], [0.65, 0.85],
      [0.55, 0.88], [0.45, 0.88], [0.35, 0.87], [0.25, 0.88],
      [0.18, 0.87]
    ];
    
    usOutline.forEach(([x, y], i) => {
      const posX = x * width;
      const posY = y * height;
      if (i === 0) ctx.moveTo(posX, posY);
      else ctx.lineTo(posX, posY);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw state borders (simplified)
    ctx.strokeStyle = "rgba(14, 160, 220, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(width * (0.2 + i * 0.1), height * 0.2);
      ctx.lineTo(width * (0.2 + i * 0.1), height * 0.88);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(width * 0.15, height * (0.25 + i * 0.12));
      ctx.lineTo(width * 0.88, height * (0.25 + i * 0.12));
      ctx.stroke();
    }

    // Draw location markers
    usLocations.forEach((location) => {
      const pos = latLngToUSMap(location.lat, location.lng, width, height);
      
      // Draw marker shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(pos.x + 2, pos.y + 2, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw marker pin
      const markerGradient = ctx.createRadialGradient(pos.x, pos.y - 3, 2, pos.x, pos.y, 10);
      if (location.type === "headquarters") {
        markerGradient.addColorStop(0, "#FFD700");
        markerGradient.addColorStop(1, "#FFA500");
      } else {
        markerGradient.addColorStop(0, "#0EA0DC");
        markerGradient.addColorStop(1, "#0B7FB3");
      }
      
      ctx.fillStyle = markerGradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw marker border
      ctx.strokeStyle = location.type === "headquarters" ? "#FF8C00" : "#085A7F";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pulse effect
      const pulseRadius = 10 + Math.sin(Date.now() / 300) * 4;
      ctx.strokeStyle = location.type === "headquarters" 
        ? "rgba(255, 215, 0, 0.5)" 
        : "rgba(14, 160, 220, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw city name label
      ctx.fillStyle = "#272727";
      ctx.font = "600 11px Muli, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(location.name, pos.x, pos.y - 18);
    });
  };

  // Main draw effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (viewMode === "global") {
        drawGlobe(ctx, canvas.width, canvas.height);
      } else {
        drawUSMap(ctx, canvas.width, canvas.height);
      }

      // Continue animation if not dragging
      if (!isDragging && viewMode === "global") {
        animationRef.current = requestAnimationFrame(draw);
      } else if (viewMode === "regional") {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, isDragging, viewMode, panOffset]);

  // Auto-rotate globe when not dragging (global view only)
  useEffect(() => {
    if (isDragging || viewMode === "regional") return;

    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.005);
    }, 16);

    return () => clearInterval(interval);
  }, [isDragging, viewMode]);

  // Reset view when switching modes
  useEffect(() => {
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedLocation(null);
  }, [viewMode]);

  // Mouse interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
    setLastPanPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    if (viewMode === "global") {
      const deltaX = e.clientX - lastMouseX;
      setRotation((prev) => prev + deltaX * 0.01);
      setLastMouseX(e.clientX);
    } else {
      const deltaX = e.clientX - lastPanPos.x;
      const deltaY = e.clientY - lastPanPos.y;
      setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPanPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledClickX = clickX * scaleX;
    const scaledClickY = clickY * scaleY;

    // Check if clicked on any marker
    let clickedLocation: Location | null = null;
    let minDistance = Infinity;

    if (viewMode === "global") {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;

      globalLocations.forEach((location) => {
        const adjustedLng = location.lng + (rotation * 180) / Math.PI;
        const pos3D = latLngToXYZ(location.lat, adjustedLng, radius);
        
        if (pos3D.x > 0) {
          const screenX = centerX + pos3D.z;
          const screenY = centerY - pos3D.y;
          const distance = Math.sqrt(
            Math.pow(scaledClickX - screenX, 2) + Math.pow(scaledClickY - screenY, 2)
          );

          if (distance < 15 && distance < minDistance) {
            clickedLocation = location;
            minDistance = distance;
          }
        }
      });
    } else {
      usLocations.forEach((location) => {
        const pos = latLngToUSMap(location.lat, location.lng, canvas.width, canvas.height);
        const distance = Math.sqrt(
          Math.pow(scaledClickX - pos.x, 2) + Math.pow(scaledClickY - pos.y, 2)
        );

        if (distance < 20 && distance < minDistance) {
          clickedLocation = location;
          minDistance = distance;
        }
      });
    }

    if (clickedLocation) {
      setSelectedLocation(clickedLocation);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3] flex items-center justify-center shadow-lg">
              {viewMode === "global" ? (
                <Globe className="w-8 h-8 text-white" />
              ) : (
                <Map className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-[#272727] mb-2">
            {viewMode === "global" ? "Global Network" : "USA Regional Network"}
          </h1>
          <p className="text-[#666666]">
            {viewMode === "global" 
              ? "Interactive map with SkyGloss locations worldwide" 
              : "10 major cities across the United States"}
          </p>
          <p className="text-sm text-[#999999]">
            {viewMode === "global" 
              ? "Drag to rotate • Click markers for details" 
              : "Click markers to view city details"}
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 sm:gap-4 mb-8 px-4"
        >
          <Button
            onClick={() => setViewMode("global")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
              viewMode === "global"
                ? "bg-[#0EA0DC] text-white shadow-lg"
                : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
          >
            <Globe className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Global View</span>
          </Button>
          <Button
            onClick={() => setViewMode("regional")}
            className={`px-4 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
              viewMode === "regional"
                ? "bg-[#0EA0DC] text-white shadow-lg"
                : "bg-[#272727] text-white hover:bg-[#272727]/90"
            }`}
          >
            <Map className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">USA Regional</span>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Globe/Map Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <Card className="skygloss-card p-4 sm:p-8 rounded-3xl">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="w-full h-auto cursor-grab active:cursor-grabbing rounded-2xl"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onClick={handleCanvasClick}
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <p className="text-xs text-[#666666]">
                    {viewMode === "global" 
                      ? "🖱️ Drag to rotate • Click markers for details" 
                      : "🖱️ Click markers for city details"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Location Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4 order-1 lg:order-2"
          >
            <h3 className="text-[#272727] mb-4">
              {viewMode === "global" ? "Global Locations" : "US Cities"}
            </h3>
            <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto space-y-4 pr-2">
              {currentLocations.map((location, index) => (
                <motion.div
                  key={location.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  <Card
                    onClick={() => setSelectedLocation(location)}
                    className="skygloss-card p-4 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          location.type === "headquarters" 
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50" 
                            : "bg-gradient-to-r from-[#0EA0DC] to-[#0B7FB3]"
                        }`} />
                        <div>
                          <h4 className="text-sm text-[#272727]">{location.name}</h4>
                          <p className="text-xs text-[#666666]">
                            {location.state ? `${location.state}, ${location.country}` : location.country}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        location.type === "headquarters"
                          ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                          : "bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20"
                      }>
                        {location.type === "headquarters" ? "HQ" : location.type === "distributor" ? "Dist" : "Retail"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-[#999999]">Shops</p>
                        <p className="text-sm text-[#272727]">{location.stats.shops}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Revenue</p>
                        <p className="text-sm text-[#272727]">{location.stats.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#999999]">Growth</p>
                        <p className="text-sm text-green-600">{location.stats.growth}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Location Detail Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedLocation(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl"
              >
                <Card className="skygloss-card p-4 sm:p-8 rounded-3xl relative max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-[#272727]" />
                  </button>

                  <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                      selectedLocation.type === "headquarters"
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                        : "bg-gradient-to-br from-[#0EA0DC] to-[#0B7FB3]"
                    }`}>
                      {selectedLocation.type === "headquarters" ? (
                        <Building2 className="w-8 h-8 text-white" />
                      ) : (
                        <MapPin className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-[#272727]">{selectedLocation.name}</h2>
                        <Badge className={
                          selectedLocation.type === "headquarters"
                            ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                            : "bg-[#0EA0DC]/10 text-[#0EA0DC] border-[#0EA0DC]/20"
                        }>
                          {selectedLocation.type === "headquarters" 
                            ? "Headquarters" 
                            : selectedLocation.type === "distributor" 
                              ? "Master Distributor" 
                              : "Retail Network"}
                        </Badge>
                      </div>
                      <p className="text-[#666666]">
                        {selectedLocation.state 
                          ? `${selectedLocation.state}, ${selectedLocation.country}` 
                          : selectedLocation.country}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0EA0DC]/10 to-[#0EA0DC]/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-5 h-5 text-[#0EA0DC]" />
                        <p className="text-sm text-[#666666]">Total Shops</p>
                      </div>
                      <p className="text-2xl text-[#272727]">{selectedLocation.stats.shops}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-[#666666]">Revenue</p>
                      </div>
                      <p className="text-2xl text-[#272727]">{selectedLocation.stats.revenue}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-[#666666]">Growth</p>
                      </div>
                      <p className="text-2xl text-green-600">{selectedLocation.stats.growth}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-[#272727] mb-2">Performance Overview</h4>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#0EA0DC] to-[#0B7FB3] rounded-full"
                          style={{ width: `${parseInt(selectedLocation.stats.growth)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-[#0EA0DC] text-white hover:bg-[#0B7FB3] rounded-xl">
                        View Details
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-[#0EA0DC]/30 text-[#0EA0DC] hover:bg-[#0EA0DC]/5 rounded-xl"
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
