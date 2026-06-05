import surahInfo from '../../assets/surah-info';

/**
 * Calculates the global ayah index (1-6236) across the entire Quran
 * for a given chapter (1-114) and verse number (1-based).
 */
export function getGlobalAyahNumber(chapterIndex: number, verseIndex: number): number {
	let globalIndex = 0;
	for (let i = 1; i < chapterIndex; i++) {
		const info = surahInfo[String(i)];
		if (info) {
			globalIndex += info.ayah_count;
		}
	}
	return globalIndex + verseIndex;
}

/**
 * Constructs the audio recitation URL from the Al Quran Cloud CDN
 */
export function getAudioUrl(reciter: string, globalAyahNumber: number): string {
	return `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;
}

/**
 * Returns a fallback audio url using the redirect cdn
 */
export function getFallbackAudioUrl(reciter: string, globalAyahNumber: number): string {
	return `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${globalAyahNumber}`;
}
