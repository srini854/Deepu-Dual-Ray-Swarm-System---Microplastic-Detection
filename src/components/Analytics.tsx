import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

export function Analytics() {
  const { sensorData, activeBoats } = useData();
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('concentration');

  const analysisData = useMemo(() => {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - ranges[timeRange as keyof typeof ranges];
    const filteredData = sensorData.filter(d => 
      new Date(d.timestamp).getTime() > cutoff
    );

    // Group data by hour for charting
    const hourlyData = filteredData.reduce((acc, reading) => {
      const hour = new Date(reading.timestamp).getHours();
      if (!acc[hour]) {
        acc[hour] = { concentration: [], particleSize: [], volume: [] };
      }
      acc[hour].concentration.push(reading.concentration_ppm);
      acc[hour].particleSize.push(reading.particle_size_microns);
      acc[hour].volume.push(reading.collection_volume_ml);
      return acc;
    }, {} as any);

    return Object.entries(hourlyData).map(([hour, data]: [string, any]) => ({
      hour: parseInt(hour),
      avgConcentration: data.concentration.reduce((a: number, b: number) => a + b, 0) / data.concentration.length,
      avgParticleSize: data.particleSize.reduce((a: number, b: number) => a + b, 0) / data.particleSize.length,
      totalVolume: data.volume.reduce((a: number, b: number) => a + b, 0)
    })).sort((a, b) => a.hour - b.hour);
  }, [sensorData, timeRange]);

  const getStatistics = () => {
    if (sensorData.length === 0) return null;

    const values = sensorData.map(d => d.concentration_ppm);
    const sorted = [...values].sort((a, b) => a - b);
    
    return {
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      min: Math.min(...values),
      max: Math.max(...values),
      std: Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length)
    };
  };

  const stats = getStatistics();

  const exportData = () => {
    const csv = [
      'Timestamp,Boat ID,Latitude,Longitude,Particle Size (μm),Concentration (ppm),Depth (cm),Volume (ml),Battery (%),Power Source',
      ...sensorData.map(d => 
        `${d.timestamp},${d.boat_id},${d.gps_lat},${d.gps_long},${d.particle_size_microns},${d.concentration_ppm},${d.depth_cm},${d.collection_volume_ml},${d.battery_status},${d.power_source}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Data Analytics & Insights</h2>
        <div className="header-controls">
          <select 
            className="time-selector"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className="export-btn" onClick={exportData}>
            <Download className="export-icon" />
            Export Data
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Statistics Overview */}
        <div className="analytics-section">
          <h3>Statistical Summary</h3>
          {stats && (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Mean Concentration</div>
                <div className="stat-value">{stats.mean.toFixed(3)} ppm</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Median</div>
                <div className="stat-value">{stats.median.toFixed(3)} ppm</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Standard Deviation</div>
                <div className="stat-value">{stats.std.toFixed(3)}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Range</div>
                <div className="stat-value">{stats.min.toFixed(2)} - {stats.max.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Visualization */}
        <div className="analytics-section chart-section">
          <div className="chart-header">
            <h3>Temporal Analysis</h3>
            <select 
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="metric-selector"
            >
              <option value="concentration">Concentration</option>
              <option value="particleSize">Particle Size</option>
              <option value="volume">Collection Volume</option>
            </select>
          </div>
          
          <div className="chart-container">
            <div className="chart-y-axis">
              <div className="y-label">
                {selectedMetric === 'concentration' && 'ppm'}
                {selectedMetric === 'particleSize' && 'μm'}
                {selectedMetric === 'volume' && 'ml'}
              </div>
            </div>
            <div className="chart-area">
              {analysisData.map((point, index) => {
                const value = selectedMetric === 'concentration' ? point.avgConcentration :
                             selectedMetric === 'particleSize' ? point.avgParticleSize :
                             point.totalVolume;
                const maxValue = Math.max(...analysisData.map(p => 
                  selectedMetric === 'concentration' ? p.avgConcentration :
                  selectedMetric === 'particleSize' ? p.avgParticleSize :
                  p.totalVolume
                ));
                const height = (value / maxValue) * 100;
                
                return (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  >
                    <div className="bar-value">{value.toFixed(1)}</div>
                    <div className="bar-label">{point.hour}:00</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Boat Performance Comparison */}
        <div className="analytics-section">
          <h3>Boat Performance Comparison</h3>
          <div className="performance-grid">
            {activeBoats.map(boatId => {
              const boatData = sensorData.filter(d => d.boat_id === boatId);
              const avgConcentration = boatData.reduce((sum, d) => sum + d.concentration_ppm, 0) / boatData.length;
              const dataPoints = boatData.length;
              
              return (
                <div key={boatId} className="performance-item">
                  <div className="performance-header">
                    <span className="boat-id">{boatId}</span>
                    <span className="data-count">{dataPoints} readings</span>
                  </div>
                  <div className="performance-metric">
                    <span>Avg Concentration:</span>
                    <span>{avgConcentration.toFixed(3)} ppm</span>
                  </div>
                  <div className="performance-bar">
                    <div 
                      className="performance-fill"
                      style={{ width: `${Math.min(100, (avgConcentration / 5) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Zones */}
        <div className="analytics-section">
          <h3>Environmental Impact Zones</h3>
          <div className="zones-grid">
            <div className="zone-item low">
              <div className="zone-header">
                <span>Low Impact</span>
                <span>&lt; 1.0 ppm</span>
              </div>
              <div className="zone-count">
                {sensorData.filter(d => d.concentration_ppm < 1.0).length} readings
              </div>
            </div>
            <div className="zone-item moderate">
              <div className="zone-header">
                <span>Moderate</span>
                <span>1.0 - 3.0 ppm</span>
              </div>
              <div className="zone-count">
                {sensorData.filter(d => d.concentration_ppm >= 1.0 && d.concentration_ppm < 3.0).length} readings
              </div>
            </div>
            <div className="zone-item high">
              <div className="zone-header">
                <span>High Impact</span>
                <span>&gt; 3.0 ppm</span>
              </div>
              <div className="zone-count">
                {sensorData.filter(d => d.concentration_ppm >= 3.0).length} readings
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .analytics-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .header-controls {
          display: flex;
          gap: 16px;
        }

        .time-selector,
        .metric-selector {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #1e293b;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }

        .export-btn:hover {
          background: #1d4ed8;
        }

        .export-icon {
          width: 16px;
          height: 16px;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          flex: 1;
        }

        .analytics-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .analytics-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 20px;
        }

        .chart-section {
          grid-column: 1 / -1;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-container {
          display: flex;
          height: 300px;
          gap: 16px;
        }

        .chart-y-axis {
          display: flex;
          align-items: center;
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }

        .y-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .chart-area {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 8px;
          padding: 16px 0;
          border-bottom: 1px solid #e2e8f0;
          border-left: 1px solid #e2e8f0;
        }

        .chart-bar {
          flex: 1;
          background: linear-gradient(180deg, #3b82f6, #1d4ed8);
          border-radius: 4px 4px 0 0;
          position: relative;
          min-height: 4px;
          cursor: pointer;
        }

        .chart-bar:hover {
          background: linear-gradient(180deg, #2563eb, #1e40af);
        }

        .bar-value {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #64748b;
          white-space: nowrap;
        }

        .bar-label {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          color: #64748b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }

        .performance-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .performance-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .boat-id {
          font-weight: 600;
          color: #1e293b;
        }

        .data-count {
          font-size: 12px;
          color: #64748b;
        }

        .performance-metric {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .performance-metric span:first-child {
          color: #64748b;
        }

        .performance-metric span:last-child {
          font-weight: 600;
          color: #1e293b;
        }

        .performance-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .performance-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 3px;
        }

        .zones-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .zone-item {
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;
        }

        .zone-item.low {
          background: #f0fdf4;
          border-left-color: #22c55e;
        }

        .zone-item.moderate {
          background: #fffbeb;
          border-left-color: #f59e0b;
        }

        .zone-item.high {
          background: #fef2f2;
          border-left-color: #ef4444;
        }

        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .zone-count {
          font-size: 14px;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .analytics-grid {
            grid-template-columns: 1fr;
          }
          
          .analytics-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}