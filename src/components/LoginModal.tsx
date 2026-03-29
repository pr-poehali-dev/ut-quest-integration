import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  getParticipant, upsertParticipant, saveSession,
  syncWithPlatform, SITE_KEY, sendEmailNotification
} from '@/lib/store';

interface Props {
  onClose: () => void;
  onLogin: (u: { phone: string; name: string }) => void;
}

type Mode = 'login' | 'register' | 'restore' | 'restore_answer';

const SECRET_QUESTIONS = [
  'Кличка первого питомца?',
  'Девичья фамилия матери?',
  'Название школы, в которой учились?',
  'Любимый город детства?',
  'Имя лучшего друга детства?',
];

export default function LoginModal({ onClose, onLogin }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [secretQ, setSecretQ] = useState(SECRET_QUESTIONS[0]);
  const [secretA, setSecretA] = useState('');
  const [restorePhone, setRestorePhone] = useState('');
  const [restoreAnswer, setRestoreAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [restoreParticipant, setRestoreParticipant] = useState<ReturnType<typeof getParticipant>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const reset = () => { setError(''); setSuccess(''); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!phone.trim() || !password.trim()) return;
    setLoading(true);
    const p = getParticipant(phone.trim());
    if (!p) { setError('Участник с таким номером не найден'); setLoading(false); return; }
    const hash = btoa(password.trim());
    const stored = localStorage.getItem(`quest_pwd_${phone.trim()}`);
    if (stored !== hash) { setError('Неверный пароль'); setLoading(false); return; }
    if (!p.isActive) { setError('Аккаунт ожидает активации. Обратитесь к администратору.'); setLoading(false); return; }
    saveSession({ phone: p.phone, name: p.name });
    await syncWithPlatform({ action: 'login', phone: p.phone, name: p.name });
    onLogin({ phone: p.phone, name: p.name });
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!phone.trim() || !name.trim() || !password.trim()) return;
    if (password !== password2) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    if (!secretA.trim()) { setError('Введите ответ на секретный вопрос'); return; }
    setLoading(true);
    const existing = getParticipant(phone.trim());
    if (existing) { setError('Этот номер уже зарегистрирован'); setLoading(false); return; }
    const participant = {
      phone: phone.trim(), name: name.trim(),
      secretQuestion: secretQ,
      secretAnswer: btoa(secretA.trim().toLowerCase()),
      registeredAt: new Date().toISOString(),
      isActive: true,
      hasPaid: false,
      score: 0,
      currentLevel: 0,
      completedLevels: [],
      lastActivity: new Date().toISOString(),
    };
    localStorage.setItem(`quest_pwd_${phone.trim()}`, btoa(password.trim()));
    upsertParticipant(participant);
    await syncWithPlatform({ action: 'register', phone: phone.trim(), name: name.trim() });
    await sendEmailNotification(
      `Новый участник: ${name.trim()}`,
      `Зарегистрировался новый участник.\nИмя: ${name.trim()}\nТелефон: ${phone.trim()}\nДата: ${new Date().toLocaleString('ru')}`
    );
    saveSession({ phone: phone.trim(), name: name.trim() });
    onLogin({ phone: phone.trim(), name: name.trim() });
    setLoading(false);
  };

  const handleRestorePhone = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    const p = getParticipant(restorePhone.trim());
    if (!p || !p.secretQuestion) { setError('Участник не найден или секретный вопрос не задан'); return; }
    setRestoreParticipant(p);
    setMode('restore_answer');
  };

  const handleRestoreAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!restoreParticipant) return;
    if (btoa(restoreAnswer.trim().toLowerCase()) !== (restoreParticipant.secretAnswer || '')) {
      setError('Неверный ответ на секретный вопрос'); return;
    }
    if (newPassword.length < 6) { setError('Пароль минимум 6 символов'); return; }
    localStorage.setItem(`quest_pwd_${restoreParticipant.phone}`, btoa(newPassword.trim()));
    setSuccess('Пароль изменён! Войдите с новым паролем.');
    setTimeout(() => { setMode('login'); setSuccess(''); }, 2000);
  };

  const inp = { backgroundColor: 'rgba(13,31,20,0.8)', border: '1px solid rgba(64,195,176,0.2)', color: 'white' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden animate-scale-in"
        style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.2)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: 'rgba(64,195,176,0.1)' }}>
          <div>
            <h2 className="font-oswald font-bold text-xl uppercase" style={{ color: 'white' }}>
              {mode === 'login' && 'Вход'}
              {mode === 'register' && 'Регистрация'}
              {(mode === 'restore' || mode === 'restore_answer') && 'Восстановление'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Мастер путей · {SITE_KEY}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        <div className="p-6">
          {(mode === 'login' || mode === 'register') && (
            <div className="flex rounded-xl overflow-hidden mb-5" style={{ backgroundColor: 'rgba(13,31,20,0.6)' }}>
              {(['login', 'register'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); reset(); }}
                  className="flex-1 py-2.5 text-xs font-oswald font-semibold uppercase tracking-wider transition-all duration-200"
                  style={{ backgroundColor: mode === m ? 'var(--teal)' : 'transparent', color: mode === m ? 'var(--forest-dark)' : 'rgba(255,255,255,0.45)' }}>
                  {m === 'login' ? 'Войти' : 'Регистрация'}
                </button>
              ))}
            </div>
          )}

          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-fast"
              style={{ backgroundColor: 'rgba(64,195,176,0.1)', border: '1px solid rgba(64,195,176,0.3)', color: 'var(--teal)' }}>
              <Icon name="CheckCircle" size={14} /><span className="text-xs">{success}</span>
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-fast"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              <Icon name="AlertCircle" size={14} /><span className="text-xs">{error}</span>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <F label="Номер телефона" icon="Phone" inp={inp}>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" />
              </F>
              <F label="Пароль" icon="Lock" inp={inp}>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" />
              </F>
              <button type="submit" className="btn-teal w-full" disabled={loading || !phone || !password} style={{ opacity: loading || !phone || !password ? 0.5 : 1 }}>
                <span className="flex items-center justify-center gap-2"><Icon name={loading ? 'Loader' : 'LogIn'} size={16} />{loading ? 'Входим…' : 'Войти'}</span>
              </button>
              <button type="button" onClick={() => { setMode('restore'); reset(); }} className="w-full text-xs text-center pt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Забыли пароль? <span style={{ color: 'var(--teal)' }}>Восстановить</span>
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <F label="Имя" icon="User" inp={inp}><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <F label="Номер телефона" icon="Phone" inp={inp}><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 900 000-00-00" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <F label="Пароль (мин. 6 символов)" icon="Lock" inp={inp}><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <F label="Повторите пароль" icon="Lock" inp={inp}><input type="password" value={password2} onChange={e => setPassword2(e.target.value)} placeholder="••••••••" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Секретный вопрос</label>
                <select value={secretQ} onChange={e => setSecretQ(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ ...inp, appearance: 'none' as const }}>
                  {SECRET_QUESTIONS.map(q => <option key={q} value={q} style={{ backgroundColor: '#1a3325' }}>{q}</option>)}
                </select>
              </div>
              <F label="Ответ на секретный вопрос" icon="HelpCircle" inp={inp}><input type="text" value={secretA} onChange={e => setSecretA(e.target.value)} placeholder="Ваш ответ" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <button type="submit" className="btn-gold w-full mt-2" disabled={loading || !phone || !name || !password} style={{ opacity: loading || !phone || !name || !password ? 0.5 : 1 }}>
                <span className="flex items-center justify-center gap-2"><Icon name={loading ? 'Loader' : 'UserPlus'} size={16} />{loading ? 'Регистрируем…' : 'Зарегистрироваться'}</span>
              </button>
            </form>
          )}

          {mode === 'restore' && (
            <form onSubmit={handleRestorePhone} className="space-y-4">
              <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Введите номер телефона, с которым регистрировались</p>
              <F label="Номер телефона" icon="Phone" inp={inp}><input type="tel" value={restorePhone} onChange={e => setRestorePhone(e.target.value)} placeholder="+7 900 000-00-00" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <button type="submit" className="btn-teal w-full" disabled={!restorePhone}>
                <span className="flex items-center justify-center gap-2"><Icon name="ArrowRight" size={16} />Продолжить</span>
              </button>
              <button type="button" onClick={() => { setMode('login'); reset(); }} className="w-full text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>← Назад к входу</button>
            </form>
          )}

          {mode === 'restore_answer' && restoreParticipant && (
            <form onSubmit={handleRestoreAnswer} className="space-y-4">
              <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.2)', color: 'rgba(255,255,255,0.7)' }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--gold)' }}>Секретный вопрос</p>
                {restoreParticipant.secretQuestion}
              </div>
              <F label="Ваш ответ" icon="HelpCircle" inp={inp}><input type="text" value={restoreAnswer} onChange={e => setRestoreAnswer(e.target.value)} placeholder="Введите ответ" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <F label="Новый пароль" icon="Lock" inp={inp}><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Минимум 6 символов" style={inp} className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none" /></F>
              <button type="submit" className="btn-teal w-full" disabled={!restoreAnswer || !newPassword}>
                <span className="flex items-center justify-center gap-2"><Icon name="KeyRound" size={16} />Сменить пароль</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function F({ label, icon, inp, children }: { label: string; icon: string; inp: object; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</label>
      <div className="relative">
        <Icon name={icon} size={14} fallback="User" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
        {children}
      </div>
    </div>
  );
}
