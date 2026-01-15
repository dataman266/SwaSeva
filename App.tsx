
import React, { useState, useEffect } from 'react';
import { AppScreen, AppState, Language, Product } from './types';
import { TRANSLATIONS } from './constants';
import HomeScreen from './components/HomeScreen';
import DetailsScreen from './components/DetailsScreen';
import SellScreen from './components/SellScreen';
import OrdersScreen from './components/OrdersScreen';
import ProfileScreen from './components/ProfileScreen';
import AssistantScreen from './components/AssistantScreen';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentScreen: 'HOME',
    userLanguage: Language.ENGLISH,
    location: 'Detecting...',
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || 'Nearby';
            setState(prev => ({ ...prev, location: city }));
          } catch (e) {
            setState(prev => ({ ...prev, location: 'Rural MH' }));
          }
        },
        () => setState(prev => ({ ...prev, location: 'Mandi' }))
      );
    }
  }, []);

  const changeScreen = (screen: AppScreen, product?: Product) => {
    setState(prev => ({ ...prev, currentScreen: screen, selectedProduct: product }));
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'HOME': return <HomeScreen lang={state.userLanguage} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} />;
      case 'DETAILS': return <DetailsScreen product={state.selectedProduct!} lang={state.userLanguage} onBack={() => changeScreen('HOME')} />;
      case 'SELL': return <SellScreen lang={state.userLanguage} onDone={() => changeScreen('HOME')} />;
      case 'ORDERS': return <OrdersScreen lang={state.userLanguage} />;
      case 'PROFILE': return <ProfileScreen lang={state.userLanguage} />;
      case 'ASSISTANT': return <AssistantScreen lang={state.userLanguage} onBack={() => changeScreen('HOME')} />;
      // Fix: Added missing onOpenAssistant prop to HomeScreen in the default case to satisfy HomeScreenProps
      default: return <HomeScreen lang={state.userLanguage} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0E1A0E] text-white">
      <Header 
        location={state.location} 
        language={state.userLanguage} 
        onLanguageChange={(l) => setState(prev => ({...prev, userLanguage: l}))} 
        onOpenAssistant={() => changeScreen('ASSISTANT')}
      />
      
      <main className="flex-grow">{renderScreen()}</main>

      <BottomNav activeScreen={state.currentScreen} onNavigate={changeScreen} lang={state.userLanguage} />
    </div>
  );
};

export default App;
