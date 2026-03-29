import { Section } from '@/App';
import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (s: Section) => void;
}

const TIMELINE = [
  { year: '1963', text: 'Начало строительства ГЭС и посёлка первостроителей на берегу Ангары' },
  { year: '1973', text: 'Присвоение статуса города — рождение Усть-Илимска' },
  { year: '1977', text: 'Полный пуск ГЭС: 4413 м плотины, мощность 3840 МВт' },
  { year: 'Сегодня', text: 'Квест «Тайны Усть-Илимска» — интерактивное путешествие по истории города' },
];

const RULES = [
  { icon: 'MessageSquare', text: '15 загадок разных форматов: текст, фото, аудио, видео' },
  { icon: 'Plus', text: '+10 очков за правильный ответ с первой попытки' },
  { icon: 'Minus', text: '−2 очка за использование подсказки' },
  { icon: 'RotateCcw', text: 'Можно попробовать ответ несколько раз, но подсказка снимает очки' },
  { icon: 'Trophy', text: 'Финал открывает интерактивную карту и PDF-путеводитель' },
  { icon: 'Users', text: 'Результаты отображаются в общем рейтинге через платформу Мастер путей' },
];

export default function AboutPage({ onNavigate }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>О пути</p>
        <h1 className="font-oswald font-bold text-4xl md:text-5xl uppercase mb-4" style={{ color: 'white' }}>
          Квест «Тайны<br /><span style={{ color: 'var(--teal)' }}>Усть-Илимска»</span>
        </h1>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Интерактивное приключение по истории сибирского города — от плотины на Ангаре до легенд таёжного края. Создан на платформе <span style={{ color: 'var(--teal)' }}>Мастер путей</span>.
        </p>
      </div>

      {/* Timeline */}
      <section className="mb-14">
        <h2 className="font-oswald font-bold text-2xl uppercase mb-6" style={{ color: 'var(--gold)' }}>История города</h2>
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(64,195,176,0.2)' }} />
          {TIMELINE.map((t, i) => (
            <div key={i} className="relative mb-6 last:mb-0">
              <div
                className="absolute -left-[25px] w-4 h-4 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--teal)', backgroundColor: 'var(--forest-dark)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--teal)' }} />
              </div>
              <div className="pl-4">
                <span className="font-oswald font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--teal)' }}>{t.year}</span>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section
        className="rounded-xl p-6 mb-10"
        style={{ backgroundColor: 'var(--forest-mid)', border: '1px solid rgba(64,195,176,0.12)' }}
      >
        <h2 className="font-oswald font-bold text-2xl uppercase mb-6" style={{ color: 'white' }}>Правила квеста</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RULES.map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}
              >
                <Icon name={r.icon} size={15} fallback="Check" />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integration info */}
      <section
        className="rounded-xl p-6 mb-10"
        style={{ backgroundColor: 'rgba(64,195,176,0.05)', border: '1px solid rgba(64,195,176,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Link" size={16} style={{ color: 'var(--teal)' }} />
          <h3 className="font-oswald font-semibold text-lg uppercase" style={{ color: 'var(--teal)' }}>
            Интеграция с платформой
          </h3>
        </div>
        <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Квест работает на платформе <strong style={{ color: 'white' }}>Мастер путей</strong>. Прогресс синхронизируется автоматически — результаты сохраняются в общем рейтинге платформы.
        </p>
        <div className="flex flex-wrap gap-3 text-xs">
          <span
            className="px-2 py-1 rounded"
            style={{ backgroundColor: 'rgba(64,195,176,0.1)', color: 'var(--teal)' }}
          >
            SITE_KEY: ТАЙНЫ--KEY-7501
          </span>
          <span
            className="px-2 py-1 rounded"
            style={{ backgroundColor: 'rgba(255,209,102,0.1)', color: 'var(--gold)' }}
          >
            Синхронизация: api.master-putey.ru
          </span>
        </div>
      </section>

      <button className="btn-gold" onClick={() => onNavigate('quest')}>
        <span className="flex items-center gap-2">
          <Icon name="Play" size={16} />
          Начать путь прямо сейчас
        </span>
      </button>
    </div>
  );
}
