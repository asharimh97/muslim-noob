<script lang="ts">
	import MetaTag from '$lib/components/chores/MetaTag.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	export let data;

	const hadits = data.hadits.data[0];
	const haditsStatusColor =
		hadits.status === 'Sahih' ? 'green' : hadits.status === 'Hasan' ? 'blue' : 'red';
</script>

<svelte:head>
	<MetaTag />
</svelte:head>

<Container className="flex flex-col gap-4">
	<h1 class="text-2xl font-bold">Hadits of the day</h1>
	<Card className="flex flex-col gap-2 shadow-xl">
		<div class="flex flex-row justify-end">
			<Badge color={haditsStatusColor}>
				{hadits.status}
			</Badge>
		</div>
		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-2">
				<h2 class="text-center text-2xl font-bold">{hadits.headingArabic}</h2>
				<p class="text-center text-sm italic">({hadits.headingEnglish})</p>
			</div>
			<p class="text-right">{hadits.hadithArabic}</p>

			<p>{hadits.hadithEnglish}</p>
			<p class="text-sm italic">
				HR. {hadits.book.bookName}. No: {hadits.hadithNumber} - {hadits.chapter.chapterNumber}
				{hadits.chapter.chapterEnglish}
			</p>
		</div>
	</Card>
</Container>
