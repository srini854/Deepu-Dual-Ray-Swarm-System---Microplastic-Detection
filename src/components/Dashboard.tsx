import React from 'react';
import { SensorOverview } from './dashboard/SensorOverview';
import { BoatStatus } from './dashboard/BoatStatus';
import { RealTimeMetrics } from './dashboard/RealTimeMetrics';
import { AlertPanel } from './dashboard/AlertPanel';
import { SystemHealth } from './dashboard/SystemHealth';

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>System Dashboard</h2>
        <p>Real-time monitoring of dual ray swarm detection system</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section full-width">
          <SensorOverview />
        </div>
        
        <div className="dashboard-section">
          <BoatStatus />
        </div>
        
        <div className="dashboard-section">
          <RealTimeMetrics />
        </div>
        
        <div className="dashboard-section">
          <AlertPanel />
        </div>
        
        <div className="dashboard-section">
          <SystemHealth />
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h2 {
          font-size: 28px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .dashboard-header p {
          color: #64748b;
          font-size: 16px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          flex: 1;
        }

        .dashboard-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .dashboard-section.full-width {
          grid-column: 1 / -1;
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .dashboard-header h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}