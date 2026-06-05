<script lang="ts">
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { twMerge } from 'tailwind-merge';

	export let data;

	let search = '';

	$: filtered = data.surahs.filter((surah) => {
		const q = search.trim().toLowerCase();
		if (!q) return true;
		return (
			surah.latin.toLowerCase().includes(q) ||
			surah.translation.toLowerCase().includes(q) ||
			surah.arabic.includes(q) ||
			surah.index === Number(q)
		);
	});
</script>

<svelte:head>
	<MetaTag
		title="Daftar Surah Al-Qur'an"
		description="List of all surahs in the Quran with search and details."
		url="/surah"
	/>
</svelte:head>

<Container>
	<h1 class="mb-4 text-center text-2xl font-bold">Daftar Surah</h1>
	<input
		type="text"
		placeholder="Cari surah (nama, terjemahan, arabic, nomor)"
		bind:value={search}
		class="mb-4 w-full rounded border border-gray-300 p-2 focus:border-blue-300 focus:ring focus:outline-none"
	/>
	<ul>
		{#each filtered as surah (surah.index)}
			<li class="mb-2">
				<a
					href={`/surah/${surah.index}`}
					class="block rounded px-3 py-2 transition hover:bg-gray-100"
				>
					<div class="mb-1 flex flex-row items-center justify-between">
						<div class="flex flex-row items-center font-semibold">
							<span class="mr-2 text-xl">{surah.index}.</span>
							<span class="text-xl">{surah.latin}</span>
						</div>
						<span class="ml-2 text-xl">{surah.arabic}</span>
					</div>
					<div class="flex flex-row items-center justify-between">
						<small class="text-gray-500">{surah.translation} &mdash; {surah.ayah_count} ayat</small>
						<span
							class={twMerge(
								'rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500',
								surah.revelation === 1 ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'
							)}
						>
							{surah.revelation === 1 ? 'Makkiyah' : 'Madaniyah'}
						</span>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</Container>
