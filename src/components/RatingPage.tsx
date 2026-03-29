import Icon from '@/components/ui/icon';

const MOCK_RATING = [
  { rank: 1, name: 'Таёжник_Андрей', score: 148, levels: 15, badge: '🏆' },
  { rank: 2, name: 'Ангара_Светлана', score: 142, levels: 15, badge: '🥈' },
  { rank: 3, name: 'Плотина_Иван', score: 136, levels: 15, badge: '🥉' },
  { rank: 4, name: 'GES_Explorer', score: 128, levels: 14, badge: '' },
  { rank: 5, name: 'Первостроитель', score: 120, levels: 13, badge: '' },
  { rank: 6, name: 'UstIlimsk_Fan', score: 110, levels: 12, badge: '' },
  { rank: 7, name: 'Сосна_2024', score: 100, levels: 11, badge: '' },
];

export default function RatingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Таблица лидеров</p>
        <h1 className="font-oswald font-bold text-4xl uppercase" style={{ color: 'white' }}>
          Рейтинг<br /><span style={{ color: 'var(--gold)' }}>Исследователей</span>
        </h1>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Синхронизируется с платформой Мастер путей в реальном времени
        </p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {MOCK_RATING.slice(0, 3).map((p) => (
          <div
            key={p.rank}
            className="p-4 rounded-xl text-center transition-transform duration-200 hover:-translate-y-1"
            style={{
              backgroundColor: p.rank === 1 ? 'rgba(255,209,102,0.08)' : 'var(--forest-mid)',
              border: p.rank === 1 ? '1px solid rgba(255,209,102,0.3)' : '1px solid rgba(64,195,176,0.1)',
            }}
          >
            <div className="text-2xl mb-1">{p.badge}</div>
            <p className="font-oswald font-bold text-sm uppercase truncate" style={{ color: 'white' }}>{p.name}</p>
            <p className="font-oswald font-bold text-xl" style={{ color: p.rank === 1 ? 'var(--gold)' : 'var(--teal)' }}>
              {p.score}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.levels}/15 уровней</p>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(64,195,176,0.12)' }}
      >
        <div
          className="px-4 py-3 grid grid-cols-12 gap-2 text-xs uppercase tracking-wider"
          style={{ backgroundColor: 'rgba(64,195,176,0.06)', color: 'rgba(255,255,255,0.35)' }}
        >
          <span className="col-span-1">#</span>
          <span className="col-span-5">Участник</span>
          <span className="col-span-3 text-right">Очки</span>
          <span className="col-span-3 text-right">Уровни</span>
        </div>
        {MOCK_RATING.map((p, i) => (
          <div
            key={p.rank}
            className="px-4 py-3 grid grid-cols-12 gap-2 items-center transition-colors duration-150"
            style={{
              backgroundColor: i % 2 === 0 ? 'rgba(13,31,20,0.4)' : 'transparent',
              borderTop: '1px solid rgba(64,195,176,0.05)',
            }}
          >
            <span
              className="col-span-1 font-oswald font-bold text-sm"
              style={{ color: p.rank <= 3 ? 'var(--gold)' : 'rgba(255,255,255,0.3)' }}
            >
              {p.rank}
            </span>
            <span className="col-span-5 font-medium text-sm truncate" style={{ color: 'white' }}>
              {p.badge && <span className="mr-1">{p.badge}</span>}
              {p.name}
            </span>
            <span className="col-span-3 text-right font-oswald font-bold" style={{ color: 'var(--teal)' }}>{p.score}</span>
            <span className="col-span-3 text-right text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.levels}/15</span>
          </div>
        ))}
      </div>

      <div
        className="mt-6 p-4 rounded-xl flex items-center gap-3"
        style={{ backgroundColor: 'rgba(64,195,176,0.05)', border: '1px solid rgba(64,195,176,0.15)' }}
      >
        <Icon name="Info" size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Рейтинг обновляется после каждого завершённого уровня. Данные синхронизируются с сервером платформы Мастер путей.
        </p>
      </div>
    </div>
  );
}
