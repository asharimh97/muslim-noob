<script lang="ts">
	import { page } from '$app/stores';
	$: chapter = $page.params.chapter;
</script>

<h1>Surah {chapter}</h1>
<p>This is the page for Surah {chapter}.</p>
