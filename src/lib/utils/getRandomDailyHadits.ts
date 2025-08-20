import { haditsInfo } from '$assets/hadits-info';

// Simple seeded random number generator
const seededRandom = (seed: number) => {
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};

export const getRandomDailyHadits = () => {
	// Create a seed based on the current date (year, month, day)
	const today = new Date();
	const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

	// Use the date seed to generate consistent random numbers
	const randomIndex = Math.floor(seededRandom(dateSeed) * haditsInfo.length);
	const selectedHadits = haditsInfo[randomIndex];
	const selectedHaditsNumber = Math.floor(
		seededRandom(dateSeed + 1) * Number(selectedHadits.hadiths_count)
	);

	return {
		book: selectedHadits.bookSlug,
		hadithNumber: selectedHaditsNumber
	};
};
