import React, { useState } from 'react';
import { Save, RefreshCw, AlertTriangle, Database } from 'lucide-react';

export function Settings() {
  const [settings, setSettings] = useState({
    alertThresholds: {
      highConcentration: 4.0,
      lowBattery: 25,
      largeParticle: 60
    },
    dataCollection: {
      samplingInterval: 3,
      retentionPeriod: 30,
      autoExport: true
    },
    sensorCalibration: {
      laserSensitivity: 92,
      infraredBaseline: 0.5,
      fusionWeight: 0.6
    },
    systemSettings: {
      notifications: true,
      darkMode: false,
      autoRefresh: true
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        alertThresholds: {
          highConcentration: 4.0,
          lowBattery: 25,
          largeParticle: 60
        },
        dataCollection: {
          samplingInterval: 3,
          retentionPeriod: 30,
          autoExport: true
        },
        sensorCalibration: {
          laserSensitivity: 92,
          infraredBaseline: 0.5,
          fusionWeight: 0.6
        },
        systemSettings: {
          notifications: true,
          darkMode: false,
          autoRefresh: true
        }
      });
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <div className="header-actions">
          <button className="reset-btn" onClick={handleReset}>
            <RefreshCw className="action-icon" />
            Reset to Defaults
          </button>
          <button 
            className={`save-btn ${saveStatus}`}
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
          >
            <Save className="action-icon" />
            {saveStatus === 'saving' ? 'Saving...' : 
             saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Alert Thresholds */}
        <div className="settings-section">
          <div className="section-header">
            <AlertTriangle className="section-icon" />
            <h3>Alert Thresholds</h3>
          </div>
          
          <div className="settings-group">
            <label className="setting-item">
              <span>High Concentration Alert (ppm)</span>
              <input
                type="number"
                step="0.1"
                value={settings.alertThresholds.highConcentration}
                onChange={(e) => updateSetting('alertThresholds', 'highConcentration', parseFloat(e.target.value))}
              />
            </label>
            
            <label className="setting-item">
              <span>Low Battery Alert (%)</span>
              <input
                type="number"
                value={settings.alertThresholds.lowBattery}
                onChange={(e) => updateSetting('alertThresholds', 'lowBattery', parseInt(e.target.value))}
              />
            </label>
            
            <label className="setting-item">
              <span>Large Particle Alert (μm)</span>
              <input
                type="number"
                value={settings.alertThresholds.largeParticle}
                onChange={(e) => updateSetting('alertThresholds', 'largeParticle', parseInt(e.target.value))}
              />
            </label>
          </div>
        </div>

        {/* Data Collection */}
        <div className="settings-section">
          <div className="section-header">
            <Database className="section-icon" />
            <h3>Data Collection</h3>
          </div>
          
          <div className="settings-group">
            <label className="setting-item">
              <span>Sampling Interval (seconds)</span>
              <input
                type="number"
                value={settings.dataCollection.samplingInterval}
                onChange={(e) => updateSetting('dataCollection', 'samplingInterval', parseInt(e.target.value))}
              />
            </label>
            
            <label className="setting-item">
              <span>Data Retention (days)</span>
              <input
                type="number"
                value={settings.dataCollection.retentionPeriod}
                onChange={(e) => updateSetting('dataCollection', 'retentionPeriod', parseInt(e.target.value))}
              />
            </label>
            
            <label className="setting-item checkbox">
              <span>Auto Export Daily Reports</span>
              <input
                type="checkbox"
                checked={settings.dataCollection.autoExport}
                onChange={(e) => updateSetting('dataCollection', 'autoExport', e.target.checked)}
              />
            </label>
          </div>
        </div>

        {/* Sensor Calibration */}
        <div className="settings-section">
          <div className="section-header">
            <Save className="section-icon" />
            <h3>Sensor Calibration</h3>
          </div>
          
          <div className="settings-group">
            <label className="setting-item">
              <span>Laser Sensitivity (%)</span>
              <input
                type="range"
                min="80"
                max="100"
                value={settings.sensorCalibration.laserSensitivity}
                onChange={(e) => updateSetting('sensorCalibration', 'laserSensitivity', parseInt(e.target.value))}
              />
              <span className="range-value">{settings.sensorCalibration.laserSensitivity}%</span>
            </label>
            
            <label className="setting-item">
              <span>Infrared Baseline (ppm)</span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.sensorCalibration.infraredBaseline}
                onChange={(e) => updateSetting('sensorCalibration', 'infraredBaseline', parseFloat(e.target.value))}
              />
              <span className="range-value">{settings.sensorCalibration.infraredBaseline}</span>
            </label>
            
            <label className="setting-item">
              <span>Fusion Algorithm Weight</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={settings.sensorCalibration.fusionWeight}
                onChange={(e) => updateSetting('sensorCalibration', 'fusionWeight', parseFloat(e.target.value))}
              />
              <span className="range-value">{settings.sensorCalibration.fusionWeight}</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-section">
          <div className="section-header">
            <RefreshCw className="section-icon" />
            <h3>System Settings</h3>
          </div>
          
          <div className="settings-group">
            <label className="setting-item checkbox">
              <span>Enable Notifications</span>
              <input
                type="checkbox"
                checked={settings.systemSettings.notifications}
                onChange={(e) => updateSetting('systemSettings', 'notifications', e.target.checked)}
              />
            </label>
            
            <label className="setting-item checkbox">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={settings.systemSettings.darkMode}
                onChange={(e) => updateSetting('systemSettings', 'darkMode', e.target.checked)}
              />
            </label>
            
            <label className="setting-item checkbox">
              <span>Auto Refresh Data</span>
              <input
                type="checkbox"
                checked={settings.systemSettings.autoRefresh}
                onChange={(e) => updateSetting('systemSettings', 'autoRefresh', e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .settings-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .reset-btn {
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

        .reset-btn:hover {
          background: #f8fafc;
          border-color: #ef4444;
          color: #ef4444;
        }

        .save-btn {
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

        .save-btn:hover {
          background: #1d4ed8;
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .save-btn.saved {
          background: #22c55e;
        }

        .action-icon {
          width: 16px;
          height: 16px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          flex: 1;
        }

        .settings-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .section-icon {
          width: 20px;
          height: 20px;
          color: #3b82f6;
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 14px;
          color: #1e293b;
        }

        .setting-item.checkbox {
          cursor: pointer;
        }

        .setting-item span:first-child {
          font-weight: 500;
        }

        .setting-item input[type="number"],
        .setting-item input[type="range"] {
          padding: 6px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          width: 120px;
        }

        .setting-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #3b82f6;
        }

        .range-value {
          font-weight: 600;
          color: #3b82f6;
          min-width: 40px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          
          .settings-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}