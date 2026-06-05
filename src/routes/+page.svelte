<script>
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Container from '$lib/components/ui/Container.svelte';

	export let data;

	console.log(data);
</script>

<!-- <ul>
	{#each data.countries as country}
		<li>{country.name}</li>
	{/each}
</ul> -->

<svelte:head>
	<MetaTag />
</svelte:head>

<Container className="flex flex-col items-center justify-center gap-2">
	<img src="/images/apple-icon.png" alt="logo" class="mx-auto w-[100px]" />
	<h1 class="text-2xl font-bold">Muslim Noob</h1>
	<p class="text-center text-gray-500">
		Sama-sama belajar agar dapat menjadi muslim yang baik dan pro
	</p>
</Container>
<Container className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[650px] mt-10">
	<a href="/surah">
		<Card className="h-full flex flex-col gap-2">
			<h2 class="text-lg font-bold">Baca Qur'an</h2>
			<p>Baca Surah Al-Qur'an beserta terjemahan, tafsir, dan audio dari imam-imam terkenal</p>
		</Card>
	</a>
	<a href="/daily-doa">
		<Card className="h-full flex flex-col gap-2">
			<h2 class="text-lg font-bold">Doa Harian</h2>
			<p>Kumpulan doa harian untuk menemani hari anda</p>
		</Card>
	</a>
	<a href="/hadits-of-the-day">
		<Card className="h-full flex flex-col gap-2">
			<h2 class="text-lg font-bold">Hadits Hari Ini</h2>
			<p>Hadits yang diambil dari imam riwayat terkenal secara acak untuk pengingat iman kita</p>
		</Card>
	</a>
	<a href="/doa-of-the-day">
		<Card className="h-full flex flex-col gap-2">
			<h2 class="text-lg font-bold">Doa Hari Ini</h2>
			<p>Doa yang diambil dari kumpulan doa harian secara acak untuk kita gunakan sehari-hari</p>
		</Card>
	</a>
</Container>
