// src/routes/surah/+page.ts
import surahInfo, { MakkiyahMadaniyah } from '../../assets/surah-info';

export function load() {
	const surahs = Object.entries(surahInfo).map(([key, value]) => ({
		...value,
		key,
		revelation: MakkiyahMadaniyah[key]
	}));

	return { surahs };
}
