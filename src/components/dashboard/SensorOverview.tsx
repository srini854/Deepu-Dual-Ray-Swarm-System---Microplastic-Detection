import React from 'react';
import { useData } from '../../context/DataContext';
import { Zap, Target, Layers } from 'lucide-react';

export function SensorOverview() {
  const { sensorData, activeBoats, getSensorAccuracy } = useData();

  // Calculate average accuracies across all boats
  const avgAccuracies = activeBoats.reduce((acc, boatId) => {
    const accuracy = getSensorAccuracy(boatId);
    acc.laser += accuracy.laser;
    acc.infrared += accuracy.infrared;
    acc.fused += accuracy.fused;
    return acc;
  }, { laser: 0, infrared: 0, fused: 0 });

  const boatCount = activeBoats.length;
  avgAccuracies.laser /= boatCount;
  avgAccuracies.infrared /= boatCount;
  avgAccuracies.fused /= boatCount;

  // Get latest overall statistics
  const latestReadings = activeBoats.map(boatId => 
    sensorData.filter(d => d.boat_id === boatId).pop()
  ).filter(Boolean);

  const avgConcentration = latestReadings.reduce((sum, reading) => 
    sum + (reading?.concentration_ppm || 0), 0) / latestReadings.length || 0;

  const avgParticleSize = latestReadings.reduce((sum, reading) => 
    sum + (reading?.particle_size_microns || 0), 0) / latestReadings.length || 0;

  return (
    <div className="sensor-overview">
      <div className="overview-header">
        <h3>Dual Ray Sensor Fusion Overview</h3>
        <div className="sync-indicator">
          <div className="sync-dot"></div>
          <span>Sensors Synchronized</span>
        </div>
      </div>

      <div className="accuracy-grid">
        <div className="accuracy-card laser">
          <div className="accuracy-header">
            <Zap className="accuracy-icon" />
            <span>Dual Ray Laser</span>
          </div>
          <div className="accuracy-value">{avgAccuracies.laser.toFixed(1)}%</div>
          <div className="accuracy-bar">
            <div 
              className="accuracy-fill laser-fill"
              style={{ width: `${avgAccuracies.laser}%` }}
            ></div>
          </div>
        </div>

        <div className="accuracy-card infrared">
          <div className="accuracy-header">
            <Target className="accuracy-icon" />
            <span>Infrared Sensor</span>
          </div>
          <div className="accuracy-value">{avgAccuracies.infrared.toFixed(1)}%</div>
          <div className="accuracy-bar">
            <div 
              className="accuracy-fill infrared-fill"
              style={{ width: `${avgAccuracies.infrared}%` }}
            ></div>
          </div>
        </div>

        <div className="accuracy-card fused">
          <div className="accuracy-header">
            <Layers className="accuracy-icon" />
            <span>Fused Detection</span>
          </div>
          <div className="accuracy-value">{avgAccuracies.fused.toFixed(1)}%</div>
          <div className="accuracy-bar">
            <div 
              className="accuracy-fill fused-fill"
              style={{ width: `${avgAccuracies.fused}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Average Concentration</div>
          <div className="metric-value">{avgConcentration.toFixed(2)} ppm</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Average Particle Size</div>
          <div className="metric-value">{avgParticleSize.toFixed(1)} μm</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Active Boats</div>
          <div className="metric-value">{boatCount}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Data Points</div>
          <div className="metric-value">{sensorData.length.toLocaleString()}</div>
        </div>
      </div>

      <style jsx>{`
        .sensor-overview {
          padding: 24px;
        }

        .overview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .overview-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .sync-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #22c55e;
          font-size: 14px;
          font-weight: 500;
        }

        .sync-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .accuracy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .accuracy-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .accuracy-card.laser {
          background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 5%, #f8fafc 100%);
        }

        .accuracy-card.infrared {
          background: linear-gradient(135deg, #fce7f3 0%, #ec4899 5%, #f8fafc 100%);
        }

        .accuracy-card.fused {
          background: linear-gradient(135deg, #ecfdf5 0%, #22c55e 5%, #f8fafc 100%);
        }

        .accuracy-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-weight: 500;
          color: #475569;
        }

        .accuracy-icon {
          width: 20px;
          height: 20px;
        }

        .accuracy-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .accuracy-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .accuracy-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .laser-fill {
          background: linear-gradient(90deg, #fbbf24, #f59e0b);
        }

        .infrared-fill {
          background: linear-gradient(90deg, #ec4899, #db2777);
        }

        .fused-fill {
          background: linear-gradient(90deg, #22c55e, #16a34a);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .metric-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .metric-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .overview-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .accuracy-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}