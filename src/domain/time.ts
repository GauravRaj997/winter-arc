// Dates are local calendar keys ("YYYY-MM-DD"); times are "HH:MM" (24h).
// Keys are parsed as UTC midnight so day math never drifts across DST.

const pad = (n: number) => String(n).padStart(2, '0');

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const fromMinutes = (min: number) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

export const isValidTime = (s: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

export const formatTime = (hhmm: string) => {
  const m = toMinutes(hhmm);
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}:${pad(m % 60)} ${h < 12 ? 'AM' : 'PM'}`;
};

export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const utc = (key: string) => new Date(`${key}T00:00:00Z`);

export const isValidDateKey = (s: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(utc(s).getTime()) && utc(s).toISOString().startsWith(s);

export const daysBetween = (from: string, to: string) =>
  Math.round((utc(to).getTime() - utc(from).getTime()) / 86_400_000);

export const addDays = (key: string, n: number) => {
  const d = utc(key);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** 0 = Sunday … 6 = Saturday */
export const weekdayOf = (key: string) => utc(key).getUTCDay();

export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDate = (key: string) =>
  utc(key).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
