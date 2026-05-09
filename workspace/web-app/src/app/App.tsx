import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { WebClientProfile } from './components/WebClientProfile';
import { SearchesListWeb } from './components/SearchesListWeb';
import { OffersListWeb } from './components/OffersListWeb';
import { ListingsListWeb } from './components/ListingsListWeb';
import { SearchDetail } from './components/SearchDetail';
import { OfferDetail } from './components/OfferDetail';
import { ListingDetail } from './components/ListingDetail';
import { ThreePanelClientProfile } from './components/ThreePanelClientProfile';

export type TabType = 'activity' | 'transactions' | 'searches' | 'listings' | 'notes' | 'reminders' | 'recommended';

export type Screen =
  | { type: 'profile'; tab: TabType }
  | { type: 'three-panel' }
  | { type: 'searches-list' }
  | { type: 'offers-list' }
  | { type: 'listings-list' }
  | { type: 'search-detail'; id: string }
  | { type: 'offer-detail'; id: string }
  | { type: 'listing-detail'; id: string };

export default function App() {
  const [screenStack, setScreenStack] = useState<Screen[]>([
    { type: 'three-panel' }
  ]);

  const currentScreen = screenStack[screenStack.length - 1];

  const navigate = (screen: Screen) => {
    setScreenStack([...screenStack, screen]);
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      setScreenStack(screenStack.slice(0, -1));
    }
  };

  const setTab = (tab: TabType) => {
    setScreenStack([{ type: 'profile', tab }]);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Toaster position="bottom-right" />
      {currentScreen.type === 'three-panel' && (
        <ThreePanelClientProfile />
      )}
      {currentScreen.type === 'profile' && (
        <WebClientProfile
          activeTab={currentScreen.tab}
          onTabChange={setTab}
          onNavigate={navigate}
        />
      )}
      {currentScreen.type === 'searches-list' && (
        <SearchesListWeb onBack={goBack} onNavigate={navigate} />
      )}
      {currentScreen.type === 'offers-list' && (
        <OffersListWeb onBack={goBack} onNavigate={navigate} />
      )}
      {currentScreen.type === 'listings-list' && (
        <ListingsListWeb onBack={goBack} onNavigate={navigate} />
      )}
      {currentScreen.type === 'search-detail' && (
        <SearchDetail id={currentScreen.id} onBack={goBack} />
      )}
      {currentScreen.type === 'offer-detail' && (
        <OfferDetail id={currentScreen.id} onBack={goBack} />
      )}
      {currentScreen.type === 'listing-detail' && (
        <ListingDetail id={currentScreen.id} onBack={goBack} />
      )}
    </div>
  );
}
