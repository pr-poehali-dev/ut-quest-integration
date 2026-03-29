import { Section, User } from '@/App';
import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (s: Section) => void;
  onLoginClick: () => void;
  user: User;
}

const HERO_IMG = 'https://cdn.poehali.dev/projects/f6ec705e-5434-4f28-ac42-1b102b709629/files/9db25fb1-7be0-4721-b1df-49acb87801db.jpg';
const DAM_IMG  = 'https://cdn.poehali.dev/projects/f6ec705e-5434-4f28-ac42-1b102b709629/files/fdf05003-2452-4eaa-95f7-ae586461a056.jpg';
const PANO_IMG = 'https://cdn.poehali.dev/projects/f6ec705e-5434-4f28-ac42-1b102b709629/files/833bb52f-b70c-4d53-baf7-94f36d5fae5d.jpg';

const FEATURES = [
  { icon: 'Puzzle', title: '15 загадок', desc: 'От плотины до легенд тайги — каждый уровень открывает новую тайну города' },
  { icon: 'Star',   title: 'Очки и рейтинг', desc: '+10 за верный ответ, −2 за подсказку. Попади в топ исследователей' },
  { icon: 'MapPin', title: 'Живые маршруты', desc: 'Интерактивная карта с точками города, которые открываются по ходу квеста' },
  { icon: 'Trophy', title: 'Финальный приз', desc: 'Цифровой путеводитель и уникальный «ключ» для настоящих знатоков' },
];

export default function HomePage({ onNavigate, onLoginClick, user }: Props) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(13,31,20,0.88) 0%, rgba(13,31,20,0.60) 50%, rgba(13,31,20,0.80) 100%)',
          }}
        />
        {/* Decorative teal line */}
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--teal), transparent)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6 animate-fade-in"
              style={{ backgroundColor: 'rgba(64, 195, 176, 0.15)', color: 'var(--teal)', border: '1px solid rgba(64,195,176,0.3)' }}
            >
              <Icon name="TreePine" size={12} />
              Мастер путей · Усть-Илимск
            </div>

            <h1
              className="font-oswald font-bold uppercase leading-none mb-4 animate-fade-in delay-100"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', color: 'white', opacity: 0 }}
            >
              Тайны<br />
              <span style={{ color: 'var(--teal)' }}>Усть‑Илимска</span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-8 animate-fade-in delay-200"
              style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px', opacity: 0 }}
            >
              Квест-путешествие по таёжному городу: от легендарной плотины на Ангаре до лесных тайн. 15 загадок, реальные места, настоящая история.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in delay-300" style={{ opacity: 0 }}>
              <button
                className="btn-gold text-sm"
                onClick={() => onNavigate('quest')}
              >
                <span className="flex items-center gap-2">
                  <Icon name="Play" size={16} />
                  Начать путь
                </span>
              </button>
              {!user && (
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-oswald font-semibold uppercase tracking-widest transition-all duration-200"
                  style={{
                    border: '1px solid rgba(64,195,176,0.4)',
                    color: 'var(--teal)',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Icon name="LogIn" size={16} />
                  Войти / Регистрация
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 animate-fade-in delay-400" style={{ opacity: 0 }}>
              {[['15', 'Загадок'], ['150', 'Очков макс.'], ['5', 'Локаций']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-oswald font-bold text-2xl" style={{ color: 'var(--gold)' }}>{val}</div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Icon name="ChevronDown" size={24} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--forest-mid)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Что тебя ждёт</p>
            <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase" style={{ color: 'white' }}>
              Исследуй город как никогда
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(13,31,20,0.6)',
                  border: '1px solid rgba(64,195,176,0.1)',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(64,195,176,0.12)', color: 'var(--teal)' }}
                >
                  <Icon name={f.icon} size={20} fallback="Star" />
                </div>
                <h3 className="font-oswald font-semibold text-lg uppercase mb-2" style={{ color: 'white' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Images strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={DAM_IMG} alt="Плотина ГЭС" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 flex items-end p-6" style={{ background: 'linear-gradient(to top, rgba(13,31,20,0.8), transparent)' }}>
            <div>
              <p className="font-oswald font-bold text-xl uppercase" style={{ color: 'white' }}>Плотина Усть-Илимской ГЭС</p>
              <p className="text-sm" style={{ color: 'var(--teal)' }}>4413 м · Ангара</p>
            </div>
          </div>
        </div>
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={PANO_IMG} alt="Панорама города" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          <div className="absolute inset-0 flex items-end p-6" style={{ background: 'linear-gradient(to top, rgba(13,31,20,0.8), transparent)' }}>
            <div>
              <p className="font-oswald font-bold text-xl uppercase" style={{ color: 'white' }}>Город в тайге</p>
              <p className="text-sm" style={{ color: 'var(--gold)' }}>Основан 1973 · Иркутская область</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: 'var(--forest-dark)' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-oswald font-bold text-3xl md:text-4xl uppercase mb-4" style={{ color: 'white' }}>
            Готов раскрыть тайны?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Присоединяйся к исследователям города и пройди все 15 уровней. Квест доступен онлайн.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="btn-gold" onClick={() => onNavigate('quest')}>
              <span className="flex items-center gap-2">
                <Icon name="Map" size={16} />
                Отправиться в путь
              </span>
            </button>
            <button
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-oswald font-semibold uppercase tracking-widest transition-all duration-200"
              style={{ border: '1px solid rgba(255,209,102,0.3)', color: 'var(--gold)' }}
              onClick={() => onNavigate('about')}
            >
              <Icon name="Info" size={16} />
              О пути
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 px-6 border-t text-center"
        style={{ borderColor: 'rgba(64,195,176,0.1)', color: 'rgba(255,255,255,0.3)' }}
      >
        <p className="text-xs">
          © 2024 Тайны Усть-Илимска · Платформа{' '}
          <span style={{ color: 'var(--teal)' }}>Мастер путей</span>
          {' '}· SITE_KEY: ТАЙНЫ--KEY-7501
        </p>
      </footer>
    </div>
  );
}
