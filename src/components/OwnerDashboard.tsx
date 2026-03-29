import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import {
  getParticipants, upsertParticipant, getSettings, saveSettings,
  clearOwnerSession, syncWithPlatform, OWNER_EMAIL, SITE_KEY,
  type Participant, type SiteSettings, PAYMENT_URL
} from '@/lib/store';

interface Props {
  onClose: () => void;
}

type Tab = 'participants' | 'settings' | 'stats';

export default function OwnerDashboard({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('participants');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setParticipants(getParticipants());
  }, [tab]);

  const reload = () => setParticipants(getParticipants());

  const toggleActive = (phone: string) => {
    const p = participants.find(x => x.phone === phone);
    if (!p) return;
    const updated = { ...p, isActive: !p.isActive };
    upsertParticipant(updated);
    reload();
  };

  const togglePaid = (phone: string) => {
    const p = participants.find(x => x.phone === phone);
    if (!p) return;
    const updated = { ...p, hasPaid: !p.hasPaid, paidAt: !p.hasPaid ? new Date().toISOString() : undefined };
    upsertParticipant(updated);
    syncWithPlatform({ action: 'payment_status', phone, hasPaid: updated.hasPaid });
    reload();
  };

  const handleSaveSettings = () => {
    saveSettings(settings);
    setSettingsSaved(true);
    syncWithPlatform({ action: 'update_settings', settings });
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleLogout = () => {
    clearOwnerSession();
    onClose();
  };

  const filtered = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

  const totalPaid = participants.filter(p => p.hasPaid).length;
  const totalActive = participants.filter(p => p.isActive).length;
  const avgScore = participants.length
    ? Math.round(participants.reduce((s, p) => s + p.score, 0) / participants.length)
    : 0;
  const completedAll = participants.filter(p => p.completedLevels.length === 15).length;

  const inp = { backgroundColor: 'rgba(13,31,20,0.8)', border: '1px solid rgba(64,195,176,0.2)', color: 'white' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ backgroundColor: 'var(--forest-dark)', border: '1px solid rgba(64,195,176,0.2)', maxHeight: '95vh' }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b flex-shrink-0"
          style={{ borderColor: 'rgba(64,195,176,0.12)', backgroundColor: 'var(--forest-mid)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,209,102,0.15)', color: 'var(--gold)' }}>
              <Icon name="Settings" size={18} />
            </div>
            <div>
              <h2 className="font-oswald font-bold text-lg uppercase" style={{ color: 'white' }}>Кабинет владельца</h2>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{OWNER_EMAIL} · {SITE_KEY}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Icon name="LogOut" size={13} />Выйти
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-0 border-b flex-shrink-0" style={{ borderColor: 'rgba(64,195,176,0.08)' }}>
          {[
            { icon: 'Users', label: 'Участников', value: participants.length, color: 'var(--teal)' },
            { icon: 'CreditCard', label: 'Оплатили', value: totalPaid, color: 'var(--gold)' },
            { icon: 'UserCheck', label: 'Активных', value: totalActive, color: '#4ade80' },
            { icon: 'Trophy', label: 'Завершили', value: completedAll, color: 'var(--gold)' },
          ].map((s, i) => (
            <div key={i} className="px-4 py-3 text-center border-r last:border-r-0"
              style={{ borderColor: 'rgba(64,195,176,0.08)', backgroundColor: 'rgba(13,31,20,0.3)' }}>
              <p className="font-oswald font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b flex-shrink-0" style={{ borderColor: 'rgba(64,195,176,0.08)' }}>
          {([
            { id: 'participants', label: 'Участники', icon: 'Users' },
            { id: 'settings', label: 'Настройки', icon: 'Settings' },
            { id: 'stats', label: 'Статистика', icon: 'BarChart2' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-5 py-3 text-xs font-oswald font-semibold uppercase tracking-wider transition-all border-b-2"
              style={{
                borderBottomColor: tab === t.id ? 'var(--teal)' : 'transparent',
                color: tab === t.id ? 'var(--teal)' : 'rgba(255,255,255,0.35)',
                backgroundColor: 'transparent',
              }}>
              <Icon name={t.icon} size={14} fallback="Circle" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* УЧАСТНИКИ */}
          {tab === 'participants' && (
            <div>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Поиск по имени или телефону…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <Icon name="Users" size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Участников пока нет</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map(p => (
                    <div key={p.phone} className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.08)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-oswald font-semibold text-sm" style={{ color: 'white' }}>{p.name}</span>
                            {p.isActive
                              ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>активен</span>
                              : <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>неактивен</span>
                            }
                            {p.hasPaid
                              ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,209,102,0.1)', color: 'var(--gold)' }}>оплачено</span>
                              : <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>не оплачено</span>
                            }
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.phone}</p>
                          <div className="flex gap-4 mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            <span>Уровень: <strong style={{ color: 'var(--teal)' }}>{p.currentLevel + 1}/15</strong></span>
                            <span>Очки: <strong style={{ color: 'var(--gold)' }}>{p.score}</strong></span>
                            <span>Завершено: <strong style={{ color: 'white' }}>{p.completedLevels.length}/15</strong></span>
                          </div>
                          {/* Progress bar */}
                          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${(p.completedLevels.length / 15) * 100}%`, background: 'linear-gradient(to right, var(--teal-dark), var(--teal))' }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => toggleActive(p.phone)}
                            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{ border: '1px solid rgba(64,195,176,0.2)', color: 'var(--teal)', backgroundColor: 'transparent' }}>
                            {p.isActive ? 'Деактивировать' : 'Активировать'}
                          </button>
                          <button onClick={() => togglePaid(p.phone)}
                            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                            style={{ border: '1px solid rgba(255,209,102,0.2)', color: 'var(--gold)', backgroundColor: 'transparent' }}>
                            {p.hasPaid ? 'Отменить оплату' : 'Подтвердить оплату'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* НАСТРОЙКИ */}
          {tab === 'settings' && (
            <div className="max-w-xl space-y-5">
              <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.1)' }}>
                <h3 className="font-oswald font-semibold text-base uppercase" style={{ color: 'var(--teal)' }}>Основные</h3>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Название квеста</label>
                  <input type="text" value={settings.questTitle} onChange={e => setSettings({ ...settings, questTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Описание</label>
                  <textarea value={settings.questDescription} onChange={e => setSettings({ ...settings, questDescription: e.target.value })}
                    rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inp} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Приветственное сообщение</label>
                  <input type="text" value={settings.welcomeMessage} onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>

              <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(255,209,102,0.12)' }}>
                <h3 className="font-oswald font-semibold text-base uppercase" style={{ color: 'var(--gold)' }}>Оплата</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSettings({ ...settings, isPaymentRequired: !settings.isPaymentRequired })}
                    className="w-10 h-6 rounded-full transition-colors relative flex-shrink-0"
                    style={{ backgroundColor: settings.isPaymentRequired ? 'var(--teal)' : 'rgba(255,255,255,0.12)' }}>
                    <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: settings.isPaymentRequired ? '22px' : '2px' }} />
                  </button>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Квест платный</span>
                </div>
                {settings.isPaymentRequired && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Цена (руб.)
                    </label>
                    <input type="number" min={0} value={settings.questPrice}
                      onChange={e => setSettings({ ...settings, questPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                  </div>
                )}
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Ссылка YooMoney
                  </label>
                  <input type="url" value={settings.paymentUrl} onChange={e => setSettings({ ...settings, paymentUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                </div>
                <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: 'rgba(255,209,102,0.06)', color: 'rgba(255,255,255,0.5)' }}>
                  После оплаты участник нажимает «Я оплатил» — вам придёт уведомление на почту для ручной активации. Или вы можете активировать вручную в списке участников выше.
                </div>
              </div>

              <div className="rounded-xl p-4 space-y-4" style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.1)' }}>
                <h3 className="font-oswald font-semibold text-base uppercase" style={{ color: 'var(--teal)' }}>Email уведомлений</h3>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Email владельца</label>
                  <input type="email" value={settings.ownerEmail} onChange={e => setSettings({ ...settings, ownerEmail: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                </div>
              </div>

              <button onClick={handleSaveSettings} className="btn-teal w-full">
                <span className="flex items-center justify-center gap-2">
                  <Icon name={settingsSaved ? 'CheckCircle' : 'Save'} size={16} />
                  {settingsSaved ? 'Сохранено!' : 'Сохранить настройки'}
                </span>
              </button>
            </div>
          )}

          {/* СТАТИСТИКА */}
          {tab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Всего участников', value: participants.length, icon: 'Users', color: 'var(--teal)' },
                  { label: 'Средний счёт', value: avgScore, icon: 'Star', color: 'var(--gold)' },
                  { label: 'Оплатили', value: `${totalPaid} / ${participants.length}`, icon: 'CreditCard', color: 'var(--gold)' },
                  { label: 'Прошли полностью', value: completedAll, icon: 'Trophy', color: '#4ade80' },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl"
                    style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.08)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={s.icon} size={16} fallback="Circle" style={{ color: s.color }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.label}</span>
                    </div>
                    <p className="font-oswald font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* По уровням */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.08)' }}>
                <h3 className="font-oswald font-semibold text-sm uppercase mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Прогресс по уровням</h3>
                {Array.from({ length: 15 }, (_, i) => {
                  const count = participants.filter(p => p.completedLevels.includes(i + 1)).length;
                  const pct = participants.length ? (count / participants.length) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 mb-2">
                      <span className="text-xs w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>Уровень {i + 1}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: 'var(--teal)' }} />
                      </div>
                      <span className="text-xs w-8 text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
