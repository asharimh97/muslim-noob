// src/routes/surah/+page.ts
import surahInfo from '../../assets/surah-info';

export function load() {
	const surahs = Object.entries(surahInfo).map(([key, value]) => ({ ...value, key }));
	return { surahs };
}
