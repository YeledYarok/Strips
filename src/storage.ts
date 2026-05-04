import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  settings: '@stripes/settings',
  log: '@stripes/log',
};

export type Stripe = {
  id: string;
  timestamp: number;
  mg: number;
};

export type Settings = {
  mgPerStripe: number;
};

const DEFAULT_SETTINGS: Settings = { mgPerStripe: 500 };

export async function getSettings(): Promise<Settings> {
  const raw = await AsyncStorage.getItem(KEYS.settings);
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

export async function getAllStripes(): Promise<Stripe[]> {
  const raw = await AsyncStorage.getItem(KEYS.log);
  return raw ? JSON.parse(raw) : [];
}

export async function logStripe(mg: number): Promise<void> {
  const existing = await getAllStripes();
  const stripe: Stripe = { id: Date.now().toString(), timestamp: Date.now(), mg };
  await AsyncStorage.setItem(KEYS.log, JSON.stringify([...existing, stripe]));
}

export async function getTodayStripes(): Promise<Stripe[]> {
  const all = await getAllStripes();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return all.filter((s) => s.timestamp >= startOfDay.getTime());
}

export async function getTodayMg(): Promise<number> {
  const today = await getTodayStripes();
  return today.reduce((sum, s) => sum + s.mg, 0);
}

export function formatMg(mg: number): string {
  return mg.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' mg';
}
