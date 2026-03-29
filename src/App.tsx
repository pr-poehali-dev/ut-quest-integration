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

export type Section = 'home' | 'about' | 'quest' | 'rating' | 'contacts' | 'faq';
export type User = { phone: string; name: string } | null;

function App() {
  const [section, setSection] = useState<Section>('home');
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<User>(null);

  const navigate = (s: Section) => {
    setSection(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="min-h-screen font-open" style={{ backgroundColor: 'var(--forest-dark)' }}>
        <NavBar current={section} onNavigate={navigate} user={user} onLoginClick={() => setLoginOpen(true)} />
        <main>
          {section === 'home'     && <HomePage     onNavigate={navigate} onLoginClick={() => setLoginOpen(true)} user={user} />}
          {section === 'about'    && <AboutPage    onNavigate={navigate} />}
          {section === 'quest'    && <QuestPage    user={user} onLoginClick={() => setLoginOpen(true)} />}
          {section === 'rating'   && <RatingPage   />}
          {section === 'contacts' && <ContactsPage />}
          {section === 'faq'      && <FaqPage      />}
        </main>
        {loginOpen && (
          <LoginModal
            onClose={() => setLoginOpen(false)}
            onLogin={(u) => { setUser(u); setLoginOpen(false); }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

export default App;
