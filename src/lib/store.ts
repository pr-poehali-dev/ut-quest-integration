// Центральное хранилище данных (localStorage)
// Владелец: successful-lucky@yandex.ru

export const OWNER_EMAIL = 'successful-lucky@yandex.ru';
export const SITE_KEY = 'ТАЙНЫ--KEY-7501';
export const API_ENDPOINT = 'https://api.master-putey.ru/integrate';
export const MASTER_PATHS_WS = 'wss://masterpaths.app/api/connect';
export const INTEGRATION_KEY = '9b4195a4-7281-46dd-abd2-566ec925ab39';
export const NOTIFY_EMAIL = 'successful-lucky@yandex.ru';
export const PAYMENT_URL = 'https://yoomoney.ru/to/410017253212598/0';

export interface Participant {
  phone: string;
  name: string;
  email?: string;
  secretQuestion?: string;
  secretAnswer?: string;
  registeredAt: string;
  isActive: boolean; // активирован владельцем
  hasPaid: boolean;
  paidAt?: string;
  score: number;
  currentLevel: number;
  completedLevels: number[];
  lastActivity: string;
}

export interface SiteSettings {
  questPrice: number;       // цена квеста в рублях (0 = бесплатно)
  questTitle: string;
  questDescription: string;
  ownerEmail: string;
  paymentUrl: string;
  isPaymentRequired: boolean;
  welcomeMessage: string;
}

export interface OwnerSession {
  email: string;
  loginAt: string;
}

// --- Настройки сайта ---
export function getSettings(): SiteSettings {
  const raw = localStorage.getItem('quest_settings');
  if (raw) return JSON.parse(raw);
  return {
    questPrice: 0,
    questTitle: 'Тайны Усть-Илимска',
    questDescription: 'Квест-путешествие по таёжному городу: 15 загадок, реальные места, настоящая история.',
    ownerEmail: OWNER_EMAIL,
    paymentUrl: PAYMENT_URL,
    isPaymentRequired: false,
    welcomeMessage: 'Добро пожаловать на путь исследователя!',
  };
}

export function saveSettings(s: SiteSettings) {
  localStorage.setItem('quest_settings', JSON.stringify(s));
}

// --- Участники ---
export function getParticipants(): Participant[] {
  const raw = localStorage.getItem('quest_participants');
  return raw ? JSON.parse(raw) : [];
}

export function saveParticipants(list: Participant[]) {
  localStorage.setItem('quest_participants', JSON.stringify(list));
}

export function getParticipant(phone: string): Participant | null {
  return getParticipants().find(p => p.phone === phone) || null;
}

export function upsertParticipant(p: Participant) {
  const list = getParticipants();
  const idx = list.findIndex(x => x.phone === p.phone);
  if (idx >= 0) list[idx] = p;
  else list.push(p);
  saveParticipants(list);
}

// --- Сессия участника ---
export function getSession(): { phone: string; name: string } | null {
  const raw = localStorage.getItem('quest_session');
  return raw ? JSON.parse(raw) : null;
}

export function saveSession(u: { phone: string; name: string }) {
  localStorage.setItem('quest_session', JSON.stringify(u));
}

export function clearSession() {
  localStorage.removeItem('quest_session');
}

// --- Сессия владельца ---
export function getOwnerSession(): OwnerSession | null {
  const raw = localStorage.getItem('quest_owner_session');
  return raw ? JSON.parse(raw) : null;
}

export function saveOwnerSession(s: OwnerSession) {
  localStorage.setItem('quest_owner_session', JSON.stringify(s));
}

export function clearOwnerSession() {
  localStorage.removeItem('quest_owner_session');
}

// --- Синхронизация с платформой ---
export async function syncWithPlatform(payload: object) {
  try {
    await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INTEGRATION_KEY}`,
        'X-Site-Key': SITE_KEY,
      },
      body: JSON.stringify({ site_key: SITE_KEY, ...payload }),
    });
  } catch { /* фоновая синхронизация */ }
}

// --- Email уведомление (через платформу) ---
export async function sendEmailNotification(subject: string, body: string) {
  await syncWithPlatform({
    action: 'notify_email',
    to: NOTIFY_EMAIL,
    subject,
    body,
  });
}