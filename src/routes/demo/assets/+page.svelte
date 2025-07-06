<script lang="ts">
	// Using the $assets alias (new approach)
	import sampleData from '$assets/sample-data.json';

	// You can also use $lib approach (traditional)
	// import sampleData from '$lib/data/sample-data.json';

	console.log('Sample data loaded:', sampleData);
</script>

<svelte:head>
	<title>Assets Demo - Muslim Noob</title>
	<meta name="description" content="Demo of $assets alias usage" />
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold">Assets Demo</h1>

	<div class="mb-6 rounded-lg bg-gray-100 p-4">
		<h2 class="mb-2 text-xl font-semibold">JSON Data Loaded via $assets</h2>
		<p class="mb-4 text-gray-600">
			This data was loaded using: <code class="rounded bg-gray-200 px-2 py-1"
				>import sampleData from '$assets/sample-data.json'</code
			>
		</p>

		<div class="rounded border bg-white p-4">
			<h3 class="mb-2 font-semibold">{sampleData.name} (v{sampleData.version})</h3>
			<p class="mb-4 text-gray-600">{sampleData.description}</p>

			<h4 class="mb-2 font-semibold">Data Items:</h4>
			<ul class="space-y-2">
				{#each sampleData.data as item}
					<li class="rounded bg-gray-50 p-3">
						<div class="font-medium">{item.title}</div>
						<div class="text-sm text-gray-600">{item.description}</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="rounded-lg bg-blue-50 p-4">
		<h2 class="mb-2 text-xl font-semibold">Usage Instructions</h2>
		<div class="space-y-2 text-sm">
			<p>
				<strong>$assets approach:</strong>
				<code class="rounded bg-blue-100 px-2 py-1">import data from '$assets/your-file.json'</code>
			</p>
			<p>
				<strong>$lib approach:</strong>
				<code class="rounded bg-blue-100 px-2 py-1"
					>import data from '$lib/data/your-file.json'</code
				>
			</p>
		</div>
	</div>
</div>
