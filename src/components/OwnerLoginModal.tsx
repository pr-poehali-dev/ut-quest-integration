import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { saveOwnerSession, OWNER_EMAIL } from '@/lib/store';

// Владелец: successful-lucky@yandex.ru
// Пароль хранится локально и устанавливается при первом входе

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const OWNER_PWD_KEY = 'quest_owner_pwd';
const DEFAULT_OWNER_PWD = btoa('admin2024'); // Пароль по умолчанию при первом входе

export default function OwnerLoginModal({ onClose, onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isFirstSetup, setIsFirstSetup] = useState(!localStorage.getItem(OWNER_PWD_KEY));
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      setError('Неверный email владельца');
      return;
    }
    const stored = localStorage.getItem(OWNER_PWD_KEY) || DEFAULT_OWNER_PWD;
    if (btoa(password) !== stored) {
      setError('Неверный пароль');
      return;
    }
    saveOwnerSession({ email: OWNER_EMAIL, loginAt: new Date().toISOString() });
    onSuccess();
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
      setError('Неверный email');
      return;
    }
    if (newPassword.length < 6) {
      setError('Пароль минимум 6 символов');
      return;
    }
    localStorage.setItem(OWNER_PWD_KEY, btoa(newPassword));
    setIsFirstSetup(false);
    setPassword(newPassword);
    setNewPassword('');
    saveOwnerSession({ email: OWNER_EMAIL, loginAt: new Date().toISOString() });
    onSuccess();
  };

  const inp = { backgroundColor: 'rgba(13,31,20,0.8)', border: '1px solid rgba(255,209,102,0.2)', color: 'white' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}>
      <div className="w-full max-w-xs rounded-2xl overflow-hidden animate-scale-in"
        style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(255,209,102,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,209,102,0.1)' }}>
          <div className="flex items-center gap-2 mb-0.5">
            <Icon name="Shield" size={16} style={{ color: 'var(--gold)' }} />
            <h2 className="font-oswald font-bold text-lg uppercase" style={{ color: 'white' }}>
              {isFirstSetup ? 'Настройка пароля' : 'Кабинет владельца'}
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{OWNER_EMAIL}</p>
        </div>

        <form onSubmit={isFirstSetup ? handleSetup : handleLogin} className="p-6 space-y-4">
          {isFirstSetup && (
            <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.2)', color: 'var(--gold)' }}>
              Первый вход — установите постоянный пароль
            </div>
          )}

          {error && (
            <div className="px-3 py-2 rounded-lg text-xs flex items-center gap-2"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#f87171' }}>
              <Icon name="AlertCircle" size={12} />{error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={OWNER_EMAIL} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
          </div>

          {isFirstSetup ? (
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Установите пароль</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
            </div>
          )}

          <button type="submit" className="btn-gold w-full" disabled={!email}>
            <span className="flex items-center justify-center gap-2">
              <Icon name="Shield" size={16} />
              {isFirstSetup ? 'Установить и войти' : 'Войти в кабинет'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
