import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Zap, Target, Layers, Settings, Vibrate as Calibrate } from 'lucide-react';

export function SensorFusion() {
  const { sensorData, activeBoats, getSensorAccuracy, technicalSpecs, getSensorTechnicalData, validateSensorAccuracy } = useData();
  const [selectedBoat, setSelectedBoat] = useState(activeBoats[0] || 'B1');
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const boatAccuracy = getSensorAccuracy(selectedBoat);
  const latestReading = sensorData.filter(d => d.boat_id === selectedBoat).pop();
  const technicalData = getSensorTechnicalData(selectedBoat);
  const validationData = validateSensorAccuracy(selectedBoat);

  // Calculate fusion algorithm performance
  const fusionMetrics = {
    improvement: boatAccuracy.fused - Math.max(boatAccuracy.laser, boatAccuracy.infrared),
    confidence: (boatAccuracy.laser + boatAccuracy.infrared) / 2,
    reliability: Math.min(100, boatAccuracy.fused + (boatAccuracy.laser * boatAccuracy.infrared) / 100)
  };

  return (
    <div className="sensor-fusion">
      <div className="fusion-header">
        <h2>Dual Ray Sensor Fusion</h2>
        <div className="header-controls">
          <select 
            className="boat-selector"
            value={selectedBoat}
            onChange={(e) => setSelectedBoat(e.target.value)}
          >
            {activeBoats.map(boatId => (
              <option key={boatId} value={boatId}>Boat {boatId}</option>
            ))}
          </select>
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showTechnicalDetails 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Technical Details
          </button>
          <button
            className={`calibrate-btn ${calibrationMode ? 'active' : ''}`}
            onClick={() => setCalibrationMode(!calibrationMode)}
          >
            <Calibrate className="calibrate-icon" />
            Calibration Mode
          </button>
        </div>
      </div>

      <div className="fusion-grid">
        {/* Sensor Readings */}
        <div className="fusion-section">
          <div className="section-title">
            <Zap className="section-icon" />
            <span>Dual Ray Laser Sensor</span>
          </div>
          <div className="sensor-display laser">
            <div className="accuracy-circle">
              <div className="accuracy-ring laser-ring" style={{ 
                background: `conic-gradient(#fbbf24 0deg ${boatAccuracy.laser * 3.6}deg, #e2e8f0 ${boatAccuracy.laser * 3.6}deg)` 
              }}>
                <div className="accuracy-center">
                  <span className="accuracy-percent">{boatAccuracy.laser.toFixed(1)}%</span>
                  <span className="accuracy-label">Accuracy</span>
                </div>
              </div>
            </div>
            <div className="sensor-metrics">
              <div className="metric">
                <span>Particle Detection</span>
                <span>{latestReading?.particle_size_microns.toFixed(1) || 0} μm</span>
              </div>
              <div className="metric">
                <span>Signal Quality</span>
                <span>Strong</span>
              </div>
              <div className="metric">
                <span>Calibration Status</span>
                <span className="status-good">Calibrated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fusion-section">
          <div className="section-title">
            <Target className="section-icon" />
            <span>Infrared Sensor</span>
          </div>
          <div className="sensor-display infrared">
            <div className="accuracy-circle">
              <div className="accuracy-ring infrared-ring" style={{ 
                background: `conic-gradient(#ec4899 0deg ${boatAccuracy.infrared * 3.6}deg, #e2e8f0 ${boatAccuracy.infrared * 3.6}deg)` 
              }}>
                <div className="accuracy-center">
                  <span className="accuracy-percent">{boatAccuracy.infrared.toFixed(1)}%</span>
                  <span className="accuracy-label">Accuracy</span>
                </div>
              </div>
            </div>
            <div className="sensor-metrics">
              <div className="metric">
                <span>Concentration</span>
                <span>{latestReading?.concentration_ppm.toFixed(2) || 0} ppm</span>
              </div>
              <div className="metric">
                <span>Temperature</span>
                <span>28.5°C</span>
              </div>
              <div className="metric">
                <span>Calibration Status</span>
                <span className="status-good">Calibrated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fusion-section full-width">
          <div className="section-title">
            <Layers className="section-icon" />
            <span>Fused Detection System</span>
          </div>
          <div className="fusion-display">
            <div className="fusion-accuracy">
              <div className="accuracy-circle large">
                <div className="accuracy-ring fused-ring" style={{ 
                  background: `conic-gradient(#22c55e 0deg ${boatAccuracy.fused * 3.6}deg, #e2e8f0 ${boatAccuracy.fused * 3.6}deg)` 
                }}>
                  <div className="accuracy-center">
                    <span className="accuracy-percent large">{boatAccuracy.fused.toFixed(1)}%</span>
                    <span className="accuracy-label">Fused Accuracy</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="fusion-metrics">
              <div className="fusion-stats">
                <div className="stat-card">
                  <div className="stat-value">+{fusionMetrics.improvement.toFixed(1)}%</div>
                  <div className="stat-label">Accuracy Improvement</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{fusionMetrics.confidence.toFixed(1)}%</div>
                  <div className="stat-label">Confidence Level</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{fusionMetrics.reliability.toFixed(1)}%</div>
                  <div className="stat-label">System Reliability</div>
                </div>
              </div>

              <div className="fusion-algorithm">
                <h4>Fusion Algorithm Status</h4>
                <div className="algorithm-steps">
                  <div className="step active">
                    <span>1. Data Acquisition</span>
                    <div className="step-status good"></div>
                  </div>
                  <div className="step active">
                    <span>2. Signal Processing</span>
                    <div className="step-status good"></div>
                  </div>
                  <div className="step active">
                    <span>3. Cross-Validation</span>
                    <div className="step-status good"></div>
                  </div>
                  <div className="step active">
                    <span>4. Confidence Weighting</span>
                    <div className="step-status good"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          {technicalData && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Water Turbidity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(technicalData.environmental.turbidity * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Sensor Temperature</p>
                <p className="text-lg font-semibold text-gray-900">
                  {technicalData.environmental.temperature?.toFixed(1)}°C
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Sampling Rate</p>
                <p className="text-lg font-semibold text-gray-900">{technicalSpecs.sampling_rate}Hz</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Calibration Status</p>
                <p className={`text-sm font-semibold ${
                  technicalData.environmental.calibration_status === 'Calibrated' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {technicalData.environmental.calibration_status}
                </p>
              </div>
            </div>
          )}

          {/* Fusion Algorithm Explanation */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How Sensor Fusion Works</h4>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <p className="font-medium">1. Dual Ray Laser Detection:</p>
                <p>Uses Mie scattering at 650nm to detect particle size and count. Light scattering intensity correlates with particle concentration and size distribution.</p>
              </div>
              <div>
                <p className="font-medium">2. Infrared Spectroscopy:</p>
                <p>Near-infrared at 1550nm identifies C-H bonds characteristic of plastic polymers, providing chemical composition data.</p>
              </div>
              <div>
                <p className="font-medium">3. Bayesian Fusion Algorithm:</p>
                <p>Combines both sensors using weighted confidence scores, environmental factors, and Kalman filtering for temporal consistency.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs text-blue-600">Accuracy Improvement</p>
                <p className="text-lg font-bold text-blue-900">+{fusionMetrics.improvement.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-600">Confidence Level</p>
                <p className="text-lg font-bold text-blue-900">{fusionMetrics.confidence.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-600">Reliability Score</p>
                <p className="text-lg font-bold text-blue-900">{fusionMetrics.reliability.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {calibrationMode && (
        <div className="calibration-panel">
          <div className="calibration-header">
            <h3>Sensor Calibration</h3>
            <button 
              className="close-btn"
              onClick={() => setCalibrationMode(false)}
            >
              ×
            </button>
          </div>
          <div className="calibration-content">
            <div className="calibration-section">
              <h4>Laser Sensor Calibration</h4>
              <div className="calibration-controls">
                <label>
                  Sensitivity: <input type="range" min="80" max="100" defaultValue="92" />
                </label>
                <label>
                  Threshold: <input type="range" min="1" max="10" defaultValue="5" />
                </label>
              </div>
            </div>
            <div className="calibration-section">
              <h4>Infrared Sensor Calibration</h4>
              <div className="calibration-controls">
                <label>
                  Sensitivity: <input type="range" min="70" max="95" defaultValue="88" />
                </label>
                <label>
                  Baseline: <input type="range" min="0" max="2" step="0.1" defaultValue="0.5" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sensor-fusion {
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .fusion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .fusion-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .header-controls {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .boat-selector {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          color: #1e293b;
        }

        .calibrate-btn {
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

        .calibrate-btn:hover,
        .calibrate-btn.active {
          background: #1e40af;
          border-color: #1e40af;
          color: white;
        }

        .calibrate-icon {
          width: 16px;
          height: 16px;
        }

        .fusion-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          flex: 1;
        }

        .fusion-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .fusion-section.full-width {
          grid-column: 1 / -1;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .section-icon {
          width: 20px;
          height: 20px;
        }

        .sensor-display {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .accuracy-circle {
          display: flex;
          justify-content: center;
        }

        .accuracy-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .accuracy-ring.large {
          width: 160px;
          height: 160px;
        }

        .accuracy-center {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .accuracy-ring.large .accuracy-center {
          width: 100px;
          height: 100px;
        }

        .accuracy-percent {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
        }

        .accuracy-percent.large {
          font-size: 28px;
        }

        .accuracy-label {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sensor-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .metric span:first-child {
          color: #64748b;
          font-size: 14px;
        }

        .metric span:last-child {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        .status-good {
          color: #22c55e !important;
        }

        .fusion-display {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }

        .fusion-metrics {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .fusion-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
        }

        .fusion-algorithm h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .algorithm-steps {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          opacity: 0.5;
        }

        .step.active {
          opacity: 1;
          background: #ecfdf5;
        }

        .step span {
          font-size: 14px;
          color: #1e293b;
        }

        .step-status {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
        }

        .step-status.good {
          background: #22c55e;
          animation: pulse 2s infinite;
        }

        .calibration-panel {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 400px;
          background: white;
          border-left: 1px solid #e2e8f0;
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .calibration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .calibration-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
        }

        .close-btn:hover {
          color: #1e293b;
        }

        .calibration-content {
          padding: 24px;
        }

        .calibration-section {
          margin-bottom: 24px;
        }

        .calibration-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .calibration-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .calibration-controls label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #64748b;
        }

        .calibration-controls input[type="range"] {
          width: 150px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .fusion-grid {
            grid-template-columns: 1fr;
          }
          
          .fusion-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .header-controls {
            width: 100%;
            justify-content: space-between;
          }
          
          .calibration-panel {
            width: 100%;
            top: 80px;
          }
          
          .fusion-display {
            flex-direction: column;
            gap: 24px;
          }
        }
      `}</style>
    </div>
  );
}