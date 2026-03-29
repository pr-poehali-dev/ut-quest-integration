import { useState, useRef, useEffect } from 'react';
import { User } from '@/App';
import Icon from '@/components/ui/icon';
import AudioPlayer from '@/components/AudioPlayer';
import { QUESTS } from '@/data/quests';
import {
  getParticipant, upsertParticipant, getSettings,
  syncWithPlatform, sendEmailNotification, SITE_KEY
} from '@/lib/store';

interface Props {
  user: User;
  onLoginClick: () => void;
}

export default function QuestPage({ user, onLoginClick }: Props) {
  const settings = getSettings();

  const initState = () => {
    if (!user) return { idx: 0, score: 0, completed: [] as number[], finished: false };
    const p = getParticipant(user.phone);
    return {
      idx: p ? Math.min(p.currentLevel, QUESTS.length - 1) : 0,
      score: p ? p.score : 0,
      completed: p ? p.completedLevels : [] as number[],
      finished: p ? p.completedLevels.length >= QUESTS.length : false,
    };
  };

  const init = initState();
  const [currentIdx, setCurrentIdx] = useState(init.idx);
  const [score, setScore] = useState(init.score);
  const [completedLevels, setCompletedLevels] = useState<number[]>(init.completed);
  const [answer, setAnswer] = useState('');
  const [hintShown, setHintShown] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(init.finished ? 'correct' : 'idle');
  const [finished, setFinished] = useState(init.finished);
  const [attempts, setAttempts] = useState(0);
  const [ripple, setRipple] = useState(false);
  const [paidConfirm, setPaidConfirm] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem('quest_muted') === 'true');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMuteToggle = () => {
    setMuted(prev => {
      localStorage.setItem('quest_muted', String(!prev));
      return !prev;
    });
  };

  const quest = QUESTS[currentIdx];

  const saveProgress = (newScore: number, newIdx: number, newCompleted: number[]) => {
    if (!user) return;
    const p = getParticipant(user.phone);
    if (!p) return;
    const updated = {
      ...p,
      score: newScore,
      currentLevel: newIdx,
      completedLevels: newCompleted,
      lastActivity: new Date().toISOString(),
    };
    upsertParticipant(updated);
    syncWithPlatform({ action: 'progress', phone: user.phone, level: newIdx, score: newScore });
  };

  // Проверка: нужна ли оплата
  const participant = user ? getParticipant(user.phone) : null;
  const needsPayment = settings.isPaymentRequired && participant && !participant.hasPaid;

  const handleHint = () => {
    setHintShown(true);
    if (!hintUsed) setHintUsed(true);
  };

  const triggerRipple = () => {
    setRipple(true);
    setTimeout(() => setRipple(false), 700);
  };

  const handleCheck = () => {
    const normalized = answer.trim().toLowerCase();
    if (normalized === quest.answer.toLowerCase()) {
      const gained = hintUsed ? Math.max(0, quest.points - 2) : quest.points;
      const newScore = score + gained;
      const newCompleted = [...completedLevels, quest.id];
      setScore(newScore);
      setCompletedLevels(newCompleted);
      setStatus('correct');
      triggerRipple();
      saveProgress(newScore, currentIdx, newCompleted);
    } else {
      setAttempts(a => a + 1);
      setStatus('wrong');
      setTimeout(() => setStatus('idle'), 1200);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= QUESTS.length) {
      setFinished(true);
      saveProgress(score, currentIdx + 1, completedLevels);
    } else {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setAnswer('');
      setHintShown(false);
      setHintUsed(false);
      setStatus('idle');
      setAttempts(0);
      saveProgress(score, nextIdx, completedLevels);
      inputRef.current?.focus();
    }
  };

  const handlePaymentConfirm = async () => {
    if (!user) return;
    setPaidConfirm(true);
    await sendEmailNotification(
      `Заявка на оплату: ${user.name}`,
      `Участник сообщает об оплате квеста.\nИмя: ${user.name}\nТелефон: ${user.phone}\nДата: ${new Date().toLocaleString('ru')}\nЦена: ${settings.questPrice} руб.\n\nАктивируйте вручную в кабинете владельца.`
    );
    await syncWithPlatform({ action: 'payment_request', phone: user.phone, name: user.name, amount: settings.questPrice });
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm p-8 rounded-2xl"
          style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.2)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}>
            <Icon name="Lock" size={28} />
          </div>
          <h2 className="font-oswald font-bold text-2xl uppercase mb-2" style={{ color: 'white' }}>Путь закрыт</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Войдите или зарегистрируйтесь, чтобы начать квест и сохранить прогресс.
          </p>
          <button className="btn-teal w-full" onClick={onLoginClick}>
            <span className="flex items-center justify-center gap-2"><Icon name="LogIn" size={16} />Войти / Регистрация</span>
          </button>
        </div>
      </div>
    );
  }

  // Блокировка по оплате
  if (needsPayment) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-sm p-8 rounded-2xl animate-scale-in"
          style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(255,209,102,0.2)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(255,209,102,0.1)', color: 'var(--gold)' }}>
            <Icon name="CreditCard" size={28} />
          </div>
          <h2 className="font-oswald font-bold text-2xl uppercase mb-2" style={{ color: 'white' }}>Доступ к пути</h2>
          <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Для прохождения квеста необходима оплата участия.
          </p>
          {settings.questPrice > 0 && (
            <p className="font-oswald font-bold text-3xl mb-4" style={{ color: 'var(--gold)' }}>
              {settings.questPrice} ₽
            </p>
          )}

          {!paidConfirm ? (
            <div className="space-y-3">
              <a href={settings.paymentUrl} target="_blank" rel="noopener noreferrer"
                className="btn-gold w-full flex items-center justify-center gap-2">
                <Icon name="ExternalLink" size={16} />
                Оплатить через YooMoney
              </a>
              <button onClick={handlePaymentConfirm}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-oswald font-semibold uppercase tracking-widest transition-all"
                style={{ border: '1px solid rgba(64,195,176,0.3)', color: 'var(--teal)' }}>
                <Icon name="Check" size={16} />
                Я оплатил — уведомить администратора
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(64,195,176,0.08)', border: '1px solid rgba(64,195,176,0.2)', color: 'var(--teal)' }}>
              <Icon name="CheckCircle" size={14} className="inline mr-2" />
              Уведомление отправлено! Администратор активирует доступ в ближайшее время.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Финальный экран
  if (finished) {
    const key = `UI-${score}-${user.phone.slice(-4)}`;
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-lg animate-scale-in">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse"
            style={{ backgroundColor: 'rgba(255,209,102,0.15)', border: '2px solid var(--gold)' }}>
            <Icon name="Trophy" size={40} style={{ color: 'var(--gold)' }} />
          </div>
          <h2 className="font-oswald font-bold text-4xl uppercase mb-2" style={{ color: 'var(--gold)' }}>Путь пройден!</h2>
          <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Исследователь: <strong style={{ color: 'white' }}>{user.name}</strong>
          </p>
          <div className="inline-block px-6 py-3 rounded-xl my-4"
            style={{ backgroundColor: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.3)' }}>
            <p className="font-oswald font-bold text-5xl" style={{ color: 'var(--gold)' }}>{score}</p>
            <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>очков из 150</p>
          </div>
          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Пройдено: {completedLevels.length} из {QUESTS.length} загадок
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-gold">
              <span className="flex items-center gap-2"><Icon name="Download" size={16} />Скачать путеводитель PDF</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-oswald font-semibold uppercase tracking-widest"
              style={{ border: '1px solid rgba(64,195,176,0.3)', color: 'var(--teal)' }}
              onClick={() => {
                setCurrentIdx(0); setScore(0); setFinished(false);
                setCompletedLevels([]); setAnswer(''); setHintShown(false); setHintUsed(false); setStatus('idle');
              }}>
              <Icon name="RotateCcw" size={16} />Пройти снова
            </button>
          </div>
          <div className="mt-6 p-4 rounded-xl text-xs"
            style={{ backgroundColor: 'rgba(64,195,176,0.05)', border: '1px solid rgba(64,195,176,0.15)', color: 'var(--teal)' }}>
            🗝 Ключ к интерактивной карте: <strong>{key}</strong>
          </div>
        </div>
      </div>
    );
  }

  const progress = (currentIdx / QUESTS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Приветствие */}
      {settings.welcomeMessage && currentIdx === 0 && (
        <div className="mb-4 px-4 py-2 rounded-xl text-sm text-center"
          style={{ backgroundColor: 'rgba(64,195,176,0.06)', border: '1px solid rgba(64,195,176,0.12)', color: 'var(--teal)' }}>
          {settings.welcomeMessage}
        </div>
      )}

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--teal)' }}>
            Загадка {currentIdx + 1} из {QUESTS.length}
          </span>
          <div className="flex items-center gap-2">
            {/* Глобальная кнопка звука */}
            <button
              onClick={handleMuteToggle}
              title={muted ? 'Включить звук' : 'Выключить звук'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all duration-200"
              style={{
                backgroundColor: muted ? 'rgba(239,68,68,0.08)' : 'rgba(64,195,176,0.08)',
                border: `1px solid ${muted ? 'rgba(239,68,68,0.2)' : 'rgba(64,195,176,0.15)'}`,
                color: muted ? '#f87171' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon name={muted ? 'VolumeX' : 'Volume2'} size={12} />
              <span className="hidden sm:inline">{muted ? 'Звук выкл.' : 'Звук вкл.'}</span>
            </button>
            <span className="font-oswald font-bold text-sm px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,209,102,0.1)', color: 'var(--gold)' }}>
              {score} очков
            </span>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, var(--teal-dark), var(--teal))' }} />
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {QUESTS.map((q, i) => (
            <div key={q.id} className="h-1 rounded-full flex-1 min-w-[8px] transition-colors duration-300"
              style={{
                backgroundColor: completedLevels.includes(q.id)
                  ? 'var(--teal)' : i === currentIdx
                  ? 'rgba(64,195,176,0.4)' : 'rgba(255,255,255,0.08)',
              }} />
          ))}
        </div>
      </div>

      {/* Quest card */}
      <div className="relative rounded-2xl overflow-hidden animate-scale-in"
        style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.12)' }}>
        {ripple && (
          <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
            <div className="w-16 h-16 rounded-full animate-ripple" style={{ backgroundColor: 'rgba(64,195,176,0.4)' }} />
          </div>
        )}

        {quest.mediaUrl && (
          <div className="relative h-52 md:h-64 overflow-hidden">
            <img src={quest.mediaUrl} alt={quest.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, var(--forest-mid) 100%)' }} />
            <div className="absolute top-3 left-3 px-2 py-1 rounded text-xs uppercase tracking-wider font-medium"
              style={{ backgroundColor: 'rgba(13,31,20,0.7)', color: 'var(--teal)', border: '1px solid rgba(64,195,176,0.3)' }}>
              <Icon name={quest.type === 'audio' ? 'Music' : 'Image'} size={10} className="inline mr-1" />
              {quest.type === 'audio' ? 'Аудио-загадка' : 'Найди ответ на фото'}
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Аудиоплеер */}
          {quest.audioUrl && (
            <div className="mb-5">
              <AudioPlayer
                key={quest.id}
                src={quest.audioUrl}
                label={quest.audioLabel}
                muted={muted}
                onMuteToggle={handleMuteToggle}
                autoPlay={true}
              />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-oswald font-bold"
              style={{ backgroundColor: 'rgba(64,195,176,0.15)', color: 'var(--teal)' }}>
              {currentIdx + 1}
            </div>
            <h2 className="font-oswald font-bold text-xl uppercase" style={{ color: 'white' }}>{quest.title}</h2>
          </div>

          <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.8)' }}>{quest.content}</p>

          {!hintShown ? (
            <button onClick={handleHint}
              className="flex items-center gap-2 text-xs mb-5 px-3 py-2 rounded-lg transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Icon name="HelpCircle" size={14} />Показать подсказку (−2 очка)
            </button>
          ) : (
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg mb-5 animate-fade-in-fast"
              style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.2)' }}>
              <Icon name="Lightbulb" size={14} style={{ color: 'var(--gold)', marginTop: '2px' }} />
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{quest.hint}</p>
            </div>
          )}

          {status !== 'correct' ? (
            <div className="flex gap-2">
              <input ref={inputRef} type="text" value={answer}
                onChange={e => setAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && answer.trim() && handleCheck()}
                placeholder="Введи ответ…"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(13,31,20,0.8)',
                  border: status === 'wrong' ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(64,195,176,0.2)',
                  color: 'white',
                }} />
              <button className="btn-teal px-5 py-3 text-sm" onClick={handleCheck}
                disabled={!answer.trim()} style={{ opacity: answer.trim() ? 1 : 0.5 }}>
                <span className="flex items-center gap-1.5"><Icon name="Check" size={16} />Ответить</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', border: '1px solid rgba(64,195,176,0.3)' }}>
                <Icon name="CheckCircle" size={18} style={{ color: 'var(--teal)' }} />
                <span className="font-medium text-sm" style={{ color: 'var(--teal)' }}>
                  Верно! +{hintUsed ? Math.max(0, quest.points - 2) : quest.points} очков
                </span>
              </div>
              <button className="btn-gold w-full" onClick={handleNext}>
                <span className="flex items-center justify-center gap-2">
                  {currentIdx + 1 < QUESTS.length
                    ? <><Icon name="ArrowRight" size={16} />Следующая загадка</>
                    : <><Icon name="Trophy" size={16} />Завершить путь</>}
                </span>
              </button>
            </div>
          )}

          {status === 'wrong' && (
            <p className="mt-2 text-xs flex items-center gap-1 animate-fade-in-fast" style={{ color: '#ef4444' }}>
              <Icon name="X" size={12} />Неверно, попробуй ещё раз
              {attempts >= 2 && !hintShown && (
                <span style={{ color: 'rgba(255,255,255,0.45)' }}> — воспользуйся подсказкой?</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Payment support */}
      <div className="mt-6 p-4 rounded-xl flex items-center justify-between gap-4"
        style={{ backgroundColor: 'rgba(13,31,20,0.5)', border: '1px solid rgba(255,209,102,0.1)' }}>
        <div>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>Нравится квест?</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Поддержи проект</p>
        </div>
        <a href={settings.paymentUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all hover:opacity-80"
          style={{ backgroundColor: 'rgba(255,209,102,0.12)', color: 'var(--gold)', border: '1px solid rgba(255,209,102,0.2)' }}>
          <Icon name="Heart" size={12} />Поддержать
        </a>
      </div>
    </div>
  );
}