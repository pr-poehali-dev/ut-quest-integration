import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { getParticipants, syncWithPlatform, type Participant } from '@/lib/store';

interface RatingEntry {
  rank: number;
  name: string;
  phone: string;
  score: number;
  levels: number;
  badge: string;
}

function toBadge(rank: number) {
  if (rank === 1) return '🏆';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

export default function RatingPage() {
  const [entries, setEntries] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'local' | 'platform'>('local');

  const buildLocal = (): RatingEntry[] => {
    const list: Participant[] = getParticipants();
    return list
      .filter(p => p.isActive)
      .sort((a, b) => b.score - a.score || b.completedLevels.length - a.completedLevels.length)
      .map((p, i) => ({
        rank: i + 1,
        name: p.name,
        phone: p.phone.slice(0, 3) + '***' + p.phone.slice(-2),
        score: p.score,
        levels: p.completedLevels.length,
        badge: toBadge(i + 1),
      }));
  };

  const fetchPlatform = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://api.master-putey.ru/integrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_rating', site_key: 'ТАЙНЫ--KEY-7501' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.rating) && data.rating.length > 0) {
          setEntries(data.rating.map((r: RatingEntry, i: number) => ({ ...r, rank: i + 1, badge: toBadge(i + 1) })));
          setSource('platform');
          setLoading(false);
          return;
        }
      }
    } catch { /* fallback */ }
    setEntries(buildLocal());
    setSource('local');
    setLoading(false);
  };

  useEffect(() => { fetchPlatform(); }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--teal)' }}>Таблица лидеров</p>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <h1 className="font-oswald font-bold text-4xl uppercase" style={{ color: 'white' }}>
            Рейтинг <span style={{ color: 'var(--gold)' }}>Исследователей</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: source === 'platform' ? 'rgba(64,195,176,0.1)' : 'rgba(255,255,255,0.06)', color: source === 'platform' ? 'var(--teal)' : 'rgba(255,255,255,0.35)' }}>
              {source === 'platform' ? '🟢 Платформа' : '🔵 Локально'}
            </span>
            <button onClick={fetchPlatform} className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Icon name="RefreshCw" size={13} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Icon name="Loader" size={20} />
          <span className="text-sm">Загружаем рейтинг…</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Icon name="Trophy" size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">Рейтинг пока пуст — будь первым!</p>
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {top3.map(p => (
                <div key={p.rank} className="p-4 rounded-xl text-center transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    backgroundColor: p.rank === 1 ? 'rgba(255,209,102,0.08)' : 'var(--forest-mid)',
                    border: p.rank === 1 ? '1px solid rgba(255,209,102,0.3)' : '1px solid rgba(64,195,176,0.1)',
                  }}>
                  <div className="text-2xl mb-1">{p.badge}</div>
                  <p className="font-oswald font-bold text-sm uppercase truncate" style={{ color: 'white' }}>{p.name}</p>
                  <p className="font-oswald font-bold text-xl" style={{ color: p.rank === 1 ? 'var(--gold)' : 'var(--teal)' }}>{p.score}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.levels}/15</p>
                </div>
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(64,195,176,0.12)' }}>
              <div className="px-4 py-3 grid grid-cols-12 gap-2 text-xs uppercase tracking-wider"
                style={{ backgroundColor: 'rgba(64,195,176,0.06)', color: 'rgba(255,255,255,0.35)' }}>
                <span className="col-span-1">#</span>
                <span className="col-span-5">Участник</span>
                <span className="col-span-3 text-right">Очки</span>
                <span className="col-span-3 text-right">Уровни</span>
              </div>
              {rest.map((p, i) => (
                <div key={p.rank} className="px-4 py-3 grid grid-cols-12 gap-2 items-center"
                  style={{ backgroundColor: i % 2 === 0 ? 'rgba(13,31,20,0.4)' : 'transparent', borderTop: '1px solid rgba(64,195,176,0.05)' }}>
                  <span className="col-span-1 font-oswald font-bold text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.rank}</span>
                  <span className="col-span-5 font-medium text-sm truncate" style={{ color: 'white' }}>{p.name}</span>
                  <span className="col-span-3 text-right font-oswald font-bold" style={{ color: 'var(--teal)' }}>{p.score}</span>
                  <span className="col-span-3 text-right text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.levels}/15</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-6 p-4 rounded-xl flex items-center gap-3"
        style={{ backgroundColor: 'rgba(64,195,176,0.05)', border: '1px solid rgba(64,195,176,0.15)' }}>
        <Icon name="Info" size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Рейтинг обновляется после каждого уровня. При наличии связи данные берутся с платформы Мастер путей, иначе — локально.
        </p>
      </div>
    </div>
  );
}
