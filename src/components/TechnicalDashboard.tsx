import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export function TechnicalDashboard() {
  const { sensorData, activeBoats, technicalSpecs, getSensorTechnicalData, validateSensorPerformance, getUnifiedSensorMetrics } = useData();
  const [selectedBoat, setSelectedBoat] = useState(activeBoats[0] || 'B1');

  const technicalData = getSensorTechnicalData(selectedBoat);
  const validationData = validateSensorPerformance(selectedBoat);
  const unifiedMetrics = getUnifiedSensorMetrics(selectedBoat);
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
          {/* Unified Dual Ray Sensor Technical Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">Unified Dual Ray Sensor</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Wavelengths</p>
                  <p className="text-lg font-semibold text-blue-600">{technicalData.dual_ray_sensor.wavelengths.join('nm, ')}nm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Combined Power</p>
                  <p className="text-lg font-semibold text-blue-600">{technicalData.dual_ray_sensor.combined_power}mW</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Laser Signal</p>
                  <p className="text-lg font-semibold text-red-600">{technicalData.dual_ray_sensor.laser_signal?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Infrared Signal</p>
                  <p className="text-lg font-semibold text-purple-600">{technicalData.dual_ray_sensor.infrared_signal?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Detection Principle</h4>
                <p className="text-sm text-blue-800 mb-2">{technicalData.dual_ray_sensor.principle}</p>
                <p className="text-xs text-blue-700">{technicalData.dual_ray_sensor.detection_method}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Optical Design</h4>
                <p className="text-sm text-gray-800 mb-1"><strong>Architecture:</strong> {technicalData.dual_ray_sensor.optical_design}</p>
                <p className="text-sm text-gray-800"><strong>Integration:</strong> {technicalData.dual_ray_sensor.integration_method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">Advantages:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.dual_ray_sensor.advantages.map((adv: string, idx: number) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-orange-700">Limitations:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.dual_ray_sensor.limitations.map((lim: string, idx: number) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Signal Processing Technical Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">Signal Processing Engine</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Algorithm</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.signal_processing.algorithm}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Laser Status</p>
                  <p className={`text-lg font-semibold ${
                    technicalData.signal_processing.laser_status === 'active' ? 'text-green-600' : 
                    technicalData.signal_processing.laser_status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {technicalData.signal_processing.laser_status?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Infrared Status</p>
                  <p className={`text-lg font-semibold ${
                    technicalData.signal_processing.infrared_status === 'active' ? 'text-green-600' : 
                    technicalData.signal_processing.infrared_status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {technicalData.signal_processing.infrared_status?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Optical Alignment</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.signal_processing.optical_alignment?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Processing Method</h4>
                <p className="text-sm text-green-800 mb-2">{technicalData.signal_processing.method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">Benefits:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.signal_processing.benefits.map((benefit: string, idx: number) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Sensor Architecture */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Unified Sensor Architecture & Development</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">How Single Sensor Was Developed</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                <div>
                  <p className="font-medium text-sm">Coaxial Beam Architecture</p>
                  <p className="text-xs text-gray-600">Laser and infrared beams share the same optical axis using dichroic beam splitter technology</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                <div>
                  <p className="font-medium text-sm">Shared Optical Path</p>
                  <p className="text-xs text-gray-600">Single lens system focuses both wavelengths simultaneously on the same sample volume</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                <div>
                  <p className="font-medium text-sm">Integrated Detection</p>
                  <p className="text-xs text-gray-600">Dual photodetectors with wavelength-selective filters capture both signals simultaneously</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                <div>
                  <p className="font-medium text-sm">Digital Signal Correlation</p>
                  <p className="text-xs text-gray-600">Real-time cross-correlation algorithms combine laser scattering and infrared absorption data</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Technical Implementation</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Optical Path Length:</span>
                <span className="font-medium">15mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Beam Combining Efficiency:</span>
                <span className="font-medium text-green-600">92.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Dichroic Filter Efficiency:</span>
                <span className="font-medium text-blue-600">98.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Temporal Alignment:</span>
                <span className="font-medium text-green-600">{(technicalSpecs.technical_validation.temporal_alignment * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Signal-to-Noise Ratio:</span>
                <span className="font-medium text-green-600">{technicalSpecs.technical_validation.signal_to_noise_ratio}dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Validation Results */}
      {validationData && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Performance Validation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Dual Ray Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Accuracy:</span>
                  <span className="font-medium">{validationData.dual_ray_performance.average_accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.dual_ray_performance.stability === 'Excellent' ? 'text-green-600' : validationData.dual_ray_performance.stability === 'Stable' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {validationData.dual_ray_performance.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard Deviation:</span>
                  <span className="font-medium">{validationData.dual_ray_performance.standard_deviation.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    validationData.dual_ray_performance.status === 'Optimal' ? 'text-green-600' : 
                    validationData.dual_ray_performance.status === 'Good' ? 'text-blue-600' :
                    validationData.dual_ray_performance.status === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {validationData.dual_ray_performance.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-red-600">Laser Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Signal:</span>
                  <span className="font-medium">{validationData.laser_performance.average_signal.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.laser_performance.stability === 'Excellent' ? 'text-green-600' : validationData.laser_performance.stability === 'Stable' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {validationData.laser_performance.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    validationData.laser_performance.status === 'Optimal' ? 'text-green-600' : 
                    validationData.laser_performance.status === 'Good' ? 'text-blue-600' :
                    validationData.laser_performance.status === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {validationData.laser_performance.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-purple-600">Infrared Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Signal:</span>
                  <span className="font-medium">{validationData.infrared_performance.average_signal.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Combined Performance:</span>
                  <span className="font-medium text-green-600">{validationData.infrared_performance.combined_performance.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reliability Score:</span>
                  <span className="font-medium text-green-600">{validationData.infrared_performance.reliability_score.toFixed(3)}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-medium">System Recommendation:</p>
                <p className="text-xs text-green-600">{validationData.infrared_performance.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backend Processing Explanation */}
      {unifiedMetrics && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backend Processing & Technical Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Optical System Design</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Architecture:</span>
                  <span className="font-medium text-xs">{unifiedMetrics.optical_system.design}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Integration Method:</span>
                  <span className="font-medium text-xs">{unifiedMetrics.optical_system.integration_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Alignment Accuracy:</span>
                  <span className="font-medium">{unifiedMetrics.optical_system.alignment_accuracy?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Beam Combining:</span>
                  <span className="font-medium">{unifiedMetrics.optical_system.beam_combining_efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optical Path:</span>
                  <span className="font-medium">{unifiedMetrics.optical_system.optical_path_length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dichroic Efficiency:</span>
                  <span className="font-medium text-green-600">{unifiedMetrics.optical_system.dichroic_efficiency}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Signal Correlation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Algorithm:</span>
                  <span className="font-medium text-xs">{unifiedMetrics.signal_correlation.correlation_algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temporal Alignment:</span>
                  <span className="font-medium">{(unifiedMetrics.signal_correlation.temporal_alignment * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signal-to-Noise:</span>
                  <span className="font-medium text-green-600">{unifiedMetrics.signal_correlation.signal_to_noise_ratio}dB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Correlation Coeff:</span>
                  <span className="font-medium">{unifiedMetrics.signal_correlation.correlation_coefficient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phase Stability:</span>
                  <span className="font-medium text-blue-600">{unifiedMetrics.signal_correlation.phase_stability}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Wavelength Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Laser Wavelength:</span>
                  <span className="font-medium text-red-600">{unifiedMetrics.wavelength_analysis.laser_wavelength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Infrared Wavelength:</span>
                  <span className="font-medium text-purple-600">{unifiedMetrics.wavelength_analysis.infrared_wavelength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wavelength Stability:</span>
                  <span className="font-medium text-green-600">{unifiedMetrics.wavelength_analysis.wavelength_stability?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spectral Resolution:</span>
                  <span className="font-medium">{unifiedMetrics.wavelength_analysis.spectral_resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Detection Bandwidth:</span>
                  <span className="font-medium">{unifiedMetrics.wavelength_analysis.detection_bandwidth}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Real-time Processing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium text-green-600">{unifiedMetrics.real_time_processing.processing_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Throughput:</span>
                  <span className="font-medium">{unifiedMetrics.real_time_processing.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Digital Filtering:</span>
                  <span className="font-medium text-blue-600">{unifiedMetrics.real_time_processing.digital_filtering}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signal Conditioning:</span>
                  <span className="font-medium">{unifiedMetrics.real_time_processing.signal_conditioning}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Unified Sensor Development Process</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Hardware Integration Process</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Optical Design Phase</p>
                    <p className="text-xs text-gray-600">Design coaxial beam architecture with dichroic beam splitter for wavelength separation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Mechanical Integration</p>
                    <p className="text-xs text-gray-600">Precision alignment of laser diode, infrared LED, and photodetectors in single housing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div>
                    <p className="font-medium text-sm">Electronic Synchronization</p>
                    <p className="text-xs text-gray-600">Phase-locked loop circuits ensure perfect temporal alignment of both wavelengths</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div>
                    <p className="font-medium text-sm">Calibration & Testing</p>
                    <p className="text-xs text-gray-600">Multi-point calibration with known particle standards and cross-validation</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Software Processing Pipeline</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Signal Acquisition</p>
                    <p className="text-xs text-gray-600">Simultaneous sampling of laser scattering and infrared absorption at 10Hz</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Digital Filtering</p>
                    <p className="text-xs text-gray-600">Noise reduction and signal conditioning using Kalman filters and moving averages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                  <div>
                    <p className="font-medium text-sm">Cross-Correlation Analysis</p>
                    <p className="text-xs text-gray-600">Mathematical correlation of laser and infrared signals for enhanced detection accuracy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">4</div>
                  <div>
                    <p className="font-medium text-sm">Output Generation</p>
                    <p className="text-xs text-gray-600">Real-time particle concentration and size estimation with confidence intervals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Key Technical Achievements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Optical Efficiency:</p>
                <p className="font-medium text-green-600">{(technicalSpecs.technical_validation.optical_efficiency * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Laser Stability:</p>
                <p className="font-medium text-blue-600">{(technicalSpecs.technical_validation.laser_stability * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Infrared Stability:</p>
                <p className="font-medium text-purple-600">{(technicalSpecs.technical_validation.infrared_stability * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Temporal Alignment:</p>
                <p className="font-medium text-green-600">{(technicalSpecs.technical_validation.temporal_alignment * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}