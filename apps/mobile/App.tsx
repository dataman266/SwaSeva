
import React, { useState, useEffect } from 'react';
import { AppScreen, AppState, Language, Product } from './types.ts';
import { TRANSLATIONS } from './constants.tsx';
import HomeScreen from './components/HomeScreen.tsx';
import DetailsScreen from './components/DetailsScreen.tsx';
import SellScreen from './components/SellScreen.tsx';
import OrdersScreen from './components/OrdersScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import AssistantScreen from './components/AssistantScreen.tsx';
import OnboardingScreen from './components/OnboardingScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import Header from './components/Header.tsx';

const ONBOARDED_KEY = 'agrimart_onboarded';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentScreen: localStorage.getItem(ONBOARDED_KEY) ? 'HOME' : 'ONBOARDING',
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
      case 'ONBOARDING': return (
        <OnboardingScreen
          lang={state.userLanguage}
          onComplete={() => {
            localStorage.setItem(ONBOARDED_KEY, 'true');
            changeScreen('HOME');
          }}
        />
      );
      default: return <HomeScreen lang={state.userLanguage} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} />;
    }
  };

  const isOnboarding = state.currentScreen === 'ONBOARDING';
  // On HOME, Header is absolutely positioned over the hero image
  // so we omit the spacer; on other screens add a top spacer
  const needsHeaderSpacer = !isOnboarding && state.currentScreen !== 'HOME';

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0A1A0A', color: '#F5F0E8' }}>
      {!isOnboarding && (
        <Header
          location={state.location}
          language={state.userLanguage}
          onLanguageChange={l => setState(prev => ({ ...prev, userLanguage: l }))}
          onOpenAssistant={() => changeScreen('ASSISTANT')}
        />
      )}

      {needsHeaderSpacer && <div className="h-14 pt-safe" aria-hidden />}

      <main className="flex-grow">{renderScreen()}</main>

      {!isOnboarding && (
        <BottomNav activeScreen={state.currentScreen} onNavigate={changeScreen} lang={state.userLanguage} />
      )}
    </div>
  );
};

export default App;
