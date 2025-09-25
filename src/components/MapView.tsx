import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { MapPin, Layers, Filter } from 'lucide-react';

export function MapView() {
  const { sensorData, activeBoats, getBoatStatus } = useData();
  const [selectedBoat, setSelectedBoat] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Get latest position for each boat
  const boatPositions = activeBoats.map(boatId => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    return latestReading ? {
      ...latestReading,
      status: getBoatStatus(boatId)
    } : null;
  }).filter(Boolean);

  // Mumbai bay coordinates
  const mapCenter = { lat: 19.07, lng: 72.87 };
  const mapBounds = {
    north: 19.2,
    south: 18.9,
    east: 73.0,
    west: 72.7
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getConcentrationColor = (concentration: number) => {
    if (concentration > 4) return '#ef4444';
    if (concentration > 2) return '#f59e0b';
    if (concentration > 1) return '#3b82f6';
    return '#22c55e';
  };

  return (
    <div className="map-view">
      <div className="map-header">
        <h2>Fleet Tracking & Environmental Monitoring</h2>
        <div className="map-controls">
          <button 
            className={`control-btn ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <Layers className="control-icon" />
            Concentration Heatmap
          </button>
          <button className="control-btn">
            <Filter className="control-icon" />
            Filters
          </button>
        </div>
      </div>

      <div className="map-container">
        <div className="map-canvas">
          {/* Simulated map background */}
          <div className="map-background">
            <div className="coastline"></div>
            <div className="water-area"></div>
          </div>

          {/* Boat markers */}
          {boatPositions.map(position => (
            <div
              key={position!.boat_id}
              className={`boat-marker ${selectedBoat === position!.boat_id ? 'selected' : ''}`}
              style={{
                left: `${((position!.gps_long - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100}%`,
                top: `${100 - ((position!.gps_lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * 100}%`,
                borderColor: getStatusColor(position!.status)
              }}
              onClick={() => setSelectedBoat(
                selectedBoat === position!.boat_id ? null : position!.boat_id
              )}
            >
              <MapPin 
                className="marker-icon" 
                style={{ color: getStatusColor(position!.status) }} 
              />
              <div className="marker-label">{position!.boat_id}</div>
              
              {/* Concentration indicator */}
              {showHeatmap && (
                <div 
                  className="concentration-ring"
                  style={{ 
                    borderColor: getConcentrationColor(position!.concentration_ppm),
                    opacity: Math.min(1, position!.concentration_ppm / 5)
                  }}
                ></div>
              )}
            </div>
          ))}

          {/* Selected boat details */}
          {selectedBoat && (() => {
            const boat = boatPositions.find(p => p!.boat_id === selectedBoat);
            if (!boat) return null;

            return (
              <div 
                className="boat-details"
                style={{
                  left: `${((boat.gps_long - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100}%`,
                  top: `${100 - ((boat.gps_lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * 100 + 5}%`
                }}
              >
                <div className="details-card">
                  <h4>Boat {boat.boat_id}</h4>
                  <div className="detail-row">
                    <span>Concentration:</span>
                    <span>{boat.concentration_ppm.toFixed(2)} ppm</span>
                  </div>
                  <div className="detail-row">
                    <span>Particle Size:</span>
                    <span>{boat.particle_size_microns.toFixed(1)} μm</span>
                  </div>
                  <div className="detail-row">
                    <span>Depth:</span>
                    <span>{boat.depth_cm} cm</span>
                  </div>
                  <div className="detail-row">
                    <span>Battery:</span>
                    <span>{boat.battery_status}%</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="map-legend">
          <h4>Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#22c55e' }}></div>
              <span>Active</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#f59e0b' }}></div>
              <span>Warning</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: '#ef4444' }}></div>
              <span>High Concentration</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .map-view {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .map-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .map-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .map-controls {
          display: flex;
          gap: 12px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        .control-btn:hover {
          background: #f8fafc;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .control-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .control-icon {
          width: 16px;
          height: 16px;
        }

        .map-container {
          flex: 1;
          display: flex;
          gap: 24px;
        }

        .map-canvas {
          flex: 1;
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          min-height: 500px;
        }

        .map-background {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
          position: relative;
        }

        .coastline {
          position: absolute;
          top: 20%;
          left: 10%;
          right: 20%;
          bottom: 30%;
          background: #fbbf24;
          border-radius: 20px;
          opacity: 0.3;
        }

        .water-area {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
        }

        .boat-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
        }

        .boat-marker.selected {
          z-index: 20;
        }

        .marker-icon {
          width: 24px;
          height: 24px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .marker-label {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
        }

        .concentration-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 2px solid;
          border-radius: 50%;
          pointer-events: none;
          animation: pulse 3s infinite;
        }

        .boat-details {
          position: absolute;
          z-index: 30;
          transform: translateX(-50%);
        }

        .details-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          min-width: 200px;
        }

        .details-card h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .detail-row span:first-child {
          color: #64748b;
        }

        .detail-row span:last-child {
          font-weight: 600;
          color: #1e293b;
        }

        .map-legend {
          width: 200px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }

        .map-legend h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .legend-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #64748b;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @media (max-width: 768px) {
          .map-container {
            flex-direction: column;
          }
          
          .map-legend {
            width: 100%;
          }
          
          .map-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}