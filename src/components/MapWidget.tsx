import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
}

interface GroupedLocation {
  country: string;
  locations: Location[];
  center: Location;
}

const headquarters: Location = {
  name: "SkyGloss HQ",
  country: "USA",
  city: "Phoenix",
  lat: 33.4484,
  lng: -112.074,
  type: "headquarters",
  address: "2 E Camelback Rd, Phoenix, AZ 85012, USA",
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

const API_BASE = import.meta.env.VITE_API_URL || "https://skygloss-backend-production-3b96.up.railway.app";

export default function MapWidget() {
  const [locations, setLocations] = useState<Location[]>([headquarters]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<GroupedLocation | null>(null);

  const mapCenter: [number, number] = [20, 0];
  const mapZoom = 2;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${API_BASE}/public/map-locations`);
        const data = await res.json();
        setLocations([headquarters, ...data]);
      } catch (err) {
        console.error("Failed to fetch map locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const groupedLocations = useMemo(() => {
    const groups: Record<string, Location[]> = {};
    locations.forEach((loc) => {
      if (!groups[loc.country]) groups[loc.country] = [];
      groups[loc.country].push(loc);
    });
    return Object.entries(groups).map(([country, locs]) => ({
      country,
      locations: locs,
      center: locs[0],
    }));
  }, [locations]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        position: "relative",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: 14,
          padding: "12px 18px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #0EA0DC, #0B7DAF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#272727", lineHeight: 1.2 }}>
            SkyGloss Network
          </div>
          <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>
            {locations.length} locations worldwide
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          zIndex: 1000,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          padding: "10px 16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          display: "flex",
          gap: 16,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFD700", display: "inline-block" }} />
          HQ
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#A855F7", display: "inline-block" }} />
          Partners
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
          Shops
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              border: "3px solid #e5e7eb",
              borderTopColor: "#0EA0DC",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
        style={{ width: "100%", height: "100%", minHeight: "400px", zIndex: 9 }}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {groupedLocations.map((group: GroupedLocation, idx: number) => (
          <Marker
            key={`${group.country}-${idx}`}
            position={[group.center.lat, group.center.lng]}
            icon={
              group.locations.length > 1
                ? createClusterIcon(group.locations.length)
                : createCustomIcon(group.center.type)
            }
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

      {/* Country Group Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 16,
            }}
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 420,
                maxHeight: "80%",
                overflow: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#272727" }}>
                    {selectedCountry.country}
                  </h3>
                  <p style={{ margin: 0, fontSize: 12, color: "#999", fontWeight: 600 }}>
                    {selectedCountry.locations.length} locations
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  style={{
                    width: 32,
                    height: 32,
                    border: "none",
                    background: "#f1f5f9",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
              {selectedCountry.locations.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setSelectedCountry(null);
                  }}
                  style={{
                    padding: 12,
                    background: "#f8fafc",
                    borderRadius: 12,
                    marginBottom: 8,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => ((e.currentTarget.style.background = "#eff6ff"), (e.currentTarget.style.borderColor = "#93c5fd"))}
                  onMouseOut={(e) => ((e.currentTarget.style.background = "#f8fafc"), (e.currentTarget.style.borderColor = "#e2e8f0"))}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: loc.type === "headquarters" ? "#fef3c7" : loc.type === "shop" ? "#dbeafe" : "#f3e8ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {loc.type === "headquarters" ? "🏢" : loc.type === "shop" ? "📍" : "💜"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#272727", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                      {loc.type === "shop" ? "Certified Shop" : "Partner"}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 16,
            }}
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 28,
                width: "100%",
                maxWidth: 440,
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedLocation(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  border: "none",
                  background: "#f1f5f9",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background:
                      selectedLocation.type === "headquarters"
                        ? "linear-gradient(135deg, #FBBF24, #F59E0B)"
                        : selectedLocation.type === "shop"
                        ? "linear-gradient(135deg, #60A5FA, #2563EB)"
                        : "linear-gradient(135deg, #C084FC, #9333EA)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  {selectedLocation.type === "headquarters" ? "🏢" : selectedLocation.type === "shop" ? "📍" : "💜"}
                </div>
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#272727",
                      lineHeight: 1.2,
                    }}
                  >
                    {selectedLocation.name}
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                    🌍 {selectedLocation.country} ·{" "}
                    {selectedLocation.type === "shop" ? "Certified Shop" : "Partner"}
                  </p>
                </div>
              </div>

              {/* Social Media */}
              {selectedLocation.socials && Object.values(selectedLocation.socials).some((v) => v) && (
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {selectedLocation.socials.website && (
                    <a href={selectedLocation.socials.website} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                      🌐
                    </a>
                  )}
                  {selectedLocation.socials.facebook && (
                    <a href={selectedLocation.socials.facebook} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                      <svg width="16" height="16" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                  )}
                  {selectedLocation.socials.instagram && (
                    <a href={selectedLocation.socials.instagram} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                      <svg width="16" height="16" fill="#E4405F" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </a>
                  )}
                  {selectedLocation.socials.youtube && (
                    <a href={selectedLocation.socials.youtube} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                      <svg width="16" height="16" fill="#FF0000" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    </a>
                  )}
                  {selectedLocation.socials.tiktok && (
                    <a href={selectedLocation.socials.tiktok} target="_blank" rel="noopener noreferrer" style={{ ...socialBtnStyle, background: "#000" }}>
                      <svg width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M21,7V9a1,1,0,0,1-1,1,8,8,0,0,1-4-1.08V15.5A6.5,6.5,0,1,1,6.53,9.72a1,1,0,0,1,1.47.9v2.52a.92.92,0,0,1-.28.62,2.49,2.49,0,0,0,2,4.23A2.61,2.61,0,0,0,12,15.35V3a1,1,0,0,1,1-1h2.11a1,1,0,0,1,1,.83A4,4,0,0,0,20,6,1,1,0,0,1,21,7Z" /></svg>
                    </a>
                  )}
                </div>
              )}

              {selectedLocation.address && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>
                    Address
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#272727" }}>{selectedLocation.address}</div>
                </div>
              )}

              {selectedLocation.city && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f8fafc",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>
                    City
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#272727" }}>{selectedLocation.city}</div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const socialBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  transition: "all 0.2s",
  fontSize: 16,
};
