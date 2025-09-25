import React, { createContext, useContext, useState, useEffect } from 'react';

interface SensorReading {
  timestamp: string;
  boat_id: string;
  gps_lat: number;
  gps_long: number;
  particle_size_microns: number;
  concentration_ppm: number;
  depth_cm: number;
  collection_volume_ml: number;
  battery_status: number;
  power_source: string;
  laser_signal_strength: number;
  infrared_signal_strength: number;
  laser_status: 'active' | 'degraded' | 'offline';
  infrared_status: 'active' | 'degraded' | 'offline';
  optical_alignment: number;
  sensor_temperature: number;
  water_turbidity: number;
  detection_confidence: number;
  laser_wavelength_stability: number;
  infrared_wavelength_stability: number;
  unified_detection_accuracy: number;
}

interface SensorTechnicalData {
  dual_ray_wavelengths: number[]; // [laser_nm, infrared_nm]
  combined_power_output: number; // mW
  sampling_rate: number; // Hz
  detection_threshold: number; // ppm
  calibration_date: string;
  fusion_algorithm: string;
  sensor_integration_method: string;
  optical_design: string;
  technical_validation: {
    laser_stability: number;
    infrared_stability: number;
    temporal_alignment: number;
    optical_efficiency: number;
    signal_to_noise_ratio: number;
  };
}
interface DataContextType {
  sensorData: SensorReading[];
  activeBoats: string[];
  isConnected: boolean;
  lastUpdate: Date | null;
  technicalSpecs: SensorTechnicalData;
  getDualRayStatus: (boatId: string) => { laser: any; infrared: any; unified: any };
  getBoatStatus: (boatId: string) => 'active' | 'warning' | 'offline';
  getSensorTechnicalData: (boatId: string) => any;
  validateSensorPerformance: (boatId: string) => any;
  getUnifiedSensorMetrics: (boatId: string) => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [activeBoats, setActiveBoats] = useState<string[]>(['B1', 'B2', 'B3', 'B4', 'B5']);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Technical specifications for the dual ray sensors
  const technicalSpecs: SensorTechnicalData = {
    dual_ray_wavelengths: [650, 1550], // [laser_nm, infrared_nm]
    combined_power_output: 8, // mW (optimized combined output)
    sampling_rate: 10, // Hz
    detection_threshold: 0.1, // ppm
    calibration_date: '2024-09-01',
    fusion_algorithm: 'Optical Signal Processing with Digital Correlation',
    sensor_integration_method: 'Coaxial Dual-Beam Architecture',
    optical_design: 'Shared Optical Path with Dichroic Beam Splitter',
    technical_validation: {
      laser_stability: 0.98,
      infrared_stability: 0.96,
      temporal_alignment: 0.99,
      optical_efficiency: 0.92,
      signal_to_noise_ratio: 45.2
    }
  };

  // Simulate real-time data updates
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch('/dual_ray_swarm_synthetic ds.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n').slice(1); // Skip header
        
        const data: SensorReading[] = lines
          .filter(line => line.trim())
          .map(line => {
            const [timestamp, boat_id, gps_lat, gps_long, particle_size_microns, 
                   concentration_ppm, depth_cm, collection_volume_ml, battery_status, power_source] = line.split(',');
            
            // Calculate unified sensor metrics using AI/ML fusion
            // Calculate laser and infrared sensor metrics
            const laser_signal_strength = Math.min(100, 85 + Math.random() * 15);
            const infrared_signal_strength = Math.min(100, 80 + Math.random() * 20);
            const optical_alignment = Math.min(100, 92 + Math.random() * 8);
            const laser_wavelength_stability = Math.min(100, 95 + Math.random() * 5);
            const infrared_wavelength_stability = Math.min(100, 93 + Math.random() * 7);
            const unified_detection_accuracy = Math.min(98, (laser_signal_strength + infrared_signal_strength) / 2 + Math.random() * 5);
            
            // Determine sensor status based on signal strength
            const laser_status = laser_signal_strength > 85 ? 'active' : laser_signal_strength > 70 ? 'degraded' : 'offline';
            const infrared_status = infrared_signal_strength > 80 ? 'active' : infrared_signal_strength > 65 ? 'degraded' : 'offline';
            
            // Environmental factors
            const sensor_temperature = 20 + Math.random() * 15; // 20-35°C
            const water_turbidity = Math.random() * 0.5; // 0-0.5 NTU
            const detection_confidence = Math.min(100, unified_detection_accuracy + Math.random() * 3);
            
            return {
              timestamp,
              boat_id,
              gps_lat: parseFloat(gps_lat),
              gps_long: parseFloat(gps_long),
              particle_size_microns: parseFloat(particle_size_microns),
              concentration_ppm: parseFloat(concentration_ppm),
              depth_cm: parseInt(depth_cm),
              collection_volume_ml: parseInt(collection_volume_ml),
              battery_status: parseInt(battery_status),
              power_source,
              laser_signal_strength,
              infrared_signal_strength,
              laser_status,
              infrared_status,
              optical_alignment,
              sensor_temperature,
              water_turbidity,
              detection_confidence,
              laser_wavelength_stability,
              infrared_wavelength_stability,
              unified_detection_accuracy
            };
          });
        
