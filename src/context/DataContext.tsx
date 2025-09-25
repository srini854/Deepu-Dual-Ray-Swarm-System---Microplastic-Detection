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
  laser_accuracy?: number;
  infrared_accuracy?: number;
  fused_accuracy?: number;
  laser_signal_strength?: number;
  infrared_signal_strength?: number;
  calibration_status?: string;
  sensor_temperature?: number;
  water_turbidity?: number;
  detection_confidence?: number;
}

interface SensorTechnicalData {
  laser_wavelength: number; // nm
  laser_power: number; // mW
  infrared_wavelength: number; // nm
  sampling_rate: number; // Hz
  detection_threshold: number; // ppm
  calibration_date: string;
  fusion_algorithm: string;
  accuracy_validation: {
    cross_validation_score: number;
    statistical_confidence: number;
    error_margin: number;
  };
}
interface DataContextType {
  sensorData: SensorReading[];
  activeBoats: string[];
  isConnected: boolean;
  lastUpdate: Date | null;
  technicalSpecs: SensorTechnicalData;
  getSensorAccuracy: (boatId: string) => { laser: number; infrared: number; fused: number };
  getBoatStatus: (boatId: string) => 'active' | 'warning' | 'offline';
  getSensorTechnicalData: (boatId: string) => any;
  validateSensorAccuracy: (boatId: string) => any;
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
    laser_wavelength: 650, // nm
    laser_power: 5, // mW
    infrared_wavelength: 1550, // nm
    sampling_rate: 10, // Hz
    detection_threshold: 0.1, // ppm
    calibration_date: '2024-09-01',
    fusion_algorithm: 'Weighted Bayesian Fusion with Kalman Filtering',
    accuracy_validation: {
      cross_validation_score: 0.94,
      statistical_confidence: 0.96,
      error_margin: 0.05
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
            
            // Calculate sensor accuracies based on data quality
            const laser_accuracy = Math.min(95, 85 + (parseInt(battery_status) / 100) * 10);
            const infrared_accuracy = Math.min(92, 80 + (parseFloat(concentration_ppm) / 5) * 12);
            const fused_accuracy = Math.min(98, (laser_accuracy + infrared_accuracy) / 2 + 3);
            
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
              laser_accuracy,
              infrared_accuracy,
              fused_accuracy
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
              laser_accuracy: Math.min(95, 85 + Math.random() * 10),
              infrared_accuracy: Math.min(92, 80 + Math.random() * 12),
            };
            newReading.fused_accuracy = Math.min(98, (newReading.laser_accuracy! + newReading.infrared_accuracy!) / 2 + 3);
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

  const getSensorAccuracy = (boatId: string) => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) {
      return { laser: 0, infrared: 0, fused: 0 };
    }
    
    return {
      laser: latestReading.laser_accuracy || 0,
      infrared: latestReading.infrared_accuracy || 0,
      fused: latestReading.fused_accuracy || 0
    };
  };

  const getBoatStatus = (boatId: string): 'active' | 'warning' | 'offline' => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) return 'offline';
    
    const timeDiff = Date.now() - new Date(latestReading.timestamp).getTime();
    if (timeDiff > 300000) return 'offline'; // 5 minutes
    if (latestReading.battery_status < 20) return 'warning';
    if (latestReading.fused_accuracy! < 85) return 'warning';
    
    return 'active';
  };

  const getSensorTechnicalData = (boatId: string) => {
    const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
    if (!latestReading) return null;
    
    return {
      laser: {
        wavelength: technicalSpecs.laser_wavelength,
        power: technicalSpecs.laser_power,
        signal_strength: latestReading.laser_signal_strength,
        accuracy: latestReading.laser_accuracy,
        principle: 'Light Scattering Analysis',
        detection_method: 'Mie scattering for particle size distribution',
        advantages: ['High precision for particle counting', 'Real-time detection', 'Size classification'],
        limitations: ['Affected by water turbidity', 'Cannot identify plastic type']
      },
      infrared: {
        wavelength: technicalSpecs.infrared_wavelength,
        signal_strength: latestReading.infrared_signal_strength,
        accuracy: latestReading.infrared_accuracy,
        principle: 'Near-Infrared Spectroscopy (NIRS)',
        detection_method: 'Chemical fingerprint analysis of C-H bonds',
        advantages: ['Chemical identification', 'Plastic type classification', 'Concentration measurement'],
        limitations: ['Lower spatial resolution', 'Temperature sensitive']
      },
      fusion: {
        algorithm: technicalSpecs.fusion_algorithm,
        accuracy: latestReading.fused_accuracy,
        confidence: latestReading.detection_confidence,
        method: 'Weighted Bayesian fusion with Kalman filtering for optimal accuracy',
        benefits: ['Combines spatial and chemical data', 'Reduces false positives', 'Enhanced reliability']
      },
      environmental: {
        temperature: latestReading.sensor_temperature,
        turbidity: latestReading.water_turbidity,
        depth: latestReading.depth_cm,
        calibration_status: latestReading.calibration_status
      }
    };
  };

  const validateSensorAccuracy = (boatId: string) => {
    const recentReadings = sensorData.filter(d => d.boat_id === boatId).slice(-10);
    if (recentReadings.length < 5) return null;
    
    const laserAccuracies = recentReadings.map(r => r.laser_accuracy!);
    const infraredAccuracies = recentReadings.map(r => r.infrared_accuracy!);
    const fusedAccuracies = recentReadings.map(r => r.fused_accuracy!);
    
    const avgLaser = laserAccuracies.reduce((a, b) => a + b, 0) / laserAccuracies.length;
    const avgInfrared = infraredAccuracies.reduce((a, b) => a + b, 0) / infraredAccuracies.length;
    const avgFused = fusedAccuracies.reduce((a, b) => a + b, 0) / fusedAccuracies.length;
    
    // Calculate standard deviation for stability assessment
    const laserStd = Math.sqrt(laserAccuracies.reduce((sum, val) => sum + Math.pow(val - avgLaser, 2), 0) / laserAccuracies.length);
    const infraredStd = Math.sqrt(infraredAccuracies.reduce((sum, val) => sum + Math.pow(val - avgInfrared, 2), 0) / infraredAccuracies.length);
    
    return {
      laser: {
        average_accuracy: avgLaser,
        stability: laserStd < 3 ? 'Stable' : 'Unstable',
        standard_deviation: laserStd,
        status: avgLaser > 85 ? 'Optimal' : avgLaser > 75 ? 'Acceptable' : 'Poor'
      },
      infrared: {
        average_accuracy: avgInfrared,
        stability: infraredStd < 3 ? 'Stable' : 'Unstable',
        standard_deviation: infraredStd,
        status: avgInfrared > 80 ? 'Optimal' : avgInfrared > 70 ? 'Acceptable' : 'Poor'
      },
      fusion: {
        average_accuracy: avgFused,
        improvement_over_individual: Math.max(0, avgFused - Math.max(avgLaser, avgInfrared)),
        reliability_score: (avgFused / 100) * (1 - Math.max(laserStd, infraredStd) / 10),
        recommendation: avgFused > 90 ? 'System performing optimally' : 
                       avgFused > 80 ? 'Consider recalibration' : 'Immediate maintenance required'
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
      getSensorAccuracy,
      getBoatStatus,
      getSensorTechnicalData,
      validateSensorAccuracy
    }}>
      {children}
    </DataContext.Provider>
  );
}