<script lang="ts">
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { Play, Share2 } from '@lucide/svelte';
	import type { SurahData, SurahInfo } from '../../../assets/types';

	export let data: {
		chapter: string;
		surahData: SurahData;
		surahInfo: SurahInfo;
	};

	let search = '';

	// $: filtered = Object.entries(data.surahData.translations.id.text).filter(([key, value]) => {
	// 	const q = search.trim().toLowerCase();
	// 	if (!q) return true;
	// 	return value.toLowerCase().includes(q) || key.toLowerCase().includes(q);
	// });
</script>

<svelte:head>
	<MetaTag 
		title={`Surah ${data.surahData.name} (${data.surahData.name_latin}) - Muslim Noob`}
		description={`Surah ${data.surahData.name} (${data.surahData.name_latin}) is the ${data.surahInfo.current.index} surah in the Quran. It has ${data.surahData.number_of_ayah} ayahs.`}
		url={`/surah/${data.chapter}`}
	/>
</svelte:head>

<Container>
	<div class="flex flex-row justify-between items-end border border-gray-100 rounded-md p-4 mb-4 shadow-xl">
		<div class="flex flex-col">
			<h1 class="mb-2 text-xl font-bold">Surah {data.surahData.name} - {data.surahData.name_latin}</h1>
			<p class="text-sm text-gray-500">{data.surahData.number_of_ayah} ayat</p>
		</div>
		<div class="flex flex-row items-center">
			<!-- INSERT_YOUR_CODE -->
			<button class="flex items-center cursor-pointer px-2 py-1 mr-2 rounded hover:bg-gray-200 transition" title="Play">
				<Play class="w-5 h-5 mr-1" />
				<span class="text-sm">Baca</span>
			</button>
			<button class="flex items-center cursor-pointer px-2 py-1 rounded hover:bg-gray-200 transition" title="Share">
				<Share2 class="w-5 h-5 mr-1" />
				<span class="text-sm">Share</span>
			</button>
		</div>
	</div>
	<input
		type="text"
		placeholder="Cari ayat (terjemahan, arabic, nomor)"
		bind:value={search}
		class="mb-4 w-full rounded border border-gray-300 p-2 focus:border-blue-300 focus:ring focus:outline-none"
	/>
	<div class="flex flex-col">
		{#each Object.entries(data.surahData.text) as [key, value]}
			<div class="flex flex-col">
				<a
					href={`/surah/${data.chapter}/${key}`}
					class="block rounded px-3 py-2 transition hover:bg-gray-100"
				>
					<div class="mb-1 flex flex-row">
						<div class="flex flex-row w-full font-semibold justify-between">
							<span class="mr-2 text-xl">{key}.</span>
							<span class="text-xl text-right leading-[2.5]">{value}</span>
						</div>
					</div>
					</a>
			</div>
		{/each}
	</div>
</Container>