        setSensorData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading sensor data:', error);
      }
    };

    loadInitialData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSensorData(prevData => {
        const latestData = [...prevData];
        
        // Simulate new readings for each boat
        activeBoats.forEach(boatId => {
          const lastReading = latestData.filter(d => d.boat_id === boatId).pop();
          if (lastReading) {
            const newReading: SensorReading = {
              ...lastReading,
              timestamp: new Date().toISOString(),
              particle_size_microns: Math.max(1, lastReading.particle_size_microns + (Math.random() - 0.5) * 5),
              concentration_ppm: Math.max(0, lastReading.concentration_ppm + (Math.random() - 0.5) * 0.5),
              battery_status: Math.max(0, Math.min(100, lastReading.battery_status + (Math.random() - 0.7) * 2)),
              laser_signal_strength: Math.min(100, 85 + Math.random() * 15),
              infrared_signal_strength: Math.min(100, 80 + Math.random() * 20),
              laser_status: Math.random() > 0.1 ? 'active' : 'degraded',
              infrared_status: Math.random() > 0.1 ? 'active' : 'degraded',
              optical_alignment: Math.min(100, 92 + Math.random() * 8),
              sensor_temperature: 20 + Math.random() * 15,
              water_turbidity: Math.random() * 0.5,
              detection_confidence: Math.min(100, 88 + Math.random() * 12),
              laser_wavelength_stability: Math.min(100, 95 + Math.random() * 5),
              infrared_wavelength_stability: Math.min(100, 93 + Math.random() * 7),
              unified_detection_accuracy: Math.min(98, 88 + Math.random() * 10)
            };
            latestData.push(newReading);
          }
        });
        
        // Keep only last 1000 readings
        return latestData.slice(-1000);
      });
      
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBoats]);

  const getDualRayStatus = (boatId: string) => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) {
      return { 
        laser: { status: 'offline', signal: 0, stability: 0 },
        infrared: { status: 'offline', signal: 0, stability: 0 },
        unified: { accuracy: 0, alignment: 0, confidence: 0 }
      };
    }
    
    return {
      laser: {
        status: latestReading.laser_status,
        signal: latestReading.laser_signal_strength,
        stability: latestReading.laser_wavelength_stability
      },
      infrared: {
        status: latestReading.infrared_status,
        signal: latestReading.infrared_signal_strength,
        stability: latestReading.infrared_wavelength_stability
      },
      unified: {
        accuracy: latestReading.unified_detection_accuracy,
        alignment: latestReading.optical_alignment,
        confidence: latestReading.detection_confidence
      }
    };
  };

  const getBoatStatus = (boatId: string): 'active' | 'warning' | 'offline' => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) return 'offline';
    
    const timeDiff = Date.now() - new Date(latestReading.timestamp).getTime();
    if (timeDiff > 300000) return 'offline'; // 5 minutes
    if (latestReading.battery_status < 20) return 'warning';
    if (latestReading.laser_status === 'offline' || latestReading.infrared_status === 'offline') return 'warning';
    if (latestReading.unified_detection_accuracy < 85) return 'warning';
    
    return 'active';
  };

  const getSensorTechnicalData = (boatId: string) => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) return null;
    
    return {
      dual_ray_sensor: {
        wavelengths: technicalSpecs.dual_ray_wavelengths,
        combined_power: technicalSpecs.combined_power_output,
        laser_signal: latestReading.laser_signal_strength,
        infrared_signal: latestReading.infrared_signal_strength,
        accuracy: latestReading.unified_detection_accuracy,
        principle: 'Unified Dual-Ray Spectroscopic Analysis',
        detection_method: 'Simultaneous laser scattering + infrared spectroscopy with optical signal processing',
        optical_design: technicalSpecs.optical_design,
        integration_method: technicalSpecs.sensor_integration_method,
        advantages: [
          'Single integrated sensor unit',
          'Enhanced accuracy through dual-wavelength analysis',
          'Real-time multi-modal analysis',
          'Reduced hardware complexity',
          'Perfect temporal alignment',
          'Shared optical path efficiency',
          'Environmental compensation'
        ],
        limitations: [
          'Requires precise optical alignment',
          'Sensitive to environmental conditions',
          'Complex calibration procedures'
        ]
      },
      signal_processing: {
        algorithm: technicalSpecs.fusion_algorithm,
        laser_status: latestReading.laser_status,
        infrared_status: latestReading.infrared_status,
        accuracy: latestReading.unified_detection_accuracy,
        confidence: latestReading.detection_confidence,
        optical_alignment: latestReading.optical_alignment,
        laser_stability: latestReading.laser_wavelength_stability,
        infrared_stability: latestReading.infrared_wavelength_stability,
        method: 'Digital signal correlation with optical beam combining and real-time processing',
        benefits: [
          'Superior accuracy through dual-wavelength correlation',
          'Real-time signal processing and analysis',
          'Reduced false positives via cross-validation',
          'Environmental drift compensation',
          'Multi-modal data fusion in single optical path'
        ]
      },
      environmental: {
        temperature: latestReading.sensor_temperature,
        turbidity: latestReading.water_turbidity,
        depth: latestReading.depth_cm,
        calibration_status: latestReading.calibration_status
      }
    };
  };

  const validateSensorPerformance = (boatId: string) => {
    const recentReadings = sensorData.filter(d => d.boat_id === boatId).slice(-10);
    if (recentReadings.length < 5) return null;
    
    const unifiedAccuracies = recentReadings.map(r => r.unified_detection_accuracy);
    const laserSignals = recentReadings.map(r => r.laser_signal_strength);
    const infraredSignals = recentReadings.map(r => r.infrared_signal_strength);
    
    const avgUnified = unifiedAccuracies.reduce((a, b) => a + b, 0) / unifiedAccuracies.length;
    const avgLaser = laserSignals.reduce((a, b) => a + b, 0) / laserSignals.length;
    const avgInfrared = infraredSignals.reduce((a, b) => a + b, 0) / infraredSignals.length;
    
    // Calculate standard deviation for stability assessment
    const unifiedStd = Math.sqrt(unifiedAccuracies.reduce((sum, val) => sum + Math.pow(val - avgUnified, 2), 0) / unifiedAccuracies.length);
    const laserStd = Math.sqrt(laserSignals.reduce((sum, val) => sum + Math.pow(val - avgLaser, 2), 0) / laserSignals.length);
    
    return {
      dual_ray_performance: {
        average_accuracy: avgUnified,
        stability: unifiedStd < 2 ? 'Excellent' : unifiedStd < 4 ? 'Stable' : 'Unstable',
        standard_deviation: unifiedStd,
        status: avgUnified > 90 ? 'Optimal' : avgUnified > 80 ? 'Good' : avgUnified > 70 ? 'Acceptable' : 'Poor'
      },
      laser_performance: {
        average_signal: avgLaser,
        stability: laserStd < 2 ? 'Excellent' : laserStd < 3 ? 'Stable' : 'Unstable',
        status: avgLaser > 90 ? 'Optimal' : avgLaser > 80 ? 'Good' : avgLaser > 70 ? 'Acceptable' : 'Poor'
      },
      infrared_performance: {
        average_signal: avgInfrared,
        combined_performance: (avgLaser + avgInfrared) / 2,
        reliability_score: (avgUnified / 100) * (1 - unifiedStd / 10),
        recommendation: avgUnified > 92 ? 'Dual ray system performing optimally' : 
                       avgUnified > 85 ? 'Consider optical recalibration' : 
                       avgUnified > 75 ? 'Sensor alignment adjustment recommended' : 'Immediate system maintenance required'
      }
    };
  };

  const getUnifiedSensorMetrics = (boatId: string) => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) return null;

    return {
      optical_system: {
        design: technicalSpecs.optical_design,
        integration_method: technicalSpecs.sensor_integration_method,
        alignment_accuracy: latestReading.optical_alignment,
        beam_combining_efficiency: 92.5,
        optical_path_length: '15mm',
        dichroic_efficiency: '98.2%'
      },
      signal_correlation: {
        correlation_algorithm: 'Cross-Correlation with Phase Lock',
        temporal_alignment: technicalSpecs.technical_validation.temporal_alignment,
        signal_to_noise_ratio: technicalSpecs.technical_validation.signal_to_noise_ratio,
        correlation_coefficient: 0.94,
        phase_stability: '±0.1°'
      },
      wavelength_analysis: {
        wavelength_bands: technicalSpecs.dual_ray_wavelengths.length,
        laser_wavelength: `${technicalSpecs.dual_ray_wavelengths[0]}nm`,
        infrared_wavelength: `${technicalSpecs.dual_ray_wavelengths[1]}nm`,
        wavelength_stability: (latestReading.laser_wavelength_stability + latestReading.infrared_wavelength_stability) / 2,
        spectral_resolution: '0.5nm',
        detection_bandwidth: '±2nm'
      },
      real_time_processing: {
        processing_time: '< 10ms',
        throughput: '20 samples/sec',
        digital_filtering: 'Enabled',
        signal_conditioning: 'Hardware-based'
      }
    };
  };
  return (
    <DataContext.Provider value={{
      sensorData,
      activeBoats,
      isConnected,
      lastUpdate,
      technicalSpecs,
      getDualRayStatus,
      getBoatStatus,
      getSensorTechnicalData,
      validateSensorPerformance,
      getUnifiedSensorMetrics
    }}>
      {children}
    </DataContext.Provider>
  );
}