import React from 'react';
import { Waves, Activity, Wifi } from 'lucide-react';

export function Header() {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <Waves className="logo-icon" />
            <div className="logo-text">
              <h1>Dual Ray Swarm</h1>
              <span>Microplastic Detection System</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="status-indicators">
            <div className="status-item">
              <Activity className="status-icon active" />
              <span>5 Boats Active</span>
            </div>
            <div className="status-item">
              <Wifi className="status-icon connected" />
              <span>System Online</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="time-display">
            <span className="time">{currentTime}</span>
            <span className="date">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #0891b2 100%);
          color: white;
          padding: 16px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          color: #67e8f9;
        }

        .logo-text h1 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }

        .logo-text span {
          font-size: 12px;
          opacity: 0.8;
        }

        .status-indicators {
          display: flex;
          gap: 24px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .status-icon {
          width: 16px;
          height: 16px;
        }

        .status-icon.active {
          color: #22c55e;
        }

        .status-icon.connected {
          color: #67e8f9;
        }

        .time-display {
          text-align: right;
        }

        .time {
          display: block;
          font-size: 16px;
          font-weight: 600;
        }

        .date {
          font-size: 12px;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 16px;
          }
          
          .header-content {
            flex-direction: column;
            gap: 12px;
          }
          
          .status-indicators {
            gap: 16px;
          }
        }
      `}</style>
    </header>
  );
}