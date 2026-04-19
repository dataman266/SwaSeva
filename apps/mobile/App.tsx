
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen, AppState, Language, Product } from './types.ts';
import HomeScreen from './components/HomeScreen.tsx';
import DetailsScreen from './components/DetailsScreen.tsx';
import SellScreen from './components/SellScreen.tsx';
import OrdersScreen from './components/OrdersScreen.tsx';
import ProfileScreen from './components/ProfileScreen.tsx';
import MyListingsScreen from './components/MyListingsScreen.tsx';
import SellerProfileScreen from './components/SellerProfileScreen.tsx';
import MessagesScreen from './components/MessagesScreen.tsx';
import ExploreScreen from './components/ExploreScreen.tsx';
import AssistantScreen from './components/AssistantScreen.tsx';
import OnboardingScreen from './components/OnboardingScreen.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import CropCalendarScreen from './components/CropCalendarScreen.tsx';
import CartScreen from './components/CartScreen.tsx';
import CheckoutScreen from './components/CheckoutScreen.tsx';
import BottomNav from './components/BottomNav.tsx';
import Header from './components/Header.tsx';

const ONBOARDED_KEY  = 'agrimart_onboarded';
const AUTH_TOKEN_KEY = 'agrimart_auth_token';

// Screens that push forward (slide left) vs pop back (slide right)
const SCREEN_ORDER: AppScreen[] = ['HOME', 'DETAILS', 'SELL', 'LISTINGS', 'MESSAGES', 'ORDERS', 'PROFILE', 'EXPLORE', 'ASSISTANT', 'CALENDAR', 'CART', 'CHECKOUT', 'SELLER_PROFILE'];

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
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(AUTH_TOKEN_KEY)
  );
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

  const changeScreen = (screen: AppScreen, product?: Product, sellerId?: string) => {
    setPrevScreen(state.currentScreen);
    setState(prev => ({ ...prev, currentScreen: screen, selectedProduct: product, selectedSellerId: sellerId }));
    window.scrollTo(0, 0);
  };

  const dir = getDirection(prevScreen, state.currentScreen);

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'HOME':      return <HomeScreen lang={state.userLanguage} location={state.location} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} onOpenExplore={() => changeScreen('EXPLORE')} />;
      case 'DETAILS':   return <DetailsScreen
        product={state.selectedProduct!}
        lang={state.userLanguage}
        onBack={() => changeScreen('HOME')}
        onViewSeller={(id) => changeScreen('SELLER_PROFILE', undefined, id)}
        onSendEnquiry={(_sellerId, _productId) => changeScreen('MESSAGES')}
      />;
      case 'SELL':      return <SellScreen lang={state.userLanguage} onDone={() => changeScreen('HOME')} />;
      case 'LISTINGS':  return <MyListingsScreen lang={state.userLanguage} onCreateNew={() => changeScreen('SELL')} />;
      case 'ORDERS':    return <OrdersScreen lang={state.userLanguage} />;
      case 'PROFILE':   return <ProfileScreen lang={state.userLanguage} onSignOut={() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(false);
        changeScreen('HOME');
      }} onExplore={() => changeScreen('EXPLORE')} onOpenCalendar={() => changeScreen('CALENDAR')} onResetOnboarding={() => {
        setIsAuthenticated(false);
        changeScreen('ONBOARDING');
      }} />;
      case 'SELLER_PROFILE': return <SellerProfileScreen
        sellerId={state.selectedSellerId!}
        lang={state.userLanguage}
        onBack={() => changeScreen(prevScreen === 'SELLER_PROFILE' ? 'HOME' : prevScreen)}
        onViewProduct={(p) => changeScreen('DETAILS', p)}
        onSendEnquiry={(_sellerId) => changeScreen('MESSAGES')}
      />;
      case 'MESSAGES':  return <MessagesScreen lang={state.userLanguage} onViewSeller={(id) => changeScreen('SELLER_PROFILE', undefined, id)} />;
      case 'EXPLORE':   return <ExploreScreen lang={state.userLanguage} location={state.location} onBack={() => changeScreen('HOME')} />;
      case 'ASSISTANT': return <AssistantScreen lang={state.userLanguage} onBack={() => changeScreen('HOME')} />;
      case 'CALENDAR':  return <CropCalendarScreen lang={state.userLanguage} onBack={() => changeScreen('HOME')} />;
      case 'CART':      return <CartScreen lang={state.userLanguage} onBack={() => changeScreen('HOME')} onCheckout={() => changeScreen('CHECKOUT')} />;
      case 'CHECKOUT':  return <CheckoutScreen lang={state.userLanguage} onBack={() => changeScreen('CART')} onConfirmed={() => changeScreen('ORDERS')} />;
      case 'ONBOARDING': return (
        <OnboardingScreen
          lang={state.userLanguage}
          onComplete={() => {
            localStorage.setItem(ONBOARDED_KEY, 'true');
            changeScreen('HOME');
          }}
        />
      );
      default: return <HomeScreen lang={state.userLanguage} location={state.location} onViewDetails={(p) => changeScreen('DETAILS', p)} onOpenAssistant={() => changeScreen('ASSISTANT')} onOpenExplore={() => changeScreen('EXPLORE')} />;
    }
  };

  // Mandatory auth gate — shown after onboarding is complete
  if (localStorage.getItem(ONBOARDED_KEY) && !isAuthenticated) {
    return (
      <AuthScreen
        lang={state.userLanguage}
        onAuthSuccess={(token) => {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const isOnboarding = state.currentScreen === 'ONBOARDING';
  const needsHeaderSpacer = !isOnboarding;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0A1A0A', color: '#F5F0E8' }}>
      {!isOnboarding && (
        <Header
          location={state.location}
          language={state.userLanguage}
          onLanguageChange={l => setState(prev => ({ ...prev, userLanguage: l }))}
          onOpenAssistant={() => changeScreen('ASSISTANT')}
          onOpenCart={() => changeScreen('CART')}
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
            style={{ WebkitBackfaceVisibility: 'hidden' }}
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
