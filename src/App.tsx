import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MapView } from './components/MapView';
import { Analytics } from './components/Analytics';
import { SensorFusion } from './components/SensorFusion';
import { Settings } from './components/Settings';
import { DataProvider } from './context/DataContext';
import './App.css';

type View = 'dashboard' | 'map' | 'analytics' | 'sensors' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MapView />;
      case 'analytics':
        return <Analytics />;
      case 'sensors':
        return <SensorFusion />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="app">
        <Header />
        <div className="app-content">
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
          <main className="main-content">
            {renderView()}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;