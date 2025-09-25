import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, CheckCircle, XCircle, Bell } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  boatId?: string;
}

export function AlertPanel() {
  const { sensorData, activeBoats } = useData();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Generate alerts based on sensor data
    const newAlerts: Alert[] = [];
    
    activeBoats.forEach(boatId => {
      const latestReading = sensorData.filter(d => d.boat_id === boatId).pop();
      if (!latestReading) return;

      // High concentration alert
      if (latestReading.concentration_ppm > 4.0) {
        newAlerts.push({
          id: `${boatId}-concentration-${Date.now()}`,
          type: 'warning',
          message: `High microplastic concentration detected: ${latestReading.concentration_ppm.toFixed(2)} ppm`,
          timestamp: new Date(),
          boatId
        });
      }

      // Low battery alert
      if (latestReading.battery_status < 25) {
        newAlerts.push({
          id: `${boatId}-battery-${Date.now()}`,
          type: latestReading.battery_status < 15 ? 'error' : 'warning',
          message: `Low battery warning: ${latestReading.battery_status}%`,
          timestamp: new Date(),
          boatId
        });
      }

      // Large particle detection
      if (latestReading.particle_size_microns > 60) {
        newAlerts.push({
          id: `${boatId}-particle-${Date.now()}`,
          type: 'info',
          message: `Large particle detected: ${latestReading.particle_size_microns.toFixed(1)} μm`,
          timestamp: new Date(),
          boatId
        });
      }
    });

    // Add new alerts and remove old ones (keep last 10)
    setAlerts(prev => [...prev, ...newAlerts].slice(-10));
  }, [sensorData, activeBoats]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="alert-icon error" />;
      case 'warning': return <AlertTriangle className="alert-icon warning" />;
      case 'info': return <CheckCircle className="alert-icon info" />;
      default: return <Bell className="alert-icon" />;
    }
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="alert-panel">
      <div className="section-header">
        <h3>System Alerts</h3>
        <div className="alert-count">
          {alerts.length} active
        </div>
      </div>

      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle className="no-alerts-icon" />
            <span>All systems normal</span>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <div className="alert-content">
                {getAlertIcon(alert.type)}
                <div className="alert-details">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-meta">
                    {alert.boatId && <span className="boat-tag">{alert.boatId}</span>}
                    <span className="alert-time">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="alert-dismiss"
                onClick={() => clearAlert(alert.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .alert-panel {
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

        .alert-count {
          font-size: 14px;
          color: #64748b;
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 12px;
        }

        .alert-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .no-alerts {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px;
          color: #64748b;
        }

        .no-alerts-icon {
          width: 32px;
          height: 32px;
          color: #22c55e;
        }

        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid;
          animation: fadeIn 0.3s ease-out;
        }

        .alert-item.error {
          background: #fef2f2;
          border-left-color: #ef4444;
        }

        .alert-item.warning {
          background: #fffbeb;
          border-left-color: #f59e0b;
        }

        .alert-item.info {
          background: #eff6ff;
          border-left-color: #3b82f6;
        }

        .alert-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          flex: 1;
        }

        .alert-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .alert-icon.error {
          color: #ef4444;
        }

        .alert-icon.warning {
          color: #f59e0b;
        }

        .alert-icon.info {
          color: #3b82f6;
        }

        .alert-details {
          flex: 1;
        }

        .alert-message {
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .alert-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .boat-tag {
          background: #e2e8f0;
          color: #475569;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .alert-dismiss {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          padding: 4px;
          border-radius: 4px;
        }

        .alert-dismiss:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}