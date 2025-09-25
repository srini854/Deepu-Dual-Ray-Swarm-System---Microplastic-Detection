import React from 'react';
import { useData } from '../../context/DataContext';
import { Server, Wifi, Database, Shield } from 'lucide-react';

export function SystemHealth() {
  const { isConnected, lastUpdate, sensorData } = useData();

  const getSystemMetrics = () => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    const recentData = sensorData.filter(d => 
      new Date(d.timestamp).getTime() > fiveMinutesAgo
    );

    return {
      dataIntegrity: Math.min(100, (recentData.length / 25) * 100), // Expected ~25 readings per 5min
      networkLatency: Math.random() * 50 + 10, // Simulated latency
      systemUptime: 99.7,
      securityStatus: 100
    };
  };

  const metrics = getSystemMetrics();

  const healthItems = [
    {
      icon: Server,
      label: 'Data Integrity',
      value: `${metrics.dataIntegrity.toFixed(1)}%`,
      status: metrics.dataIntegrity > 90 ? 'good' : metrics.dataIntegrity > 70 ? 'warning' : 'error'
    },
    {
      icon: Wifi,
      label: 'Network Latency',
      value: `${metrics.networkLatency.toFixed(0)}ms`,
      status: metrics.networkLatency < 30 ? 'good' : metrics.networkLatency < 60 ? 'warning' : 'error'
    },
    {
      icon: Database,
      label: 'System Uptime',
      value: `${metrics.systemUptime}%`,
      status: metrics.systemUptime > 99 ? 'good' : metrics.systemUptime > 95 ? 'warning' : 'error'
    },
    {
      icon: Shield,
      label: 'Security Status',
      value: `${metrics.securityStatus}%`,
      status: 'good'
    }
  ];

  return (
    <div className="system-health">
      <div className="section-header">
        <h3>System Health</h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="health-grid">
        {healthItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className={`health-item ${item.status}`}>
              <div className="health-icon-container">
                <Icon className="health-icon" />
              </div>
              <div className="health-info">
                <div className="health-label">{item.label}</div>
                <div className="health-value">{item.value}</div>
              </div>
              <div className={`health-indicator ${item.status}`}></div>
            </div>
          );
        })}
      </div>

      <div className="last-update">
        <span>Last updated: </span>
        <span className="update-time">
          {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
        </span>
      </div>

      <style jsx>{`
        .system-health {
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

        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .connection-status.connected {
          color: #22c55e;
        }

        .connection-status.disconnected {
          color: #ef4444;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        .health-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .health-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          position: relative;
        }

        .health-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: white;
        }

        .health-icon {
          width: 20px;
          height: 20px;
          color: #64748b;
        }

        .health-item.good .health-icon {
          color: #22c55e;
        }

        .health-item.warning .health-icon {
          color: #f59e0b;
        }

        .health-item.error .health-icon {
          color: #ef4444;
        }

        .health-info {
          flex: 1;
        }

        .health-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .health-value {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .health-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .health-indicator.good {
          background: #22c55e;
        }

        .health-indicator.warning {
          background: #f59e0b;
        }

        .health-indicator.error {
          background: #ef4444;
        }

        .last-update {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
        }

        .update-time {
          font-weight: 600;
          color: #1e293b;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}