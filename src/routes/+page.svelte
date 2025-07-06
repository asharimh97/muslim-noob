<script>
	import MetaTag from '$lib/components/chores/MetaTag.svelte';

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

<div class="flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<h2 class="text-lg font-bold">Welcome to SvelteKit</h2>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
	</div>
</div>
