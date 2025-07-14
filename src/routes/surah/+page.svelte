<script lang="ts">
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Container from '$lib/components/ui/Container.svelte';

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

<MetaTag
	title="Daftar Surah Al-Qur'an"
	description="List of all surahs in the Quran with search and details."
	url="/surah"
/>

<Container>
	<h1 class="mb-4 text-center text-2xl font-bold">Daftar Surah</h1>
	<input
		type="text"
		placeholder="Cari surah (nama, terjemahan, arabic, nomor)"
		bind:value={search}
		class="mb-4 w-full max-w-md rounded border border-gray-300 p-2 focus:border-blue-300 focus:ring focus:outline-none"
	/>
	<ul>
		{#each filtered as surah (surah.index)}
			<li class="mb-4">
				<a href={`/surah/${surah.index}`} class="block rounded px-3 transition hover:bg-gray-100">
					<strong>{surah.index}. {surah.latin}</strong>
					<span class="ml-2 text-xl">{surah.arabic}</span><br />
					<small class="text-gray-500">{surah.translation} &mdash; {surah.ayah_count} ayat</small>
				</a>
			</li>
		{/each}
	</ul>
</Container>
