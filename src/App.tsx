import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from '@/components/NavBar';
import HomePage from '@/components/HomePage';
import AboutPage from '@/components/AboutPage';
import QuestPage from '@/components/QuestPage';
import RatingPage from '@/components/RatingPage';
import ContactsPage from '@/components/ContactsPage';
import FaqPage from '@/components/FaqPage';
import LoginModal from '@/components/LoginModal';
import OwnerLoginModal from '@/components/OwnerLoginModal';
import OwnerDashboard from '@/components/OwnerDashboard';
import { getSession, saveSession, clearSession, getOwnerSession, clearOwnerSession } from '@/lib/store';

export type Section = 'home' | 'about' | 'quest' | 'rating' | 'contacts' | 'faq';
export type User = { phone: string; name: string } | null;

function App() {
  const [section, setSection] = useState<Section>('home');
  const [loginOpen, setLoginOpen] = useState(false);
  const [ownerLoginOpen, setOwnerLoginOpen] = useState(false);
  const [ownerDashOpen, setOwnerDashOpen] = useState(false);
  const [user, setUser] = useState<User>(() => getSession());

  const navigate = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (u: { phone: string; name: string }) => {
    setUser(u);
    saveSession(u);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    clearSession();
  };

  // Двойной клик по логотипу — вход в кабинет владельца
  const handleLogoDoubleClick = () => {
    const ownerSess = getOwnerSession();
    if (ownerSess) setOwnerDashOpen(true);
    else setOwnerLoginOpen(true);
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen font-open" style={{ backgroundColor: 'var(--forest-dark)' }}>
        <NavBar
          current={section}
          onNavigate={navigate}
          user={user}
          onLoginClick={() => setLoginOpen(true)}
          onLogout={handleLogout}
          onLogoDoubleClick={handleLogoDoubleClick}
        />
        <main>
          {section === 'home'     && <HomePage     onNavigate={navigate} onLoginClick={() => setLoginOpen(true)} user={user} />}
          {section === 'about'    && <AboutPage    onNavigate={navigate} />}
          {section === 'quest'    && <QuestPage    user={user} onLoginClick={() => setLoginOpen(true)} />}
          {section === 'rating'   && <RatingPage   />}
          {section === 'contacts' && <ContactsPage />}
          {section === 'faq'      && <FaqPage      />}
        </main>

        {loginOpen && (
          <LoginModal onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        )}
        {ownerLoginOpen && (
          <OwnerLoginModal
            onClose={() => setOwnerLoginOpen(false)}
            onSuccess={() => { setOwnerLoginOpen(false); setOwnerDashOpen(true); }}
          />
        )}
        {ownerDashOpen && (
          <OwnerDashboard onClose={() => { setOwnerDashOpen(false); clearOwnerSession(); }} />
        )}
      </div>
    </TooltipProvider>
  );
}

export default App;
