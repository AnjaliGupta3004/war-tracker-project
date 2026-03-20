import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

// Optimized GeoURL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const markers = [
  { markerOffset: -15, name: "Middle East", coordinates: [45.0, 25.0] },
  { markerOffset: -15, name: "Eastern Europe", coordinates: [30.0, 50.0] },
  { markerOffset: 25, name: "South Asia", coordinates: [78.0, 20.0] },
];

const WorldMap = () => {
  return (
    <div className="bg-[#0f172a] border border-slate-800 p-4 mb-12 shadow-2xl overflow-hidden relative">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">
          Global Satellite View: Active Theaters
        </h2>
        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Source: Sentinel-1</span>
      </div>
      
      {/* Map Container with explicit height to prevent layout collapse */}
      <div className="h-[300px] w-full flex justify-center items-center">
        <ComposableMap 
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies && geographies.length > 0 ? (
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#ef4444", outline: "none", transition: "all 0.3s" },
                      pressed: { fill: "#7f1d1d", outline: "none" },
                    }}
                  />
                ))
              ) : null
            }
          </Geographies>
          
          {markers.map(({ name, coordinates, markerOffset }) => (
            <Marker key={name} coordinates={coordinates}>
              <circle r={4} fill="#ef4444" stroke="#020617" strokeWidth={1} />
              <circle r={8} fill="#ef4444" opacity={0.3} className="animate-ping" />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ 
                  fontFamily: "monospace", 
                  fontSize: "10px", 
                  fill: "#94a3b8", 
                  fontWeight: "bold", 
                  pointerEvents: "none" 
                }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
      
      {/* HUD Scanner Effect */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-red-500/10 animate-pulse"></div>
    </div>
  )
}

export default WorldMap