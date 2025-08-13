export interface SurahData {
  number: string;
  name: string;
  name_latin: string;
  number_of_ayah: string;
  text: Record<string, string>;
  translations: Record<string, {
    name: string;
    text: Record<string, string>;
  }>;
  tafsir: Record<string, {
    id: {
      kemenag: {
        name: string;
        source: string;
        text: Record<string, string>;
      }
    }
  }>;
}

export interface SurahInfoItem {
  translation: string;
  arabic: string;
  latin: string;
  ayah_count: number;
  index: number;
}

export interface SurahInfo {
  current: SurahInfoItem;
  prev: SurahInfoItem | null;
  next: SurahInfoItem | null;
}