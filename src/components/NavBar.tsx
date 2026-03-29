import { useState } from 'react';
import { Section } from '@/App';
import Icon from '@/components/ui/icon';

interface Props {
  current: Section;
  onNavigate: (s: Section) => void;
  user: { phone: string; name: string } | null;
  onLoginClick: () => void;
}

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'home',     label: 'Главная' },
  { id: 'about',    label: 'О пути' },
  { id: 'quest',    label: 'Путь' },
  { id: 'rating',   label: 'Рейтинг' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'faq',      label: 'ЧаВо' },
];

export default function NavBar({ current, onNavigate, user, onLoginClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'rgba(13, 31, 20, 0.95)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(64, 195, 176, 0.12)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--teal)', color: 'var(--forest-dark)' }}
          >
            <Icon name="TreePine" size={18} />
          </div>
          <span
            className="font-oswald font-bold text-lg uppercase tracking-wider hidden sm:block"
            style={{ color: 'var(--teal)' }}
          >
            Тайны Усть-Илимска
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="px-3 py-1.5 rounded-md text-sm font-open font-medium transition-all duration-200 uppercase tracking-wide"
              style={{
                color: current === item.id ? 'var(--teal)' : 'rgba(255,255,255,0.65)',
                backgroundColor: current === item.id ? 'rgba(64, 195, 176, 0.12)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Login / user */}
        <div className="flex items-center gap-3">
          {user ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ backgroundColor: 'rgba(64, 195, 176, 0.1)', color: 'var(--teal)' }}
            >
              <Icon name="User" size={16} />
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="btn-teal text-xs px-4 py-2 rounded-lg"
            >
              Войти
            </button>
          )}
          {/* Burger */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t pb-3 animate-fade-in"
          style={{
            backgroundColor: 'rgba(13, 31, 20, 0.98)',
            borderColor: 'rgba(64, 195, 176, 0.12)',
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className="w-full text-left px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors"
              style={{
                color: current === item.id ? 'var(--teal)' : 'rgba(255,255,255,0.65)',
                backgroundColor: current === item.id ? 'rgba(64, 195, 176, 0.08)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
