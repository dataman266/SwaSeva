
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen, AppState, Language, Product } from './types.ts';
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

// Screens that push forward (slide left) vs pop back (slide right)
const SCREEN_ORDER: AppScreen[] = ['HOME', 'DETAILS', 'SELL', 'ORDERS', 'PROFILE', 'ASSISTANT'];

function getDirection(from: AppScreen, to: AppScreen): number {
  const fi = SCREEN_ORDER.indexOf(from);
  const ti = SCREEN_ORDER.indexOf(to);
  if (fi === -1 || ti === -1) return 1;
  return ti >= fi ? 1 : -1;
}

const variants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir * -32, opacity: 0 }),
};

const transition = { duration: 0.28, ease: [0.32, 0, 0.16, 1] as const };

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentScreen: localStorage.getItem(ONBOARDED_KEY) ? 'HOME' : 'ONBOARDING',
    userLanguage: Language.ENGLISH,
    location: 'Detecting...',
  });
  const [prevScreen, setPrevScreen] = useState<AppScreen>('HOME');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || 'Nearby';
            setState(prev => ({ ...prev, location: city }));
          } catch {
            setState(prev => ({ ...prev, location: 'Rural MH' }));
          }
        },
        () => setState(prev => ({ ...prev, location: 'Mandi' }))
      );
    }
  }, []);

  const changeScreen = (screen: AppScreen, product?: Product) => {
    setPrevScreen(state.currentScreen);
    setState(prev => ({ ...prev, currentScreen: screen, selectedProduct: product }));
    window.scrollTo(0, 0);
  };

  const dir = getDirection(prevScreen, state.currentScreen);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'HOME':      return <HomeScreen lang={state.userLanguage} location={state.location} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} />;
      case 'DETAILS':   return <DetailsScreen product={state.selectedProduct!} lang={state.userLanguage} onBack={() => changeScreen('HOME')} />;
      case 'SELL':      return <SellScreen lang={state.userLanguage} onDone={() => changeScreen('HOME')} />;
      case 'ORDERS':    return <OrdersScreen lang={state.userLanguage} />;
      case 'PROFILE':   return <ProfileScreen lang={state.userLanguage} />;
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
      default: return <HomeScreen lang={state.userLanguage} location={state.location} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} />;
    }
  };

  const isOnboarding = state.currentScreen === 'ONBOARDING';
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

      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={state.currentScreen}
            custom={dir}
            variants={isOnboarding ? undefined : variants}
            initial={isOnboarding ? { opacity: 0 } : 'enter'}
            animate={isOnboarding ? { opacity: 1 } : 'center'}
            exit={isOnboarding ? { opacity: 0 } : 'exit'}
            transition={transition}
            style={{ willChange: 'transform, opacity' }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isOnboarding && (
        <BottomNav activeScreen={state.currentScreen} onNavigate={changeScreen} lang={state.userLanguage} />
      )}
    </div>
  );
};

export default App;
