import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { sendEmailNotification, syncWithPlatform, NOTIFY_EMAIL } from '@/lib/store';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '', type: 'question' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await sendEmailNotification(
      `[${form.type === 'problem' ? 'Проблема' : 'Вопрос'}] от ${form.name}`,
      `Имя: ${form.name}\nТелефон: ${form.phone}\nСообщение:\n${form.message}\n\nОтправлено: ${new Date().toLocaleString('ru')}`
    );
    await syncWithPlatform({
      action: 'contact_form',
      name: form.name,
      phone: form.phone,
      message: form.message,
      type: form.type,
    });
    setSent(true);
    setLoading(false);
  };

  const inp = { backgroundColor: 'rgba(13,31,20,0.7)', border: '1px solid rgba(64,195,176,0.15)', color: 'white' };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Связь</p>
        <h1 className="font-oswald font-bold text-4xl uppercase" style={{ color: 'white' }}>Контакты</h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Вопросы по квесту, техническая поддержка, предложения о сотрудничестве
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          {sent ? (
            <div className="p-8 rounded-2xl text-center animate-scale-in"
              style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.2)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}>
                <Icon name="CheckCircle" size={28} />
              </div>
              <h3 className="font-oswald font-bold text-xl uppercase mb-2" style={{ color: 'white' }}>Сообщение отправлено</h3>
              <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>Ответим в течение 24 часов</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>на {NOTIFY_EMAIL}</p>
              <button className="mt-4 text-xs underline" style={{ color: 'var(--teal)' }}
                onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '', type: 'question' }); }}>
                Отправить ещё
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-oswald font-semibold text-xl uppercase mb-4" style={{ color: 'white' }}>Написать нам</h2>

              {/* Type toggle */}
              <div className="flex gap-2">
                {[
                  { id: 'question', label: 'Вопрос', icon: 'MessageCircle' },
                  { id: 'problem', label: 'Проблема', icon: 'AlertTriangle' },
                  { id: 'access', label: 'Доступ', icon: 'KeyRound' },
                ].map(t => (
                  <button key={t.id} type="button" onClick={() => setForm({ ...form, type: t.id })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: form.type === t.id ? 'rgba(64,195,176,0.15)' : 'transparent',
                      border: `1px solid ${form.type === t.id ? 'rgba(64,195,176,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: form.type === t.id ? 'var(--teal)' : 'rgba(255,255,255,0.4)',
                    }}>
                    <Icon name={t.icon} size={12} fallback="Circle" />{t.label}
                  </button>
                ))}
              </div>

              {[
                { key: 'name', label: 'Имя', placeholder: 'Ваше имя', type: 'text' },
                { key: 'phone', label: 'Телефон', placeholder: '+7 900 000-00-00', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.label}</label>
                  <input type={f.type} value={form[f.key as 'name' | 'phone']}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} />
                </div>
              ))}

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>Сообщение</label>
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Ваш вопрос или предложение…" rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inp} />
              </div>

              <button type="submit" className="btn-teal w-full"
                disabled={loading || !form.name || !form.message}
                style={{ opacity: loading || !form.name || !form.message ? 0.5 : 1 }}>
                <span className="flex items-center justify-center gap-2">
                  <Icon name={loading ? 'Loader' : 'Send'} size={16} />
                  {loading ? 'Отправляем…' : 'Отправить'}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h2 className="font-oswald font-semibold text-xl uppercase mb-4" style={{ color: 'white' }}>Информация</h2>
          {[
            { icon: 'MapPin', label: 'Город', value: 'Усть-Илимск, Иркутская область' },
            { icon: 'Mail', label: 'Email', value: NOTIFY_EMAIL },
            { icon: 'Globe', label: 'Платформа', value: 'Мастер путей' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.08)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}>
                <Icon name={item.icon} size={16} fallback="Info" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>{item.value}</p>
              </div>
            </div>
          ))}

          {/* Report */}
          <button onClick={() => setForm({ ...form, type: 'problem' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.8)' }}>
            <Icon name="AlertTriangle" size={15} />Сообщить о проблеме
          </button>

          {/* Access request */}
          <button onClick={() => setForm({ ...form, type: 'access' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ backgroundColor: 'rgba(255,209,102,0.06)', border: '1px solid rgba(255,209,102,0.2)', color: 'var(--gold)' }}>
            <Icon name="KeyRound" size={15} />Запросить доступ к пути
          </button>
        </div>
      </div>
    </div>
  );
}
