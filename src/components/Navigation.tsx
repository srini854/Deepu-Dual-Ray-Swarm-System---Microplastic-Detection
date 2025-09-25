import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Zap, 
  Settings as SettingsIcon,
  FileText
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Map View', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sensors', label: 'Sensor Fusion', icon: Zap },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'technical', label: 'Technical Docs', icon: FileText },
  ];

  return (
    <nav className="navigation">
      <div className="nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <style jsx>{`
        .navigation {
          width: 240px;
          background: white;
          border-right: 1px solid #e2e8f0;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
        }

        .nav-content {
          padding: 24px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 24px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #1e40af;
        }

        .nav-item.active {
          background: linear-gradient(90deg, #eff6ff 0%, rgba(239, 246, 255, 0.3) 100%);
          color: #1e40af;
          border-right: 3px solid #1e40af;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .nav-label {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .navigation {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .nav-content {
            display: flex;
            overflow-x: auto;
            padding: 12px 0;
          }
          
          .nav-item {
            flex-shrink: 0;
            flex-direction: column;
            padding: 8px 16px;
            gap: 4px;
          }
          
          .nav-label {
            font-size: 12px;
          }
        }
      `}</style>
    </nav>
  );
}