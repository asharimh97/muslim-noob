import { HADITS_API_URL } from '$lib/constants/api';
import { getRandomDailyHadits } from '$lib/utils/getRandomDailyHadits';
import { HADITH_API_KEY } from '$env/static/private';
import axios from 'axios';

interface HaditsDataItem {
	book: {
		aboutWriter: string;
		bookName: string;
		bookSlug: string;
		id: number;
		writerDeath: string;
		writerName: string;
	};
	bookSlug: string;
	chapter: {
		bookSlug: string;
		chapterArabic: string;
		chapterEnglish: string;
		chapterNumber: string;
		chapterUrdu: string;
		id: number;
	};
	chapterId: string;
	englishNarrator: string;
	hadithArabic: string;
	hadithEnglish: string;
	hadithNumber: number;
	hadithUrdu: string;
	headingArabic: string;
	headingEnglish: string;
	headingUrdu: string;
	id: number;
	status: string;
	urduNarrator: string;
	volume: string;
}

interface HaditsResponse {
	current_page: number;
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	next_page_url: string;
	path: string;
	per_page: number;
	prev_page_url: string;
	to: number;
	total: number;
	data: HaditsDataItem[];
}

export async function load() {
	const { book, hadithNumber } = getRandomDailyHadits();

	const response = await axios.get(`${HADITS_API_URL}hadiths`, {
		params: {
			book,
			hadithNumber,
			apiKey: HADITH_API_KEY
		}
	});

	return { hadits: response.data.hadiths as HaditsResponse };
}
