import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Связь</p>
        <h1 className="font-oswald font-bold text-4xl uppercase" style={{ color: 'white' }}>
          Контакты
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Вопросы по квесту, техническая поддержка, предложения о сотрудничестве
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          {sent ? (
            <div
              className="p-8 rounded-2xl text-center animate-scale-in"
              style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.2)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}
              >
                <Icon name="CheckCircle" size={28} />
              </div>
              <h3 className="font-oswald font-bold text-xl uppercase mb-2" style={{ color: 'white' }}>Сообщение отправлено</h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Ответим в течение 24 часов</p>
              <button
                className="mt-4 text-xs underline"
                style={{ color: 'var(--teal)' }}
                onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '' }); }}
              >
                Отправить ещё
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <h2 className="font-oswald font-semibold text-xl uppercase mb-4" style={{ color: 'white' }}>
                Напишите нам
              </h2>
              {[
                { key: 'name', label: 'Имя', placeholder: 'Ваше имя', type: 'text' },
                { key: 'phone', label: 'Телефон', placeholder: '+7 900 000-00-00', type: 'tel' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.key as 'name' | 'phone']}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--forest-mid)',
                      border: '1px solid rgba(64,195,176,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Сообщение
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ваш вопрос или предложение…"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 resize-none"
                  style={{
                    backgroundColor: 'var(--forest-mid)',
                    border: '1px solid rgba(64,195,176,0.15)',
                    color: 'white',
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn-teal w-full"
                disabled={!form.name || !form.message}
                style={{ opacity: form.name && form.message ? 1 : 0.5 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Send" size={16} />
                  Отправить
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h2 className="font-oswald font-semibold text-xl uppercase mb-4" style={{ color: 'white' }}>
            Информация
          </h2>
          {[
            { icon: 'MapPin', label: 'Город', value: 'Усть-Илимск, Иркутская область' },
            { icon: 'Globe', label: 'Платформа', value: 'Мастер путей (masterpaths.app)' },
            { icon: 'Key', label: 'Ключ сайта', value: 'ТАЙНЫ--KEY-7501' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 p-4 rounded-xl"
              style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.08)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}
              >
                <Icon name={item.icon} size={16} fallback="Info" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
                <p className="text-sm font-medium" style={{ color: 'white' }}>{item.value}</p>
              </div>
            </div>
          ))}

          {/* Report button */}
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: 'rgba(239,68,68,0.8)',
            }}
          >
            <Icon name="AlertTriangle" size={15} />
            Сообщить о проблеме
          </button>

          {/* Access request */}
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: 'rgba(255,209,102,0.06)',
              border: '1px solid rgba(255,209,102,0.2)',
              color: 'var(--gold)',
            }}
          >
            <Icon name="KeyRound" size={15} />
            Запросить доступ к пути
          </button>
        </div>
      </div>
    </div>
  );
}
