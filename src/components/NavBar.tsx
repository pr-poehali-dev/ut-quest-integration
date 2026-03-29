import { useState } from 'react';
import { Section } from '@/App';
import Icon from '@/components/ui/icon';

interface Props {
  current: Section;
  onNavigate: (s: Section) => void;
  user: { phone: string; name: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onLogoDoubleClick: () => void;
}

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'home',     label: 'Главная' },
  { id: 'about',    label: 'О пути' },
  { id: 'quest',    label: 'Путь' },
  { id: 'rating',   label: 'Рейтинг' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'faq',      label: 'ЧаВо' },
];

export default function NavBar({ current, onNavigate, user, onLoginClick, onLogout, onLogoDoubleClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: 'rgba(13, 31, 20, 0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(64, 195, 176, 0.12)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo — двойной клик открывает кабинет владельца */}
        <button
          onClick={() => onNavigate('home')}
          onDoubleClick={onLogoDoubleClick}
          className="flex items-center gap-2 group select-none"
          title="Главная (двойной клик — кабинет)"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ backgroundColor: 'var(--teal)', color: 'var(--forest-dark)' }}>
            <Icon name="TreePine" size={18} />
          </div>
          <span className="font-oswald font-bold text-lg uppercase tracking-wider hidden sm:block"
            style={{ color: 'var(--teal)' }}>
            Тайны Усть-Илимска
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className="px-3 py-1.5 rounded-md text-sm font-open font-medium transition-all duration-200 uppercase tracking-wide"
              style={{
                color: current === item.id ? 'var(--teal)' : 'rgba(255,255,255,0.65)',
                backgroundColor: current === item.id ? 'rgba(64, 195, 176, 0.12)' : 'transparent',
              }}>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(64, 195, 176, 0.1)', color: 'var(--teal)' }}>
                <Icon name="User" size={16} />
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                <Icon name="ChevronDown" size={12} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden shadow-xl z-50 animate-fade-in-fast"
                  style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.2)' }}>
                  <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(64,195,176,0.1)' }}>
                    <p className="text-xs font-medium" style={{ color: 'white' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{user.phone}</p>
                  </div>
                  <button onClick={() => { onNavigate('quest'); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs transition-colors hover:bg-white/5"
                    style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <Icon name="Map" size={13} />Мой путь
                  </button>
                  <button onClick={() => { onLogout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs transition-colors hover:bg-white/5 border-t"
                    style={{ color: '#f87171', borderColor: 'rgba(255,255,255,0.06)' }}>
                    <Icon name="LogOut" size={13} />Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onLoginClick} className="btn-teal text-xs px-4 py-2 rounded-lg">
              Войти
            </button>
          )}

          <button className="md:hidden p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.7)' }}
            onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t pb-3 animate-fade-in"
          style={{ backgroundColor: 'rgba(13, 31, 20, 0.98)', borderColor: 'rgba(64, 195, 176, 0.12)' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
              className="w-full text-left px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors"
              style={{
                color: current === item.id ? 'var(--teal)' : 'rgba(255,255,255,0.65)',
                backgroundColor: current === item.id ? 'rgba(64, 195, 176, 0.08)' : 'transparent',
              }}>
              {item.label}
            </button>
          ))}
          {user && (
            <button onClick={() => { onLogout(); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-6 py-3 text-sm border-t mt-1"
              style={{ color: '#f87171', borderColor: 'rgba(255,255,255,0.06)' }}>
              <Icon name="LogOut" size={14} />Выйти
            </button>
          )}
        </div>
      )}

      {/* Overlay для закрытия меню пользователя */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
}
