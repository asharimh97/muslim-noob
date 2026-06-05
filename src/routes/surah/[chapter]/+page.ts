import type { SurahData, SurahInfo } from '../../../assets/types';

export async function load({ params }: { params: { chapter: string } }): Promise<{ chapter: string, surahData: SurahData, surahInfo: SurahInfo }> {
	const { chapter } = params;

	// Import surah data dynamically
	const surahData = await import(`../../../assets/surah-data/${chapter}.ts`).then((module) => module.default);
	const surahInfo = await import(`../../../assets/surah-info/${chapter}.ts`).then((module) => module.default);
	
	if (!surahData || !surahInfo) {
		throw new Error(`Surah ${chapter} not found`);
	}

	return { chapter, surahData: surahData[chapter], surahInfo };
}