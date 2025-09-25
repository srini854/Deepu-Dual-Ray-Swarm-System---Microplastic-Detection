import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export function TechnicalDashboard() {
  const { sensorData, activeBoats, technicalSpecs, getSensorTechnicalData, validateSensorAccuracy, getAIFusionMetrics } = useData();
  const [selectedBoat, setSelectedBoat] = useState(activeBoats[0] || 'B1');

  const technicalData = getSensorTechnicalData(selectedBoat);
  const validationData = validateSensorAccuracy(selectedBoat);
  const aiFusionData = getAIFusionMetrics(selectedBoat);
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
                  <p className="text-lg font-semibold text-blue-600">{technicalData.unified_sensor.wavelengths.join('nm, ')}nm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Combined Power</p>
                  <p className="text-lg font-semibold text-blue-600">{technicalData.unified_sensor.combined_power}mW</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Signal Strength</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.unified_sensor.signal_strength?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Accuracy</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.unified_sensor.accuracy?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Detection Principle</h4>
                <p className="text-sm text-blue-800 mb-2">{technicalData.unified_sensor.principle}</p>
                <p className="text-xs text-blue-700">{technicalData.unified_sensor.detection_method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">Advantages:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.unified_sensor.advantages.map((adv: string, idx: number) => (
                      <li key={idx}>{adv}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-orange-700">Limitations:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.unified_sensor.limitations.map((lim: string, idx: number) => (
                      <li key={idx}>{lim}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AI/ML Fusion Engine Technical Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">AI/ML Fusion Engine</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Model Version</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.ai_fusion.model_version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AI Confidence</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.ai_fusion.ai_confidence?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ML Quality</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.ai_fusion.ml_quality?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Neural Output</p>
                  <p className="text-lg font-semibold text-green-600">{technicalData.ai_fusion.neural_output?.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">AI Architecture</h4>
                <p className="text-sm text-green-800 mb-2">{technicalData.ai_fusion.architecture}</p>
                <p className="text-xs text-green-700">{technicalData.ai_fusion.method}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h5 className="text-sm font-medium text-green-700">AI Benefits:</h5>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                    {technicalData.ai_fusion.benefits.map((adv: string, idx: number) => (
                      <li key={idx}>{adv}</li>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI/ML Fusion Algorithm Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-600">AI Algorithm Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Method:</p>
                  <p className="font-medium">{technicalData.ai_fusion.algorithm}</p>
                </div>
                <div>
                  <p className="text-gray-600">Model Version:</p>
                  <p className="font-medium">{technicalData.ai_fusion.model_version}</p>
                </div>
                <div>
                  <p className="text-gray-600">Architecture:</p>
                  <p className="font-medium text-xs">{technicalData.ai_fusion.architecture}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-green-600">AI Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Unified Accuracy:</p>
                  <p className="font-medium text-green-600">{technicalData.ai_fusion.accuracy?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">AI Confidence:</p>
                  <p className="font-medium text-blue-600">{technicalData.ai_fusion.ai_confidence?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Ensemble Score:</p>
                  <p className="font-medium text-green-600">{technicalData.ai_fusion.ensemble_score?.toFixed(1)}%</p>
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
            <h4 className="font-medium text-blue-900 mb-2">How the AI Fusion Algorithm Works</h4>
            <p className="text-sm text-blue-800">{technicalData.ai_fusion.method}</p>
          </div>
        </div>
      )}

      {/* Accuracy Validation Results */}
      {validationData && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI/ML System Validation Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-blue-600">Unified Sensor Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Accuracy:</span>
                  <span className="font-medium">{validationData.unified_sensor.average_accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.unified_sensor.stability === 'Excellent' ? 'text-green-600' : validationData.unified_sensor.stability === 'Stable' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {validationData.unified_sensor.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard Deviation:</span>
                  <span className="font-medium">{validationData.unified_sensor.standard_deviation.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    validationData.unified_sensor.status === 'Optimal' ? 'text-green-600' : 
                    validationData.unified_sensor.status === 'Good' ? 'text-blue-600' :
                    validationData.unified_sensor.status === 'Acceptable' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {validationData.unified_sensor.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-green-600">AI System Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Confidence:</span>
                  <span className="font-medium">{validationData.ai_system.average_confidence.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ML Quality:</span>
                  <span className="font-medium text-green-600">{validationData.ai_system.ml_quality.toFixed(1)}%</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Stability:</span>
                  <span className={`font-medium ${validationData.ai_system.stability === 'Excellent' ? 'text-green-600' : validationData.ai_system.stability === 'Stable' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {validationData.ai_system.stability}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">AI Performance:</span>
                  <span className="font-medium text-green-600">{validationData.ai_system.ai_performance.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-700 font-medium">AI Recommendation:</p>
                <p className="text-xs text-green-600">{validationData.ai_system.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backend Processing Explanation */}
      {aiFusionData && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI/ML Fusion Engine Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Neural Network Architecture</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span className="font-medium text-xs">{aiFusionData.neural_network.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Layers:</span>
                  <span className="font-medium">{aiFusionData.neural_network.processing_layers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attention Heads:</span>
                  <span className="font-medium">{aiFusionData.neural_network.attention_heads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parameters:</span>
                  <span className="font-medium">{aiFusionData.neural_network.parameters}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Ensemble Learning</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Models Count:</span>
                  <span className="font-medium">{aiFusionData.ensemble_learning.models_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voting Strategy:</span>
                  <span className="font-medium text-xs">{aiFusionData.ensemble_learning.voting_strategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diversity Index:</span>
                  <span className="font-medium">{aiFusionData.ensemble_learning.diversity_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ensemble Score:</span>
                  <span className="font-medium text-green-600">{aiFusionData.ensemble_learning.ensemble_score?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Spectral Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wavelength Bands:</span>
                  <span className="font-medium">{aiFusionData.spectral_analysis.wavelength_bands}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spectral Resolution:</span>
                  <span className="font-medium">{aiFusionData.spectral_analysis.spectral_resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Feature Extraction:</span>
                  <span className="font-medium text-xs">{aiFusionData.spectral_analysis.feature_extraction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signature Quality:</span>
                  <span className="font-medium text-blue-600">{aiFusionData.spectral_analysis.signature_quality?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Real-time Processing</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inference Time:</span>
                  <span className="font-medium text-green-600">{aiFusionData.real_time_processing.inference_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Throughput:</span>
                  <span className="font-medium">{aiFusionData.real_time_processing.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edge Computing:</span>
                  <span className="font-medium text-blue-600">{aiFusionData.real_time_processing.edge_computing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model Compression:</span>
                  <span className="font-medium">{aiFusionData.real_time_processing.model_compression}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI/ML Backend Processing & Validation</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">AI/ML Processing Pipeline</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <p className="font-medium text-sm">Unified Dual-Ray Capture</p>
                    <p className="text-xs text-gray-600">Simultaneous laser + infrared sampling at {technicalSpecs.sampling_rate}Hz with perfect temporal alignment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">2</div>
                  <div>
                    <p className="font-medium text-sm">Neural Network Processing</p>
                    <p className="text-xs text-gray-600">Deep learning feature extraction with attention mechanisms and spectral analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">3</div>
                  <div>
                    <p className="font-medium text-sm">AI Fusion & Ensemble</p>
                    <p className="text-xs text-gray-600">Multi-model ensemble voting with confidence weighting and uncertainty quantification</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">4</div>
                  <div>
                    <p className="font-medium text-sm">Real-time Optimization</p>
                    <p className="text-xs text-gray-600">Adaptive learning, environmental compensation, and continuous model improvement</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">AI/ML Validation Methods</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">AI Model Validation</p>
                    <p className="text-xs text-gray-600">K-fold cross-validation with stratified sampling and temporal splits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Ensemble Validation</p>
                    <p className="text-xs text-gray-600">Multi-model performance assessment with diversity metrics and bias-variance analysis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Uncertainty Quantification</p>
                    <p className="text-xs text-gray-600">Bayesian neural networks for confidence estimation and prediction intervals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">✓</div>
                  <div>
                    <p className="font-medium text-sm">Adaptive Learning</p>
                    <p className="text-xs text-gray-600">Online learning with concept drift detection and model adaptation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current AI System Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Unified Accuracy:</p>
                <p className="font-medium text-green-600">{technicalData.ai_fusion.accuracy?.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">AI Error Margin:</p>
                <p className="font-medium">±{(technicalSpecs.accuracy_validation.error_margin * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">AI Model Accuracy:</p>
                <p className="font-medium text-blue-600">{(technicalSpecs.accuracy_validation.ai_model_accuracy * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-600">Ensemble Performance:</p>
                <p className="font-medium text-green-600">{(technicalSpecs.accuracy_validation.ensemble_performance * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}