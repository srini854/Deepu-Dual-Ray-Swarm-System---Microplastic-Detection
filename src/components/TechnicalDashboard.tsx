import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export function TechnicalDashboard() {
  const { sensorData, activeBoats, technicalSpecs, getSensorTechnicalData, validateSensorAccuracy } = useData();
  const [selectedBoat, setSelectedBoat] = useState(activeBoats[0] || 'B1');

  const technicalData = getSensorTechnicalData(selectedBoat);
  const validationData = validateSensorAccuracy(selectedBoat);
  const latestReading = sensorData.filter(d => d.boat_id === selectedBoat).pop();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Technical Dashboard</h2>
        <select
          value={selectedBoat}
          onChange={(e) => setSelectedBoat(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {activeBoats.map(boat => (
            <option key={boat} value={boat}>Boat {boat}</option>
          ))}
        </select>
      </div>

      {/* Real-time Data Stream */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Data Stream - {selectedBoat}</h3>
        {latestReading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Timestamp</p>
              <p className="text-sm font-medium">{new Date(latestReading.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Concentration</p>
              <p className="text-sm font-medium">{latestReading.concentration_ppm.toFixed(2)} ppm</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Particle Size</p>
              <p className="text-sm font-medium">{latestReading.particle_size_microns.toFixed(1)} μm</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Depth</p>
              <p className="text-sm font-medium">{latestReading.depth_cm} cm</p>
            </div>
            <div className="bg-cyan-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Battery</p>
              <p className="text-sm font-medium">{latestReading.battery_status}%</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Power Source</p>
              <p className="text-sm font-medium capitalize">{latestReading.power_source}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sensor Technical Specifications */}
      {technicalData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dual Ray Laser Technical Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">Dual Ray Laser System</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Wavelength</p>
                  <p className="text-lg font-semibold text-red-600">{technicalData.laser.wavelength}nm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Laser Power</p>
                  <p className="text-lg font-semibold text-red-600">{technicalData.laser.power}mW</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Signal Strength</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.laser.signal_strength?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Accuracy</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.laser.accuracy?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Detection Principle</h4>
                <p className="text-sm text-red-800 mb-2">{technicalData.laser.principle}</p>
                <p className="text-xs text-red-700">{technicalData.laser.detection_method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">Advantages:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.laser.advantages.map((adv: string, idx: number) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-orange-700">Limitations:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.laser.limitations.map((lim: string, idx: number) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Infrared Sensor Technical Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">Infrared Spectroscopy System</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Wavelength</p>
                  <p className="text-lg font-semibold text-purple-600">{technicalData.infrared.wavelength}nm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperature</p>
                  <p className="text-lg font-semibold text-purple-600">{technicalData.environmental.temperature?.toFixed(1)}°C</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Signal Strength</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.infrared.signal_strength?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Accuracy</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.infrared.accuracy?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Detection Principle</h4>
                <p className="text-sm text-purple-800 mb-2">{technicalData.infrared.principle}</p>
                <p className="text-xs text-purple-700">{technicalData.infrared.detection_method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">Advantages:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.infrared.advantages.map((adv: string, idx: number) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-orange-700">Limitations:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.infrared.limitations.map((lim: string, idx: number) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fusion Algorithm Performance */}
      {technicalData && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Fusion Algorithm Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">Algorithm Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Method:</p>
                  <p className="font-medium">{technicalData.fusion.algorithm}</p>
                </div>
                <div>
                  <p className="text-gray-600">Sampling Rate:</p>
                  <p className="font-medium">{technicalSpecs.sampling_rate}Hz</p>
                </div>
                <div>
                  <p className="text-gray-600">Detection Threshold:</p>
                  <p className="font-medium">{technicalSpecs.detection_threshold}ppm</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Fused Accuracy:</p>
                  <p className="font-medium text-green-600">{technicalData.fusion.accuracy?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Detection Confidence:</p>
                  <p className="font-medium text-blue-600">{(technicalData.fusion.confidence! * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Cross-Validation Score:</p>
                  <p className="font-medium text-green-600">{(technicalSpecs.accuracy_validation.cross_validation_score * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-orange-600">Environmental Factors</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Water Turbidity:</p>
                  <p className="font-medium">{(technicalData.environmental.turbidity * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Sensor Temperature:</p>
                  <p className="font-medium">{technicalData.environmental.temperature?.toFixed(1)}°C</p>
                </div>
                <div>
                  <p className="text-gray-600">Calibration Status:</p>
                  <p className={`font-medium ${
                    technicalData.environmental.calibration_status === 'Calibrated' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {technicalData.environmental.calibration_status}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How the Fusion Algorithm Works</h4>
            <p className="text-sm text-blue-800">{technicalData.fusion.method}</p>
          </div>
        </div>
      )}

      {/* Accuracy Validation Results */}
      {validationData && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Accuracy Validation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-red-600">Laser Sensor Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Accuracy:</span>
                  <span className="font-medium">{validationData.laser.average_accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.laser.stability === 'Stable' ? 'text-green-600' : 'text-orange-600'}`}>
                    {validationData.laser.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard Deviation:</span>
                  <span className="font-medium">{validationData.laser.standard_deviation.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    validationData.laser.status === 'Optimal' ? 'text-green-600' : 
                    validationData.laser.status === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {validationData.laser.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-purple-600">Infrared Sensor Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Accuracy:</span>
                  <span className="font-medium">{validationData.infrared.average_accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.infrared.stability === 'Stable' ? 'text-green-600' : 'text-orange-600'}`}>
                    {validationData.infrared.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard Deviation:</span>
                  <span className="font-medium">{validationData.infrared.standard_deviation.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    validationData.infrared.status === 'Optimal' ? 'text-green-600' : 
                    validationData.infrared.status === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {validationData.infrared.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Fusion Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fused Accuracy:</span>
                  <span className="font-medium text-blue-600">{validationData.fusion.average_accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Improvement:</span>
                  <span className="font-medium text-green-600">+{validationData.fusion.improvement_over_individual.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reliability Score:</span>
                  <span className="font-medium text-blue-600">{(validationData.fusion.reliability_score * 100).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">Recommendation:</p>
                <p className="text-xs text-blue-600">{validationData.fusion.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backend Processing Explanation */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend Processing & Accuracy Validation</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Data Processing Pipeline</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Raw Data Acquisition</p>
                    <p className="text-xs text-gray-600">Simultaneous sampling from both sensors at {technicalSpecs.sampling_rate}Hz</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Signal Processing</p>
                    <p className="text-xs text-gray-600">Noise filtering, baseline correction, and signal enhancement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div>
                    <p className="font-medium text-sm">Feature Extraction</p>
                    <p className="text-xs text-gray-600">Particle size from laser, chemical signature from infrared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div>
                    <p className="font-medium text-sm">Bayesian Fusion</p>
                    <p className="text-xs text-gray-600">Weighted combination based on sensor confidence and environmental factors</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Accuracy Validation Methods</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Cross-Validation</p>
                    <p className="text-xs text-gray-600">K-fold validation against known standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Statistical Analysis</p>
                    <p className="text-xs text-gray-600">Standard deviation and confidence interval calculation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Environmental Compensation</p>
                    <p className="text-xs text-gray-600">Real-time adjustment for turbidity, temperature, and depth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Kalman Filtering</p>
                    <p className="text-xs text-gray-600">Temporal consistency and noise reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current System Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Overall Accuracy:</p>
                <p className="font-medium text-green-600">{technicalData.fusion.accuracy?.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Error Margin:</p>
                <p className="font-medium">±{(technicalSpecs.accuracy_validation.error_margin * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Statistical Confidence:</p>
                <p className="font-medium text-blue-600">{(technicalSpecs.accuracy_validation.statistical_confidence * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Last Calibration:</p>
                <p className="font-medium">{technicalSpecs.calibration_date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}