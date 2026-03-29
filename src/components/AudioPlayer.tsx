import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

interface Props {
  src: string;
  label?: string;
  muted: boolean;
  onMuteToggle: () => void;
  autoPlay?: boolean;
}

export default function AudioPlayer({ src, label, muted, onMuteToggle, autoPlay = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Громкость — тихая и приятная (0.22 = ~22%)
  const VOLUME = 0.22;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;
    audio.loop = true;

    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onMeta = () => setDuration(audio.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    if (autoPlay && !muted) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
    };
  }, [src]);

  // Реагируем на изменение muted
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
    }
  }, [muted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || muted) return;
    if (playing) audio.pause();
    else audio.play().catch(() => {});
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(13,31,20,0.7)', border: '1px solid rgba(64,195,176,0.18)' }}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Label */}
      {label && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-medium" style={{ color: 'var(--teal)' }}>{label}</p>
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-3">
        {/* Play/pause */}
        <button
          onClick={togglePlay}
          disabled={muted}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            backgroundColor: muted ? 'rgba(255,255,255,0.05)' : 'var(--teal)',
            color: muted ? 'rgba(255,255,255,0.2)' : 'var(--forest-dark)',
            cursor: muted ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon name={playing ? 'Pause' : 'Play'} size={16} />
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div
            className="h-1.5 rounded-full overflow-hidden cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress * 100}%`,
                background: muted
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(to right, var(--teal-dark), var(--teal))',
              }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <span>{fmt(duration * progress)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Mute toggle */}
        <button
          onClick={onMuteToggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          title={muted ? 'Включить звук' : 'Выключить звук'}
          style={{
            backgroundColor: muted ? 'rgba(239,68,68,0.1)' : 'rgba(64,195,176,0.08)',
            border: `1px solid ${muted ? 'rgba(239,68,68,0.25)' : 'rgba(64,195,176,0.15)'}`,
            color: muted ? '#f87171' : 'rgba(255,255,255,0.45)',
          }}
        >
          <Icon name={muted ? 'VolumeX' : 'Volume2'} size={14} />
        </button>
      </div>

      {muted && (
        <div className="px-4 pb-3 flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <Icon name="VolumeX" size={11} />
          <span>Звук отключён — включите для прослушивания</span>
        </div>
      )}
    </div>
  );
}
