import React from 'react';
import { useData } from '../../context/DataContext';
import { Anchor, Battery, Droplets, MapPin } from 'lucide-react';

export function BoatStatus() {
  const { sensorData, activeBoats, getBoatStatus } = useData();

  const getLatestReading = (boatId: string) => {
    return sensorData.filter(d => d.boat_id === boatId).pop();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="boat-status">
      <div className="section-header">
        <h3>Boat Fleet Status</h3>
        <div className="boat-count">{activeBoats.length} boats deployed</div>
      </div>

      <div className="boat-list">
        {activeBoats.map(boatId => {
          const reading = getLatestReading(boatId);
          const status = getBoatStatus(boatId);
          
          if (!reading) return null;

          return (
            <div key={boatId} className="boat-card">
              <div className="boat-header">
                <div className="boat-id">
                  <Anchor className="boat-icon" />
                  <span>{boatId}</span>
                </div>
                <div 
                  className={`status-indicator ${status}`}
                  style={{ background: getStatusColor(status) }}
                ></div>
              </div>

              <div className="boat-metrics">
                <div className="metric">
                  <Battery className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Battery</span>
                    <span className="metric-value">{reading.battery_status}%</span>
                  </div>
                </div>

                <div className="metric">
                  <Droplets className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Depth</span>
                    <span className="metric-value">{reading.depth_cm}cm</span>
                  </div>
                </div>

                <div className="metric">
                  <MapPin className="metric-icon" />
                  <div className="metric-info">
                    <span className="metric-label">Position</span>
                    <span className="metric-value">
                      {reading.gps_lat.toFixed(3)}, {reading.gps_long.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="power-source">
                <span className="power-label">Power:</span>
                <span className={`power-value ${reading.power_source}`}>
                  {reading.power_source}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .boat-status {
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .boat-count {
          font-size: 14px;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 12px;
        }

        .boat-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .boat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .boat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .boat-id {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .boat-icon {
          width: 16px;
          height: 16px;
          color: #0891b2;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .boat-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 12px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-icon {
          width: 14px;
          height: 14px;
          color: #64748b;
        }

        .metric-info {
          display: flex;
          justify-content: space-between;
          flex: 1;
        }

        .metric-label {
          font-size: 12px;
          color: #64748b;
        }

        .metric-value {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }

        .power-source {
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
        }

        .power-label {
          color: #64748b;
        }

        .power-value {
          font-weight: 600;
          margin-left: 8px;
          text-transform: uppercase;
        }

        .power-value.solar {
          color: #f59e0b;
        }

        .power-value.hydro {
          color: #0891b2;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}