import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import MenuBar from '@/components/MenuBar';
import FloatingChatButton from '@/components/FloatingChatButton';
import Dashboard from './Dashboard';
import MapView from './MapView';
import StreetAnalysis from './StreetAnalysis';
import Analytics from './Analytics';
import NGONetwork from './NGONetwork';
import Settings from './Settings';
import StateDetail from './StateDetail';
import NGOManagement from './NGOManagement';

const Index = () => {
  const { user, isAdmin, isNGO } = useUser();
  const [activeMenuItem, setActiveMenuItem] = useState('map');

  const handleStateClick = (stateName: string) => {
    setActiveMenuItem(`state/${encodeURIComponent(stateName)}`);
  };

  const handleStateChange = (stateName: string) => {
    setActiveMenuItem(`state/${encodeURIComponent(stateName)}`);
  };

  const renderContent = () => {
    // Check if it's a state detail page
    if (activeMenuItem.startsWith('state/')) {
      const stateName = decodeURIComponent(activeMenuItem.replace('state/', ''));
      return <StateDetail stateName={stateName} onBack={() => setActiveMenuItem('map')} onStateChange={handleStateChange} userState={isNGO ? user?.state : undefined} />;
    }
    
    switch (activeMenuItem) {
      case 'dashboard':
        return <Dashboard userState={isNGO ? user?.state : undefined} />;
      case 'map':
        return <MapView onStateClick={handleStateClick} userState={isNGO ? user?.state : undefined} />;
      case 'streets':
        return <StreetAnalysis userState={isNGO ? user?.state : undefined} />;
      case 'analytics':
        return <Analytics userState={isNGO ? user?.state : undefined} />;
      case 'ngo':
        return <NGONetwork userState={isNGO ? user?.state : undefined} />;
      case 'ngo-management':
        return isAdmin ? <NGOManagement /> : <Dashboard userState={isNGO ? user?.state : undefined} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard userState={isNGO ? user?.state : undefined} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <MenuBar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      <div className="flex-1" style={{ marginLeft: '64px' }}>
        {renderContent()}
      </div>
      {isNGO && <FloatingChatButton />}
    </div>
  );
};

export default Index;
