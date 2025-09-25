import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function RealTimeMetrics() {
  const { sensorData, activeBoats } = useData();
  const [trends, setTrends] = useState<{[key: string]: 'up' | 'down' | 'stable'}>({});

  useEffect(() => {
    // Calculate trends for concentration over last 10 readings
    const newTrends: {[key: string]: 'up' | 'down' | 'stable'} = {};
    
    activeBoats.forEach(boatId => {
      const readings = sensorData
        .filter(d => d.boat_id === boatId)
        .slice(-10);
      
      if (readings.length >= 2) {
        const recent = readings.slice(-3).reduce((sum, r) => sum + r.concentration_ppm, 0) / 3;
        const earlier = readings.slice(-6, -3).reduce((sum, r) => sum + r.concentration_ppm, 0) / 3;
        
        if (recent > earlier + 0.1) newTrends[boatId] = 'up';
        else if (recent < earlier - 0.1) newTrends[boatId] = 'down';
        else newTrends[boatId] = 'stable';
      }
    });
    
    setTrends(newTrends);
  }, [sensorData, activeBoats]);

  const getLatestMetrics = () => {
    const latest = activeBoats.map(boatId => 
      sensorData.filter(d => d.boat_id === boatId).pop()
    ).filter(Boolean);

    return {
      totalVolume: latest.reduce((sum, r) => sum + (r?.collection_volume_ml || 0), 0),
      avgBattery: latest.reduce((sum, r) => sum + (r?.battery_status || 0), 0) / latest.length || 0,
      maxConcentration: Math.max(...latest.map(r => r?.concentration_ppm || 0)),
      activeSensors: latest.filter(r => r?.battery_status > 20).length * 2 // dual sensors per boat
    };
  };

  const metrics = getLatestMetrics();

  return (
    <div className="real-time-metrics">
      <div className="section-header">
        <h3>Real-Time Metrics</h3>
        <Activity className="activity-icon" />
      </div>

      <div className="metrics-list">
        <div className="metric-item">
          <div className="metric-header">
            <span>Total Collection Volume</span>
            <TrendingUp className="trend-icon up" />
          </div>
          <div className="metric-value-large">
            {metrics.totalVolume.toLocaleString()} ml
          </div>
          <div className="metric-subtitle">Across all boats</div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span>Fleet Battery Average</span>
            <div className={`trend-icon ${metrics.avgBattery > 50 ? 'stable' : 'down'}`}>
              {metrics.avgBattery > 50 ? <Activity /> : <TrendingDown />}
            </div>
          </div>
          <div className="metric-value-large">
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          </div>
          <div className="battery-bar">
            <div 
              className="battery-fill"
              style={{ 
                width: `${metrics.avgBattery}%`,
                background: metrics.avgBattery > 50 ? '#22c55e' : metrics.avgBattery > 20 ? '#f59e0b' : '#ef4444'
              }}
            ></div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span>Peak Concentration</span>
            <TrendingUp className="trend-icon warning" />
          </div>
          <div className="metric-value-large">
            {metrics.maxConcentration.toFixed(2)} ppm
          </div>
          <div className="metric-subtitle">
            {metrics.maxConcentration > 3 ? 'Above threshold' : 'Normal levels'}
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-header">
            <span>Active Sensors</span>
            <Activity className="trend-icon up" />
          </div>
          <div className="metric-value-large">
            {metrics.activeSensors}
          </div>
          <div className="metric-subtitle">Dual-ray systems online</div>
        </div>
      </div>

      <div className="boat-trends">
        <h4>Concentration Trends</h4>
        <div className="trends-grid">
          {activeBoats.map(boatId => (
            <div key={boatId} className="trend-item">
              <span className="boat-label">{boatId}</span>
              <div className={`trend-indicator ${trends[boatId] || 'stable'}`}>
                {trends[boatId] === 'up' && <TrendingUp />}
                {trends[boatId] === 'down' && <TrendingDown />}
                {(!trends[boatId] || trends[boatId] === 'stable') && <Activity />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .real-time-metrics {
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

        .activity-icon {
          width: 20px;
          height: 20px;
          color: #22c55e;
          animation: pulse 2s infinite;
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .metric-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .metric-header span {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .trend-icon {
          width: 16px;
          height: 16px;
        }

        .trend-icon.up {
          color: #22c55e;
        }

        .trend-icon.down {
          color: #ef4444;
        }

        .trend-icon.warning {
          color: #f59e0b;
        }

        .trend-icon.stable {
          color: #64748b;
        }

        .metric-value-large {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .metric-subtitle {
          font-size: 12px;
          color: #64748b;
        }

        .battery-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .battery-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .boat-trends h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .trends-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 12px;
        }

        .trend-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .boat-label {
          font-size: 12px;
          font-weight: 600;
          color: #1e293b;
        }

        .trend-indicator {
          width: 16px;
          height: 16px;
        }

        .trend-indicator.up {
          color: #22c55e;
        }

        .trend-indicator.down {
          color: #ef4444;
        }

        .trend-indicator.stable {
          color: #64748b;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}